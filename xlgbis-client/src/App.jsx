import React, { useCallback, useEffect, useState, useRef } from 'react';
import "./App.css";
import LoginPanel from './LoginPanel.jsx';
import Board from './Board.js';
import Toast from './Toast.jsx';
import Dashboard from './Dashboard/Dashboard.jsx';

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
        }
        window.addEventListener('resize', CalculateViewportWidth);
        CalculateViewportWidth()
        return () => { window.removeEventListener('resize', CalculateViewportWidth); }
    }, [Board.vw.get(), Board.vh.get()])

    let refToastContainer = useRef(null)

    return (
        <div className='h-100'>
            <div data-label="toast_container" ref={refToastContainer} className='h-100 w-100' style={{ position: "fixed", zIndex: -1 }}>
                {toasts.map((toastData, i) => <Toast key={i} parent={refToastContainer} data={toastData} />)}
            </div>
            <button onClick={() => {
                Board.toasts.push({
                    level: 2,
                    message: "Code.ToMessage(resp.data.code)"
                })
            }}>Test button</button>

            {/* {
                sceneIndex === 1 ?
                    <Dashboard /> :
                    <div className="px-0 h-100">
                        <div className="cust-main-bg" />
                        <div className='col-3 mx-auto pt-5'>
                            <LoginPanel />
                        </div>
                    </div>
            } */}

        </div>
    );
};

export default App;
