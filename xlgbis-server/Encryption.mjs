import Config from "./Config.mjs"

export default class Encryption {
    static #key = Buffer.from(Config.server.simpleXor)
    static #keyLen = Encryption.#key.length

    static EncodeSimple(obj) {
        let str = JSON.stringify(obj)
        let buf = Buffer.from(str, "utf8")
        let outBuf = Buffer.alloc(buf.length)
        for (let i = 0; i < buf.length; i++) {
            outBuf[i] = buf[i] ^ Encryption.#key[i % Encryption.#keyLen]
        }
        return outBuf.toString("base64")
    }

    static DecodeSimple(b64) {
        let encBuf = Buffer.from(b64, "base64")
        let outBuf = Buffer.alloc(encBuf.length)
        for (let i = 0; i < encBuf.length; i++) {
            outBuf[i] = encBuf[i] ^ Encryption.#key[i % Encryption.#keyLen]
        }
        let str = outBuf.toString("utf8")
        let obj
        try {
            obj = JSON.parse(str)
        } catch (error) {
            console.error(error);
        }
        return obj
    }
}
