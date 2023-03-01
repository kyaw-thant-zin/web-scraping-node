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
    const _updatedPriority = ref(false)
    const _updatedVisibility = ref(false)
    const _updatedLink = ref({
        error: false,
        success: false,
        message: ''
    })
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
        if(campaigns.length > 0) {
            campaigns.forEach((campaign) => {
                const dumpCampaign = {}
                dumpCampaign.value = campaign.id
                dumpCampaign.label = campaign.campaignName
                filteredCampaign.push(dumpCampaign)
            })
        }
        _campaigns.value = filteredCampaign
    }

    const storeUpdatedLink = (link) => {
        _updatedLink.value = link
    }

    const storeUpdatePriority = (priority) => {
        _updatedPriority.value = priority
    }

    const storeUpdateVisibility = (visibility) => {
        _updatedVisibility.value = visibility
    }

    const storeCamapignOutputs = (campaigns) => {
        const filteredCampaignOutputs = []
        if(campaigns.length > 0) {
            campaigns.forEach((co) => {
                const dumpCo = {}
                let account = '-'
                let hashtag = '-'
                let visibility = false
                let priority = false
                let video = {}
                if(co.tHashtag == null) {
                    video = co.tUser.tVideo
                    account = co.account
                    const desc = co.tUser.tVideo.desc
                    if(desc != '') {
                        const hashtagPattern = /#[\p{L}0-9_]+/ug
                        const tags = desc.match(hashtagPattern).toString()
                        hashtag = tags
                    }
                    visibility = co.tUser.tVideo.visibility
                    priority = co.tUser.tVideo.priority
                } else {
                    video = co.tHashtag.tVideo
                    hashtag = co.hashtag
                    account = '@'+co.tHashtag.tVideo.authorUniqueId
                    visibility = co.tHashtag.tVideo.visibility
                    priority = co.tHashtag.tVideo.priority
                }
    
    
                let secTags = ''
                if(video.secVideoURL != '' && video.desc != '') {
                    const hashtags = video.desc.match(/#[\p{L}0-9_]+/ug)
                    if(hashtags.length > 0) {
                        secTags = hashtags.join(',')
                    } 
                } else {
                    secTags = hashtag
                }
    
    
                const date = dayjs(video.createTime)
                const formattedDate = date.format('DD/MM/YYYY')
    
                dumpCo.id = co.id
                dumpCo.tVideoId = video.id
                dumpCo.publicPrivate = !visibility
                dumpCo.campaignName = co.campaignName
                dumpCo.tiktok = video.secVideoURL != '' ? video.secVideoURL : video.videoURL
                dumpCo.postDate = formattedDate
                dumpCo.account = account
                dumpCo.hashtag = secTags
                dumpCo.views = video.playCount
                dumpCo.link = video.webVideoURL
                dumpCo.priority = priority
                dumpCo.url = video.webVideoURL
                dumpCo.showText = true
                filteredCampaignOutputs.push(dumpCo)
            })
        }
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

    const handleCampaignOutputPriority = async (id, priority) => {
        storeLoading(true)
        const response = await API.campaignOutput.updatePriority(id, priority)
        storeUpdatePriority(response)
        storeLoading(false)
        setTimeout(() => {
            storeUpdatePriority(false)
        }, 500)
    }

    const handleCampaignOutputVisibilityUpdate = async (id, visibility) => {
        storeLoading(true)
        const response = await API.campaignOutput.updateVisibility(id, !visibility)
        storeUpdateVisibility(response)
        storeLoading(false)
        setTimeout(() => {
            storeUpdateVisibility(false)
        }, 500)
        
    }

    const handleCampaignOutputLinkUpdate = async (id, link) => {
        storeLoading(true)
        const response = await API.campaignOutput.updateLink(id, link)
            if(response) {
                storeUpdatedLink({
                    error: false,
                    success: true,
                    message: 'Successfully updated link!'
                })
                setTimeout(() => {
                    storeUpdatedLink({
                        error: false,
                        success: false,
                        message: ''
                    })
                }, 500)
            } else {
                storeUpdatedLink({
                    error: true,
                    success: false,
                    message: 'Please check entered URL.'
                })
            }

            storeLoading(false)
            return response
    }

    return {
        _error,
        _loading,
        _campaign,
        _campaigns,
        _campaignOutputs,
        _updatedLink,
        _updatedPriority,
        _updatedVisibility,
        _campaignOutputTablePage,
        storeCampaign,
        handleCampaign,
        handleCampaigns,
        handleCampaignOutputs,
        handleCampaignOutputPriority,
        storeCampaignOutputTablePage,
        handleCampaignOutputVisibilityUpdate,
        handleCampaignOutputLinkUpdate
    }

})