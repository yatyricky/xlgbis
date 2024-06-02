import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react';
// import LoginPanel from './LoginPanel.jsx';
import Board from './Board.js';
// import DismissableToast from './DismissableToast.jsx';
// import Dashboard from './Dashboard/Dashboard.jsx';
import Rect from './Maths/Rect.js';
import Node from './UI/Node.js';
import ButtonNode from './UI/ButtonNode.js';
import { GetViewportHeight, GetViewportWidth } from './Utils.js';
import TextNode from './UI/TextNode.js';

export default () => {
    let root = Node.Root

    //#region ugui
    const [viewport, setViewport] = useState({
        w: GetViewportWidth(),
        h: GetViewportHeight()
    }, [])
    useLayoutEffect(() => {
        function calcViewPort() {
            let w = GetViewportWidth()
            let h = GetViewportHeight()
            setViewport({ w, h })
            Node.UpdateRoot(new Rect(0, 0, w, h))
            root.BuildTree()
        }
        window.addEventListener('resize', calcViewPort);
        calcViewPort()
        return () => { window.removeEventListener('resize', calcViewPort); }
    }, [])
    //#endregion

    let testToast = () => {
        console.log("so seee");
        let toasts = Node.Root.Find("toasts")

        new TextNode("toast", toasts, {
            anchor: "top-center",
            anchorRect: { w: 300, h: 100 },
            pivot: "top-center"
        }, {
            text: "hello"
        })
    }

    useEffect(() => {
        console.log("<<<>><<><<<<>");
        let btn = new ButtonNode("test_button", root, {
            anchorRect: new Rect(0, 0, 160, 70)
        }, {
            onClick: () => testToast()
        })
        new TextNode("btn-text", btn, {
            anchor: "stretch"
        }, {
            text: "button"
        })

        new Node("toasts", root, {
            anchor: "stretch"
        })
    }, [])

    // <Container fluid className='px-0 h-100'>
    //     <ToastContainer className="p-3" position="top-center" style={{ zIndex: 1 }}>
    //         
    //     </ToastContainer>
    //     {
    //         sceneIndex === 1 ?
    //             <Dashboard /> :
    //             <Container fluid className="px-0 h-100">
    //                 <div className="cust-main-bg" />
    //                 <div className='col-3 mx-auto pt-5'>
    //                     <LoginPanel />
    //                 </div>
    //             </Container>
    //     }

    // </Container>


    return root.Render()
};
