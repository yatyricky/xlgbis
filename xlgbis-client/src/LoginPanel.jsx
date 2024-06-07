import React, { useEffect, useState } from 'react';
import Timer from "./Timer.jsx"
import Board from "./Board.js"
import HttpTask from './HttpTask.js';
import { Button, Form, Input, Row, Col, Card, Image } from '@kdcloudjs/kdesign'

function LoginPanel() {
    let [state, setState] = useState(false)
    let [veriCodeLoading, setVeriCodeLoading] = useState(false)
    let [submitLoading, setSubmitLoading] = useState(false)
    const [form] = Form.useForm()

    function performLogin() {
        setSubmitLoading(true)
        HttpTask("/user_login", {
            account: form.getFieldValue("account"),
            qywxbotkey: form.getFieldValue("qywxbotkey")
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
        HttpTask("/user_request_qywxbotkey", { account: form.getFieldValue("account") }, (isLoading) => {
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
                        labelWidth={50}
                        layout='horizontal'
                        form={form}
                        onFinish={() => performLogin()}>
                        <Form.Item label="账号" name="account">
                            <Input style={{ width: 250 }} borderType="bordered" />
                        </Form.Item>
                        <Form.Item label="验证码" name="qywxbotkey" >
                            <Input borderType="bordered" style={{ width: 250 }} addonAfter={
                                <Button
                                    style={{ width: 100 }}
                                    disabled={state}
                                    loading={veriCodeLoading}
                                    type="text"
                                    onClick={() => requestCode()}
                                >{state ?
                                    (veriCodeLoading ?
                                        "获取验证码" :
                                        (<Timer seconds={60} formatter={"已发送({0})"} onCompleted={() => setState(false)} />)
                                    ) :
                                    "获取验证码"}</Button>

                            } />
                        </Form.Item>

                        <Button loading={submitLoading} type="primary" htmlType="submit">登录</Button>
                        <Button onClick={() => { Board.token.set("???") }}>??</Button>
                    </Form>
                </Card>
            </Col>
            <Col flex="auto" />
        </Row>
    );
}

export default LoginPanel;
