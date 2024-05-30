import React, { useEffect, useState } from "react";
import { Button, Col } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import Board from "../Board.js";
import HttpTask from "../HttpTask.js";

const itemClass = "w-100 h-100 text-start rounded-0"
const itemVariant = "light"
const itemStyle = { paddingLeft: "20px" }

export default () => {
    let [hasUserPermit, setHasUserPermit] = useState(false)

    useEffect(() => {
        HttpTask("/user_has_permit", { pname: "/user_list" }, undefined, (data) => {
            setHasUserPermit(data.flag)
        }, undefined, true)
    }, [Board.token.get()])

    return (
        <Col className="col-1 bg-light cust-side-nav">
            <Accordion defaultActiveKey={['home', "acc_closing"]} alwaysOpen>

                <Accordion.Item eventKey="home">
                    <Accordion.Body className="p-1">
                        <Button className={itemClass} style={itemStyle} variant={itemVariant}>主页</Button>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="acc_docs">
                    <Accordion.Header>凭证</Accordion.Header>
                    <Accordion.Body className="p-1">
                        <Button className={itemClass} style={itemStyle} variant={itemVariant}>录凭证</Button>
                        <Button className={itemClass} style={itemStyle} variant={itemVariant}>查凭证</Button>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="acc_reports">
                    <Accordion.Header>报表</Accordion.Header>
                    <Accordion.Body className="p-1">
                        <Button className={itemClass} style={itemStyle} variant={itemVariant}>资产负债表</Button>
                        <Button className={itemClass} style={itemStyle} variant={itemVariant}>利润表</Button>
                        <Button className={itemClass} style={itemStyle} variant={itemVariant}>现金流量表</Button>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="acc_closing">
                    <Accordion.Body className="p-1">
                        <Button className={itemClass} style={itemStyle} variant={itemVariant} onClick={() => testOpen()}>结账</Button>
                    </Accordion.Body>
                </Accordion.Item>

                {hasUserPermit ? (
                    <Accordion.Item eventKey="system">
                        <Accordion.Header>System</Accordion.Header>
                        <Accordion.Body className="p-1">
                            <Button className={itemClass} style={itemStyle} variant={itemVariant} onClick={() => {
                                if (Board.panels.filter(e => e.type === "user_manager").length === 0) {
                                    Board.panels.push({
                                        type: "user_manager",
                                        title: "User Manager",
                                        place: "left"
                                    })
                                }
                            }}>User</Button>
                        </Accordion.Body>
                    </Accordion.Item>
                ) : <></>}

            </Accordion>
        </Col>
    )
}
