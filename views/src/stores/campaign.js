import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'
import { useLocalStorage } from '@vueuse/core'

export const useCampaignStore = defineStore('campaign', () => {

    const _campaign = ref(null)
    const _loading = ref(false)
    const _error = ref(false)
    const _created = ref(false)
    const _destroyed = ref(false)
    const _updateVisibility = ref(false)
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

    const storeDestroyed = (destroy) => {
        _destroyed.value = destroy
    }

    const storeUpdateVisibility = (visibility) => {
        _updateVisibility.value = visibility
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

            dumpCampaign.id = campaign.id
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

    const storeCampaign = (campaign) => {
        const filteredCampaign = {}
        filteredCampaign.id = campaign.id
        filteredCampaign.campaignName = campaign.campaignName
        filteredCampaign.collectionType = {
            label: campaign.collectionType.type,
            value: campaign.collectionType.id
        }
        filteredCampaign.account = campaign.account
        filteredCampaign.hashtag = campaign.hashtag
        filteredCampaign.linkType = {
            label: campaign.linkType.type,
            value: campaign.linkType.id
        }
        _campaign.value = filteredCampaign
    }

    const storeCampaignTablePage = (page) => {
        _campaignTablePage.value = page
    }

    const handleCampaigns = async () => {
        const response = await API.campaign.index()
        storeCampaigns(response)
    }

    const handleCampaign = async (id) => {
        const response = await API.campaign.show(id)
        storeCampaign(response)
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
        setTimeout(() => {
            storeCreated(false)
        }, 500)
    }

    const handleCampaignVisibilityUpdate = async (id, visibility) => {
        storeLoading(true)
        const response = await API.campaign.updateVisibility(id, visibility)
        storeUpdateVisibility(response)
        storeLoading(false)
        setTimeout(() => {
            storeUpdateVisibility(false)
        }, 500)
    }

    const handleCampaignUpdate = async (formData) => {

    }

    const handleCampaignDestroy = async (id) => {
        storeLoading(true)
        const response = await API.campaign.destroy(id)
        storeDestroyed(response)
        storeLoading(false)
        setTimeout(() => {
            storeDestroyed(false)
        }, 500)
    }

    return {
        _loading,
        _error,
        _created,
        _destroyed,
        _updateVisibility,
        _collectionTypes,
        _linkTypes,
        _campaignTablePage,
        _campaign,
        _campaigns,
        storeLoading,
        storeError,
        storeCreated,
        storeCollectionTypes,
        storeLinkTypes,
        storeCampaignTablePage,
        handleCampaigns,
        handleCampaign,
        handleUniqueField,
        handleCollectionTypes,
        handleLinkTypes,
        handleCampaignCreate,
        handleCampaignUpdate,
        handleCampaignDestroy,
        handleCampaignVisibilityUpdate
    }


})