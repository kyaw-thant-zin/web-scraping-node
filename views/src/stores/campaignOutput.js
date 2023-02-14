import { ref } from 'vue'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'
import { useLocalStorage } from '@vueuse/core'

export const useCampaignOutputStore = defineStore('campaignOutput', () => {

    const _campaign = ref(useLocalStorage('_selectedCampaign', {
        label: 'All Campaigns',
        value: 0
    }))
    const _campaigns = ref([
        {
            label: 'All Campaigns',
            value: '0'
        }
    ])
    const _loading = ref(false)
    const _error = ref(false)
    const _updatePriority = ref(false)
    const _campaignOutputs = ref(null)
    const _campaignOutputTablePage = ref(useLocalStorage('_campaignOutputTablePage', 1))

    const storeLoading = (loading) => {
        _loading.value = loading
    }

    const storeError = (error) => {
        _error.value = error
    }

    const storeCampaign = (campaign) => {
        _campaign.value = campaign
    }

    const storeCampaigns = (campaigns) => {
        const filteredCampaign = [{
            label: 'All Campaigns',
            value: '0'
        }]
        campaigns.forEach((campaign) => {
            const dumpCampaign = {}
            dumpCampaign.value = campaign.id
            dumpCampaign.label = campaign.campaignName
            filteredCampaign.push(dumpCampaign)
        })

        _campaigns.value = filteredCampaign
    }

    const storeUpdatePriority = (priority) => {
        _updatePriority.value = priority
    }

    const storeCamapignOutputs = (campaigns) => {
        const filteredCampaignOutputs = []
        campaigns.forEach((co) => {
            const dumpCo = {}
            let account = '-'
            let hashtag = '-'
            let video = {}
            if(co.campaignOutput.tHashtag == null) {
                video = co.campaignOutput.tUser.tVideo
                account = co.account
            } else {
                video = co.campaignOutput.tHashtag.tVideo
                hashtag = co.hashtag
            }

            const date = dayjs(video.createTime)
            const formattedDate = date.format('DD/MM/YYYY')

            dumpCo.id = co.id
            dumpCo.tVideoId = video.id
            dumpCo.publicPrivate = co.campaignOutput.visibility
            dumpCo.campaignName = co.campaignName
            dumpCo.tiktok = video.videoURL
            dumpCo.postDate = formattedDate
            dumpCo.account = account
            dumpCo.hashtag = hashtag
            dumpCo.views = video.playCount
            dumpCo.link = co.linkType.type
            dumpCo.priority = co.campaignOutput.priority
            dumpCo.url = video.webVideoURL
            filteredCampaignOutputs.push(dumpCo)
        })
        _campaignOutputs.value = filteredCampaignOutputs
    }

    const storeCampaignOutputTablePage = (page) => {
        _campaignOutputTablePage.value = page
    }

    const handleCampaign = (campaign) => {
        
    }

    const handleCampaigns = async () => {
        const campaigns = await API.campaign.index()
        storeCampaigns(campaigns)
        storeLoading(false)
    }

    const handleCampaignOutputs = async () => {
        storeLoading(true)
        const campaigns = await API.campaignOutput.index()
        storeCamapignOutputs(campaigns)
    }

    const handleCampaignOutputPriority = () => {

    }

    const handleCampaignOutputVisibilityUpdate = (id, visibility) => {
        storeLoading(true)

    }

    return {
        _error,
        _loading,
        _campaign,
        _campaigns,
        _campaignOutputs,
        _updatePriority,
        _campaignOutputTablePage,
        storeCampaign,
        handleCampaign,
        handleCampaigns,
        handleCampaignOutputs,
        handleCampaignOutputPriority,
        storeCampaignOutputTablePage,
        handleCampaignOutputVisibilityUpdate
    }

})