import axios from 'axios'
import { apiURL } from '@/api/constants.js';

const headers = {
    'Content-Type': 'application/json',
}

const instance = axios.create({
    baseURL: 'http://localhost:8080/',
});

export const API = {
    'user': {
        'signUp': async (signUpData) => {
            const response = await instance.post(apiURL + '/user/sign-up', signUpData, { headers: headers })
            return response.data
        },
        'checkUniqueFields': async (field, val) => {
            const fieldData = {
                field: field,
                val: val
            }
            const response = await instance.get(apiURL + '/user/sign-up/validate-unique', { 
                headers: headers ,
                params: fieldData
            })
            return response.data
        }
    }
}