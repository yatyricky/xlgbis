import React, { useEffect, useState } from "react";
import HttpTask from "../HttpTask";
import Board from "../Board";
import { Button, Form, Modal, Spin, Table, Input } from '@kdcloudjs/kdesign'
import { PencilFill } from "react-bootstrap-icons"

export default ({ panelData }) => {
    const [visible, setVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [userList, setUserList] = useState([])
    const [tableHeight, setTableHeight] = useState(Board.vh.get() - 120)
    const [editingUser, setEditingUser] = useState({})
    const [submitLoading, setSubmitLoading] = useState(false)
    const [form] = Form.useForm()

    const bodyStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
    const handleClick = (bool) => {
        setVisible(bool)
    }

    useEffect(() => {
        let controller = HttpTask("/user_list", {}, (loading) => {
            setIsLoading(loading)
        }, (data) => {
            setUserList(data)
        })

        let resizePane = () => {
            setTableHeight(Board.vh.get() - 120)
        }
        Board.vh.subscribe(resizePane)
        return () => {
            controller.abort()
            Board.vh.unsubscribe(resizePane)
        }
    }, [])

    const _columns = [
        {
            code: 'account',
            name: 'account',
            width: 150,
            columnResize: true,
        },
        {
            code: 'name',
            name: 'name',
            width: 100,
            columnResize: true,
            features: {
                filterable: true
            },
        },
        {
            code: 'qywxbotkey',
            name: 'qywxbotkey',
            width: 320,
            columnResize: true,
        },
        {
            name: 'Edit',
            render: (value, record, rowIndex) => {
                console.log("rendered", value, record, rowIndex);
                return (
                    <Button type="text" onClick={(e) => {
                        e.stopPropagation()
                        setEditingUser(record)
                        handleClick(true)
                    }}><PencilFill /></Button>
                )
            },
            width: 200
        }
    ];

    const [columns, setColumns] = useState(_columns)
    const handleColumnDragStopped = (columnMoved, nextColumns) => {
        const columnSeq = nextColumns.reduce((result, col, colIndex) => {
            result[col.code] = colIndex
            return result
        }, {})
        setColumns(
            _columns.reduce((result, col) => {
                result[columnSeq[col.code]] = {
                    ...col
                }
                return result
            }, [])
        )
    }

    const filter = {
        defaultFilters: [],
    }

    function performEditUser() {
        setSubmitLoading(true)
        // HttpTask("/user_login", {
        //     account: form.getFieldValue("account"),
        //     qywxbotkey: form.getFieldValue("qywxbotkey")
        // }, (isLoading) => {
        //     setSubmitLoading(isLoading)
        // }, (data) => {
        //     Board.token.set(data.token)
        //     Board.userName.set(data.name)
        //     localStorage.setItem("token", data.token)
        // })
    }

    return (
        <>
            {isLoading ?
                (
                    <Spin type="container" />
                ) :
                (
                    <Table
                        useVirtual={true}
                        style={{ overflow: "auto", height: tableHeight }}
                        dataSource={userList}
                        columns={columns}
                        columnDrag={{
                            onColumnDragStopped: handleColumnDragStopped
                        }}
                        columnResize={true}
                        primaryKey={(e) => e.account}
                        rowSelection={{
                            // type: "checkbox",
                            highlightRowWhenSelected: true,
                            clickArea: "row",
                            column: {
                                // width:0,
                                hidden: true
                            }
                        }}
                        filter={filter}
                    />
                )}
            <Modal
                title={'Edit User'}
                body={
                    <Form
                        labelWidth={50}
                        layout='horizontal'
                        form={form}
                    >
                        <Form.Item label="account" name="account" disabled={true}>
                            <Input style={{ width: 250 }} borderType="bordered" value={editingUser.account} />
                        </Form.Item>
                        <Form.Item label="name" name="name" >
                            <Input style={{ width: 250 }} borderType="bordered" value={editingUser.name} />
                        </Form.Item>
                        <Form.Item label="qywxbotkey" name="qywxbotkey" >
                            <Input borderType="bordered" style={{ width: 250 }} value={editingUser.qywxbotkey} />
                        </Form.Item>
                    </Form>
                }
                bodyStyle={bodyStyle}
                onCancel={() => {
                    handleClick(false)
                }}
                onOk={() => {
                    performEditUser()
                }}
                okButtonProps={{ loading: submitLoading }}
                maskClosable={false}
                type="normal"
                closable={true}
                mask={true}
                focusTriggerAfterClose
                visible={visible}
            />
        </>
    )
}
