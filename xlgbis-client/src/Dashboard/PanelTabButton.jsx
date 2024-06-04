import React from "react"

export default ({ onMouseDown, onClose, title, showClose }) => {
    return (
        <div data-label="panel-tab" style={{paddingLeft:"6px", paddingRight:"6px"}} onMouseDown={onMouseDown}>
            <div style={{ display: "inline-block", marginRight: "6px" }} >{title}</div>
            {showClose ? (<div className="btn-close" style={{ display: "inline-block", width: "4px", height: "4px" }} onClick={onClose}></div>) : <></>}
        </div>
    )
}
