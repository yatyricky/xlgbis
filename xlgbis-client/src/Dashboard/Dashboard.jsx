import React, { useEffect, useState } from "react";
import MyHeader from "./MyHeader.jsx";
import NavSideBar from "./NavSideBar.jsx";
import { Layout, SplitPanel } from '@kdcloudjs/kdesign'
import Pane from "./Pane.jsx";
import Board from "../Board.js"

export default () => {
    let [height, setHeight] = useState(Board.vh.get() - 50 - 32)

    useEffect(() => {
        let watchViewHeight = (value) => {
            setHeight(value - 50 - 32)
        }
        Board.vh.subscribe(watchViewHeight)
        return () => {
            Board.vh.unsubscribe(watchViewHeight)
        }
    }, [])

    return (
        <Layout>
            <MyHeader />
            <Layout style={{ height }}>
                <NavSideBar />
                <Layout>
                    <Layout.Content
                        className="site-layout-background"
                        style={{
                            backgroundColor: '#fff'
                        }}>
                        <SplitPanel firstSlot={<Pane place="left" />} secondSlot={<Pane place="right" />} />
                    </Layout.Content>
                </Layout>
            </Layout>
        </Layout>
    )
}
