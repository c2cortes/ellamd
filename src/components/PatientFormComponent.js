import React, { Component } from 'react';
import { ListGroup, Row, Col, Button, Alert, FormGroup, FormControl, ControlLabel, Modal } from 'react-bootstrap' ;
import axios from 'axios';

import IngredientItemComponent from './IngredientItemComponent';

import { base_url } from './appconfig';

export default class PatientFormController extends Component {

    constructor(){
        super();
        this.state = {
            show: false,
            alertType: 'danger',
            formulations: [],
            validationErrorMessage: '',
            showErrorValidationMessage: false,
            formulationIngredients: []
        }
    }
    
    componentDidMount(){
        this.loadFormulations();
    }

    handleClose(){
        //this.setState({ show: false });
    }
    
    loadFormulations(){
        const url = base_url + 'formulations';
        axios.get(url)
        .then(response => {
          if(response.data.status == 'SUCCESS'){
            this.setState({ formulations: response.data.data }, () => this.loadIngredients() );
          }
        }).catch((error) => {
          this.setState({ showErrorValidationMessage: true, alertType: 'danger', validationErrorMessage: 'An error occurs trying to retreive data' })
        });
    }

    loadIngredients(){
        const url = base_url + 'ingredients';
        axios.get(url)
        .then(response => {
          if(response.data.status == 'SUCCESS'){
            this.setState({ ingredients: response.data.data });
          }
        }).catch((error) => {
          this.setState({ showErrorValidationMessage: true, alertType: 'danger', validationErrorMessage: 'An error occurs trying to retreive data' })
        });
    }
    
    renderFormulationItem(item){  
        return <option label={item.name} value={item.id} key={item.id}></option>
    }

    loadIngredientsByFormulation(e){
        let formulationId = e.target.value;
        const url = base_url + 'formulation_ingredients?id=' + e.target.value;
        axios.get(url)
        .then(response => {
            console.log('response => ', response.data.status);
            if(response.data.status == 'SUCCESS'){
                this.setState({ formulationIngredients: response.data.data, formulationId });
            }
        }).catch((error) => {
          this.setState({ showErrorValidationMessage: true, alertType: 'danger', validationErrorMessage: 'An error occurs trying to retreive formulations ingredients' })
        });
    }

    updateIngredientValue(ingredient_id, val){
        const formulationIngredients = this.state.formulationIngredients;
        let ingredientInfo = formulationIngredients.find(k => k.ingredient_id == ingredient_id);
        ingredientInfo.percentage = val;
        this.setState({ formulationIngredients });
    }

    renderIngredientItem(item, index){
        let ingredientInfo = this.state.ingredients.find(k => k.id == item.ingredient_id);
        item.name = ingredientInfo.name;
        item.description = ingredientInfo.description;
        item.minimum_percentage = ingredientInfo.minimum_percentage;
        item.maximum_percentage = ingredientInfo.maximum_percentage;
        return <IngredientItemComponent key={index} item={item} index={index} updateIngredientValue={ (ingredient_id, val) => this.updateIngredientValue(ingredient_id, val) }/>;
    }
      
    handleSendForm(){
        let _ids = [];
        let _percentages = [];
        this.state.formulationIngredients.forEach(function(item){
            _ids.push(item.ingredient_id);
            _percentages.push(item.percentage);
        });

        let url = base_url + 'reports?name='+this.state.name+'&address='+this.state.address+'&user_date='+this.state.dateOfBirth+'&formulationId='+this.state.formulationId+'&ids[]=' + _ids.join('&ids[]=')+'&percentages[]=' + _percentages.join('&percentages[]=');

        axios.get(url, this.state.formulationIngredients)
        .then(response => {
          if(response.data.status == 'SUCCESS'){
            this.setState({ showErrorValidationMessage: true, alertType: 'success', validationErrorMessage: 'The data has been saved, look at the report: http://localhost:3000/api/v1reports?' + response.data.data })
          }
        }).catch((error) => {
          this.setState({ showErrorValidationMessage: true, alertType: 'danger', validationErrorMessage: 'An error occurs trying to retreive data' })
        });
    }

    render(){
        return (
            <div>
                <form>
                    <div><h4>Patient Information</h4><hr/></div>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12}>
                        { this.state.showErrorValidationMessage ? <Alert bsStyle={ this.state.alertType }>{ this.state.validationErrorMessage }</Alert> : null }
                        </Col>
                        <Col xs={12} sm={4} md={4} lg={4}>
                            <FormGroup
                            controlId="formName"
                            >
                                <ControlLabel>Name:</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.name}
                                    placeholder="Name"
                                    onChange={(e) => this.setState({name:e.target.value})}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={12} sm={4} md={4} lg={4}>
                            <FormGroup
                            controlId="formLastname"
                            >
                                <ControlLabel>Address:</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.address}
                                    placeholder="Address"
                                    onChange={(e) => this.setState({address:e.target.value})}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={12} sm={4} md={4} lg={4}>
                            <FormGroup
                            controlId="formBirthDay"
                            >
                                <ControlLabel>Date of birth:</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.dateOfBirth}
                                    placeholder="Date of birth"
                                    onChange={(e) => this.setState({dateOfBirth:e.target.value})}
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} sm={4} md={4} lg={4}>
                        </Col>
                        <Col xs={12} sm={4} md={4} lg={4}>
                            <FormGroup controlId="formFormulations">
                                <ControlLabel>Formulations</ControlLabel>
                                <FormControl componentClass="select" placeholder="select" onChange={ (e) => this.loadIngredientsByFormulation(e) }>
                                    <option value="0" label="Select an option"></option>
                                    { this.state.formulations.map((item) => { return this.renderFormulationItem(item) }) }
                                </FormControl>
                            </FormGroup>
                        </Col>
                        <Col xs={12} sm={4} md={4} lg={4}>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12}>
                            <ListGroup>
                                { this.state.formulationIngredients.map((item, index) => { return this.renderIngredientItem(item, index) }) }   
                            </ListGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12}>
                            <hr/>
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col xs={12} sm={4} md={4} lg={4}>    
                            
                        </Col>
                        <Col xs={12} sm={4} md={4} lg={4}>
                            <FormGroup
                            controlId="formSend"
                            >
                                <Button bsStyle="primary" onClick={ () => this.handleSendForm() }>Send</Button>
                            </FormGroup>
                        </Col>

                        <Col xs={12} sm={4} md={4} lg={4}>    
                            
                        </Col>
                    </Row>
                </form>
            </div>
        )
    }
}