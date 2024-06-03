import Node from "./Node.js"

export default class ButtonNode extends Node {
    constructor(name, parent, rectProps, buttonProps) {
        super(name, parent, rectProps)
        this.buttonProps = buttonProps

        this.dom.onclick = buttonProps.onClick
    }

    GetDom() {
        return document.createElement("button")
    }
}
