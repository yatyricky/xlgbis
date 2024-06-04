import Rect from "./Rect.js"

/**
 * @typedef {"top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right" | "stretch-left" | "stretch-center" | "stretch-right" | "stretch-stretch" | "stretch" | "top-stretch" | "middle-stretch" | "bottom-stretch" } AnchorName
 */

/**
 * @typedef {"top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right" } PivotName
 */

/**
 * @typedef {{xmin: number, ymin: number, xmax: number, ymax: number}} AnchorData
 */

/**
 * @typedef {{x: number, y: number}} PivotData
 */

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

/**
 * 
 * @param {Rect} parentSize 
 * @param {AnchorName | AnchorData} anchor 
 * @param {Rect} anchorRect 
 * @param {PivotName | PivotData} pivot 
 * @returns {Rect}
 */
export function Transform(parentSize, anchor, anchorRect, pivot) {
    if (parentSize.offsetLeft !== undefined) {
        parentSize = new Rect(parentSize.offsetLeft, parentSize.offsetTop, parentSize.offsetWidth, parentSize.offsetHeight)
    }

    anchor = anchor || "center"
    pivot = pivot || "center"

    if (typeof anchor === "string") {
        let convertAnchor = AnchorName[anchor]
        if (!convertAnchor) {
            console.error(`Unknown anchor name ${anchor}`);
            convertAnchor = AnchorName.center
        }
        anchor = convertAnchor
    }

    if (typeof pivot === "string") {
        let convertPivot = PivotName[pivot]
        if (!convertPivot) {
            console.error(`Unknown pivot name ${pivot}`);
            convertPivot = PivotName.center
        }
        pivot = convertPivot
    }

    anchorRect = anchorRect || new Rect(0, 0, 0, 0)
    anchorRect.x = anchorRect.x || 0
    anchorRect.y = anchorRect.y || 0

    let aw = parentSize.w * (anchor.xmax - anchor.xmin)
    let ah = parentSize.h * (anchor.ymax - anchor.ymin)
    let w = aw + anchorRect.w
    let h = ah + anchorRect.h
    let cx = parentSize.w * ((anchor.xmax - anchor.xmin) * pivot.x + anchor.xmin)
    let cy = parentSize.h * ((anchor.ymax - anchor.ymin) * pivot.y + anchor.ymin)
    let ax = cx + anchorRect.x
    let ay = cy + anchorRect.y
    let l = ax - w * pivot.x + parentSize.x
    let t = ay - h * pivot.y + parentSize.y
    return new Rect(l, t, w, h)
}

