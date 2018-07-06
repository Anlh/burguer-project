import React from 'react';

import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    // It transform the received object ingredients keys into an array of strings
    // It only use the keys of the objects, the values aren't passed
    let transformedIngredients = Object.keys(props.ingredients) // ex: ['salad', 'bacon', 'cheese', 'meat']
        .map(igKey => {
            // example: structure output:
            // 1st: [undefined]
            // 2nd: [undefined]
            // 3rd: [undefined, undefined]
            return [...Array(props.ingredients[igKey])].map((_, i) => {
                // Will fill the structure above with JSX BurgerIngredient components for each position
                return <BurgerIngredient key={igKey + i} type={igKey}/>
            });
        })
        // This will ensure that our arr will be flatten, will be reduced into a single array and not a matrix of arrays
        // in other words will concat the next array into the previous array
        .reduce((prevArr, nextArr) => {
            return prevArr.concat(nextArr);
        }, []);

    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients</p>;
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

export default burger;