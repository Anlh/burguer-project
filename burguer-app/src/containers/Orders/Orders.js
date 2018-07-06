import React, {Component} from 'react';

import Order from '../../components/Order/Order';
import {firebaseInstance} from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class Orders extends Component {
    state = {
        orders: [],
        loading: true
    };

    componentDidMount() {
        firebaseInstance.get('/orders.json')
            .then(response => {
                const fetchedOrders = [];
                // Convert the object collection returned from the server and convert it to an array
                for (let key in response.data) {
                    fetchedOrders.push({
                        id: key,
                        ...response.data[key]
                    });
                }

                this.setState({loading: false, orders: fetchedOrders});
            })
            .catch(error => {
                this.setState({loading: false});
            });
    }

    render() {
        console.log(this.state.orders);
        return (
            <div>
                {this.state.orders.map(order => (
                    <Order
                        key={order.id}
                        ingredients={order.ingredients}
                        price={order.price}/>
                ))}
            </div>
        );
    }
}

export default withErrorHandler(Orders, firebaseInstance);