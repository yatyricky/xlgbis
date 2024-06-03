import Node from "./Node.js"

export default class TextNode extends Node {

    constructor(name, parent, rectProps, textProps) {
        super(name, parent, rectProps)
        this.textProps = textProps

        this.textNode = document.createTextNode(this.textProps.text)
        this.dom.appendChild(this.textNode)
        this.dom.style.textWrap = textProps.wrap === true ? "pretty" : "nowrap"
    }
}
