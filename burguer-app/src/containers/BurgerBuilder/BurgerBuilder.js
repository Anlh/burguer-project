import React, {Component} from 'react';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...};
    // }
    // Modern syntax replace the constructor syntax above
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4
    };

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
    };


    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        return (
            <Aux>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls
                    burguerPrice={this.state.totalPrice}
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}/>
            </Aux>
        );
    }
}

export default BurgerBuilder;