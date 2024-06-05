import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import HttpTask from "../HttpTask";
import { Container, Spinner } from "react-bootstrap";
import Board from "../Board";
import List from 'rc-virtual-list';

export default () => {
    let data = []
    for (let i = 0; i < 10000; i++) {
        data[i] = {
            id: i,
            name: Array(Math.floor(Math.random() * 5) + 3).map(e => Math.floor(Math.random() * 26) + 65).join("")
        }
    }
    console.log(data[0].name);
    return (
        <>
            <List style={{ border: "1px solid black" }} data={data} height={200} itemHeight={30} itemKey={(e) => e.id}>
                {e => <div>{e.name}</div>}
            </List>
        </>
    )
}
