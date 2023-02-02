<script setup>

  import { useMeta } from 'vue-meta'
  import { ref, computed, onMounted } from 'vue'
  import { WebsiteName } from '@/api/constants.js'


  /* app config */
  useMeta({
    title: 'USER',
  })

  const isPwd = ref(true)
  const formData = {
    userName: ref(''),
    password: ref(''),
  }

  const rememberMe = ref(false)

  async function submitForm() {
    console.log(formData)
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
                <form @submit.prevent="submitForm"  class="fit row l-signup-wr-form">
                    <div class="col-12 auth-input icon-input">
                        <q-input 
                            borderless 
                            label="Username or email"
                            name="userName" 
                            v-model="formData.userName.value" 
                            :rules="[val => !!val || 'Field is required']"
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
                            v-model="formData.password.value" 
                            :type="isPwd ? 'password' : 'text'" 
                            label="Password"
                            :rules="[
                                val => !!val || 'Field is required',
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
                            <q-checkbox v-model="rememberMe" label="Remember Me" color="primary" />
                            <router-link to="/forgot-password">Forgot Password?</router-link>
                        </div>
                    </div>
                    <div class="col-12 text-center auth-submit">
                        <q-btn type="submit" size="md" class="q-px-lg q-py-sm" label="Sign In" />
                    </div>
                </form>
            </q-card-section> 
        </q-card>
        <p class="auth-desc">New to Product? <router-link to="/sign-up">Sign Up</router-link></p>
    </div>
  </div>
</template>

<style lang="scss">

  

</style>
