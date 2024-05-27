import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Timer from "./Timer.jsx"
import Board from "./Board.js"

function LoginPanel() {
    let [state, setState] = useState(false)

    function blah(params) {

    }

    function performLogin(event) {
        event.preventDefault()
        // Board.toasts.push({
        //     level: Math.floor(Math.random() * 3),
        //     header: Math.random() < 0.5 ? "" + Math.random() : undefined,
        //     message: "当前状态不郧西，比u芯片加埃塔那你四天内公式狮子嗯你的伤口芯片加埃塔那你四天内公式狮子嗯你的伤口芯片加埃塔那你四天内公式狮子嗯你的伤口i啊实打实大大我哪怕" + Math.random()
        // })
        Board.token.set("???????")
    }

    return (
        <Form className='shadow px-3 py-3' onSubmit={performLogin}>
            <Row>
                <h2 className='text-center'>XLG</h2>
            </Row>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>账号</Form.Label>
                <Form.Control type="text" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>验证码</Form.Label>
                <Row>
                    <Col xs='8'>
                        <Form.Control type="text" />
                    </Col>
                    <Col className='w-100'>
                        <Button className='w-100' disabled={state} onClick={() => {
                            setState(true)
                        }}>
                            {state ? (<Timer seconds={10} formatter={"已发送({0})"} onCompleted={() => setState(false)} />) : "获取验证码"}
                        </Button>
                    </Col>
                </Row>
            </Form.Group>
            <Button variant="primary" type="submit">登录</Button>
        </Form>
    );
}

export default LoginPanel;