<script setup>
import { useMeta } from 'vue-meta'
import { useQuasar } from 'quasar'
import { ref, watchEffect, computed } from 'vue'
import { WebsiteName } from '@/api/constants.js'
import { useAuthStore } from '@/stores/auth.js'


/* app config */
useMeta({
title: 'SIGN UP',
})

const $q = useQuasar()
const authStore = useAuthStore()

const isPwd = ref(true)
const formData = ref({
    firstName: '',
    lastName: '',
    tel: '',
    email: '',
    userName: '',
    password: '',
    confirmPassword: '',
})

const acceptAgreementError = ref(false)
const acceptAgreement = ref(false)

watchEffect( async () => {

    if(authStore.loadingState) {
        $q.loading.show()
    }

}, [authStore.loadingState])

const formIsValid = () => { 

    if(!acceptAgreement.value) {
        acceptAgreementError.value = true
    } else {
        acceptAgreementError.value = false
    }

    return acceptAgreement.value
}

async function submitForm(formData) {
    if(formIsValid()) {
        authStore.handleRegister(formData)
    }
    
}


</script>

<template>
  <metainfo>
    <template v-slot:title="{ content }">{{
      content ? `${content} | ${WebsiteName}` : WebsiteName
    }}</template>
  </metainfo>
  <div class="fit row wrap justify-center items-center min-height-fit auth-bg">
    <div class="col-xs-10 col-sm-8 col-md-5 justify-center q-my-xl">
        <q-card class="q-px-xl q-py-lg l-signup">
            <q-card-section class="l-signup-wr">
                <h1 class="l-signup-wr-ttl">HASHVANK</h1>
                <p class="l-signup-wr-desc">Welcome! Thank you for joining us.</p>
                <q-form @submit.prevent="submitForm(formData)"  class="fit row l-signup-wr-form">
                    <div class="col-12 auth-input">
                        <q-input 
                            borderless 
                            type="text" 
                            name="firstName"
                            v-model="formData.firstName" 
                            label="First Name" 
                            lazy-rules
                            :rules="[val => !!val.replace(/\s/g, '') || 'Field is required']"
                        />
                    </div>
                    <div class="col-12 auth-input">
                        <q-input 
                            borderless 
                            type="text" 
                            name="lastName" 
                            v-model="formData.lastName" 
                            label="Last Name" 
                            lazy-rules
                            :rules="[val => !!val.replace(/\s/g, '') || 'Field is required']"
                        />
                    </div>
                    <div class="col-12 auth-input">
                        <q-input 
                            borderless 
                            type="tel" 
                            name="tel" 
                            v-model="formData.tel" 
                            label="Tel:" 
                            lazy-rules
                            :rules="[val => !!val.replace(/\s/g, '') || 'Field is required']"
                        />
                    </div>
                    <div class="col-12 auth-input">
                        <q-input 
                            borderless 
                            type="email" 
                            name="email" 
                            v-model="formData.email" 
                            label="Email" 
                            lazy-rules
                            :rules="[
                                val => !!val.replace(/\s/g, '') || 'Field is required', 
                                (val, rules) => rules.email(val) || 'Please enter a valid email address'
                            ]"
                        />
                    </div>
                    <div class="col-12 auth-input">
                        <q-input 
                            borderless 
                            name="userName" 
                            v-model="formData.userName" 
                            label="Username" 
                            lazy-rules
                            :rules="[
                                val => !!val.replace(/\s/g, '') || 'Field is required',
                                val => val.length >= 4 || 'Please use minumn 4 character',
                                val => /^[a-zA-Z0-9_.]+$/.test(val) || 'Username can only contain letters, numbers, underscores, and periods'
                            ]"
                        />
                    </div>
                    <div class="col-12 auth-input">
                        <q-input 
                            borderless 
                            name="password"
                            v-model="formData.password" 
                            :type="isPwd ? 'password' : 'text'" 
                            label="Password"
                            lazy-rules
                            :rules="[
                                val => !!val.replace(/\s/g, '') || 'Field is required',
                                val => val.length >= 8 || 'Please use minumn 8 character',
                            ]"
                        >
                            <template v-slot:append>
                            <q-icon
                                :name="isPwd ? 'visibility_off' : 'visibility'"
                                class="cursor-pointer"
                                @click="isPwd = !isPwd"
                            />
                            </template>
                        </q-input>
                    </div>
                    <div class="col-12 auth-input">
                        <q-input 
                            borderless 
                            name="confirmPassword"
                            v-model="formData.confirmPassword" 
                            :type="isPwd ? 'password' : 'text'" 
                            label="Confirm Password"
                            lazy-rules
                            :rules="[
                                val => !!val.replace(/\s/g, '') || 'Field is required',
                                val => val.length >= 8 || 'Please use minumn 8 character',
                            ]"
                        >
                            <template v-slot:append>
                            <q-icon
                                :name="isPwd ? 'visibility_off' : 'visibility'"
                                class="cursor-pointer"
                                @click="isPwd = !isPwd"
                            />
                            </template>
                        </q-input>
                    </div>
                    <div class="col-12">
                        <div class="row items-center">
                            <q-checkbox
                                name="accept_agreement"
                                v-model="acceptAgreement"
                            />
                            <p class="q-mb-none">Agree with <a class="auth-link" href="https://www.google.com" target="_blank" rel="noreferrer noopener">
                                    Terms & Conditions</a></p>
                            <div
                                v-if="acceptAgreementError"
                                class="auth-alret"
                            >You must agree to the terms and conditions to continue.</div>
                        </div>
                    </div>
                    <div class="col-12 text-center auth-submit">
                        <q-btn type="submit" size="md"  class="q-px-lg q-py-sm" label="Sign Up" />
                    </div>
                </q-form>
            </q-card-section> 
        </q-card>
        <p class="auth-desc">Already member? <router-link to="/sign-in">Sign In</router-link></p>
    </div>
  </div>
</template>

<style lang="scss">

  

</style>
