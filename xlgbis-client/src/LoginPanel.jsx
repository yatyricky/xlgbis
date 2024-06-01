import React, { useEffect, useState } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Timer from "./Timer.jsx"
import Board from "./Board.js"
import Image from 'react-bootstrap/Image';
import HttpTask from './HttpTask.js';

function LoginPanel() {
    let [inAcc, setInAcc] = useState("")
    let [inVeriCode, setInVeriCode] = useState("")
    let [state, setState] = useState(false)
    let [veriCodeLoading, setVeriCodeLoading] = useState(false)
    let [submitLoading, setSubmitLoading] = useState(false)

    function performLogin(event) {
        event.preventDefault()
        setSubmitLoading(true)
        HttpTask("/user_login", {
            account: inAcc,
            qywxbotkey: inVeriCode
        }, (isLoading) => {
            setSubmitLoading(isLoading)
        }, (data) => {
            Board.token.set(data.token)
            Board.userName.set(data.name)
            localStorage.setItem("token", data.token)
        })
    }

    function requestCode() {
        setState(true)
        HttpTask("/user_request_qywxbotkey", { account: inAcc }, (isLoading) => {
            setVeriCodeLoading(isLoading)
        }, undefined, () => {
            setState(false)
        })
    }

    useEffect(() => {
        let token = localStorage.getItem("token")
        if (!String.isEmptyText(token)) {
            setSubmitLoading(true)
            HttpTask("/user_auto_login", {}, (status) => {
                setSubmitLoading(status)
            }, (data) => {
                Board.token.set(token)
                Board.userName.set(data.name)
            }, () => {
                localStorage.removeItem("token")
            }, undefined, {
                Authorization: `Bearer ${token}`
            })
        }
    }, [Board.token.get()])

    return (
        <Form className='shadow px-3 py-3' onSubmit={performLogin}>
            <Row className='' >
                <Col className='flex-grow-1'></Col>
                <Image src='xlg3-200.png' className='cust-width-200 center-block img-responsive' />
                <Col className='flex-grow-1'></Col>
            </Row>

            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>账号</Form.Label>
                <Form.Control type="text" value={inAcc} onChange={e => setInAcc(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>验证码</Form.Label>
                <Row>
                    <Col>
                        <Form.Control type="text" value={inVeriCode} onChange={e => setInVeriCode(e.target.value)} />
                    </Col>
                    <Col className='cust-width-160'>
                        <Button className='w-100' disabled={state} onClick={() => requestCode()}>
                            {state ?
                                (veriCodeLoading ?
                                    (<span>
                                        <Spinner size='sm' animation="border" role="status" />
                                        <span className='px-1'>获取验证码</span>
                                    </span>) :
                                    (<Timer seconds={60} formatter={"已发送({0})"} onCompleted={() => setState(false)} />)
                                ) :
                                "获取验证码"
                            }
                        </Button>
                    </Col>
                </Row>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={submitLoading}>
                {submitLoading ? <span><Spinner size='sm' animation="border" role="status" ></Spinner><span className='px-1'>登录</span></span> : "登录"}
            </Button>
            <Button onClick={()=>{Board.token.set("???")}}>??</Button>
        </Form>
    );
}

export default LoginPanel;