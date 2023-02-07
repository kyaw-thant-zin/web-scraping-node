import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'
import { useLocalStorage } from '@vueuse/core'

export const useCampaignStore = defineStore('campaign', () => {

    const _loading = ref(false)
    const _error = ref(false)
    const _created = ref(false)
    const _collectionTypes = ref(null)
    const _linkTypes = ref(null)
    const _campaigns = ref(null)
    const _campaignTablePage = ref(useLocalStorage('_campaignTablePage', 1))

    const storeLoading = (loading) => {
        _loading.value = loading
    }

    const storeError = (error) => {
        _error.value = error
    }

    const storeCreated = (created) => {
        _created.value = created
    }

    const storeCollectionTypes = (collectionTypes) => {
        const filteredCollectionTypes = []
        collectionTypes.forEach((colType) => {
            const dumpColType = {}
            for(const key in colType) {
                if(key === 'id') {
                    dumpColType.value = colType[key]
                } else {
                    dumpColType.label = colType[key]
                }
            }
            filteredCollectionTypes.push(dumpColType)
        })
        
        _collectionTypes.value = filteredCollectionTypes
    }

    const storeLinkTypes = (linkTypes) => {
        const filteredLinkTypes = []
        linkTypes.forEach((linkType) => {
            const dumpLinkType = {}
            for(const key in linkType) {
                if(key === 'id') {
                    dumpLinkType.value = linkType[key]
                } else {
                    dumpLinkType.label = linkType[key]
                }
            }
            filteredLinkTypes.push(dumpLinkType)
        })
        _linkTypes.value = filteredLinkTypes
    }

    const storeCampaigns = (campaigns) => {
        const filteredCampaign = []
        campaigns.forEach((campaign) => {
            const dumpCampaign = {}

            const date = new Date(campaign.createTimestamp)
            const formattedDate = date.toLocaleString(undefined, {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }).replace(/\//g, '/')

            dumpCampaign.campaignName = campaign.campaignName
            dumpCampaign.createdAt = formattedDate
            dumpCampaign.collectionType = campaign.collectionType.type
            dumpCampaign.account = campaign.account
            dumpCampaign.tags = campaign.hashtag
            dumpCampaign.linkType = campaign.linkType.type
            dumpCampaign.publicPrivate = campaign.visibility
            dumpCampaign.action = true
            filteredCampaign.push(dumpCampaign)
        })
        _campaigns.value = filteredCampaign
    }

    const storeCampaignTablePage = (page) => {
        _campaignTablePage.value = page
        console.log(_campaignTablePage.value)
    }

    const handleCampaigns = async () => {
        const response = await API.campaign.index()
        storeCampaigns(response)
    }

    const handleUniqueField = async (campaignName) => {
        const response = await API.campaign.checkUniqueField(campaignName)
        return response
    }

    const handleCollectionTypes = async () => {
        storeLoading(true)
        const collectionTypes = await API.campaign.getCollectionTypes()
        storeCollectionTypes(collectionTypes)
    }

    const handleLinkTypes = async () => {
        const linkTypes = await API.campaign.getLinkTypes()
        storeLinkTypes(linkTypes)
        storeLoading(false)
    }

    const handleCampaignCreate = async (formData) => {
        storeLoading(true)
        const response = await API.campaign.store(formData)
        storeCreated(response)
        storeLoading(false)
    }

    const handleCampaignUpdate = async (formData) => {

    }

    return {
        _loading,
        _error,
        _created,
        _collectionTypes,
        _linkTypes,
        _campaignTablePage,
        _campaigns,
        storeLoading,
        storeError,
        storeCreated,
        storeCollectionTypes,
        storeLinkTypes,
        storeCampaignTablePage,
        handleCampaigns,
        handleUniqueField,
        handleCollectionTypes,
        handleLinkTypes,
        handleCampaignCreate,
        handleCampaignUpdate
    }


})