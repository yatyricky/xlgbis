import React, { useEffect, useState } from "react";
import { Tabs, Tab, Button, Col, Row, Container } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import Board from "./Board.js";

export default () => {
    let [panels, setPanels] = useState([])

    function watchPanels(values) {
        setPanels([...values])
    }
    Board.panels.subscribe(watchPanels)

    useEffect(() => {
        return () => {
            Board.panels.unsubscribe(watchPanels)
        }
    }, [panels, setPanels])

    function testOpen(params) {
        Board.panels.push({
            key: "" + Math.random(),
            type: "acc_query",
            title: "查凭证",
            place: Math.random() < 0.5 ? "left" : "right"
        })
    }

    function closeTab(key) {
        Board.panels.filterInPlace((e) => e.key !== key)
    }

    let renderPanelTab = (e, i) => {
        return (
            <Tab
                eventKey={e.key}
                key={i}
                title={(
                    <Container fluid className="px-0">
                        <Row className="mx-0">
                            <Col className="px-1 col-auto">{e.title}</Col>
                            <Col className="btn-close cust-btn-close" onClick={() => closeTab(e.key)}></Col>
                        </Row>
                    </Container>
                )}>
                {(<Container fluid className="mx-0 py-1 h-100">
                    <Button>{e.key}</Button>
                </Container>
                )}
            </Tab>
        )
    }

    return (
        <Container fluid className="vh-100 px-0">
            <Row className="border-bottom">
                <Col>XLG</Col>
            </Row>
            <Row className="h-100">
                <Col className="col-1 bg-light">
                    <Accordion defaultActiveKey={['home', "acc_closing"]} alwaysOpen>
                        <Accordion.Item eventKey="home">
                            <Accordion.Body className="p-1">
                                <Button className="w-100 h-100 text-start rounded-0" variant="light">主页</Button>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="acc_docs">
                            <Accordion.Header>凭证</Accordion.Header>
                            <Accordion.Body className="p-1">
                                <Button className="w-100 h-100 text-start rounded-0" variant="light">录凭证</Button>
                                <Button className="w-100 h-100 text-start rounded-0" variant="light">查凭证</Button>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="acc_reports">
                            <Accordion.Header>报表</Accordion.Header>
                            <Accordion.Body className="p-1">
                                <Button className="w-100 h-100 text-start rounded-0" variant="light">资产负债表</Button>
                                <Button className="w-100 h-100 text-start rounded-0" variant="light">利润表</Button>
                                <Button className="w-100 h-100 text-start rounded-0" variant="light">现金流量表</Button>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="acc_closing">
                            <Accordion.Body className="p-1">
                                <Button className="w-100 h-100 text-start rounded-0" variant="light" onClick={() => testOpen()}>结账</Button>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
                <Col className="px-0">
                    {(() => {
                        let left = panels.filter(e => e.place === "left")
                        let right = panels.filter(e => e.place === "right")
                        if (left.length > 0 && right.length > 0) {
                            return (
                                <Row className="h-100">
                                    <Col className="m-1 h-100"><Tabs variant="underline">{left.map(renderPanelTab)}</Tabs></Col>
                                    <Col className="m-1"><Tabs variant="underline">{right.map(renderPanelTab)}</Tabs></Col>
                                </Row>
                            )
                        } else {
                            return (<Tabs variant="underline">
                                {panels.map(renderPanelTab)}
                            </Tabs>)
                        }
                    })()}
                </Col>
            </Row>
        </Container>
    )
}
