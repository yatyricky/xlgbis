import React, { useEffect, useState } from 'react'
import { Tabs, Button, Icon } from '@kdcloudjs/kdesign'
import Board from "../Board.js"
import { PanelDefine } from "./NavSideBar.jsx";

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

    let selectFirst = () => {
        setTimeout(() => {
            if (panels.length > 0) {
                setActiveKey(panels[0].key)
            }
        }, 0);
    }

    let closeBtn = (evt) => {
        console.log(evt);
        if (typeof evt === "object") {
            return
        }
        Board.panels.filterInPlace(e => e.key !== String(evt))
        selectFirst()
    }

    let closeOthers = (evt) => {
        if (typeof evt === "object") {
            return
        }
        Board.panels.filterInPlace(e => e.place !== place || e.key === String(evt))
        selectFirst()
    }

    let movePane = (evt) => {
        if (typeof evt === "object") {
            return
        }
        let curr = Board.panels.find(e => e.key === String(evt))
        if (curr) {
            curr.place = curr.place === "left" ? "right" : "left"
        }
        Board.panels.invokeHandlers()
        selectFirst()
    }

    return (
        <Tabs type="dynamic" showScrollArrow activeKey={activeKey} onChange={setActiveKey}>
            {panels.map((pane) => {
                let define = PanelDefine[pane.type]
                if (!define) {
                    console.error(`Undefined panel type ${e.type}`)
                }
                return (
                    <Tabs.TabPane
                        key={pane.key}
                        tab={pane.title}
                        operations={[(
                            <Button type="text" onClick={closeBtn}>
                                <Icon type="close" />
                            </Button>
                        )]}>
                        <define.comp panelData={pane} />
                    </Tabs.TabPane>
                )
            })}
            <Tabs.TabPane specialPane="contextMenu">
                <div onClick={closeOthers}>关闭其他</div>
                <div onClick={movePane}>{`移到${place === "left" ? "右" : "左"}侧`}</div>
            </Tabs.TabPane>
        </Tabs>
    )
}
