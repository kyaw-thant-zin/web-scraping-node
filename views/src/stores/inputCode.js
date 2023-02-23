import { ref } from 'vue'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'
import { useLocalStorage } from '@vueuse/core'

export const useInputCodeStore = defineStore('inputCode', () => {

    const _loading = ref(false)
    const _error = ref(false)
    const _inputCodes = ref(null)
    const _updatedLayoutType = ref(false)
    const _updatedShowAccount = ref(false)
    const _updatedShowTitle = ref(false)
    const _updatedShowHashtag = ref(false)
    const _inputCodeTablePage = ref(useLocalStorage('_inputCodeTablePage', 1))

    const storeLoading = (loading) => {
        _loading.value = loading
    }

    const storeError = (error) => {
        _error.value = error()
    }

    const storeInputCodes = (inputCodes) => {

        const filteredInputCodes = []
        inputCodes.forEach((ic) => {
            const dumpIC = {}
            dumpIC.id = ic.id
            dumpIC.campaignName = ic.campaign.campaignName
            dumpIC.layoutType = ic.layoutType
            dumpIC.layoutContent = `${ic.showAccount}, ${ic.showTitle}, ${ic.showHashtag}`
            dumpIC.showAccount = ic.showAccount
            dumpIC.showTitle = ic.showTitle
            dumpIC.showHashtag = ic.showHashtag
            dumpIC.apiCode = ic.apiToken
            dumpIC.showText = true
            filteredInputCodes.push(dumpIC)
        })

        _inputCodes.value = filteredInputCodes
    }

    const storeInputCodeTablePage = (page) => {
        _inputCodeTablePage.value = page
    }

    const storeUpdatedLayoutType = (updatedLayoutType) => {
        _updatedLayoutType.value = updatedLayoutType
    }

    const storeUpdatedShowAccount = (updatedShowAccount) => {
        _updatedShowAccount.value = updatedShowAccount
    }

    const storeUpdatedShowTitle = (updatedShowTitle) => {
        _updatedShowTitle.value = updatedShowTitle
    }

    const storeUpdatedShowHashtag = (updatedShowHashtag) => {
        _updatedShowHashtag.value = updatedShowHashtag
    }

    const handleInputCodes = async () => {

        storeLoading(true)
        const inputCodes = await API.inputCode.index()
        storeInputCodes(inputCodes)
        storeLoading(false)
    }

    const handleUpdateLayoutType = async (id, val) => {
        storeLoading(true)
        const response = await API.inputCode.updateLayoutType(id, val)
        if(response) {
            storeUpdatedLayoutType({
                error: false,
                success: true,
                message: 'Layout type successfully updated.'
            })
        } else {
            storeUpdatedLayoutType({
                error: true,
                success: false,
                message: 'Unable to update layout type.'
            })
        }
        storeLoading(false)
    }

    const handleUpdateShowAccount = async (id, val, type) => {
        storeLoading(true)
        const response = await API.inputCode.updateLayoutContent(id, val, type)
        console.log(response)
        if(response) {
            storeUpdatedShowAccount({
                success: true,
                error: false,
                message: 'Layout Content successfully updated!'
            })
        } else {
            storeUpdatedShowAccount({
                success: false,
                error: true,
                message: 'Unable to update Layout Content!'
            })
        }
        storeLoading(false)
    }

    const handleUpdateShowTitle = async (id, val) => {
        
    }

    const handleUpdateShowHashtag = async (id, val) => {
        
    }

    return {
        _error,
        _loading,
        _inputCodes,
        _inputCodeTablePage,
        _updatedLayoutType,
        _updatedShowAccount,
        _updatedShowTitle,
        _updatedShowHashtag,
        handleInputCodes,
        storeInputCodeTablePage,
        handleUpdateLayoutType,
        handleUpdateShowAccount,
        handleUpdateShowTitle,
        handleUpdateShowHashtag
    }

})