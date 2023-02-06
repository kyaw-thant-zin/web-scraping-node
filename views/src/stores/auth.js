import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', () => {

    const _loading = ref(false)
    const _user = ref(null)
    const _error = ref(false)
    const _uuid = ref(useLocalStorage('_uuid', null))
    const _isLoggedIn = ref(useLocalStorage('_isLoggedIn', false))
    const _rememberMe = ref(useLocalStorage('_rememberMe', false))

    const storeUser = (user) => {
        _user.value = user
    }

    const storeUUID = (uuid) => {
        _uuid.value = uuid
    }
    const storeError = (error) => {
        _error.value = error
    }

    const storeRememberMe = (rememberMe) => {
        _rememberMe.value = rememberMe
    }

    const storeIsLoggedIn = (isLoggedIn) => {
        _isLoggedIn.value = isLoggedIn
    }

    const storeLoading = (loading) => {
        _loading.value = loading
    }

    const handleCheckAuth = async (uuid) => {
        const response = await API.checkAuth(uuid)
        if(response !== false) {
            storeError(false)
            storeUser(response)
            storeUUID(response.uuid)
            storeIsLoggedIn(true)
            return true
        } else {
            storeError(true)
            storeUser(null)
            storeUUID(null)
            storeIsLoggedIn(false)
            return false
        }
    }

    const handleSignUp = async (data) => {
        const response = await API.user.signUp(data)
        return response
    }

    const handleUniqueFields = async (field, val) => {
        const response = await API.user.checkUniqueFields(field, val)
        return response
    }

    const handleSignIn = async (data) => {
        storeRememberMe(data.rememberMe)
        storeLoading(true)
        const response = await API.user.signIn(data)
        if(response === 'USER_NOT_FOUND' || response === 'WRONG_PASSWORD') {
            storeError(true)
            storeUser(null)
            storeUUID(null)
            storeIsLoggedIn(false)
        } else {
            storeError(false)
            storeUser(response)
            storeUUID(response.uuid)
            storeIsLoggedIn(true)
        }
        storeLoading(false)
    }

    const handleSignOut = async () => {
        const response = await API.user.signOut()
        storeIsLoggedIn(false)
        storeUUID(null)
    }

    return {
        _uuid,
        _error,
        _isLoggedIn,
        _rememberMe,
        _loading,
        _user,
        handleCheckAuth,
        handleSignUp,
        handleUniqueFields,
        handleSignIn,
        handleSignOut
    }
})