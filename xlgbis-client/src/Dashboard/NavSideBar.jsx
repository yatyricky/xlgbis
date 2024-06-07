import React, { useEffect, useState } from "react";
import Board from "../Board.js";
import HttpTask from "../HttpTask.js";
import DropdownButtonExt from "./DropdownButtonExt.jsx";
import UserList from "../User/UserList.jsx";
import AccDocQuery from "../User/AccDocQuery.jsx";

export const PanelDefine = {
    user_manager: { comp: UserList, unique: true },
    acc_query: { comp: AccDocQuery },
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
            Message.error({
                content: `unknown panel ${type}`,
                closable: true
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
        <div className="px-0 bg-light" style={{ width: "120px" }}>
            <ButtonGroup vertical style={{ width: "100%" }}>
                <Button style={{ textAlign: "left" }} variant="light"><i className="bi bi-house" style={{ margin: "4px" }} />主页</Button>

                <DropdownButtonExt title="凭证" icon="bi bi-file-text" id="acc_docs" variant="light">
                    <Dropdown.Item eventKey="accdoc_new" >录凭证</Dropdown.Item>
                    <Dropdown.Item eventKey="accdoc_query" >查凭证</Dropdown.Item>
                </DropdownButtonExt>

                <DropdownButtonExt title="报表" icon="bi bi-table" id="acc_reports" variant="light">
                    <Dropdown.Item eventKey="accrep_balsht" >资产负债表</Dropdown.Item>
                    <Dropdown.Item eventKey="accrep_revsht" >利润表</Dropdown.Item>
                    <Dropdown.Item eventKey="accrep_cassht" >现金流量表</Dropdown.Item>
                </DropdownButtonExt>

                <Button style={{ textAlign: "left" }} onClick={() => openPanel("acc_query", "查凭证")} variant="light">
                    <i className="bi bi-check-all" style={{ margin: "4px" }} />
                    结账
                </Button>

                {hasUserPermit ? (
                    <DropdownButtonExt title="System" icon="bi bi-gear" id="system" variant="light">
                        <Dropdown.Item eventKey="accrep_balsht" onClick={() => openPanel("user_manager", "User Manager")}>User</Dropdown.Item>
                    </DropdownButtonExt>
                ) : <></>}
            </ButtonGroup>
        </div>
    )
}
