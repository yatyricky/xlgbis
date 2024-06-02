import AnchoredText from "../Anchored/AnchoredText.jsx"
import Node from "./Node.js"

export default class TextNode extends Node {

    constructor(name, parent, rectProps, textProps) {
        super(name, parent, rectProps)
        this.textProps = textProps
    }

    Render(key) {
        return (
            <AnchoredText key={key} node={this}
                text={this.textProps.text}
                fit={this.textProps.fit}
                align={this.textProps.align}
                wrap={this.textProps.wrap}
            >
                {this.RenderChildren()}
            </AnchoredText>
        )
    }
}
