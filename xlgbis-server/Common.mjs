/**
 * @typedef IResp
 * @property {Number} code
 * @property {Number} ts
 * @property {any} data
 */

import Code from "./Code.mjs";

export default class Common {
    static StringIsEmpty(str) {
        return str === undefined || str === null || typeof str !== "string" || str.length === 0
    }

    static ObjectParse(json) {
        let obj
        try {
            obj = JSON.parse(json)
        } catch (error) {
            console.error(error);
        }
        return obj
    }

    static Respond(res, code, data) {
        if (code === undefined) {
            throw new Error("Code is undefined")
        }
        res.status(200).send({ code, ts: Date.now(), data })
    }

    /**
     * 
     * @param {import("express-serve-static-core").Express} app 
     * @param {import("express-serve-static-core").RequestHandler<ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>>} asyncFunc 
     */
    static ExpressUseAsync(app, asyncFunc) {
        app.use(function (req, res, next) {
            asyncFunc(req, res, next).catch((err) => {
                console.error(`[ERROR]: ${err}`);
                res.status(200).send({
                    code: Code.ERROR,
                    ts: Date.now()
                })
            })
        })
    }

    /**
     * 
     * @param {import("express-serve-static-core").Express} app 
     * @param {String} path
     * @param {import("express-serve-static-core").RequestHandler<ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>>} asyncFunc 
     */
    static ExpressPostAsync(app, path, asyncFunc) {
        app.post(path, function (req, res, next) {
            asyncFunc(req, res, next).catch((err) => {
                console.error(`[ERROR]: ${err}`);
                res.status(200).send({
                    code: Code.ERROR,
                    ts: Date.now()
                })
            })
        })
    }
}
