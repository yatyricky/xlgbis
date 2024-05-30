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
    /**
     * @type {Map<number, db_permission>}
     */
    static ById

    static async Init() {
        let resp = await MySqlWrapper.Inst.Query("select * from permission")
        if (resp.code !== Code.SUCCESS) {
            throw new Error(`Fatal init permission ${resp.code}`)
        }

        Permission.ByName = new Map()
        Permission.ById = new Map()
        for (const entry of resp.data) {
            Permission.ByName.set(entry.name, entry)
            Permission.ById.set(entry.pid, entry)
        }
    }

    static GetPermissionById(pid) {
        let permit = Permission.ById.get(pid)
        if (!permit) {
            throw new Error(`Undefined permission ${pid} in db`)
        }
        return permit
    }

    static GetPermissionById(pid) {
        let permit = Permission.ById.get(pid)
        if (!permit) {
            throw new Error(`Undefined permission ${pid} in db`)
        }
        return permit
    }

    static GetPermissionByName(name) {
        let permit = Permission.ByName.get(name)
        if (!permit) {
            throw new Error(`Undefined permission ${name} in db`)
        }
        return permit
    }
}
