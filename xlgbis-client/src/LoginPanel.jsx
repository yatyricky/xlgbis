import React, { useState } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Timer from "./Timer.jsx"
import Board from "./Board.js"
import axios from "axios";
import Config from './Config.js';
import Code from './Code.js';
import Image from 'react-bootstrap/Image';
import HttpTask, { HttpTaskStatus } from './HttpTask.js';

function LoginPanel() {
    let [inAcc, setInAcc] = useState("")
    let [inVeriCode, setInVeriCode] = useState("")
    let [state, setState] = useState(false)
    let [veriCodeHttp, setVeriCodeHttp] = useState(HttpTaskStatus.Loading)

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
                        <Button className='w-100' disabled={state} onClick={() => {
                            setState(true)
                            HttpTask("/user_request_qywxbotkey", { account: inAcc }, (httpStatus) => {
                                setVeriCodeHttp(httpStatus)
                                if (httpStatus !== HttpTaskStatus.Loading) {
                                    setState(false)
                                }
                            })
                        }}>
                            {state ? (veriCodeHttp === HttpTaskStatus.Loading ? (<span>
                                <Spinner size='sm' animation="border" role="status" />获取验证码</span>) : (
                                <Timer seconds={60} formatter={"已发送({0})"} onCompleted={() => setState(false)} />
                            )) : "获取验证码"}
                        </Button>
                    </Col>
                </Row>
            </Form.Group>
            <Button variant="primary" type="submit">登录</Button>
        </Form>
    );
}

export default LoginPanel;