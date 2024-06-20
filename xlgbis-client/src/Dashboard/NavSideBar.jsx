import React, { useEffect, useState } from "react";
import Board from "../Board.js";
import HttpTask from "../HttpTask.js";
import UserList from "../User/UserList.jsx";
import AccDocQuery from "../User/AccDocQuery.jsx";
import { Layout, Menu } from '@kdcloudjs/kdesign'
import { House, JournalCheck, JournalText, FileText, FileEarmarkSpreadsheet, CurrencyYen, Gear, Wrench } from "react-bootstrap-icons"

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
        <Layout.Sider
            width={200}
            className="site-layout-background"
            style={{
                backgroundColor: '#fff',
                listStyleType: "none",
                // padding: "0px"
            }}>
            <Menu
                mode="inline"
                theme="light"
                defaultSelectedKey={'1'}
                defaultOpenKeys={['sub1']}
                style={{
                    width: '100%',
                    height: '100%',
                    borderRight: 0
                }}
                onClick={(e) => {
                    if (e.key === "acc_close") {
                        openPanel("acc_query", "查凭证")
                    }
                }}
            >
                <Menu.Item icon={<House />} key="dashboard">主页</Menu.Item>
                <Menu.SubMenu key="acc_docs" icon={<FileText />} onClick={"clicked menu"} title="凭证">
                    <Menu.Item key="acc_docs_new" onClick={"clicked opt1"}>录凭证</Menu.Item>
                    <Menu.Item key="acc_docs_query">查凭证</Menu.Item>
                    <Menu.Item key="acc_docs_attach">附件</Menu.Item>
                </Menu.SubMenu>
                <Menu.SubMenu key="book" icon={<JournalText />} onClick={"clicked menu"} title="账簿">
                    <Menu.Item key="book_ledger" onClick={"clicked opt1"}>明细账</Menu.Item>
                    <Menu.Item key="book_sheet">科目余额表</Menu.Item>
                </Menu.SubMenu>
                <Menu.SubMenu key="acc_reports" icon={<FileEarmarkSpreadsheet />} title="报表">
                    <Menu.Item key="acc_reports_balance">资产负债表</Menu.Item>
                    <Menu.Item key="acc_reports_income">利润表</Menu.Item>
                    <Menu.Item key="acc_reports_cash">现金流量表</Menu.Item>
                </Menu.SubMenu>
                <Menu.Item key="acc_close" icon={<JournalCheck />}>结账</Menu.Item>
                <Menu.Item key="teller_diary" icon={<CurrencyYen />}>日记账</Menu.Item>
                <Menu.SubMenu key="settings" icon={<Gear />} title="设置">
                    <Menu.Item key="settings_accounts">科目</Menu.Item>
                    <Menu.Item key="settings_accounts_aux">辅助核算</Menu.Item>
                </Menu.SubMenu>
                {hasUserPermit ? (
                    <Menu.SubMenu key="system" icon={<Wrench />} title="System">
                        <Menu.Item key="user_manage">User Manager</Menu.Item>
                    </Menu.SubMenu>
                ) : <></>}
            </Menu>
        </Layout.Sider>
    )
}
