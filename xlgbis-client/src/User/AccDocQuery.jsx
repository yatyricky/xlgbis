import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import HttpTask from "../HttpTask";
import Board from "../Board";
import { Table } from "@kdcloudjs/kdesign"

let data = []
for (let i = 0; i < 30000; i++) {
    data[i] = {
        id: i,
        name: Array(Math.floor(Math.random() * 5) + 3).fill(1).map(e => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join(""),
        age: Math.floor(Math.random() * 26) + 5,
    }
}

const _columns = [
    {
        code: 'id',
        name: 'ID',
        // key: 'id',
        width: 50,
        // getSpanRect: (value, row, rowIndex) => {
        //     if (rowIndex === 0) {
        //         return {
        //             left: 0,
        //             right: 2,
        //             top: rowIndex,
        //             bottom: rowIndex + 2
        //         }
        //     }
        // }
        columnResize: true,
    },
    {
        code: 'name',
        name: 'Name',
        // key: 'name',
        width: 100,
        columnResize: true,
        features: {
            filterable: true
        },
    },
    {
        code: 'age',
        name: 'Age',
        // key: 'age',
        width: 75,
        columnResize: true,
        features: {
            filterable: true
        },
    },
];

export default () => {
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
        defaultFilters: [
        ],
    }

    return (
        <>
            <div>Before contents</div>
            <Table
                useVirtual={true}
                style={{ overflow: "auto", height: 800 }}
                dataSource={data}
                columns={columns}
                columnDrag={{
                    onColumnDragStopped: handleColumnDragStopped
                }}
                columnResize={true}
                primaryKey={(e) => "" + e.id}
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
            <div>succeeding contents</div>
        </>
    )
}
