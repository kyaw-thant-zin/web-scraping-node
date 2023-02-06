import axios from 'axios'
import { apiURL } from '@/api/constants.js';

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:8080/',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
}

const instance = axios.create({
    baseURL: 'http://localhost:8080/',
});

export const API = {
    'checkAuth': async () => {
        const response = await instance.get(apiURL + '/user/check-auth', { 
            headers: headers ,
        })
        return response.data
    },
    'user': {
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
        },
        'signUp': async (signUpData) => {
            const response = await instance.post(apiURL + '/user/sign-up', signUpData, { headers: headers })
            return response.data
        },
        'signIn': async (signInData) => {
            const response = await instance.post(apiURL + '/user/sign-in', signInData, { headers: headers })
            return response.data
        },
        'signOut': async () => {
            const response = await instance.post(apiURL + '/user/sign-out', { headers: headers })
            return response.data
        },
    }
}