import React, { Component } from 'react';
import { ListGroup, Row, Col, Button, Alert, FormGroup, FormControl, ControlLabel, PanelGroup } from 'react-bootstrap' ;
import axios from 'axios';

import IngredientItemComponent from './IngredientItemComponent';

import { base_url } from './appconfig';

export default class PatientFormController extends Component {

    constructor(){
        super();
        
        this.state = {
          formulations: [],
          validationErrorMessage: '',
          showErrorValidationMessage: false,
          formulationIngredients: []
        }
    }
    
    componentDidMount(){
        this.loadFormulations();
    }
    
    loadFormulations(){
        const url = base_url + 'formulations';
        axios.get(url)
        .then(response => {
          if(response.data.status == 'SUCCESS'){
            this.setState({ formulations: response.data.data }, () => this.loadIngredients() );
          }
        }).catch((error) => {
          this.setState({ showErrorValidationMessage: true, validationErrorMessage: 'An error occurs trying to retreive data' })
        });
    }

    loadIngredients(){
        const url = base_url + 'ingredients';
        axios.get(url)
        .then(response => {
          if(response.data.status == 'SUCCESS'){
              console.log('INGREDIENTS => ', response.data.data)
            this.setState({ ingredients: response.data.data });
          }
        }).catch((error) => {
          this.setState({ showErrorValidationMessage: true, validationErrorMessage: 'An error occurs trying to retreive data' })
        });
    }
    
    renderFormulationItem(item){  
        return <option label={item.name} value={item.id} key={item.id}></option>
    }

    loadIngredientsByFormulation(e){
        const url = base_url + 'formulation_ingredients?id=' + e.target.value;
        axios.get(url)
        .then(response => {
          if(response.data.status == 'SUCCESS'){
                console.log('formulation_ingredients', response.data.data);
                this.setState({ formulationIngredients: response.data.data });
          }
        }).catch((error) => {
          this.setState({ showErrorValidationMessage: true, validationErrorMessage: 'An error occurs trying to retreive data' })
        });
    }

    renderIngredientItem(item, index){
        let ingredientInfo = this.state.ingredients.find(k => k.id == item.ingredient_id);
        item.name = ingredientInfo.name;
        item.minimum_percentage = ingredientInfo.minimum_percentage;
        item.maximum_percentage = ingredientInfo.maximum_percentage;
        return <IngredientItemComponent key={index} item={item} index={index} />;
    }
      
    render(){
        return (
            <div>
            <form>
                <div><h4>Patient Information</h4><hr/></div>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                    { this.state.showErrorValidationMessage ? <Alert bsStyle="danger">{ this.state.validationErrorMessage }</Alert> : null }
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
                    <Col xs={12} sm={6} md={6} lg={6}>
                    
                        
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={6}>
                        <FormGroup
                        controlId="formSend"
                        >
                            <Button bsStyle="primary" onClick={ () => this.handleSend() }>Enviar</Button>
                        </FormGroup>
                    </Col>
                </Row>
            </form>
                
                <ListGroup>
                    { this.state.formulationIngredients.map((item, index) => { return this.renderIngredientItem(item, index) }) }   
                </ListGroup>
            </div>
        )
    }
}