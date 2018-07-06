import React, {Component} from 'react';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import {firebaseInstance} from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    };

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.totalPrice,
            customer: {
                name: 'Tiago Ferreira',
                address: {
                    street: 'Test street 1',
                    zipCode: '123123',
                    country: 'Portugal'
                },
                email: 'asdad@asd.com',
            },
            deliveryMethod: 'fastest'
        };


        firebaseInstance.post('/orders.json', order)
            .then(response => {
                this.setState({loading: false});
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({loading: false});
            });

    };

    render() {
        let form = (
            <div className={classes.ContactData}>
                <h4>Enter your contact Data</h4>
                <form>
                    <Input inputtype="input" type="text" name="name" placeholder="Your name"/>
                    <Input inputtype="input" type="email" name="email" placeholder="Your email"/>
                    <Input inputtype="input" type="text" name="street" placeholder="Your street"/>
                    <Input inputtype="input" type="text" name="postalCode" placeholder="Your postal code"/>
                    <Button btnType="Success" clicked={this.orderHandler}>Order</Button>
                </form>
            </div>
        );

        if (this.state.loading) {
            form = <Spinner/>;
        }
        return form;
    }
}

export default ContactData;