import React, { useEffect, useRef, useState } from "react";
import { Tabs, Tab, Col, Row, Container } from "react-bootstrap";
import Board from "../Board.js";
import Vector2 from "../Maths/Vector2.js";
import Rect from "../Maths/Rect.js";
import Header from "./Header.jsx";
import NavSideBar from "./NavSideBar.jsx";
import UserList from "../User/UserList.jsx";
import { Transform } from "../Maths/Transform.js";

let tempDragKey = null
let beginDragPos = null
let currentDragPos = new Vector2(0, 0)
let leftDrop = new Rect(0, 0, 0, 0)
let rightDrop = new Rect(0, 0, 0, 0)
let wasDragged = false

export default () => {
    let [panels, setPanels] = useState([])

    useEffect(() => {
        let watchPanels = (values) => {
            setPanels([...values])
        }
        Board.panels.subscribe(watchPanels)
        return () => {
            Board.panels.unsubscribe(watchPanels)
        }
    }, [Board.panels.get()])

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
                    <Container data-label="panel-tab" fluid className="px-0" onMouseDown={() => beginDragTab(e.key)}>
                        <Row className="mx-0">
                            <Col className="px-1 col-auto">{e.title}</Col>
                            {((e.place === "left" && e.key === leftPanelKey) || (e.place === "right" && e.key === rightPanelKey)) ?
                                (<Col className="btn-close cust-btn-close" onClick={() => closeTab(e.key)}></Col>) : <></>}
                        </Row>
                    </Container>
                )}>
                {(<div className="py-1">
                    {e.type === "user_manager" ? <UserList /> : <></>}
                </div>
                )}
            </Tab>
        )
    }

    let refWs = useRef(null)
    if (refWs.current) {
        leftDrop = Transform(refWs.current, { xmin: 0, xmax: 0.5, ymin: 0, ymax: 1 }, new Rect(0, 0, -12, -12))
        rightDrop = Transform(refWs.current, { xmin: 0.5, xmax: 1, ymin: 0, ymax: 1 }, new Rect(0, 0, -12, -12))
    }

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
            <Row className="mx-0 h-100">
                <div className="d-flex flex-column px-0">
                    <Header />
                    <Row className="mx-0 flex-grow-1">
                        <NavSideBar />
                        <div data-label="workspace" ref={refWs} className="px-0 col">
                            {(() => {
                                let left = panels.filter(e => e.place === "left")
                                let right = panels.filter(e => e.place === "right")
                                if (left.length > 0 && right.length > 0) {
                                    return (
                                        <Row className="mx-0 h-100">
                                            <Col className="px-1 border border-secondary">
                                                <Tabs
                                                    variant="underline"
                                                    activeKey={leftPanelKey}
                                                    onSelect={(k) => setLeftPanelKey(k)}
                                                >{left.map(renderPanelTab)}</Tabs>
                                            </Col>
                                            <Col className="px-1 border border-secondary">
                                                <Tabs
                                                    variant="underline"
                                                    activeKey={rightPanelKey}
                                                    onSelect={(k) => setRightPanelKey(k)}
                                                >{right.map(renderPanelTab)}</Tabs>
                                            </Col>
                                        </Row>
                                    )
                                } else {
                                    return (
                                        <Row className="mx-0 h-100">
                                            <Col className="px-1 border border-secondary">
                                                <Tabs
                                                    variant="underline"
                                                    activeKey={leftPanelKey}
                                                    onSelect={(k) => setLeftPanelKey(k)}
                                                >{panels.map(renderPanelTab)}</Tabs>
                                            </Col>
                                        </Row>
                                    )
                                }
                            })()}
                        </div>
                    </Row>
                </div>
            </Row>
        </Container>
    )
}
