import Node from "./Node.js"
import React from "react"
import Rect from "../Maths/Rect.js"

export default class RootNode extends Node {

    constructor(name, parent, rectProps) {
        super(name, parent, rectProps)
        this.parent = { size: new Rect() }
    }

    Render() {
        return (
            <div style={{
                position: "fixed",
                left: this.size.x,
                top: this.size.y,
                width: this.size.w,
                height: this.size.h
            }}>
                {this.RenderChildren()}
            </div >
        )
    }
}
