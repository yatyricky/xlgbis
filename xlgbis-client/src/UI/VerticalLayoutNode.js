import VerticalLayoutGroup from "../Anchored/VerticalLayoutGroup.jsx"
import Node from "./Node.js"

export default class TextNode extends Node {

    constructor(name, parent, rectProps, verticalLayoutProps) {
        super(name, parent, rectProps)
        this.verticalLayoutProps = verticalLayoutProps
    }

    Render(key) {
        return (
            <VerticalLayoutGroup key={key} node={this}
                gap={this.verticalLayoutProps.gap}
                fit={this.verticalLayoutProps.fit}
            >
                {this.RenderChildren()}
            </VerticalLayoutGroup>
        )
    }
}
