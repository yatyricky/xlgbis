import { Toast } from "react-bootstrap"
import Board from "./Board.js"
import { useState } from "react"
import React from "react"

const ToastLevel = new Map([
    [1, "warning"],
    [2, "danger"]
])

const ToastHeader = new Map([
    [0, "提示"],
    [1, "注意"],
    [2, "警告"]
])

export default ({ level, header, message, index }) => {
    const closeToast = () => {
        Board.toasts.remove(index)
    }

    return <Toast onClose={closeToast} bg={ToastLevel.get(level)}>
        <Toast.Header>
            <strong className="me-auto">{header || ToastHeader.get(level) || ToastHeader.get(0)}</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
    </Toast>
}