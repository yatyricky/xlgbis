import Rect from "./Maths/Rect"

// /**
//  * @typedef RectTransform
//  * @property {Rect} size
//  * @property {import("./Anchored/Transform").AnchorName | import("./Anchored/Transform").AnchorData} anchor
//  * @property {Rect} rect
//  * @property {import("./Anchored/Transform").PivotName | import("./Anchored/Transform").PivotData} pivot
//  */

// /**
//  * @typedef UINode
//  * @property {string} name
//  * @property {string} type
//  * @property {boolean} active
//  * @property {RectTransform} rt
//  * @property {React.CSSProperties} style
//  * @property {UINode} parent
//  * @property {UINode[]} children
//  */

// /**
//  * @type {UINode}
//  */
const UI = {
    // Root
    type: "Root",
    active: true,
    rt: {
        size: null
    },
    parent: null,
    children: [
        {
            name: "toasts",
            type: "VerticalLayoutGroup",
            active: true,
            rt: {
                anchor: "stretch"
            },
            style: {},
            parent: null,
            children: [],
            CompVLGroup: {
                gap: 10
            }
        },
        {
            name: "LoginScene",
            type: "AnchoredDiv",
            active: true,
            rt: {
                anchor: "stretch"
            },
            parent: null,
            children: []
        },
        {
            name: "DashboardScene",
            type: "AnchoredDiv",
            active: false,
            rt: {
                anchor: "stretch"
            },
            parent: null,
            children: []
        },
    ],
    refresh: 0
}

/**
 * 
 * @param {string} path 
 * @param {UINode} node 
 * @returns {UINode | undefined}
 */
export function UIFind(path, node) {
    let current = undefined
    let paths = path.split("/")
    for (const p of paths) {
        if (String.isEmptyText(p)) {
            continue
        }
        let n = (current || node || UI).children.find(e => e.name === p)
        if (!n) {
            return undefined
        }
        current = n
    }

    return current
}

window.UI = UI

export default UI
