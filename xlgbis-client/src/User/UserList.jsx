import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import HttpTask from "../HttpTask";
import { Container, Spinner } from "react-bootstrap";
import { MultiGrid, Grid } from "react-virtualized"
import Board from "../Board";
import { Transform } from "../Maths/Transform";
import Rect from "../Maths/Rect.js";

export default ({ panelData }) => {
    let [isLoading, setIsLoading] = useState(true)
    let [userList, setUserList] = useState([])

    // useLayoutEffect(() => {
    //     function CalculateViewportWidth() {
    //         let vw = Math.max(window.innerWidth || 0)
    //         let panels = Board.panels.get()
    //         let windowsCount = panels.filter(e => e.place === "left").length < panels.length ? 2 : 1
    //         let widthToSet = (vw - 200) / windowsCount - 30
    //         setViewPortWidth(widthToSet)
    //     }
    //     window.addEventListener('resize', CalculateViewportWidth);
    //     CalculateViewportWidth()
    //     return () => { window.removeEventListener('resize', CalculateViewportWidth); }
    // }, [Board.panels.get().map(e => `${e.key}-${e.place}`).join("/")])

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
            return (<div key={cell.key} style={cell.style}>{index2field[cell.columnIndex.toString()]}</div>)
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
        return (<div key={cell.key} style={{ ...cell.style, textWrap: "nowrap" }}>{"" + prop}</div>)
    }

    return (
        isLoading ?
            (
                <Spinner animation="border" role="status" />
            ) :
            (
                <div data-label="MultiGrid-parent" style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
                    <MultiGrid
                        cellRenderer={cellRenderer}
                        columnCount={Object.keys(index2field).length}
                        columnWidth={75}
                        height={300}
                        rowCount={userList.length + 1}
                        rowHeight={40}
                        width={300}
                        style={{ position: "absolute" }}
                    />
                </div>

            )
    )
}