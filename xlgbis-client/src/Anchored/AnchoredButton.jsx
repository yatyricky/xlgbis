import React, { useState } from "react"

export default ({ children, node, onClick }) => {
    let [size, setSize] = useState(node.size)
    node.setSize = setSize
    console.log("got onclic", onClick, node.style);

    return (
        <button
            style={{
                ...node.style,
                position: "fixed",
                left: size.x,
                top: size.y,
                width: size.w,
                height: size.h,
            }}
            onClick={() => {
                console.log(">>>>>>");
                // onClick()
                node.buttonProps.onClick()
            }}
        >{children}</button>
    )
}
