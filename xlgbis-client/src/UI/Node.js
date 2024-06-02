import AnchoredDiv from "../Anchored/AnchoredDiv.jsx"
import Rect from "../Maths/Rect.js"

const AnchorName = {
    "top-left": { xmin: 0, ymin: 0, xmax: 0, ymax: 0 },
    "top-center": { xmin: 0.5, ymin: 0, xmax: 0.5, ymax: 0 },
    "top-right": { xmin: 1, ymin: 0, xmax: 1, ymax: 0 },
    "middle-left": { xmin: 0, ymin: 0.5, xmax: 0, ymax: 0.5 },
    "middle-center": { xmin: 0.5, ymin: 0.5, xmax: 0.5, ymax: 0.5 },
    "center": { xmin: 0.5, ymin: 0.5, xmax: 0.5, ymax: 0.5 },
    "middle-right": { xmin: 1, ymin: 0.5, xmax: 1, ymax: 0.5 },
    "bottom-left": { xmin: 0, ymin: 1, xmax: 0, ymax: 1 },
    "bottom-center": { xmin: 0.5, ymin: 1, xmax: 0.5, ymax: 1 },
    "bottom-right": { xmin: 1, ymin: 1, xmax: 1, ymax: 1 },

    "stretch-left": { xmin: 0, ymin: 0, xmax: 0, ymax: 1 },
    "stretch-center": { xmin: 0.5, ymin: 0.5, xmax: 0, ymax: 1 },
    "stretch-right": { xmin: 1, ymin: 1, xmax: 0, ymax: 1 },

    "stretch-stretch": { xmin: 0, ymin: 0, xmax: 1, ymax: 1 },
    "stretch": { xmin: 0, ymin: 0, xmax: 1, ymax: 1 },

    "top-stretch": { xmin: 0, ymin: 0, xmax: 1, ymax: 0 },
    "middle-stretch": { xmin: 0, ymin: 0.5, xmax: 1, ymax: 0.5 },
    "bottom-stretch": { xmin: 0, ymin: 1, xmax: 1, ymax: 1 },
}

const PivotName = {
    "top-left": { x: 0, y: 0 },
    "top-center": { x: 0.5, y: 0 },
    "top-right": { x: 1, y: 0 },
    "middle-left": { x: 0, y: 0.5 },
    "middle-center": { x: 0.5, y: 0.5 },
    "center": { x: 0.5, y: 0.5 },
    "middle-right": { x: 1, y: 0.5 },
    "bottom-left": { x: 0, y: 1 },
    "bottom-center": { x: 0.5, y: 1 },
    "bottom-right": { x: 1, y: 1 },
}

export default class Node {
    /**
     * 
     * @param {Rect} parentSize 
     * @param {{ xmin: number, ymin: number, xmax: number, ymax: number }} anchor 
     * @param {Rect} anchorRect 
     * @param {{ x: number, y: number }} pivot 
     * @returns {Rect}
     */
    static Transform(parentSize, anchor, anchorRect, pivot) {
        let adx = anchor.xmax - anchor.xmin
        let ady = anchor.ymax - anchor.ymin
        let w = parentSize.w * adx + anchorRect.w
        let h = parentSize.h * ady + anchorRect.h
        let ax = parentSize.w * (adx * pivot.x + anchor.xmin) + anchorRect.x
        let ay = parentSize.h * (ady * pivot.y + anchor.ymin) + anchorRect.y
        let l = ax - w * pivot.x + parentSize.x
        let t = ay - h * pivot.y + parentSize.y
        return new Rect(l, t, w, h)
    }

    /**
     * 
     * @param {string} name 
     * @param {Node} parent 
     * @param {{anchor: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right" | "stretch-left" | "stretch-center" | "stretch-right" | "stretch-stretch" | "stretch" | "top-stretch" | "middle-stretch" | "bottom-stretch" | { xmin: number, ymin: number, xmax: number, ymax: number }, anchorRect: Rect, pivot: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right" | {x: number, y: number}, style: React.CSSProperties } rectProps
     * 
     */
    constructor(name, parent, rectProps) {
        const { anchor, anchorRect, pivot, style } = rectProps
        this.name = name
        this.active = true
        /** @type {Node[]} */
        this.children = []

        anchor = anchor || "center"
        if (typeof anchor === "string") {
            let convertAnchor = AnchorName[anchor]
            if (!convertAnchor) {
                console.error(`Unknown anchor name ${anchor}`);
                convertAnchor = AnchorName.center
            }
            anchor = convertAnchor
        }
        this.anchor = anchor

        anchorRect = anchorRect || new Rect(0, 0, 0, 0)
        anchorRect.x = anchorRect.x || 0
        anchorRect.y = anchorRect.y || 0
        this.anchorRect = anchorRect

        if (typeof pivot === "string") {
            let convertPivot = PivotName[pivot]
            if (!convertPivot) {
                console.error(`Unknown pivot name ${pivot}`);
                convertPivot = PivotName.center
            }
            pivot = convertPivot
        }
        this.pivot = pivot
        this.style = style || {}

        this.SetParent(parent)
    }

    /**
     * 
     * @param {Node} node 
     */
    AddChild(node) {
        if (this.children.includes(node)) {
            console.warn(`Node ${this.name} already has child ${node}`)
            return
        }

        node.SetParent(this)
    }

    /**
     * 
     * @param {Node} node 
     */
    SetParent(node) {
        if (!node) {
            return
        }

        if (this.parent) {
            let list = this.parent.children
            let idx = list.indexOf(this)
            if (idx >= 0) {
                list.splice(idx, 1)
            } else {
                console.error(`???`)
            }
        }

        this.parent = node
        node.children.push(this)
        this.size = Node.Transform(parent.size, this.anchor, this.anchorRect, this.pivot)
    }

    RenderChildren() {
        return this.children.filter(e => e.active).map((e, i) => e.Render(i))
    }

    Render(key) {
        return (
            <AnchoredDiv key={key} node={this}>
                {this.RenderChildren()}
            </AnchoredDiv>
        )
    }
}
