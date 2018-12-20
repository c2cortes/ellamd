import React, { Component } from 'react';
import { ListGroupItem, Row, Col, Button, Alert } from 'react-bootstrap';

export default class IngredientItemComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            percentage: this.props.item.percentage,
            showDescription: false,
            descriptionButtonLabel: 'Show'
        }
    }

    componentDidMount(){
        console.log(this.props.item.minimum_percentage, this.props.item.maximum_percentage);
    }

    changeValue(e){
        this.setState({ percentage: e.target.value });
        this.props.updateIngredientValue(this.props.item.ingredient_id, e.target.value);
    }

    renderRangeInput(){
        return <input onChange={ (e) => this.changeValue(e) } type="number" name="quantity" min={ this.props.item.minimum_percentage } max={ this.props.item.maximum_percentage } value={ this.state.percentage }></input>
    }

    render() {
        return (
            <ListGroupItem>
                <Row className='ingredient-item'>
                    <Col xs={12} sm={4} md={4} lg={4}>{ this.props.item.name }</Col>
                    <Col xs={12} sm={4} md={4} lg={4}>{ this.renderRangeInput() }</Col>
                    <Col xs={12} sm={4} md={4} lg={4}><Button bsStyle='primary' onClick={ () =>  this.setState({ showDescription: this.state.showDescription ? false : true, descriptionButtonLabel: this.state.showDescription ? 'Show' : 'Hide' }) }>{ this.state.descriptionButtonLabel } ingredient description</Button></Col>
                </Row>
                <Row className='ingredient-item'>                    
                    <Col xs={12} sm={12} md={12} lg={12}><hr/></Col>
                </Row>
                <Row className='ingredient-item'>                    
                    <Col xs={12} sm={12} md={12} lg={12}>{ this.state.showDescription ? <Alert bsStyle='warning'>{ this.props.item.description }</Alert> : null }</Col>
                </Row>
            </ListGroupItem>
        )
    }   
}