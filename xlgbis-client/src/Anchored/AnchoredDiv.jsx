import React, { useState } from "react"
import Node from "../UI/Node.js";
import Rect from "../Maths/Rect.js"

export default ({ children, node }) => {
    let [size, setSize] = useState(node.size)
    node.setSize = setSize
    // node.size = Node.Transform(node.parent.size, node.anchor, node.anchorRect, node.pivot)
    // let [size, setSize] = useState(size)
    // node.update = ({ size }) => {
    //     setSize(size)

    //     for (const child of node.children) {
    //         child.size = Transform(node.size, child.anchor, child.rect, child.pivot)
    //         if (child.update) {
    //             child.update({ size: child.size })
    //         }
    //     }
    // }

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
