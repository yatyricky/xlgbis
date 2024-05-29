import React, { useCallback, useEffect, useState } from 'react';
import "./App.css";
import LoginPanel from './LoginPanel.jsx';
import { ToastContainer, Container } from 'react-bootstrap';
import Board from './Board.js';
import DismissableToast from './DismissableToast.jsx';
import Dashboard from './Dashboard.jsx';

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

    return (
        <Container fluid className='px-0 h-100'>
            <ToastContainer className="p-3" position="top-center" style={{ zIndex: 1 }}>
                {toasts.map((toastData, i) => <DismissableToast key={i} data={toastData} />)}
            </ToastContainer>
            {
                sceneIndex === 1 ?
                    <Dashboard /> :
                    <Container fluid className="px-0 h-100">
                        <div className="cust-main-bg" />
                        <div className='col-3 mx-auto pt-5'>
                            <LoginPanel />
                        </div>
                    </Container>
            }

        </Container>
    );
};

export default App;
