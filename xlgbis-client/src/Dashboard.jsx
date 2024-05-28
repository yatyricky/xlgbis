import React, { useEffect, useState } from "react";
import { Tabs, Tab, Button, Col, Row, Container } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import Board from "./Board.js";
import Vector2 from "./Vector2.js";
import Rect from "./Rect.js";

let tempDragKey = null
let beginDragPos = null
let currentDragPos = new Vector2(0, 0)
let leftDrop = new Rect(0, 0, 0, 0)
let rightDrop = new Rect(0, 0, 0, 0)
let wasDragged = false

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

    // drag
    let v2 = new Vector2()
    let [dragData, setDragData] = useState({
        key: "",
        x: 0,
        y: 0
    })

    function beginDragTab(key) {
        tempDragKey = key
    }

    function beginDrag(evt) {
        wasDragged = false
        if (String.isEmptyText(tempDragKey)) {
            return
        }
        beginDragPos = new Vector2(evt.pageX, evt.pageY)
    }

    function endDrag() {
        let moveTo
        if (leftDrop.contains(currentDragPos)) {
            moveTo = "left"
        } else if (rightDrop.contains(currentDragPos)) {
            moveTo = "right"
        }
        if (wasDragged && moveTo) {
            let pi = Board.panels.findIndex(e => e.key === tempDragKey)
            if (pi >= 0) {
                let curr = Board.panels.remove(pi)
                Board.panels.push({ ...curr, place: moveTo })

                if (Board.panels.filter(e => e.place === "left").length === 0) {
                    Board.panels.foreach((e) => {
                        e.place = "left"
                    })
                }
            }
        }
        tempDragKey = null
        setDragData(prevData => ({ ...prevData, key: "", x: 0, y: 0 }))
        beginDragPos = null
    }

    function doDrag(evt) {
        if (String.isEmptyText(tempDragKey) || !beginDragPos) {
            return
        }
        currentDragPos.set(evt.pageX, evt.pageY)
        v2.setTo(currentDragPos).subSelf(beginDragPos)
        if (v2.magnitude() > 10) {
            wasDragged = true
            setDragData(prevData => ({ ...prevData, key: tempDragKey, x: currentDragPos.x, y: currentDragPos.y }))
        } else {
            setDragData(prevData => ({ ...prevData, key: "", x: 0, y: 0 }))
        }
    }

    let [leftPanelKey, setLeftPanelKey] = useState("")
    let [rightPanelKey, setRightPanelKey] = useState("")

    let renderPanelTab = (e, i) => {
        return (
            <Tab
                eventKey={e.key}
                key={i}
                title={(
                    <Container fluid className="px-0" onMouseDown={() => beginDragTab(e.key)}>
                        <Row className="mx-0">
                            <Col className="px-1 col-auto">{e.title}</Col>
                            {((e.place === "left" && e.key === leftPanelKey) || (e.place === "right" && e.key === rightPanelKey)) ?
                                (<Col className="btn-close cust-btn-close" onClick={() => closeTab(e.key)}></Col>) : <></>}
                        </Row>
                    </Container>
                )}>
                {(<Container fluid className="mx-0 py-1">
                    <Button>{e.key}</Button>
                </Container>
                )}
            </Tab>
        )
    }

    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    leftDrop.set(vw / 12 - 10, 30, vw / 12 * 11 / 2 - 10, vh - 100)
    rightDrop.set(vw / 12 + vw / 12 * 11 / 2, 30, vw / 12 * 11 / 2 - 20, vh - 100)

    return (
        <Container fluid className="px-0 h-100" onMouseDown={(evt) => beginDrag(evt)} onMouseUp={(evt) => endDrag(evt)} onMouseMove={(evt) => doDrag(evt)}>
            <div style={{
                position: "fixed",
                display: String.isEmptyText(dragData.key) ? "none" : "block",
                top: dragData.y,
                left: dragData.x,
                zIndex: 100
            }}>{panels.find(e => e.key === dragData.key)?.title}</div>
            <div style={{
                position: "fixed",
                display: String.isEmptyText(dragData.key) ? "none" : "block",
                backgroundColor: leftDrop.contains(currentDragPos) ? "#99FF9999" : "#99FF9933",
                left: leftDrop.x,
                top: leftDrop.y,
                width: leftDrop.w,
                height: leftDrop.h,
                zIndex: 99
            }} />
            <div style={{
                position: "fixed",
                display: String.isEmptyText(dragData.key) ? "none" : "block",
                backgroundColor: rightDrop.contains(currentDragPos) ? "#99FF9999" : "#99FF9933",
                left: rightDrop.x,
                top: rightDrop.y,
                width: rightDrop.w,
                height: rightDrop.h,
                zIndex: 99
            }} />
            <Row className="h-100 w-100 px-0">
                <div className="d-flex flex-column">
                    <Row className="border-bottom">
                        <Col>XLG</Col>
                    </Row>
                    <Row className="flex-grow-1">
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
                        <Col className="pl-1">
                            {(() => {
                                let left = panels.filter(e => e.place === "left")
                                let right = panels.filter(e => e.place === "right")
                                if (left.length > 0 && right.length > 0) {
                                    return (
                                        <Row className="h-100">
                                            <Col className="px-1 border border-secondary"><Tabs variant="underline" activeKey={leftPanelKey} onSelect={(k) => setLeftPanelKey(k)}>{left.map(renderPanelTab)}</Tabs></Col>
                                            <Col className="px-1 border border-secondary"><Tabs variant="underline" activeKey={rightPanelKey} onSelect={(k) => setRightPanelKey(k)}>{right.map(renderPanelTab)}</Tabs></Col>
                                        </Row>
                                    )
                                } else {
                                    return (
                                        <Row className="h-100">
                                            <Col className="px-1 border border-secondary"><Tabs variant="underline" activeKey={leftPanelKey} onSelect={(k) => setLeftPanelKey(k)}>{panels.map(renderPanelTab)}</Tabs></Col>
                                        </Row>
                                    )
                                }
                            })()}
                        </Col>
                    </Row>
                </div>
            </Row>
        </Container>
    )
}
