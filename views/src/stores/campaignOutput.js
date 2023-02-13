import { ref } from 'vue'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'
import { useLocalStorage } from '@vueuse/core'

export const useCampaignOutputStore = defineStore('campaignOutput', () => {

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

    const storeCampaigns = (campaigns) => {
        const filteredCampaigns = []
        campaigns.forEach((campaign) => {
            const dumpCampaign = {}
            for(const key in campaign) {
                if(key === 'id') {
                    dumpCampaign.value = campaign.id
                } else {
                    dumpCampaign.label = campaign.campaignName
                }
            }
            filteredCampaigns.push(dumpCampaign)
        })
        _campaigns.value = filteredCampaigns
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

    const handleCampaigns = async () => {
        const campaigns = await API.campaigns.index()
        storeCampaigns(response)
    }

    const handleCampaignOutputs = async () => {
        const campaigns = await API.campaignOutput.index()
        storeCamapignOutputs(campaigns)
    }

    const handleCampaignOutputPriority = () => {

    }

    return {
        _error,
        _loading,
        _campaigns,
        _campaignOutputs,
        _updatePriority,
        _campaignOutputTablePage,
        handleCampaigns,
        handleCampaignOutputs,
        handleCampaignOutputPriority,
        storeCampaignOutputTablePage
    }

})