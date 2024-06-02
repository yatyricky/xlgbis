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
                width: size.w,
                height: size.h,
                left: size.x,
                top: size.y,
            }}
            onClick={() => {
                console.log(">>>>>>");
                // onClick()
            }}
            onMouseEnter={() => {
                console.log(".....");
            }}
        >{children}</button>
    )
}
