import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Input, ListGroup, ListGroupItem, UncontrolledCollapse, CardBody, Card, Alert } from 'reactstrap';
import '../../views/views.css';

class DiscoverModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isOpen: true,
            showAlert: true,
            existingNode: [],
            blankChkCount: 0,
            actualNode: {}
        }
    }

    static getDerivedStateFromProps(props, state) {
        return { existingNode: props.node, actualNode: props.actualNode }
    }

    cancel = () => {
        this.setState({ isOpen: false })
        this.props.cancel()
    }

    action(node) {
        let allChecked = document.getElementById('all').checked
        let checkboxes = document.querySelectorAll('#form1 input[type="checkbox"]')
        let actNode = node
        actNode.nodeType = actNode.type
        actNode.allInterfaces = actNode.interfaces
        let existingNode = this.state.existingNode[0]
        let updatedNode = existingNode
        let blankChkCount = 0
        if (allChecked) {
            let interfaces = actNode.allInterfaces
            let existingInterfaces = updatedNode.allInterfaces
            if (interfaces && interfaces.length) {
                interfaces = interfaces.map(function (item, index) {
                    item.port = actNode.allInterfaces[index].port
                    item.ip = actNode.allInterfaces[index].ip
                    item.IPAddress = actNode.allInterfaces[index].ip
                    item.admin = actNode.allInterfaces[index].admin
                    item.connectedTo.name = actNode.allInterfaces[index].connectedTo.name
                    item.connectedTo.port = actNode.allInterfaces[index].connectedTo.port
                    item.connectedTo.serverName = actNode.allInterfaces[index].connectedTo.name
                    item.connectedTo.serverPort = actNode.allInterfaces[index].connectedTo.port
                    item.isMngmntIntf = actNode.allInterfaces[index].isMngmntIntf
                    return item
                })

                existingInterfaces.map((exItem) => {
                    if (exItem.isMngmntIntf == true) {
                        let mngmtInterface = {
                            port: exItem.port,
                            ip: exItem.ip,
                            IPAddress: exItem.IPAddress,
                            admin: exItem.admin,
                            connectedTo: {
                                name: exItem.connectedTo.name,
                                port: exItem.connectedTo.port,
                                serverName: exItem.connectedTo.serverName,
                                serverPort: exItem.connectedTo.serverPort,
                            },
                            isMngmntIntf: exItem.isMngmntIntf
                        }

                        interfaces.push(mngmtInterface)
                    }
                })

                actNode.allInterfaces = interfaces
            }
            else {
                existingInterfaces.map((exItem) => {
                    if (exItem.isMngmntIntf == true) {
                        let mngmtInterface = {
                            port: exItem.port,
                            ip: exItem.ip,
                            IPAddress: exItem.IPAddress,
                            admin: exItem.admin,
                            connectedTo: {
                                name: exItem.connectedTo.name,
                                port: exItem.connectedTo.port,
                                serverName: exItem.connectedTo.serverName,
                                serverPort: exItem.connectedTo.serverPort,
                            },
                            isMngmntIntf: exItem.isMngmntIntf
                        }

                        interfaces.push(mngmtInterface)
                    }
                })
                actNode.allInterfaces = interfaces
            }
            this.props.action(actNode)
            this.setState({ isOpen: false })
        }
        else {
            let typeChecked = document.getElementById('type').checked
            if (!typeChecked) {
                blankChkCount++
                updatedNode.nodeType = updatedNode.nodeType
            } else {
                updatedNode.nodeType = actNode.nodeType
            }
            let snChecked = document.getElementById('sn').checked
            if (!snChecked) {
                blankChkCount++
                updatedNode.serialNumber = updatedNode.serialNumber
            }
            else {
                updatedNode.serialNumber = actNode.serialNumber
            }
            let kernelChecked = document.getElementById('kernel').checked
            if (!kernelChecked) {
                blankChkCount++
                updatedNode.kernel = updatedNode.kernel
            } else {
                updatedNode.kernel = actNode.kernel
            }
            let isoChecked = document.getElementById('iso').checked
            if (!isoChecked) {
                blankChkCount++
                updatedNode.linuxISO = updatedNode.linuxISO
            } else {
                updatedNode.linuxISO = actNode.linuxISO
            }
            let interfaceChecked = document.getElementById('interface').checked
            if (!interfaceChecked) {
                blankChkCount++
                updatedNode.allInterfaces = updatedNode.allInterfaces
            } else {
                let existingInterfaces = updatedNode.allInterfaces
                let interfaces = actNode.allInterfaces
                if (interfaces && interfaces.length) {
                    interfaces = interfaces.map(function (item, index) {

                        item.port = actNode.allInterfaces[index].port
                        item.ip = actNode.allInterfaces[index].ip
                        item.IPAddress = actNode.allInterfaces[index].ip
                        item.admin = actNode.allInterfaces[index].admin
                        item.connectedTo.name = actNode.allInterfaces[index].connectedTo.name
                        item.connectedTo.port = actNode.allInterfaces[index].connectedTo.port
                        item.connectedTo.serverName = actNode.allInterfaces[index].connectedTo.name
                        item.connectedTo.serverPort = actNode.allInterfaces[index].connectedTo.port
                        item.isMngmntIntf = actNode.allInterfaces[index].isMngmntIntf
                        return item
                    })

                    existingInterfaces.map((exItem) => {
                        if (exItem.isMngmntIntf == true) {
                            let mngmtInterface = {
                                port: exItem.port,
                                ip: exItem.ip,
                                IPAddress: exItem.IPAddress,
                                admin: exItem.admin,
                                connectedTo: {
                                    name: exItem.connectedTo.name,
                                    port: exItem.connectedTo.port,
                                    serverName: exItem.connectedTo.serverName,
                                    serverPort: exItem.connectedTo.serverPort,
                                },
                                isMngmntIntf: exItem.isMngmntIntf
                            }
                            interfaces.push(mngmtInterface)
                        }
                    })

                    updatedNode.allInterfaces = interfaces
                }
            }
            if (blankChkCount == checkboxes.length - 1) {
                return this.setState({ blankChkCount: true })
            } else {
                this.props.action(updatedNode)
                this.setState({ isOpen: false })
            }

        }

    }

    cancelAlert = () => {
        this.setState({ showAlert: false });
    }

    toggle = (e) => {
        let checkboxes = document.querySelectorAll('#form1 input[type="checkbox"]')
        for (let i = 0; i < checkboxes.length; i++) {
            if (e.target.checked == true) {
                checkboxes[i].checked = true
            }
            else {
                checkboxes[i].checked = false
            }
        }
    }

    chk = (e) => {
        let count = 0
        let checkboxes = document.querySelectorAll('#form1 input[type="checkbox"]')

        if (e.target.checked == false) {
            checkboxes[0].checked = false
        }
        else {
            for (let i = 1; i < checkboxes.length; i++) {
                if (checkboxes[i].checked == true) {
                    count++
                }
            }
            if (count == checkboxes.length - 1) {
                checkboxes[0].checked = true
            }
        }
    }



    render() {
        let blankChkCount = this.state.blankChkCount
        let err = null
        if (blankChkCount) {
            err = <Alert color="danger" isOpen={this.state.showAlert} toggle={this.cancelAlert}>Please tick minimum one checkbox to proceed!!!</Alert>
        }
        let existingNode = this.state.existingNode[0]
        let actualNode = this.state.actualNode
        let existingInterfaces = existingNode.allInterfaces
        let actualInterfaces = []
        if (actualNode.interfaces) {
            actualInterfaces = actualNode.interfaces
        }
        else {
            actualInterfaces = []
        }
        return (
            <Modal isOpen={this.state.isOpen} toggle={() => this.cancel()} size="lg" centered="true" >
                <ModalHeader toggle={() => this.cancel()}> Discover Node </ModalHeader>
                {err}
                <ModalBody style={{ margin: '15px' }} id="form1">
                    <Row className="headerRow">
                        <Col sm="1" className="head-check"><input className="form-check-input" onChange={(e) => { this.toggle(e) }} type="checkbox" id="all" name="all" /></Col>
                        <Col sm="3" className="head-name">Fields</Col>
                        <Col sm="4" className="head-name">Existing values</Col>
                        <Col sm="4" className="head-name">Actual Values</Col>

                    </Row>
                    <Row className="headerRow1 borderBottom">
                        <Col sm="1" className="head-check"><input className="form-check-input" onChange={(e) => { this.chk(e) }} type="checkbox" id="type" name="type" /></Col>
                        <Col sm="3" className="head-name-light">Type</Col>
                        <Col sm="4" className="head-name-light">{existingNode.nodeType}</Col>
                        <Col sm="4" className="head-name-light">{actualNode.type}</Col>

                    </Row>
                    <Row className="headerRow1 borderBottom" >
                        <Col sm="1" className="head-check"><input className="form-check-input" onChange={(e) => { this.chk(e) }} type="checkbox" id="sn" name="sn" /></Col>
                        <Col sm="3" className="head-name-light">Serial Number</Col>
                        <Col sm="4" className="head-name-light">{existingNode.serialNumber}</Col>
                        <Col sm="4" className="head-name-light">{actualNode.serialNumber}</Col>

                    </Row>
                    <Row className="headerRow1 borderBottom" >
                        <Col sm="1" className="head-check"><input className="form-check-input" onChange={(e) => { this.chk(e) }} type="checkbox" id="kernel" name="kernel" /></Col>
                        <Col sm="3" className="head-name-light">Linux kernel</Col>
                        <Col sm="4" className="head-name-light">{existingNode.kernel}</Col>
                        <Col sm="4" className="head-name-light">{actualNode.kernel}</Col>

                    </Row>
                    <Row className="headerRow1 borderBottom" >
                        <Col sm="1" className="head-check"><input className="form-check-input" onChange={(e) => { this.chk(e) }} type="checkbox" id="iso" name="iso" /></Col>
                        <Col sm="3" className="head-name-light">Base Linux Iso</Col>
                        <Col sm="4" className="head-name-light">{existingNode.linuxISO}</Col>
                        <Col sm="4" className="head-name-light">{actualNode.linuxISO}</Col>
                    </Row>
                    <Row className="headerRow1 headerRow3" style={{ marginBottom: '20px' }}>
                        <Col sm="1" className="head-check"><input className="form-check-input" type="checkbox" id="interface" onChange={(e) => { this.chk(e) }} name="interface" /></Col>
                        <Col sm="3" className="head-name-light">Interfaces</Col>
                        <Col sm="4" className="head-name-light" style={{ maxHeight: '200px', overflowY: 'auto' }}>{existingInterfaces.map((item) => {
                            return (<ListGroup>
                                <ListGroupItem>
                                    {item.port}
                                </ListGroupItem>
                            </ListGroup>)
                        })}
                        </Col>
                        <Col sm="4" className="head-name-light" style={{ maxHeight: '200px', overflowY: 'auto' }}>{actualInterfaces.map((item, index) => {
                            return (
                                <div>
                                    <ListGroup>
                                        <ListGroupItem>
                                            {item.port}
                                        </ListGroupItem>
                                    </ListGroup>
                                </div>)
                        })}</Col>
                    </Row>
                    <Row>
                        <Col sm="8" style={{ textAlign: 'left' }}><h5>Do you want to replace selected values ?</h5></Col>
                        <Col sm="2" style={{ textAlign: 'right' }}><Button outline className="custBtn" color="primary" onClick={() => (this.action(actualNode))}>Yes</Button></Col>
                        <Col sm="2" style={{ textAlign: 'right' }}><Button outline className="custBtn" color="primary" onClick={() => (this.cancel())}>No</Button></Col>
                    </Row>
                </ModalBody>
            </Modal>
        )
    }
}

export default DiscoverModal