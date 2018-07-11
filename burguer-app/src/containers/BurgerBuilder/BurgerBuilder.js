import React, {Component} from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {firebaseInstance} from '../../axios-orders';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {
    state = {
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    };

    componentDidMount() {
        firebaseInstance.get('https://react-burger-project-1c588.firebaseio.com/ingredients.json')
            .then(response => {
                const ingredients = Object.keys(response.data).map(igKey => {
                    return igKey;
                });
                console.log(ingredients);
                this.setState({ingredients: response.data, purchasable: true});
            })
            .catch(error => {
                this.setState({error: true});
            });
    }


    updatePurchaseState(ingredients) {
        // Create an array of strings
        const sum = Object.keys(ingredients)
            .map(igKey => { // [values, values, values]
                return ingredients[igKey];
            })
            .reduce((sum, currentIngredientValue) => { // Convert into a number, sum is the accumulator, currentIngredientValue is the current value of the ingredient
                return sum + currentIngredientValue
            }, 0); // The second argument is used as the first value for the first callback iteration sum = 0 on the first call

        return sum > 0;
    }


    purchaseHandler = () => {
        this.setState({purchasing: true});
    };

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    };

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
    };


    render() {
        const disabledInfo = {
            ...this.props.ings
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner/>;

        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls
                        ordered={this.purchaseHandler}
                        burguerPrice={this.props.totalPrice}
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchasable={this.updatePurchaseState(this.props.ings)}/>
                </Aux>
            );

            orderSummary = <OrderSummary
                totalPrice={this.props.totalPrice}
                ingredients={this.props.ings}
                purchaseCanceled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}/>;
        }

        if (this.state.loading) {
            orderSummary = <Spinner/>;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        totalPrice: state.totalPrice
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName}),
    }
};



export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, firebaseInstance));