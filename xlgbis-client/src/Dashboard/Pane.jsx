import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Tabs, Button, Icon } from '@kdcloudjs/kdesign'
import Board from "../Board.js"

export default ({ place }) => {
    const [activeKey, setActiveKey] = useState(1)
    let [panels, setPanels] = useState([])

    useEffect(() => {
        let watchPanels = (values) => {
            setPanels(values.filter(e => e.place === place))
        }
        Board.panels.subscribe(watchPanels)
        return () => {
            Board.panels.unsubscribe(watchPanels)
        }
    }, [Board.panels.get()])

    return (
        <Tabs type="dynamic" showScrollArrow activeKey={activeKey} onChange={setActiveKey}>
            {panels.map((pane) => {
                return (
                    <Tabs.TabPane key={pane.key} tab={pane.title}>
                        {pane.title}
                    </Tabs.TabPane>
                )
            })}
        </Tabs>
    )
}