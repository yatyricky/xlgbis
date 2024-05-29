import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Timer from "./Timer.jsx"
import Board from "./Board.js"
import axios from "axios";
import Config from './Config.js';
import Code from './Code.js';

function LoginPanel() {
    let [inAcc, setInAcc] = useState("")
    let [inVeriCode, setInVeriCode] = useState("")
    let [state, setState] = useState(false)

    function blah(params) {

    }

    function performLogin(event) {
        event.preventDefault()
        axios.post(`${Config.server}/user_login`, {
            account: inAcc,
            qywxbotkey: inVeriCode
        }).then(resp => {
            if (resp.data.code !== 0) {
                Board.toasts.push({
                    level: 2,
                    message: Code.ToMessage(resp.data.code)
                })
            } else {
                Board.token.set(resp.data.data)
            }
        })
    }

    return (
        <Form className='shadow px-3 py-3' onSubmit={performLogin}>
            <Row>
                <h2 className='text-center'>XLG</h2>
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
                    <Col className='cust-width-120'>
                        <Button className='w-100' disabled={state} onClick={() => {
                            axios.post(`${Config.server}/user_request_qywxbotkey`, {
                                account: inAcc
                            }).then(resp => {
                                if (resp.data.code !== 0) {
                                    Board.toasts.push({
                                        level: 2,
                                        message: Code.ToMessage(resp.data.code)
                                    })
                                } else {
                                    setState(true)
                                }
                            })
                        }}>
                            {state ? (<Timer seconds={60} formatter={"已发送({0})"} onCompleted={() => setState(false)} />) : "获取验证码"}
                        </Button>
                    </Col>
                </Row>
            </Form.Group>
            <Button variant="primary" type="submit">登录</Button>
        </Form>
    );
}

export default LoginPanel;