import React, { Component } from 'react';
import { Col, Row, Input, Card ,CardHeader,CardBody ,InputGroup, InputGroupAddon, Modal, ModalHeader, ModalBody, ModalFooter, } from 'reactstrap';
import { ServerAPI } from '../../../ServerAPI';
import { Redirect } from 'react-router-dom'
import { Button } from 'reactstrap';
import SummaryDataTable from './SummaryDataTable';
import {nodeHead} from '../../../consts'
import '../../views.css';

class NodeSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            roleData: [],
            isoData: [],
            kernelData: [],
            typedata: [],
            nodeHead: nodeHead,
            selectedRowIndex: [],
            selectedRows: [],
            displayModel: false,
            redirect: false
        }
    }

    componentDidMount() {
        ServerAPI.DefaultServer().fetchAllServerNodes(this.updateNodeSummary, this);
        ServerAPI.DefaultServer().fetchAllRoles(this.retrieveRoleData, this);
        ServerAPI.DefaultServer().fetchAllIso(this.retrieveIsoData, this);
        ServerAPI.DefaultServer().fetchAllKernels(this.retrieveKernelsData, this);
        ServerAPI.DefaultServer().fetchAllSystemTypes(this.retrieveTypesData, this);
    }

    
  retrieveRoleData(instance, data) {
    if (!data) {
      alert("No data received");
    }
    else {
      if (Object.keys(data).length) {
        instance.setState({ roleData: data });
      }
    }
  }

  retrieveIsoData(instance, data) {
    if (!data) {
      alert("No data received");
    }
    else {
      if (Object.keys(data).length) {
        instance.setState({ isoData: data });
      }
    }
  }

  retrieveKernelsData(instance, data) {
    if (!data) {
      alert("No data received");
    }
    else {
      if (Object.keys(data).length) {
        instance.setState({ kernelData: data });
      }
    }
  }

  retrieveTypesData(instance, data) {
    if (!data) {
      alert("No data received");
    }
    else {
      if (Object.keys(data).length) {
        instance.setState({ typedata: data });
      }
    }
  }

  getRoles() {
    let rolesHtml = [];
    this.state.roleData.map((item) => (rolesHtml.push(<option>{item.label}</option>)));
    return rolesHtml;
  }

  getTypes() {
    let typesHtml = [];
    this.state.typedata.map((item) => (typesHtml.push(<option>{item.label}</option>)));
    return typesHtml;
  }

  getKernel() {
    let kernelHtml = [];
    this.state.kernelData.map((item) => (kernelHtml.push(<option>{item.label}</option>)));
    return kernelHtml;
  }

  getIso() {
    let isoHtml = [];
    this.state.isoData.map((item) => (isoHtml.push(<option>{item.label}</option>)));
    return isoHtml;
  }

    updateNodeSummary = (instance, nodes) => {
        instance.setState({
            nodes: nodes,
        });
    }

    checkBoxClick = (rowIndex, singleRowClick) => {
        if (singleRowClick) {
            let { nodes } = this.state
            let selectedRows = [nodes[rowIndex]]
            this.setState({
                selectedRows, redirect: true
            })
            return
        }
        let { selectedRowIndex } = this.state
        let arrayIndex = selectedRowIndex.indexOf(rowIndex)
        if (arrayIndex > -1) {
            selectedRowIndex.splice(arrayIndex, 1)
        } else {
            selectedRowIndex.push(rowIndex)
        }

    }

    onConfigureClick = () => {
        let { nodes, selectedRowIndex } = this.state
        let selectedRows = []
        if (selectedRowIndex.length) {
            selectedRowIndex.map(function (rowIndex) {
                selectedRows.push(nodes[rowIndex])
            })
            this.setState({
                selectedRows, redirect: true
            })
        }
    }

    renderFilterComponent = () => {
        let filters = []
        let filterOptions = [
            {
                'id': 'status',
                'displayName': 'Status',
                'options': [
                    {
                        'id': 'active',
                        'displayName': 'Active',
                    },
                    {
                        'id': 'unprovisioned',
                        'displayName': 'Unprovisioned',
                    }
                ]
            }, {
                'id': 'role',
                'displayName': 'Role',
                'options': [
                    {
                        'id': 'Leaf',
                        'displayName': 'Leaf',
                    },
                    {
                        'id': 'Spine',
                        'displayName': 'Spine',
                    },
                    {
                        'id': 'K8Worker',
                        'displayName': 'K8Worker',
                    },
                    {
                        'id': 'etcD',
                        'displayName': 'etcD',
                    },
                    {
                        'id': 'Cache',
                        'displayName': 'Cache',
                    }
                ]
            },
            {
                'id': 'type',
                'displayName': 'Type',
                'options': [
                    {
                        'id': 'PS-3001',
                        'displayName': 'PS-3001',
                    },
                    {
                        'id': 'SuperMicro-x',
                        'displayName': 'SuperMicro-x',
                    }
                ]
            },
            {
                'id': 'site',
                'displayName': 'Site',
                'options': [
                    {
                        'id': 'SJC0',
                        'displayName': 'SJC0',
                    }
                ]
            }
        ]

        filterOptions.map(function (filterOption) {
            let options = filterOption.options
            if (!options || !options.length)
                return null
            filters.push(<div>
                <div className="head-name">{filterOption.displayName}</div>
                <select multiple className="form-control">{options.map(function (option) {
                    return <option value={option.id}>{option.displayName}</option>
                })}</select>
            </div>)
        })

        return (
            <Card className="borRad">
                <CardHeader>Filter</CardHeader>
                <CardBody>
                    {filters}
                    <div style={{paddingTop:'10px'}}>
                    <Button className="custBtn" outline color="secondary">Apply</Button>
                    <Button className="custBtn" outline color="secondary">Reset</Button>
                    </div>
                </CardBody>
            </Card>
        )
    }

    renderSearchComponent = () => {
        return (
            <Card className="borRad">
                <CardHeader>Search</CardHeader>
                <CardBody>
                    <InputGroup >
                        <Input placeholder="search" className="borRadLeft" />
                        <InputGroupAddon addonType="append" className="borRadRight"></InputGroupAddon>
                    </InputGroup>
                </CardBody>
            </Card>
        )
    }

    renderUpgradeModelDialog() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} size="lg" centered="true" >
                    <ModalHeader>Add Node</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col sm="6">Name: <Input id='name'/></Col>
                            <Col sm="6">Site: <Input id='site' /></Col>
                        </Row>
                        <Row>    
                            <Col sm="6">Status: <Input id='status'/></Col>
                            <Col sm="6">Roles: <select multiple className="form-control" id="roles">{this.getRoles()}</select></Col>
                        </Row>
                        <Row>
                            <Col sm="6">Type: <select className="form-control" id="types">{this.getTypes()}</select></Col>
                            <Col sm="6">Serial Number: <Input id='serialNumber' /></Col>
                        </Row>
                        <Row> 
                            <Col sm="6">Linux Kernel: <select className="form-control" id="linuxkernel">{this.getKernel()}</select></Col>
                            <Col sm="6">Base Linux ISO: <select className="form-control" id="linuxIso">{this.getIso()}</select></Col>
                        </Row>    
                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="primary" onClick={()=>(this.addNode())}>Add</Button>{'  '}
                        <Button outline color="secondary" onClick={()=>(this.click())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    addNode() {
        let roles = this.getSelectRoleValues(document.getElementById('roles'))
        let a = {
            'Name' : document.getElementById('name').value,
            'site': document.getElementById('site').value,
            'status': document.getElementById('status').value,
            'roles': roles,
            'type': document.getElementById('types').value,
            'serialNumber': document.getElementById('serialNumber').value,
            'kernel': document.getElementById('linuxkernel').value,
            'linuxISO': document.getElementById('linuxIso').value
        }
        ServerAPI.DefaultServer().addNode(this.callback,this,a);
    }

    getSelectRoleValues(select) {
        var result = [];
        var options = select && select.options;
        var opt;
      
        for (var i=0, iLen=options.length; i<iLen; i++) {
          opt = options[i];
      
          if (opt.selected) {
            result.push(opt.value || opt.text);
          }
        }
        return result;
    }

    callback(instance, data) {
        let a = instance.state.nodes
        if(!a) {
           a = []
        }
        a.push(data)
        instance.setState({data: a,displayModel : !instance.state.displayModel})
    }

    click() {
        this.setState({displayModel : !this.state.displayModel})
    }


    render() {
        if (this.state.redirect) {
            return <Redirect push to={{ pathname: '/node/config', state: this.state.selectedRows }} />
        }
        return (
            <Container-fluid >
                <Row>
                    <Col sm="9">
                        <div className='marginLeft10 '>
                            <Button onClick={() => (this.onConfigureClick())} className="custBtn marginLeft13N" outline color="secondary">Configure</Button>
                            <Button className="custBtn" outline color="secondary" onClick={() => (this.click())}>New</Button>
                            <SummaryDataTable heading={this.state.nodeHead} data={this.state.nodes} checkBoxClick={this.checkBoxClick} selectEntireRow={true}/>
                        </div>
                    </Col>
                    <Col sm="3">                        
                        {this.renderSearchComponent()}
                        {this.renderFilterComponent()}                        
                    </Col>
                </Row>
                {this.renderUpgradeModelDialog()}
            </Container-fluid>
        );
    }
}
export default NodeSummary;