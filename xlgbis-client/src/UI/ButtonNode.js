import AnchoredButton from "../Anchored/AnchoredButton.jsx"
import Node from "./Node.js"
import React from "react"

export default class ButtonNode extends Node {
    constructor(name, parent, rectProps, buttonProps) {
        super(name, parent, rectProps)
        this.buttonProps = buttonProps
        console.log("constor" , this.buttonProps.onClick);
    }

    Render(key) {
        console.log("rendered button");
        return (
            <AnchoredButton key={key} node={this}
                onClick={this.buttonProps.onClick}
            >
                {this.RenderChildren()}
            </AnchoredButton>
        )
    }
}
