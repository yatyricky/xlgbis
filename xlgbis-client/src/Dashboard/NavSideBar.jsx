import React, { useEffect, useState } from "react";
import Board from "../Board.js";
import HttpTask from "../HttpTask.js";

const itemClass = "w-100 h-100 text-start rounded-0"
const itemVariant = "light"
const itemStyle = { paddingLeft: "20px" }

const PanelDefine = {
    user_manager: { unique: true },
    acc_query: {},
}

export default () => {
    let [hasUserPermit, setHasUserPermit] = useState(false)

    useEffect(() => {
        HttpTask("/user_has_permit", { pname: "/user_list" }, undefined, (data) => {
            setHasUserPermit(data.flag)
        }, undefined, true)
    }, [Board.token.get()])

    function selectPanel(key) {
        for (const dom of document.getElementsByClassName("nav-link")) {
            if (dom.getAttribute("data-rr-ui-event-key") === key) {
                dom.click()
                break
            }
        }
    }

    function _doOpenPanel(type, title) {
        Board.panels.push({ type, title, place: "left" })
        setTimeout(() => {
            let last = Board.panels.get(Board.panels.get().length - 1)
            selectPanel(last?.key)
        }, 0);
    }

    function openPanel(type, title) {
        let define = PanelDefine[type]
        if (!define) {
            return Board.toasts.push({
                level: 2,
                message: `unknown panel ${type}`
            })
        }

        if (define.unique) {
            let find = Board.panels.filter(e => e.type === type)
            if (find.length === 0) {
                _doOpenPanel(type, title)
            } else {
                selectPanel(find[0].key)
            }
        } else {
            _doOpenPanel(type, title)
        }
    }

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
                        <Button className={itemClass} style={itemStyle} variant={itemVariant}
                            onClick={() => openPanel("acc_query", "查凭证")}>结账</Button>
                    </Accordion.Body>
                </Accordion.Item>

                {hasUserPermit ? (
                    <Accordion.Item eventKey="system">
                        <Accordion.Header>System</Accordion.Header>
                        <Accordion.Body className="p-1">
                            <Button className={itemClass} style={itemStyle} variant={itemVariant}
                                onClick={() => openPanel("user_manager", "User Manager")}>User</Button>
                        </Accordion.Body>
                    </Accordion.Item>
                ) : <></>}

            </Accordion>
        </Col>
    )
}
