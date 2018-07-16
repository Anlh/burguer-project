import * as actionTypes from './actionTypes';
import {firebaseInstance} from "../../axios-orders";

export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData
    };
};

export const purchaseBurgerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error
    };
};

const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START
    }
};

// Async action
export const purchaseBurger = (orderData) => {
    return dispatch => {
        dispatch(purchaseBurgerStart());
        firebaseInstance.post('/orders.json', orderData)
            .then(response => {
                console.log('success');
                dispatch(purchaseBurgerSuccess(response.data.name, orderData));
            })
            .catch(error => {
                console.log('[purchaseBurger action fail]', error);
                dispatch(purchaseBurgerFail(error));
            });
    };
};

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    };
};

export const fetchOrdersSuccess = (orders) => {
    return {
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders
    };
};

export const fetchOrdersFail = (error) => {
    return {
        type: actionTypes.FETCH_ORDERS_FAIL,
        error
    };
};

const fetchOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START
    };
};

export const fetchOrders = () => {
    return dispatch => {
        dispatch(fetchOrdersStart());
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
                dispatch(fetchOrdersSuccess(fetchedOrders));
            })
            .catch(error => {
                dispatch(fetchOrdersFail(error));
            });
    }
};