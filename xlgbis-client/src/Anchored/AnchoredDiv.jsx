import { Transform } from "./Transform.js"
import React, { useState } from "react"
import Rect from "../Rect.js"

/**
 * @typedef {object} ParamAnchoredDiv
 * @property {React.MutableRefObject} parent
 * @property {React.ReactNode[]} children
 * @property {import("./Transform.js").AnchorName | import("./Transform.js").AnchorData} anchor
 * @property {Rect} rect
 * @property {import("./Transform.js").PivotName | import("./Transform.js").PivotData} pivot
 * @property {React.CSSProperties} style
 */


const AnchoredDiv = ({ children, node }) => {
    let rt = node.rt
    rt.size = Transform(node.parent.rt.size, rt.anchor, rt.rect, rt.pivot)
    let [size, setSize] = useState(rt.size)
    node.update = ({ size }) => {
        setSize(size)

        for (const child of node.children) {
            child.rt.size = Transform(node.rt.size, child.rt.anchor, child.rt.rect, child.rt.pivot)
            if (child.update) {
                child.update({ size: child.rt.size })
            }
        }
    }

    return (
        <div
            style={{
                ...node.style,
                position: "fixed",
                width: size.w,
                height: size.h,
                left: size.x,
                top: size.y,
            }}
        >{children}</div>
    )
}

export default AnchoredDiv
