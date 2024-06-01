import Board from "../Board.js"
import React, { useCallback, useEffect, useRef } from "react"

const ToastLevel = new Map([
    [1, "warning"],
    [2, "danger"]
])

const ToastHeader = new Map([
    [0, "提示"],
    [1, "注意"],
    [2, "警告"]
])

const DismissableToast = ({ data }) => {
    const ref = useRef(null)

    const closeToast = useCallback(() => {
        Board.toasts.filterInPlace(e => e.key !== data.key)
    }, [data])

    useEffect(() => {
        if (data.expire === undefined) {
            data.expire = Date.now() + 5000
        }

        data.timeoutId = setTimeout(() => {
            closeToast()
        }, data.expire - Date.now());

        return () => {
            clearTimeout(data.timeoutId)
        }
    }, [data])

    return <Toast ref={ref} onClose={closeToast} bg={ToastLevel.get(data.level)} onMouseEnter={() => {
        data.expire = Date.now() + 86400 * 1000
        clearTimeout(data.timeoutId)
    }}>
        <Toast.Header>
            <strong className="me-auto">{data.header || ToastHeader.get(data.level) || ToastHeader.get(0)}{data.key}</strong>
        </Toast.Header>
        <Toast.Body>{data.message}</Toast.Body>
    </Toast>
}

export default DismissableToast
