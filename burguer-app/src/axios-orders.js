import axios from 'axios';

export const firebaseInstance = axios.create({
    baseURL: 'https://react-burger-project-1c588.firebaseio.com/'
});