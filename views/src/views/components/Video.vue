<script setup>
import {defineProps, ref} from 'vue'

const video = defineProps(['url'])
const v = ref(null)

const playVideo = () => {
    v.value.play();
}

const endedPlaying = () => {
    v.value.currentTime = 0
}

</script>

<template>
    <div class="campaignOutput-t-video">
        <div class="video-wr">
            <video 
                ref="v"
                @mouseover="playVideo"
                @ended="endedPlaying"
                :src="video.url" 
                muted 
                playsinline></video>
        </div>
    </div>
</template>