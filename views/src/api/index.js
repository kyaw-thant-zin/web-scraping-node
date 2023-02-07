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
    'checkAuth': async (uuid) => {
        const response = await instance.get(apiURL + '/user/check-auth', { 
            headers: headers ,
            params: {
                'uuid': uuid
            }
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
    },
    'campaign': {
        'index': async () => {
            const response = await instance.get(apiURL+ '/campaign', {
                headers: headers
            })
            return response.data
        },
        'checkUniqueField': async (campaignName) => {
            const response = await instance.get(apiURL + '/campaign/validate-unique', { 
                headers: headers ,
                params: {
                    'campaignName': campaignName
                }
            })
            return response.data
        },
        'getCollectionTypes': async () => {
            const response = await instance.get(apiURL + '/collection-types', { 
                headers: headers ,
            })
            return response.data
        },
        'getLinkTypes': async () => {
            const response = await instance.get(apiURL + '/link-types', { 
                headers: headers ,
            })
            return response.data
        },
        'store': async (formData) => {
            const response = await instance.post(apiURL + '/campaign/store', formData, { headers: headers })
            return response.data
        },
        'show': async (id) => {

        },
        'update': async (id, formData) => {

        },
        'updateVisibility': async (id, visibility) => {
            const formData = {
                id: id,
                visibility: visibility === true ? 1:0
            }
            const response = await instance.post(apiURL + '/campaign/visibility/update/', formData, { headers: headers })
            return response.data
        }
    }
}