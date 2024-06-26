import React from "react"
import Board from "../Board";
import { Layout, Row, Col, Button } from '@kdcloudjs/kdesign'

export default () => {
    let logout = () => {
        localStorage.removeItem("token")
        Board.token.set("")
    }

    return (
        <Layout.Header
            style={{
                height: 50,
                backgroundColor: "rgb(63, 81, 180, 0.1)"
            }}>
            <Row wrap={false}>
                <Col flex={"auto"}>
                    <div
                        className="logo"
                        style={{
                            float: 'left',
                            width: 120,
                            height: 32,
                            margin: '10px 25px 10px 0',
                            backgroundImage: "url(\"xlg3-200.png\")",
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat"
                        }}
                    />
                </Col>
                <Col flex="200px" style={{ textAlign: "right" }}>
                    <Button.Dropdown overlay={[
                        {
                            value: '1',
                            label: '设置',
                            action: () => {}
                        },
                        {
                            value: '2',
                            label: '退出',
                            action: logout
                        },
                    ]} onItemClick={(e) => e.action()}>
                        {Board.userName.get()}
                    </Button.Dropdown>
                </Col>
            </Row>
        </Layout.Header>
    )
}
