import ServerCode from "../../xlgbis-server/Code.mjs"

let rev = new Map()
for (const name in ServerCode) {
    if (Object.hasOwnProperty.call(ServerCode, name)) {
        const id = ServerCode[name];
        rev.set(id, name)
    }
}

const name2msg = {
    ACCOUNT_NOT_EXISTS: "账号错误"
}

class Code {
    static Codes = ServerCode

    static ToMessage(id) {
        let reved = rev.get(id)
        if (!reved) {
            return `未知错误(${id})`
        }
        return name2msg[reved] || `未知错误(${reved})`
    }
}

export default Code;
