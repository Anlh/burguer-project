import React from 'react';

import classes from './Order.css';

const order = (props) => {
    // const ingredientsToJsxArr = Object.keys(props.ingredients).map((keyIng) => {
    //     return <p key={keyIng}>Ingredient: {keyIng} {props.ingredients[keyIng]}</p>;
    // });

    // Or
    const ingredients = [];
    for (let ingredientName in props.ingredients) {
        if (props.ingredients.hasOwnProperty(ingredientName) && props.ingredients[ingredientName] > 0) {
            ingredients.push(
                <span
                    style={{
                        textTransform: 'capitalize',
                        display: 'inline-block',
                        margin: '0 8px',
                        border: '1px solid gray',
                        padding: '5px'
                    }}
                    key={ingredientName}>
                    {ingredientName}
                    ({props.ingredients[ingredientName]})
                </span>
            );
        }
    }

    return (
        <div className={classes.Order}>
            <p>Ingredients: {ingredients}</p>
            <p>Price: <strong>{(+props.price).toFixed(2)} €</strong></p>
        </div>
    );
};

export default order;