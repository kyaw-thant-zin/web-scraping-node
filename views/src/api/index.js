import axios from 'axios'
import { apiURL } from '@/api/constants.js';

const headers = {
    'Content-Type': 'application/json',
}

export const API = {
    'user': {
        'signUp': async (signUpData) => {
            const response = await axios.post(apiURL + '/user/sign-up', signUpData, { headers: headers })
            return response
        }
    }
}