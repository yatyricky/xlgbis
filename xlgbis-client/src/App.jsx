import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react';
import "./App.css";
import LoginPanel from './LoginPanel.jsx';
import Board from './Board.js';
import Dashboard from './Dashboard/Dashboard.jsx';
import Rect from './Maths/Rect.js';
import { Message, Button } from '@kdcloudjs/kdesign'

function GetViewportWidth() {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
}

function GetViewportHeight() {
    return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
}

const App = () => {
    // scene
    let [sceneIndex, setSceneIndex] = useState(0)
    let updateSceneIndex = useCallback(val => {
        setSceneIndex(String.isEmptyText(val) ? 0 : 1)
    }, [Board.token])

    useEffect(() => {
        Board.token.subscribe(updateSceneIndex)
        return () => {
            Board.token.unsubscribe(updateSceneIndex)
        }
    }, [Board.token])

    useLayoutEffect(() => {
        function CalculateViewportWidth() {
            let w = GetViewportWidth()
            let h = GetViewportHeight()
            Board.vw.set(w)
            Board.vh.set(h)
            Board.viewport.set(new Rect(0, 0, w, h))
        }
        window.addEventListener('resize', CalculateViewportWidth);
        CalculateViewportWidth()
        return () => { window.removeEventListener('resize', CalculateViewportWidth); }
    }, [Board.vw.get(), Board.vh.get()])

    return (
        <>
            <Button onClick={() => Message.error({
                content: `unknown panel blah`,
                closable: true,
                duration: 0
            })}>Click me</Button>
            {/* {sceneIndex === 0 ? <LoginPanel /> : <Dashboard />} */}
        </>
    );
};

export default App;
