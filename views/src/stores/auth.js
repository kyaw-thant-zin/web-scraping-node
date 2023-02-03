import { defineStore } from 'pinia'
import { API } from '@/api/index.js'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        authUser: null,
        loadingState: false
    }),
    getters: {
        user: (state) => state.authUser, 
        loading: (state) => state.loadingState
    },
    actions: {
        async handleRegister(data) {
            // make a request to server
            const response = await API.user.signUp(data)
            return response
        },
        async handleUniqueFields(field, val) {
            const response = await API.user.checkUniqueFields(field, val)
            return response
        }
    }
})