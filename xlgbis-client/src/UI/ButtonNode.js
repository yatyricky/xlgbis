import AnchoredButton from "../Anchored/AnchoredButton.jsx"
import Node from "./Node.js"

export default class TextNode extends Node {

    constructor(name, parent, rectProps, buttonProps) {
        super(name, parent, rectProps)
        this.buttonProps = buttonProps
    }

    Render(key) {
        return (
            <AnchoredButton key={key} node={this}
                onClick={() => this.buttonProps.onClick()}
            >
                {this.RenderChildren()}
            </AnchoredButton>
        )
    }
}
