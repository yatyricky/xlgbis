import React, { useEffect, useRef, useState } from "react"

export default ({ children, node, text, fit, align, wrap }) => {
    let [size, setSize] = useState(node.size)
    node.setSize = setSize

    // if (fit) {
    //     rt.w = "fit-content"
    //     rt.h = "auto"
    // }

    let ref = useRef(null)

    // useEffect(() => {
    //     if (fit) {
    //         rectTransform.size = Transform(node.parent.size, node.anchor, {
    //             ...rt.rect,
    //             w: ref.current.offsetWidth,
    //             h: ref.current.offsetHeight,
    //         }, rt.pivot)
    //         setRt(rectTransform.size)
    //     }
    // }, [rt])

    return (
        <div
            ref={ref}
            style={{
                ...node.style,
                position: "fixed",
                left: size.x,
                top: size.y,
                width: size.w,
                height: size.h,
                textWrap: wrap ? "wrap" : "nowrap",
                textAlign: align !== undefined ? align : "left",
            }}
        >{text}{children}</div>
    )
}
