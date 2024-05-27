import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export default class Config {
    static v;

    static Init() {
        Config.v = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json")).toString())
    }
}
