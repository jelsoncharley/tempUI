import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, Media } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { frrHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import { FETCH_ALL_FRR, ADD_FRR, UPDATE_FRR, DELETE_FRR } from '../../../apis/RestConfig';
import { postRequest } from '../../../apis/RestApi';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { getFrr, addFrr, updateFrr } from '../../../actions/frrAction';

class Frr extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            frrHead: frrHead,
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            displayEditModel: false,
            visible: false
        }
        this.counter = 0;
    }

    componentDidMount() {
        this.props.getFrr(FETCH_ALL_FRR)
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data ? props.data.toJS() : []
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


    showDeleteButton() {
        let a = [];
        if (this.state.showDelete == true) {
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteFrr())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }


    deleteFrr() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })
        postRequest(DELETE_FRR, deleteIds).then(function (data) {
            let failedSites = []
            failedSites = getNameById(data.Data.Failure, self.state.data);
            failedSites.map((item) => {
                NotificationManager.error(item + ' is in use', "Site")
            })
            self.setState({ showDelete: false, selectedRowIndexes: [] });
            self.props.getFrr(FETCH_ALL_FRR);
        })
    }

    onDismiss() {
        this.setState({ visible: false });
    }

    renderUpgradeModelDialog() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add Frr</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='frrName' /><br />
                        Location <Input className="marTop10" id='frrLoc' /><br />
                        Description <Input className="marTop10" id='frrDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addFrr())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false })
    }

    addFrr() {
        let self = this;
        let frr = document.getElementById('frrName').value
        let validFrr = trimString(frr)
        if (!validFrr) {
            this.setState({ visible: true });
            return;
        }
        let params = {
            'Name': validFrr,
            'Location': document.getElementById('frrLoc').value,
            'Description': document.getElementById('frrDesc').value
        }
        let frrPromise = self.props.addFrr(ADD_FRR, params)

        frrPromise.then(function (value) {
            NotificationManager.success("Frr added successfully", "Frr") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "Frr") // "error!"
        })
        self.setState({ displayModel: false, visible: false })
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one Frr to edit")
            return
        }
        this.setState({ displayEditModel: true })
    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel })
    }

    renderEditModelDialog() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit Frr</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" value={edittedData.Name} /><br />
                        Location <Input className="marTop10" id='frrLocEdit' defaultValue={edittedData.Location} /><br />
                        Description <Input className="marTop10" id='frrDescEdit' defaultValue={edittedData.Description} /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editFrr(edittedData.Id))}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editFrr = (frrId) => {
        let self = this

        let params = {
            'Id': frrId,
            'Location': document.getElementById('frrLocEdit').value ? document.getElementById('frrLocEdit').value : "-",
            'Description': document.getElementById('frrDescEdit').value ? document.getElementById('frrDescEdit').value : "-"
        }

        let frrPromise = self.props.updateFrr(UPDATE_FRR, params)

        frrPromise.then(function (value) {
            NotificationManager.success("Frr updated successfully", "Frr") // "Success!"
            self.setState({ displayEditModel: false, selectedRowIndexes: [] })
        }).catch(function (e) {
            console.warn(e)
            self.setState({ displayEditModel: false, selectedRowIndexes: [] })
            NotificationManager.error("Something went wrong", "Frr") // "error!"
        })
    }



    render() {
        return (
            <div>
                <Media className="tableTitle">
                    <Media body>
                        <div className="padTop5">Frr</div>
                    </Media>
                    <Media right>
                        <div className='marginLeft10'>
                            <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N" outline color="secondary">New</Button>
                            <Button onClick={() => (this.showEditDialogBox())} className="custBtn animated fadeIn">Edit</Button>
                            {this.showDeleteButton()}
                        </div>
                    </Media>
                </Media>
                <div style={{ height: '200px', overflowY: 'scroll', overflowX: 'hidden' }}>
                    <SummaryDataTable key={this.counter++} heading={this.state.frrHead} data={this.state.data} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} />
                </div>
                {this.renderUpgradeModelDialog()}
                {this.renderEditModelDialog()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.frrReducer.get('frr')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getFrr: (url) => dispatch(getFrr(url)),
        addFrr: (url, params) => dispatch(addFrr(url, params)),
        updateFrr: (url, params) => dispatch(updateFrr(url, params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Frr);