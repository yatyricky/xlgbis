import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

let Config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json")).toString())

function GenerateBytes(len) {
    let buf = Buffer.alloc(len)
    for (let i = 0; i < len; i++) {
        buf[i] = Math.floor(Math.random() * 256)
    }
    return buf
}

Config.server.secret = GenerateBytes(128)
Config.server.simpleXor = GenerateBytes(128)

export default Config
