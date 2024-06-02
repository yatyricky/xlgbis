import React, { useEffect, useState } from "react"

// overflow, scroll, hidden, fit
export default ({ children, node, gap, fit }) => {
    let rt = node.rt
    rt.size = Transform(node.parent.rt.size, rt.anchor, rt.rect, rt.pivot)

    let [r, setR] = useState(rt.size)

    useEffect(() => {
        if (fit === "fit") {
            let sum = 0
            for (const child of node.children) {
                sum += child.rt.size.h
            }
            if (node.children.length > 1) {
                sum += (node.children.length - 1) * gap
            }
            rt.size = Transform(node.parent.rt.size, rt.anchor, {
                ...rt.rect,
                h: sum
            }, rt.pivot)
        } else {
        }
        let top = 0
        for (const child of node.children) {
            child.rt.size = Transform(node.rt.size, "top-center", {
                ...child.rt.rect,
                y: top
            }, "top-center")
            if (child.update) {
                child.update({ size: child.rt.size })
            }
            top += gap + child.rt.size.h
        }
        setR(rt.size)
    }, [children.length])

    return (
        <div
            style={{
                ...node.style,
                position: "fixed",
                width: r.w,
                height: r.h,
                left: r.x,
                top: r.y,
            }}
        >{children}</div>
    )
}
