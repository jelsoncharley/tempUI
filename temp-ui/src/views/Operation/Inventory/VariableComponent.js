import React, {Component} from 'react';
import {
    Row,
    Col,
    Badge,
    Button,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Card,
    CardHeader,
    CardFooter,
    CardBody,
    Collapse,
    Form,
    FormGroup,
    FormText,
    Label,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Table
} from 'reactstrap';
import Styles from './VariableComponent.css';
import {AnsibleVariable} from '../../../ServerAPI';

var total = 1;

class VariableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 1,
            name: '',
            pairs: [{name: ''}],
            ansibleVariables: [],
            ansibleVariableHeader: "",
            componentHeader: "Variables",
            varGrpStateChanged: false,
        };
        this.onKeyChanged = this.onKeyChanged.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
    }
    
    componentWillReceiveProps(nextProps) {
        let ansiVarArr = [];
        let header = "";
        let compHeader = "Variables"
        if (nextProps.playbookVariables !== undefined) {
            ansiVarArr = nextProps.playbookVariables;
            header = "Playbook";
            compHeader = "Run Arguments"
        } else if (nextProps.hostVariables !== undefined) {
            header = "Host"
            ansiVarArr = nextProps.hostVariables;
        }
        this.setState({
            ansibleVariables: ansiVarArr,
            ansibleVariableHeader: header,
            componentHeader: compHeader,
            varGrpStateChanged: false,
        });
    }

    componentDidMount() {
    }
    
    componentWillUnmount() {
        // Save here..
        if (this.state.varGrpStateChanged) {
            this.props.setVariables(this.state.ansibleVariables);
        }
    }
    
    addVariable() {
        let varArr = this.state.ansibleVariables;
        let aVar = new AnsibleVariable("", "");
        varArr.push(aVar);
        this.setState({
            ansibleVariables: varArr,
        });
    }

    removeVariable(event, index) {
        console.log("Remove Varaible at index :: " + index)
    }
    
    onKeyChanged(event, index, origKey) {
        this.state.varGrpStateChanged = true;
        let newKey = event.target.value;
        this.state.ansibleVariables[index].key = newKey;
        let bVar = this.state.ansibleVariables[index];
        if (this.state.ansibleVariables[index].value.length > 0) {
            // make sure Value for same variable is already set before updating the server.
            this.props.setVariables(this.state.ansibleVariables);
        }
    }
    
    onValueChanged(event, index, origValue) {
        this.state.varGrpStateChanged = true;
        let newValue = event.target.value;
        this.state.ansibleVariables[index].value = newValue;
        let bVar = this.state.ansibleVariables[index];
        if (this.state.ansibleVariables[index].key.length > 0) {
            this.props.setVariables(this.state.ansibleVariables);
        }
    }
    
    onKeyFocused(event, keyId) {
        console.log("Key Focused :: Event :: " + event);
    }
    
    renderVariables() {
        //onFocus={(e) => this.onKeyFocused(e, key)
        let retHTML = [];
        //                <div className="floatRight" onClick={() => this.addVariable()} ><strong>+</strong></div>

        retHTML.push(
            <CardHeader id="variables_host" key="variables_host">
                <Row>
                    <Col>
                        <h5>{this.state.ansibleVariableHeader}</h5>
                    </Col>
                    <Col>
                        <Button className="floatRight" color="link" size="lg" onClick={() => this.addVariable()}> + </Button>
                    </Col>
                </Row>
            </CardHeader>);
        for (let index in this.state.ansibleVariables) {
            let key = this.state.ansibleVariables[index].key
            let parentId = this.props.parentId !== undefined? this.props.parentId: 0;
            let varId = "host_var_" + parentId + "_" + index;
            let styleHeight = "50px";
            retHTML.push(
                <CardBody id={varId} key={varId} className="card-body-var">
                    <Row>
                        <Col md="5"><Input type="text" placeholder="Key" required defaultValue={this.state.ansibleVariables[index].key} onChange={(event) => this.onKeyChanged(event, index, this.state.ansibleVariables[index].key)} /></Col>
                        <Col md="1"><strong style={{textAlign:"center"}}>:</strong></Col>
                        <Col md="5"><Input type="text" placeholder="Value" required defaultValue={this.state.ansibleVariables[index].value} onChange={(event) => this.onValueChanged(event, index, this.state.ansibleVariables[index].value)}/></Col>
                    </Row>
                </CardBody>
            );
        }
        return retHTML;
    }
    
    renderSystemVariables() {
        let retHTML = [];
        retHTML.push(<div style={{height:'20px'}}> </div>);
        retHTML.push(
            <CardHeader id="variables_system" key="variables_system">
                <h5>System</h5>
            </CardHeader>);
        for (let index in this.props.systemVariables) {
            let varId = "system_all_"+index;
            retHTML.push(
                <CardBody id={varId} key={varId} className="card-body-var-sys">
                    <Row>
                        <Col md="5">{this.props.systemVariables[index].key}</Col>
                        <Col md="1"><strong style={{textAlign:"center"}}>:</strong></Col>
                        <Col md="5">{this.props.systemVariables[index].value}</Col>
                    </Row>
              </CardBody>
            );
        }
        return retHTML;
    }

    renderGroupVariables() {
        let retHTML = [];
        retHTML.push(
            <CardHeader id="variables_groups" key="variables_groups">
                <h5>Groups</h5>
            </CardHeader>);
        for (let index in this.props.groupVariables) {
            let varId = "group_"+index;
            retHTML.push(
                <CardBody id={varId} key={varId} style={{height:'40px'}}>
                    <Row>
                        <Col md="5">{this.props.groupVariables[index].key}</Col>
                        <Col md="1"><strong style={{textAlign:"center"}}>:</strong></Col>
                        <Col md="5">{this.props.groupVariables[index].value}</Col>
                    </Row>
              </CardBody>
            );
        }
        return retHTML;
    }

    render() {
        if(this.props.active) {
            return (
                <div className="animated fadeIn">
                    <Card>
                        <CardHeader id="    ">
                            <h2>{this.state.componentHeader}</h2>
                        </CardHeader>
                        <div style={{height:"350px",marginBottom:"20px", overflowY:'scroll'}}>
                            {this.renderVariables()}
                            {
                                (this.props.systemVariables !== undefined)?
                                this.renderSystemVariables() :
                                null
                            }
                        </div>
                    </Card>
                </div>
            )
        }else{
            return (<div></div>)
        }
    }
}
export default VariableComponent;
