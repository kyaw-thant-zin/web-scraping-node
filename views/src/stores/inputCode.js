import { ref } from 'vue'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'
import { useLocalStorage } from '@vueuse/core'
import { copyToClipboard } from 'quasar'

export const useInputCodeStore = defineStore('inputCode', () => {

    const _loading = ref(false)
    const _error = ref(false)
    const _inputCodes = ref(null)
    const _updatedLayoutType = ref(false)
    const _updatedLayoutContent = ref(false)
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
            dumpIC.visibility = ic.campaign.visibility
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

    const storeUpdatedLayoutContent = (updatedLayoutContent) => {
        _updatedLayoutContent.value = updatedLayoutContent
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

    const handleUpdateLayoutContent = async (id, val, type) => {
        storeLoading(true)
        const response = await API.inputCode.updateLayoutContent(id, val, type)
        console.log(response)
        if(response) {
            storeUpdatedLayoutContent({
                success: true,
                error: false,
                message: 'Layout Content successfully updated!'
            })
        } else {
            storeUpdatedLayoutContent({
                success: false,
                error: true,
                message: 'Unable to update Layout Content!'
            })
        }
        storeLoading(false)
    }

    const copyHTML = (apiCode) => {

        const layout = `<div id="hashvank"></div>
        <script type="text/javascript" async src="http://localhost:8080/v1/api/campaign/videos?token=${apiCode}"></script>`
        copyToClipboard(layout)
    }

    return {
        _error,
        _loading,
        _inputCodes,
        _inputCodeTablePage,
        _updatedLayoutType,
        _updatedLayoutContent,
        handleInputCodes,
        storeInputCodeTablePage,
        handleUpdateLayoutType,
        handleUpdateLayoutContent,
        copyHTML
    }

})