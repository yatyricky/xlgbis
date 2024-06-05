import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import HttpTask from "../HttpTask";
import { Container, Spinner } from "react-bootstrap";
import Board from "../Board";
import { Transform } from "../Maths/Transform";
import Rect from "../Maths/Rect.js";

export default ({ panelData }) => {
    let [isLoading, setIsLoading] = useState(true)
    let [userList, setUserList] = useState([])

    let index2field = {
        ["0"]: "account",
        ["1"]: "name",
        ["2"]: "qywxbotkey"
    }

    useEffect(() => {
        HttpTask("/user_list", {}, (loading) => {
            setIsLoading(loading)
        }, (data) => {
            setUserList([...data])
        })
    }, [])

    /**
     * @param {import("react-virtualized").GridCellProps} cell 
     * @returns {import("react").ReactNode}
     */
    function cellRenderer(cell) {
        if (cell.rowIndex === 0) {
            return (
                <div
                    key={cell.key}
                    style={{
                        ...cell.style,
                        fontWeight: "bold",
                        border: "1px solid gray"
                    }}
                >
                    {index2field[cell.columnIndex.toString()]}
                </div>
            )
        }

        /**
         * @type {import("../../../xlgbis-server/User/User.mjs").db_user}
         */
        let user = userList[cell.rowIndex - 1]
        if (user === undefined) {
            return (<></>)
        }
        let fName = index2field[cell.columnIndex.toString()]
        if (fName === undefined) {
            return (<></>)
        }
        let prop = user[fName]
        return (
            <div
                key={cell.key}
                style={{
                    ...cell.style,
                    textWrap: "nowrap",
                    border: "1px solid gray"
                }}
            >
                {"" + prop}
            </div>
        )
    }

    let columnCount = Object.keys(index2field).length
    let rowCount = userList.length + 1
    return (
        isLoading ?
            (
                <Spinner animation="border" role="status" />
            ) :
            (
                <div data-label="MultiGrid-parent" style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
                    <ArrowKeyStepper columnCount={columnCount} rowCount={rowCount} mode="cells">
                        {({ onSectionRendered, scrollToColumn, scrollToRow }) => (
                            <Grid
                                columnCount={columnCount}
                                onSectionRendered={onSectionRendered}
                                rowCount={rowCount}
                                scrollToColumn={scrollToColumn}
                                scrollToRow={scrollToRow}

                                cellRenderer={cellRenderer}
                                columnWidth={75}
                                height={rowCount * 40}
                                rowHeight={40}
                                width={300}
                                style={{ position: "absolute", border: "1px solid gray" }}
                            />
                        )}
                    </ArrowKeyStepper>
                </div>
            )
    )
}