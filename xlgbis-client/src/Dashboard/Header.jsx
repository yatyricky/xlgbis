import React from "react"
import { Col, Row, Image, Dropdown } from "react-bootstrap";
import Board from "../Board";

export default () => {
    let logout = () => {
        localStorage.removeItem("token")
        Board.token.set("")
    }

    return (
        <Row className="border-bottom">
            <Col><Image src='xlg3-200.png' style={{ height: "40px" }} /></Col>
            <Col />
            <Col className="col-auto">
                <Dropdown>
                    <Dropdown.Toggle variant="link" id="dropdown-basic">
                        {Board.userName.get()}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item>设置</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => logout()}>退出</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
        </Row>
    )
}
