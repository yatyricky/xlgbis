import React, { useEffect, useState } from 'react';
import "./App.css";
import LoginPanel from './LoginPanel.jsx';
import { ToastContainer, Toast, Container } from 'react-bootstrap';
import Board from './Board.js';
import DismissableToast from './DismissableToast.jsx';
import Dashboard from './Dashboard.jsx';

const App = () => {
    // toast
    let [toasts, setToasts] = useState([])

    function update(messages) {
        setToasts([...messages])
        console.log("updated", messages);
    }

    Board.toasts.subscribe(update)

    // scene
    let [sceneIndex, setSceneIndex] = useState(0)
    function updateSceneIndex(val) {
        setSceneIndex(String.isEmptyText(val) ? 0 : 1)
    }
    Board.token.subscribe(updateSceneIndex)

    useEffect(() => {
        return () => {
            Board.toasts.unsubscribe(update)
            Board.token.unsubscribe(updateSceneIndex)
        }
    }, [toasts, setToasts])

    return (
        <Container fluid className='px-0 h-100'>
            <ToastContainer className="p-3" position="top-center" style={{ zIndex: 1 }}>
                {toasts.map((toastData, i) => <DismissableToast header={toastData.header} message={toastData.message} level={toastData.level} key={i} index={i} />)}
            </ToastContainer>
            {
                sceneIndex === 1 ?
                    <Dashboard /> :
                    <div className='col-md-3 mx-auto mt-5'>
                        <LoginPanel />
                    </div>
            }

        </Container>
    );
};

export default App;
