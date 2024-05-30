import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import HttpTask from "../HttpTask";
import { Spinner } from "react-bootstrap";
import { MultiGrid, Grid } from "react-virtualized"
import Board from "../Board";

export default () => {
    let [isLoading, setIsLoading] = useState(true)
    let [userList, setUserList] = useState([])
    let [viewPortWidth, setViewPortWidth] = useState(0)

    useLayoutEffect(() => {
        console.log("recalc");
        function CalculateViewportWidth() {
            let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
            let panels = Board.panels.get()
            let windowsCount = panels.filter(e => e.place === "left").length < panels.length ? 2 : 1
            setViewPortWidth((vw - 200) / windowsCount - 20)
        }
        window.addEventListener('resize', CalculateViewportWidth);
        CalculateViewportWidth()
        return () => { window.removeEventListener('resize', CalculateViewportWidth); }
    }, [Board.panels.get().map(e => `${e.key}-${e.place}`).join("/")])

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
        return (<div key={cell.key} style={cell.style}>{"" + prop}</div>)
    }

    return (
        isLoading ?
            (<Spinner animation="border" role="status" />) :
            (<MultiGrid
                cellRenderer={cellRenderer}
                columnCount={Object.keys(index2field).length}
                columnWidth={75}
                height={150}
                rowCount={userList.length + 1}
                rowHeight={40}
                width={viewPortWidth}
                // fixedColumnCount={2}
                fixedRowCount={1}
            />)
    )
}