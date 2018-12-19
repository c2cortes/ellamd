import React, { Component } from 'react';
import { ListGroupItem, Row, Col } from 'react-bootstrap';

export default class IngredientItemComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            percentage: this.props.item.percentage
        }
    }

    changeValue(e){
        this.setState({ percentage: e.target.value });
    }

    renderRangeInput(){
        return <input onChange={ (e) => this.changeValue(e) } type="number" name="quantity" min={ this.props.item.minimum_percentage } max={ this.props.item.maximum_percentage } value={ this.state.percentage }></input>
    }

    render() {
        return (
            <ListGroupItem>
                <Row className='ingredient-item'>
                    <Col xs={12} sm={4} md={4} lg={4}>{ this.props.item.name }</Col>
                    <Col xs={12} sm={4} md={4} lg={4}>{ this.props.item.name }</Col>
                    <Col xs={12} sm={4} md={4} lg={4}>{ this.renderRangeInput() }</Col>
                </Row>
            </ListGroupItem>
        )
    }   
}