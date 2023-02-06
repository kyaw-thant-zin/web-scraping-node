<script setup>
import { useMeta } from 'vue-meta'
import { useQuasar } from 'quasar'
import { ref, watchEffect } from 'vue'
import { WebsiteName } from '@/api/constants.js'
import { useAuthStore } from '@/stores/auth.js'


/* app config */
useMeta({
    title: 'SIGN UP',
})

const $q = useQuasar()
const authStore = useAuthStore()

const authForm = ref(null)

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
    } else {
        $q.loading.hide()
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
        authStore.loadingState = true
        const resposne = authStore.handleSignUp(formData)
        authStore.loadingState = false
        if(resposne) {
            $q.notify({
                caption: 'Congratulations, your account has been successfully created.',
                message: 'SUCCESS',
                icon: 'mdi-check-circle-outline',
                color: 'positive',
                timeout: 1000
            })
            resetForm()
            authStore.router.push({ name: 'signIn' })
        } else {
            $q.notify({
                caption: 'Oops, something went wrong. Please try again later.',
                message: 'ERROR',
                icon: 'mdi-close-box-outline',
                color: 'negative',
                timeout: 1000
            })
        }
    }
    
}

const emailLoadingState = ref(false)
const usernameLoadingState = ref(false)
async function validateUnique(val, rules, field) {
    
    if(field === 'email') {
        if(rules.email(val)) {
            emailLoadingState.value = true
            const resposne = await authStore.handleUniqueFields(field, val)
            emailLoadingState.value = false
            return resposne || 'Email already exists.'
        } 
        return rules.email(val) || 'Please enter a valid email address'
    }else if(field === 'userName') {

        const validate = /^[a-zA-Z0-9_.]+$/.test(val)
        if(validate) {
            usernameLoadingState.value = true
            const resposne = await authStore.handleUniqueFields(field, val)
            usernameLoadingState.value = false
            return resposne || 'Username already exists.'
        } 
        return validate || 'Username can only contain letters, numbers, underscores, and periods'
    }
}

function resetForm() {
    formData.value.firstName = ''
    formData.value.lastName = ''
    formData.value.tel = ''
    formData.value.email = ''
    formData.value.userName = ''
    formData.value.password = ''
    formData.value.confirmPassword = ''
    acceptAgreement.value = false
    authForm.value.resetValidation()
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
                <q-form ref="authForm" @submit.prevent="submitForm(formData)"  class="fit row l-signup-wr-form">
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
                            :loading="emailLoadingState"
                            v-model="formData.email" 
                            label="Email" 
                            lazy-rules
                            :rules="[
                                val => !!val.replace(/\s/g, '') || 'Field is required', 
                                (val, rules) => validateUnique(val, rules, 'email'),
                            ]"
                        />
                    </div>
                    <div class="col-12 auth-input">
                        <q-input 
                            borderless 
                            name="userName" 
                            :loading="usernameLoadingState"
                            v-model="formData.userName" 
                            label="Username" 
                            lazy-rules
                            :rules="[
                                val => !!val.replace(/\s/g, '') || 'Field is required',
                                val => val.length >= 4 || 'Please use minumn 4 character',
                                (val, rules) => validateUnique(val, rules, 'userName')
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
