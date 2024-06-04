import React from "react"
import { Dropdown, ButtonGroup } from "react-bootstrap"

export default ({ children, id, title, variant, icon }) => {
    return (
        <Dropdown as={ButtonGroup} drop="end" >
            <Dropdown.Toggle id={id} style={{ textAlign: "left" }} variant={variant}>
                <i className={icon} style={{ margin: "4px" }}></i>
                {title}
            </Dropdown.Toggle>
            <Dropdown.Menu >
                {children}
            </Dropdown.Menu>
        </Dropdown>
    )
}