<script setup>
import { ref, watchEffect } from 'vue'
import { useQuasar } from 'quasar'
import { useMeta } from 'vue-meta'
import { useAuthStore } from '@/stores/auth.js'
import { WebsiteName } from '@/api/constants.js'


/* app config */
useMeta({
  title: 'SIGN IN',
})

const $q = useQuasar()
const authStore = useAuthStore()

// CHECK AUTH AND REDIRECT
const auth = await authStore.handleCheckAuth()
if(auth) {
  authStore.router.push({name: 'campaigns'})
}

const authForm = ref(null)
const isPwd = ref(true)
const formData = ref({
  userName: '',
  password: '',
  rememberMe: false
})

watchEffect( async () => {

if(authStore.loadingState) {
    $q.loading.show()
} else {
    $q.loading.hide()
}

}, [authStore.loadingState])

async function submitForm(formData) {
    authStore.loadingState = true
    const resposne = await authStore.handleSignIn(formData)
    authStore.loadingState = false
    if(resposne === 'WRONG_PASSWORD') {

    } else if(resposne === 'USER_NOT_FOUND') {

    } else if(resposne?.uuid) {
      resetForm()
      authStore.setAuthUser(authStore, resposne)
      authStore.router.replace({ path: '/campaigns' })
    }
}

function resetForm() {
    formData.value.userName = ''
    formData.value.password = ''
    formData.value.rememberMe = false
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
                <p class="l-signup-wr-desc">Welcome back! Please login to continue.</p>
                <q-form ref="authForm" @submit.prevent="submitForm(formData)"  class="fit row l-signup-wr-form">
                    <div class="col-12 auth-input icon-input">
                        <q-input 
                            borderless 
                            label="Username or email"
                            name="userName" 
                            v-model="formData.userName" 
                            lazy-rules
                            :rules="[val => !!val.replace(/\s/g, '') || 'Field is required']"
                        >
                          <template v-slot:prepend>
                            <q-icon name="mdi-email-outline" />
                          </template>
                        </q-input>
                    </div>
                    <div class="col-12 auth-input icon-input">
                        <q-input 
                            borderless 
                            name="password"
                            v-model="formData.password" 
                            :type="isPwd ? 'password' : 'text'" 
                            label="Password"
                            lazy-rules
                            :rules="[
                                val => !!val.replace(/\s/g, '') || 'Field is required',
                            ]"
                        >
                          <template v-slot:prepend>
                            <q-icon name="mdi-lock-outline" />
                          </template> 
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
                        <div class="row justify-between items-center">
                            <q-checkbox v-model="formData.rememberMe" label="Remember Me" color="primary" />
                            <router-link to="/forgot-password">Forgot Password?</router-link>
                        </div>
                    </div>
                    <div class="col-12 text-center auth-submit">
                        <q-btn type="submit" size="md" class="q-px-lg q-py-sm" label="Sign In" />
                    </div>
                </q-form>
            </q-card-section> 
        </q-card>
        <p class="auth-desc">New to Product? <router-link to="/sign-up">Sign Up</router-link></p>
    </div>
  </div>
</template>

<style lang="scss">

  

</style>
