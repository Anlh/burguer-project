import React, {Component} from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {firebaseInstance} from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
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

        this.setState({purchasable: sum > 0});
    }


    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCounted = oldCount + 1;
        const updatedIngredients = { // Create a new copy of the ingredients object
            ...this.state.ingredients
        };
        const priceAddition = INGREDIENT_PRICES[type];

        updatedIngredients[type] = updatedCounted;

        this.setState({
            ingredients: updatedIngredients,
            totalPrice: this.state.totalPrice + priceAddition
        });

        this.updatePurchaseState(updatedIngredients);
    };

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];

        if (oldCount <= 0) {
            return;
        }

        const updatedCounted = oldCount - 1;
        const updatedIngredients = { // Create a new copy of the ingredients object
            ...this.state.ingredients
        };
        const priceDeduction = INGREDIENT_PRICES[type];

        updatedIngredients[type] = updatedCounted;

        this.setState({
            ingredients: updatedIngredients,
            totalPrice: this.state.totalPrice - priceDeduction
        });
        this.updatePurchaseState(updatedIngredients);
    };

    purchaseHandler = () => {
        this.setState({purchasing: true});
    };

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    };

    purchaseContinueHandler = () => {
        // alert('you continue!');
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Tiago Ferreira',
                address: {
                    street: 'Test street 1',
                    zipCode: '123123',
                    country: 'Portugal'
                },
                email: 'asdad@asd.com',
                deliveryMethod: 'fastest'
            }
        };

        firebaseInstance.post('/orders', order)
            .then(response => {
                this.setState({loading: false, purchasing: false});
            })
            .catch(error => {
                this.setState({loading: false, purchasing: false});
            });
    };


    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner/>;

        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls
                        ordered={this.purchaseHandler}
                        burguerPrice={this.state.totalPrice}
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}/>
                </Aux>
            );

            orderSummary = <OrderSummary
                totalPrice={this.state.totalPrice}
                ingredients={this.state.ingredients}
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

export default withErrorHandler(BurgerBuilder, firebaseInstance);