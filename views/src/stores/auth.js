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
        async handleCheckAuth() {
            const response = await API.checkAuth()
            return response
        },
        async handleSignUp(data) {
            const response = await API.user.signUp(data)
            return response
        },
        async handleUniqueFields(field, val) {
            const response = await API.user.checkUniqueFields(field, val)
            return response
        },
        async handleSignIn(data) {
            const response = await API.user.signIn(data)
            return response
        },
        setAuthUser (state, user) {
            state.authUser = user
        }
    }
})