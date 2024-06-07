import React, { useEffect, useState } from 'react';
import Timer from "./Timer.jsx"
import Board from "./Board.js"
import HttpTask from './HttpTask.js';
import { Layout, Button, Form, Input, Row, Col, Card, Image } from '@kdcloudjs/kdesign'

function LoginPanel() {
    let [inAcc, setInAcc] = useState("")
    let [inVeriCode, setInVeriCode] = useState("")
    let [state, setState] = useState(false)
    let [veriCodeLoading, setVeriCodeLoading] = useState(false)
    let [submitLoading, setSubmitLoading] = useState(false)
    const [form] = Form.useForm()

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
        <Row style={{ paddingTop: 80, margin: 0 }}>
            <Col flex="auto" />
            <Col flex="400px">
                <Card>
                    <Row>
                        <Col flex="auto" />
                        <Col flex="150px" >
                            <Image preview={false} src='xlg3-200.png' />
                        </Col>
                        <Col flex="auto" />
                    </Row>
                    <br />
                    <Form
                        style={{ width: 300 }}
                        labelWidth={50}
                        layout='horizontal'
                        form={form}
                        onValuesChange={(changedValue, values) => {
                            console.log(changedValue, values)
                        }}
                        onFinish={(val) => console.log(val)}>
                        <Form.Item label="账号" name="account" required>
                            <Input style={{ width: 250 }} />
                        </Form.Item>
                        <Form.Item label="验证码" name="qywxbotkey" required>
                            <Row wrap={false} style={{ width: 260 }}>
                                <Col flex="auto">
                                    <Input />
                                </Col>
                                <Col flex="100px">
                                    <Button style={{ width: 100 }} loading={state} type="primary" onClick={() => setState(true)} >获取验证码</Button>
                                </Col>
                            </Row>
                        </Form.Item>

                        <Button type="primary" htmlType="submit">
                            登录
                        </Button>
                    </Form>
                </Card>
            </Col>
            <Col flex="auto" />
        </Row>
        // <Container fluid className="px-0 h-100">
        //     <div className="cust-main-bg" />
        //     <div style={{ width: 500, margin:"0 auto", paddingTop: 80 }}>
        //         <Form className='shadow px-3 py-3' onSubmit={performLogin}>
        //             <Row className='' >
        //                 <Col className='flex-grow-1'></Col>
        //                 <Image src='xlg3-200.png' className='cust-width-200 center-block img-responsive' />
        //                 <Col className='flex-grow-1'></Col>
        //             </Row>

        //             <Form.Group className="mb-3" controlId="formBasicEmail">
        //                 <Form.Label>账号</Form.Label>
        //                 <Form.Control type="text" value={inAcc} onChange={e => setInAcc(e.target.value)} />
        //             </Form.Group>

        //             <Form.Group className="mb-3" controlId="formBasicPassword">
        //                 <Form.Label>验证码</Form.Label>
        //                 <Row>
        //                     <Col>
        //                         <Form.Control type="text" value={inVeriCode} onChange={e => setInVeriCode(e.target.value)} />
        //                     </Col>
        //                     <Col className='cust-width-160'>
        //                         <Button className='w-100' disabled={state} onClick={() => requestCode()}>
        //                             {state ?
        //                                 (veriCodeLoading ?
        //                                     (<span>
        //                                         <Spinner size='sm' animation="border" role="status" />
        //                                         <span className='px-1'>获取验证码</span>
        //                                     </span>) :
        //                                     (<Timer seconds={60} formatter={"已发送({0})"} onCompleted={() => setState(false)} />)
        //                                 ) :
        //                                 "获取验证码"
        //                             }
        //                         </Button>
        //                     </Col>
        //                 </Row>
        //             </Form.Group>
        //             <Button variant="primary" type="submit" disabled={submitLoading}>
        //                 {submitLoading ? <span><Spinner size='sm' animation="border" role="status" ></Spinner><span className='px-1'>登录</span></span> : "登录"}
        //             </Button>
        //             <Button onClick={() => { Board.token.set("???") }}>??</Button>
        //         </Form>
        //     </div>
        // </Container>
    );
}

export default LoginPanel;