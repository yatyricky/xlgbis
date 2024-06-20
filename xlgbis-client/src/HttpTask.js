import axios from "axios";
import Config from "./Config.js";
import Board from "./Board.js";
import Code from "./Code.js";
import { Message } from '@kdcloudjs/kdesign'

function defaultFunc() {
}

/**
 * 
 * @param {String} path 
 * @param {Object} body 
 * @param {((isLoading: boolean) => void) | undefined} onLoading 
 * @param {((data: any) => void) | undefined} onData 
 * @param {((code: number) => void) | undefined} onError 
 * @param {boolean | undefined} suppressErrorToast 
 * @param {Object} additionalHeaders
 * @returns {AbortController}
 */
function HttpTask(path, body, onLoading, onData, onError, suppressErrorToast, additionalHeaders) {
    const controller = new AbortController();
    onLoading = onLoading || defaultFunc
    onData = onData || defaultFunc
    onError = onError || defaultFunc
    onLoading(true)
    let headers = {
        Authorization: `Bearer ${Board.token.get()}`,
        ...additionalHeaders
    }
    axios.post(`${Config.server}${path}`, body, {
        headers,
        signal: controller.signal
    }).then(resp => {
        if (resp.data.code !== 0) {
            if (suppressErrorToast !== true) {
                Message.error({
                    content: Code.ToMessage(resp.data.code),
                    closable: true
                })
            }

            onError(resp.data.code)
            onLoading(false)
        } else {
            onData(resp.data.data)
            onLoading(false)
        }
    }).catch(err => {
        if (suppressErrorToast !== true) {
            Message.error({
                content: Code.ToMessage(Code.Codes.NETWORK_CLIENT_ERROR),
                closable: true
            })
        }

        onError(Code.Codes.NETWORK_CLIENT_ERROR)
        onLoading(false)
    })
    return controller
}

export default HttpTask
