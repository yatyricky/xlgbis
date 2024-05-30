import Code from "../Code.mjs"
import Common from "../Common.mjs";
import * as Protocol from "../Protocol.mjs";
import jwt from "jsonwebtoken";
import Config from "../Config.mjs"
import MySqlWrapper from "../MySqlWrapper.mjs";
import Encryption from "../Encryption.mjs";
import Permission from "./Permission.mjs";

/**
 * @typedef db_user
 * @property {Number} uid
 * @property {String} account
 * @property {String} passhash
 * @property {String} name
 * @property {String} qywxbotkey
 */

export default class User {
    static #verificationCode = {}

    static #PadWithLeadingZeroes(n, digits) {
        let s = "" + n
        for (let i = s.length; i < digits; i++) {
            s = "0" + s
        }
        return s
    }

    static #GenerateVerificationCode(uid) {
        let n = Math.floor(Math.random() * 1000000)
        let code = User.#PadWithLeadingZeroes(n, 6)
        User.#verificationCode[uid] = { ts: Date.now(), code }
        return code
    }

    static async UserHasPermission(uid, pid, bid) {
        let permit = Permission.GetPermissionById(pid)
        let resp

        if (permit.checkbook === 1) {
            if (bid === undefined) {
                throw new Error(`UserHasPermission requires bid for permission ${pid}`)
            }
            // requires book permission
            resp = await MySqlWrapper.Inst.Query(`select enable from user_permission where uid='${uid}' and pid='${pid}' and bid='${bid}' limit 1;`)
        } else {
            // user permission
            resp = await MySqlWrapper.Inst.Query(`select enable from user_permission where uid='${uid}' and pid='${pid}' limit 1;`)
        }

        if (resp.code !== Code.SUCCESS) {
            console.error(`[MYSQL]: error, code=${resp.code}`);
            return false
        }
        if (resp.data.length === 0 || resp.data[0].enable !== 1) {
            return false
        }
        return true
    }

    /**
     * 
     * @param {import("express-serve-static-core").Express} app 
     */
    static Register(app) {
        Common.ExpressPostAsync(app, "/user_has_permit", async (req, res) => {
            let body = req.body

            if (!Protocol.Validate(body, Protocol.Schema.user_has_permit.req)) {
                return Common.Respond(res, Code.USER_INVALID_INPUT)
            }

            let permit = Permission.GetPermissionByName(body.pname)
            let resp = await User.UserHasPermission(res.locals.jwtPayload.uid, permit.pid, body.bid)
            Common.Respond(res, Code.SUCCESS, { flag: resp })
        })

        /**
         * register
         */
        Common.ExpressPostAsync(app, "/user_register", async (req, res) => {
            let body = req.body

            if (!Protocol.Validate(body, Protocol.Schema.user_register.req)) {
                return Common.Respond(res, Code.USER_INVALID_INPUT)
            }

            const checkAccountResp = await MySqlWrapper.Inst.Query(`select uid from \`user\` where account='${body.account}' limit 1`)
            if (checkAccountResp.code !== Code.SUCCESS) {
                return Common.Respond(res, checkAccountResp.code)
            }

            if (checkAccountResp.data.length > 0) {
                return Common.Respond(res, Code.USER_ALREADY_EXISTS)
            }

            const insertResp = await MySqlWrapper.Inst.Query(`INSERT INTO \`user\` (\`account\`, \`passhash\`, \`name\`) VALUES ('${body.account}', '${body.passhash}', '${body.name}');`)
            if (insertResp.code !== Code.SUCCESS) {
                return Common.Respond(res, Code.DB_INSERT_USER_ERR)
            }

            Common.Respond(res, Code.SUCCESS)
        })

        /**
         * request qywx verification code
         */
        Common.ExpressPostAsync(app, "/user_request_qywxbotkey", async (req, res) => {
            let body = req.body

            if (!Protocol.Validate(body, Protocol.Schema.user_request_qywxbotkey.req)) {
                return Common.Respond(res, Code.USER_INVALID_INPUT)
            }

            const checkAccountResp = await MySqlWrapper.Inst.Query(`select uid, qywxbotkey from \`user\` where account='${body.account}' limit 1`)
            if (checkAccountResp.code !== Code.SUCCESS) {
                return Common.Respond(res, checkAccountResp.code)
            }

            if (checkAccountResp.data.length === 0) {
                return Common.Respond(res, Code.USER_NOT_EXISTS)
            }

            let user = checkAccountResp.data[0]
            if (Common.StringIsEmpty(user.qywxbotkey)) {
                return Common.Respond(res, Code.USER_NOT_GRANTED)
            }

            let verificationCode = User.#verificationCode[user.uid]
            if (verificationCode && verificationCode.ts + Config.user.qywxbotkeyExpr > Date.now()) {
                return Common.Respond(res, Code.USER_QYEXBOTKEY_SENT)
            }

            User.#GenerateVerificationCode(user.uid)
            let resp = await fetch(`https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${user.qywxbotkey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "msgtype": "text",
                    "text": {
                        "content": User.#verificationCode[user.uid].code
                    }
                })
            })
            let objRespQywx = Common.ObjectParse(await resp.text())
            if (objRespQywx.errcode !== 0) {
                return Common.Respond(res, Code.USER_QYWXBOTKEY_FAILED)
            }

            Common.Respond(res, Code.SUCCESS)
        })

        /**
         * login
         */
        Common.ExpressPostAsync(app, "/user_login", async (req, res) => {
            let body = req.body
            if (!Protocol.Validate(body, Protocol.Schema.user_login.req)) {
                return Common.Respond(res, Code.USER_INVALID_INPUT)
            }

            const checkAccountResp = await MySqlWrapper.Inst.Query(`select uid, name from \`user\` where account='${body.account}' limit 1`)
            if (checkAccountResp.code !== Code.SUCCESS) {
                return Common.Respond(res, checkAccountResp.code)
            }

            if (checkAccountResp.data.length === 0) {
                return Common.Respond(res, Code.USER_NOT_EXISTS)
            }

            let user = checkAccountResp.data[0]
            let verificationCode = User.#verificationCode[user.uid]
            if (!verificationCode || body.qywxbotkey !== verificationCode.code) {
                return Common.Respond(res, Code.USER_QYEXBOTKEY_MISMATCH)
            }

            if (verificationCode.ts + Config.user.qywxbotkeyExpr <= Date.now()) {
                return Common.Respond(res, Code.USER_QYEXBOTKEY_EXPIRED)
            }

            // success
            let token = jwt.sign({
                data: Encryption.EncodeSimple({
                    uid: user.uid,
                    iat: Date.now(),
                })
            }, Config.server.secret, {
                expiresIn: 86400,
                issuer: "xlg.com",
            })

            Common.Respond(res, Code.SUCCESS, { token, name: user.name })
        })

        Common.ExpressPostAsync(app, "/user_auto_login", async (req, res) => {
            let body = req.body
            if (!Protocol.Validate(body, Protocol.Schema.user_auto_login.req)) {
                return Common.Respond(res, Code.USER_INVALID_INPUT)
            }

            const checkAccountResp = await MySqlWrapper.Inst.Query(`select name from \`user\` where uid='${res.locals.jwtPayload.uid}' limit 1`)
            if (checkAccountResp.code !== Code.SUCCESS) {
                return Common.Respond(res, checkAccountResp.code)
            }

            if (checkAccountResp.data.length === 0) {
                return Common.Respond(res, Code.USER_NOT_EXISTS)
            }

            let user = checkAccountResp.data[0]

            // success
            Common.Respond(res, Code.SUCCESS, { name: user.name })
        })

        Common.ExpressPostAsync(app, "/user_list", async (req, res) => {
            let body = req.body
            if (!Protocol.Validate(body, Protocol.Schema.user_list.req)) {
                return Common.Respond(res, Code.USER_INVALID_INPUT)
            }

            const resp = await MySqlWrapper.Inst.Query(`SELECT \`account\`,\`name\`,\`qywxbotkey\` FROM \`user\`;`)
            if (resp.code !== Code.SUCCESS) { return Common.Respond(res, resp.code) }

            Common.Respond(res, Code.SUCCESS, resp.data)
        })

        /**
         * set user qywx bot key
         */
        Common.ExpressPostAsync(app, "/user_group_set_qywxbotkey", async (req, res) => {
            let body = req.body
            if (!Protocol.Validate(body, Protocol.Schema.user_group_set_qywxbotkey.req)) {
                return Common.Respond(res, Code.USER_INVALID_INPUT)
            }

            const resp = await MySqlWrapper.Inst.Query(`UPDATE \`user\` SET \`qywxbotkey\` = '${body.qywxbotkey}' WHERE (\`uid\` = '${body.tuid}');`)
            if (resp.code !== Code.SUCCESS) { return Common.Respond(res, resp.code) }

            Common.Respond(res, Code.SUCCESS)
        })

        Common.ExpressPostAsync(app, "/user_group_set_profile", async (req, res) => {
            let body = req.body
            if (!Protocol.Validate(body, Protocol.Schema.user_group_set_profile.req)) {
                return Common.Respond(res, Code.USER_INVALID_INPUT)
            }

            const resp = await MySqlWrapper.Inst.Query(`UPDATE \`user\` SET \`name\` = '${body.name}' WHERE (\`uid\` = '${body.tuid}');`)
            if (resp.code !== Code.SUCCESS) { return Common.Respond(res, resp.code) }

            Common.Respond(res, Code.SUCCESS)
        })
    }
}
