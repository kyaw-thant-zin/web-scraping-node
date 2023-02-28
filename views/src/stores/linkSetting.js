import { ref } from 'vue'
import moment from 'moment-timezone'
import Papa from 'papaparse'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'
import FileSaver from 'file-saver'
import { useLocalStorage } from '@vueuse/core'

export const useLinkSettingStore = defineStore('linkSetting', () => {

    const _loading = ref(false)
    const _error = ref(false)
    const _linkSettings = ref(null)
    const _importedCSV = ref(false)
    const _linkSettingTablePage = ref(useLocalStorage('_linkSettingTablePage', 1))

    const storeLoading = (loading) => {
        _loading.value = loading
    }

    const storeImportedCSV = (importedCSV) => {
        _importedCSV.value = importedCSV
    }

    const storelinkSettings = (linkSettings) => {
        const filteredLinkSettings = []
        if(linkSettings.length > 0) {
            linkSettings.forEach((ls) => {
                const dumpLs = {
                    id: ls.id,
                    hashtag: ls.hashtag,
                    imgURL: ls.imageURL,
                    title: ls.title,
                    pageURL: ls.pageURL
                }
                filteredLinkSettings.push(dumpLs)
            })
        }
        _linkSettings.value = filteredLinkSettings
    }

    const storeLinkSettingTablePage = (page) => {
        _linkSettingTablePage.value = page
    }

    const handleLinkSettings = async () => {
        storeLoading(true)
        const response = await API.linkSetting.index()
        storelinkSettings(response)
        storeLoading(false)
    }

    const handleInportCSV = (file) => {
        storeLoading(true)
        try {
            Papa.parse( file, {
                header: true,
                skipEmptyLines: true,
                worker: true,
                complete: async function(results, file) {
                    if(results.data && results.errors.length == 0) {
                        // send the CSV data to API
                        for (const row of results.data) {
                            if(row.hashtag) {
                                const response = await API.linkSetting.store(row)
                                handleLinkSettings()
                            }
                        }
                        storeImportedCSV(true)
                    }
                }
            })


        } catch (error) {
            
        }
        storeLoading(false)
        setTimeout(() => {
            storeImportedCSV(false)
        }, 500)
    }

    const handleExportCSV = async (columns, rows) => {
        storeLoading(true)

        const content = {
            "fields": ['hashtag', 'imgURL', 'title', 'pageURL'],
            "data": []
        }

        rows.forEach((r) => {
            const dumpR = [
                r.hashtag,
                r.imgURL,
                r.title,
                r.pageURL
            ]
            content.data.push(dumpR)
        })

        try {
            const csv = Papa.unparse(content)
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
            const currentDate = moment().tz('Asia/Tokyo').format('DDMMYY-Hmm').toString()
            const filename = `export-${currentDate}.csv`
            FileSaver.saveAs(blob, filename)
        } catch (error) {
            console.log(error)
        }
        

        storeLoading(false)
    }

    return {
        _error,
        _loading,
        _importedCSV,
        _linkSettings,
        _linkSettingTablePage,
        handleLinkSettings,
        handleInportCSV,
        handleExportCSV,
        storeLinkSettingTablePage
    }

})