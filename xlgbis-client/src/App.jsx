import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react';
import "./App.css";
import LoginPanel from './LoginPanel.jsx';
import { ToastContainer } from 'react-bootstrap';
import Board from './Board.js';
import DismissableToast from './DismissableToast.jsx';
import Dashboard from './Dashboard/Dashboard.jsx';
import Rect from './Maths/Rect.js';

function GetViewportWidth() {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
}

function GetViewportHeight() {
    return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
}

const App = () => {
    // toast
    let [toasts, setToasts] = useState([])
    let update = useCallback((messages) => {
        setToasts([...messages])
    }, [Board.toasts])

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

    return (<>
        <ToastContainer className="p-3" position="top-center" style={{ zIndex: 1 }}>
            {toasts.map((toastData, i) => <DismissableToast key={i} data={toastData} />)}
        </ToastContainer>
        {sceneIndex === 1 ? <Dashboard /> : <LoginPanel />}
    </>);
};

export default App;
