import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react';
// import LoginPanel from './LoginPanel.jsx';
import Board from './Board.js';
// import DismissableToast from './DismissableToast.jsx';
// import Dashboard from './Dashboard/Dashboard.jsx';
import Rect from './Rect.js';
import AnchoredDiv from "./Anchored/AnchoredDiv.jsx"
import UI, { UIFind } from './UI.js';
import AnchoredButton from './Anchored/AnchoredButton.jsx';
import AnchoredText from './Anchored/AnchoredText.jsx';
import VerticalLayoutGroup from './Anchored/VerticalLayoutGroup.jsx';

const App = () => {
    // toast
    let [toasts, setToasts] = useState([])
    let update = useCallback((messages) => {
        setToasts([...messages])
    }, [Board.toasts])

    let [refresh, setRefresh] = useState(0)

    // scene
    let [sceneIndex, setSceneIndex] = useState(0)
    let updateSceneIndex = useCallback(val => {
        setSceneIndex(String.isEmptyText(val) ? 0 : 1)
    }, [Board.token])

    useEffect(() => {
        Board.toasts.subscribe(update)
        Board.token.subscribe(updateSceneIndex)
        return () => {
            Board.toasts.unsubscribe(update)
            Board.token.unsubscribe(updateSceneIndex)
        }
    }, [Board.toasts, Board.token])

    //#region ugui
    const [viewport, setViewport] = useState({
        w: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
        h: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    }, [])
    useLayoutEffect(() => {
        function calcViewPort() {
            setViewport({
                ...viewport,
                w: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
                h: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
            })
        }
        window.addEventListener('resize', calcViewPort);
        calcViewPort()
        return () => { window.removeEventListener('resize', calcViewPort); }
    }, [])

    UI.rt.size = new Rect(0, 0, viewport.w, viewport.h)
    //#endregion

    function testToast() {
        let toasts = UIFind("toasts")
        toasts.children.push({
            name: "toast",
            type: "AnchoredDiv",
            active: true,
            rt: {
                anchor: "top-center",
                pivot: "top-center",
                rect: { w: 300, h: 100 }
            },
            style: {},
            parent: null,
            children: [{
                name: "toast-text",
                type: "AnchoredText",
                active: true,
                rt: {
                    anchor: "stretch"
                },
                style: {},
                parent: null,
                children: [],
                CompText: {
                    text: "Hello"
                }
            }]
        })
        setRefresh(++UI.refresh)
    }

    useEffect(() => {
        UIFind("LoginScene").children.push({
            // testbutton
            type: "AnchoredButton",
            active: true,
            rt: {
                rect: { w: 160, h: 70 }
            },
            parent: null,
            children: [],
            CompButton: {
                onClick: testToast
            }
        })
    }, [])

    let cyclic = {}
    cyclic.renderMap = new Map([
        ["Root", (node) => {
            return (
                <div id={refresh} style={{ position: "fixed", width: viewport.w, height: viewport.h }}>
                    {cyclic.renderChildren(node)}
                </div >
            )
        }],
        ["AnchoredDiv", (node, i) => {
            return (
                <AnchoredDiv key={i} node={node}>
                    {cyclic.renderChildren(node)}
                </AnchoredDiv>
            )
        }],
        ["AnchoredButton", (node, i) => {
            return (
                <AnchoredButton key={i} node={node} onClick={() => node.CompButton.onClick()}>
                    {cyclic.renderChildren(node)}
                </AnchoredButton>
            )
        }],
        ["AnchoredText", (node, i) => {
            let c = node.CompText
            return (
                <AnchoredText key={i} node={node} text={c.text} fit={c.fit} align={c.align} wrap={c.wrap}>
                    {cyclic.renderChildren(node)}
                </AnchoredText>
            )
        }],
        ["VerticalLayoutGroup", (node, i) => {
            let c = node.CompVLGroup
            return (
                <VerticalLayoutGroup key={i} node={node} gap={c.gap} fit={c.fit}>
                    {cyclic.renderChildren(node)}
                </VerticalLayoutGroup>
            )
        }]
    ])

    cyclic.renderChildren = (node) => {
        return node.children.filter(e => e.active).map((e, i) => {
            e.parent = node
            return cyclic.renderNode(e, i)
        })
    }

    cyclic.renderNode = (node, i) => {
        let renderer = cyclic.renderMap.get(node.type)
        if (!renderer) {
            throw new Error(`Unimplemented node type ${node.type}`)
        }
        return renderer(node, i)
    }

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
    return cyclic.renderNode(UI)
};

export default App;
