import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import HttpTask from "../HttpTask";
import { Container, Spinner } from "react-bootstrap";
import Board from "../Board";
import VirtualTable from "rc-table/lib/VirtualTable"

let data = []
for (let i = 0; i < 10000; i++) {
    data[i] = {
        id: i,
        name: Array(Math.floor(Math.random() * 5) + 3).fill(1).map(e => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join(""),
        age: Math.floor(Math.random() * 26) + 5,
    }
}

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 50,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 100,
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: 75,
    },
    {
        title: 'Editable',
        dataIndex: '',
        key: 'editable',
        render: () => <input></input>,
    },
];

export default () => {
    return (
        <VirtualTable scroll={{ y: 200 }} data={data} columns={columns} rowKey={(e) => e.id} />
    )
}
