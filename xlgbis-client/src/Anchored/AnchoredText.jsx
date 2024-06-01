import React, { useEffect, useRef, useState } from "react"
import { Transform } from "./Transform.js"

export default ({ children, node, text, fit, align, wrap }) => {
    let rectTransform = node.rt
    rectTransform.size = Transform(node.parent.rt.size, rectTransform.anchor, rectTransform.rect, rectTransform.pivot)

    let [rt, setRt] = useState(rectTransform.size)
    node.update = ({size}) => {
        setRt(size)
    }

    if (fit) {
        rt.w = "fit-content"
        rt.h = "auto"
    }

    let ref = useRef(null)

    useEffect(() => {
        if (fit) {
            rectTransform.size = Transform(node.parent.rt.size, rt.anchor, {
                ...rt.rect,
                w: ref.current.offsetWidth,
                h: ref.current.offsetHeight,
            }, rt.pivot)
            setRt(rectTransform.size)
        }
    }, [rt])

    return (
        <div
            ref={ref}
            style={{
                ...node.style,
                textWrap: wrap ? "wrap" : "nowrap",
                position: "fixed",
                width: rt.w,
                height: rt.h,
                left: rt.x,
                top: rt.y,
                textAlign: align !== undefined ? align : "left",
            }}
        >{text}{children}</div>
    )
}
