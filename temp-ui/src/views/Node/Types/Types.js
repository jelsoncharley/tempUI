import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { typeHead } from '../../../consts';
import { trimString } from '../../../components/Utility/Utility';

class Types extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            typeHead: typeHead,
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            visible: false,
            errorMsg: ''
        }
    }

    componentDidMount() {
        ServerAPI.DefaultServer().fetchAllSystemTypes(this.retrieveData, this);
    }

    retrieveData(instance, data) {
        if (!data) {
            alert("No data received");
        }
        else {
            instance.setState({ data: data, selectedRowIndexes: [] });
        }
    }

    checkBoxClick = (rowIndex) => {
        let { selectedRowIndexes } = this.state
        let arrayIndex = selectedRowIndexes.indexOf(rowIndex)
        if (arrayIndex > -1) {
            selectedRowIndexes.splice(arrayIndex, 1)
        } else {
            selectedRowIndexes.push(rowIndex)
        }
        if (this.state.selectedRowIndexes.length > 0) {
            this.setState({ showDelete: true });
        }
        else {
            this.setState({ showDelete: false });
        }
    }

    onDismiss() {
        this.setState({ visible: false })
    }

    renderUpgradeModelDialog() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.click()} size="lg" centered="true" >
                    <ModalHeader toggle={() => this.click()}>Add System Type</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()}>{this.state.errorMsg}</Alert>
                        <Row>
                            <Col>Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='typeName' required={true} /><br />
                                Vendor <Input className="marTop10" id='typeVendor' /><br />
                                Rack Unit <Input className="marTop10" id='typeRackUnit' /><br />
                                AirFlow <Input className="marTop10" id='typeAirFlow' /><br /></Col><Col>
                                Front Panel Interface<font color="red"><sup>*</sup></font> <Input className="marTop10" type="number" min={1} max={128} id='noFPI' /><br />
                                Speed Front Panel Interface <Input className="marTop10" id='SpeedFPI' /><br />
                                Management Interfaces<font color="red"><sup>*</sup></font> <Input className="marTop10" type="number" min={0} id='noMI' /><br />
                                Speed/Type <Input className="marTop10" id='speedType' /><br /></Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addType())}>Add</Button>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.click())}>Cancel</Button>


                    </ModalFooter>
                </Modal>
            );
        }
    }

    click() {
        this.setState({ displayModel: !this.state.displayModel, visible: false })
    }

    addType() {

        let typename = document.getElementById('typeName').value
        let validtypename = trimString(typename)
        let a = {
            'Id': validtypename,
            'Vendor': document.getElementById('typeVendor').value,
            'RackUnit': document.getElementById('typeRackUnit').value,
            'Airflow': document.getElementById('typeAirFlow').value,
            'NumFrontPanelInterface': parseInt(document.getElementById('noFPI').value),
            'SpeedFrontPanelInterface': document.getElementById('SpeedFPI').value,
            'NumMgmtInterface': parseInt(document.getElementById('noMI').value),
            'SpeedMgmtInterafce': document.getElementById('speedType').value
        }
        if (!a.Id) {
            this.setState({ visible: true, errorMsg: 'Please enter the System Name' });
            return;
        }

        if (a.NumFrontPanelInterface > 128 || a.NumFrontPanelInterface < 1 || isNaN(a.NumFrontPanelInterface)) {
            this.setState({ visible: true, errorMsg: 'Please enter a valid Front Panel Interface (between 1 and 128)' });
            return;
        }
        if (a.NumMgmtInterface < 0 || isNaN(a.NumMgmtInterface)) {
            this.setState({ visible: true, errorMsg: 'Please enter a valid Management Interface' });
            return;
        }
        ServerAPI.DefaultServer().addSystemTypes(this.callback, this, a);
    }

    callback(instance, data) {
        let a = instance.state.data
        if (!a) {
            a = []
        }
        a.push(data)
        instance.setState({ data: a, displayModel: !instance.state.displayModel, visible: false })
    }

    showDeleteButton() {
        let a = [];
        if (this.state.showDelete == true) {
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteTypes())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }

    deleteTypes() {
        for (let i = 0; i < this.state.selectedRowIndexes.length; i++) {
            ServerAPI.DefaultServer().deleteSystemType(this.callbackDelete, this, this.state.data[this.state.selectedRowIndexes[i]].label);
        }
        this.setState({ showDelete: !this.state.showDelete, selectedRowIndexes: [] });
    }

    callbackDelete = (instance) => {
        ServerAPI.DefaultServer().fetchAllSystemTypes(this.retrieveData, this);
    }


    render() {

        return (
            <div>
                <div className='marginLeft10'>
                    <Button onClick={() => (this.click())} className="custBtn marginLeft13N" outline color="secondary">New</Button>
                    {this.showDeleteButton()}
                </div>
                <Row className="tableTitle">System Types</Row>
                <SummaryDataTable heading={this.state.typeHead} data={this.state.data} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} />
                {this.renderUpgradeModelDialog()}
            </div>
        );
    }



}

export default Types;