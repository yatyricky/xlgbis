import axios from "axios";
import Config from "./Config.js";
import Board from "./Board.js";
import Code from "./Code.js";

export const HttpTaskStatus = {
    Success: 0,
    Loading: 1,
    Error: 2
}

function defaultFunc() {
}

function HttpTask(path, body, onStatus, onData) {
    onStatus = onStatus || defaultFunc
    onData = onData || defaultFunc
    onStatus(HttpTaskStatus.Loading)
    axios.post(`${Config.server}${path}`, body).then(resp => {
        if (resp.data.code !== 0) {
            Board.toasts.push({
                level: 2,
                message: Code.ToMessage(resp.data.code)
            })
            onStatus(HttpTaskStatus.Error)
        } else {
            onData(resp.data.data)
            onStatus(HttpTaskStatus.Success)
        }
    }).catch(err => {
        Board.toasts.push({
            level: 2,
            message: Code.ToMessage(Code.Codes.NETWORK_CLIENT_ERROR)
        })
        onStatus(HttpTaskStatus.Error)
    })
}

export default HttpTask
