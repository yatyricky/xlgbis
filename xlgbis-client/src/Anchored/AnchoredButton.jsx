import React from "react"
import { Transform } from "./Transform.js"

export default ({ children, node, onClick }) => {
    let rt = node.rt
    rt.size = Transform(node.parent.rt.size, rt.anchor, rt.rect, rt.pivot)

    return (
        <button
            style={{
                ...node.style,
                position: "fixed",
                width: rt.size.w,
                height: rt.size.h,
                left: rt.size.x,
                top: rt.size.y,
            }}
            onClick={onClick}
        >{children}</button>
    )
}
