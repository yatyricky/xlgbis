import Code from "../Code.mjs";
import MySqlWrapper from "../MySqlWrapper.mjs";

/**
 * @typedef db_permission
 * @property {Number} pid
 * @property {String} name
 * @property {String} description
 * @property {Number} checkbook
 * @property {Number} checktoken
 */

export default class Permission {
    /**
     * @type {Map<string, db_permission>}
     */
    static ByName

    static async Init() {
        let resp = await MySqlWrapper.Inst.Query("select * from permission")
        if (resp.code !== Code.SUCCESS) {
            throw new Error(`Fatal init permission ${resp.code}`)
        }

        Permission.ByName = new Map()
        for (const entry of resp.data) {
            Permission.ByName.set(entry.name, entry)
        }
    }
}
