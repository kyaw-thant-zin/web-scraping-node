import { defineStore } from 'pinia'
import axios from 'axios'

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
            
            console.log(data.firstName)
            console.log(this.loadingState)
            console.log(this.router)
        }
    }
})