import Board from "./Board.js"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Transform } from "./Maths/Transform.js"
import Rect from "./Maths/Rect.js"

const ToastLevel = new Map([
    [1, "warning"],
    [2, "danger"]
])

const ToastHeader = new Map([
    [0, "提示"],
    [1, "注意"],
    [2, "警告"]
])

export default ({ parent, data }) => {
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

    let [size, setSize] = useState(Transform(parent.current, "top-center", new Rect(0, 0, 200, 100), "top-center"))

    return (
        <div
            data-label="toast"
            onClose={closeToast}
            style={{
                position: "fixed",
                left: size.x,
                top: size.y,
                width: size.w,
                height: size.h
            }}
            bg={ToastLevel.get(data.level)}
            onMouseEnter={() => {
                data.expire = Date.now() + 86400 * 1000
                clearTimeout(data.timeoutId)
            }}
        >
            <div>
                <strong>{data.header || ToastHeader.get(data.level) || ToastHeader.get(0)}{data.key}</strong>
            </div>
            <div>{data.message}</div>
        </div>
    )
}
