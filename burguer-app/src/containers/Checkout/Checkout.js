import React, {Component} from 'react';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';

class Checkout extends Component {
    state = {
        ingredients: {
            salad: 1,
            meat: 1,
            cheese: 1,
            bacon: 1
        }
    };

    componentDidMount() {
        console.log(this.props);
        const {params: ingredients} = this.props.match.params;
        this.setState({ingredients: JSON.parse(ingredients)})
    }


    render() {
        return (
            <div>
                <CheckoutSummary
                    cancel={() => this.props.history.replace('/')}
                    continue={function(){}}
                    ingredients={this.state.ingredients}/>
            </div>
        );
    }
}

export default Checkout;