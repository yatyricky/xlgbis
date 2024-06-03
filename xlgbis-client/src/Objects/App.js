import Board from "../Board.js"
import HttpTask from '../HttpTask.js';
import Node from "../UI/Node.js";
import Rect from "../Maths/Rect.js";
import { GetViewportHeight, GetViewportWidth } from '../Utils.js';
import BaseObject from "./BaseObject.js";
import ButtonNode from "../UI/ButtonNode.js";
import TextNode from "../UI/TextNode.js";

export default class App extends BaseObject {
    Awake() {
        this.domNode = document.getElementById('root');

        Node.Root = new Node("root")
        this.domNode.appendChild(Node.Root.dom)
        Node.AutoBuild = true
        Node.Root.parent = { size: new Rect() }

        window.addEventListener('resize', this._CalcViewPort.bind(this));
        this._CalcViewPort()
    }

    Start() {
        let btn = new ButtonNode("test_button", Node.Root, {
            anchorRect: new Rect(0, 0, 180, 60)
        }, {
            onClick: (evt) => {
                console.log("clicked", evt);
            }
        })

        new TextNode("txt", btn, {
            anchor: "middle-stretch",
            anchorRect: new Rect(0, 0, 120, 100),
            fitHeight: true,
        }, {
            text: "My Button's smooth bug vras muunch",
            wrap: true,
        })
    }

    _CalcViewPort() {
        let w = GetViewportWidth()
        let h = GetViewportHeight()

        let rect = new Rect(0, 0, w, h)
        Node.Root.anchorRect = rect
        Node.Root.parent.size = rect

        let style = this.domNode.style
        style.position = "fixed"
        style.left = `${rect.x}px`
        style.top = `${rect.y}px`
        style.width = `${rect.w}px`
        style.height = `${rect.h}px`

        Node.Root.BuildTree()
    }
}
