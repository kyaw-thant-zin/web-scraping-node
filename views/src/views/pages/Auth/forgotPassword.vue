<script setup>

  import { useMeta } from 'vue-meta'
  import { ref, computed, onMounted } from 'vue'
  import { WebsiteName } from '@/api/constants.js'


  /* app config */
  useMeta({
    title: 'USER',
  })

  const formData = {
    email: ref(''),
  }

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
                <p class="l-signup-wr-desc">Enter your email and we'll send you a link to <br> reset your password.</p>
                <form @submit.prevent="submitForm"  class="fit row l-signup-wr-form">
                    <div class="col-12 auth-input icon-input">
                      <q-input 
                            borderless 
                            type="email" 
                            name="email" 
                            v-model="formData.email.value" 
                            label="Email" 
                            :rules="[
                                val => !!val || 'Field is required', 
                                (val, rules) => rules.email(val) || 'Please enter a valid email address'
                            ]"
                        >
                          <template v-slot:prepend>
                            <q-icon name="mdi-email-outline" />
                          </template>
                        </q-input>
                    </div>
                    <div class="col-12 text-center auth-submit">
                        <q-btn type="submit" size="md" class="q-px-lg q-py-sm" label="Continue" />
                    </div>
                </form>
            </q-card-section> 
        </q-card>
        <p class="auth-desc">New to Product? <router-link to="/sign-up">Sign Up</router-link></p>
        <p class="auth-desc">Already member? <router-link to="/sign-in">Sign In</router-link></p>
    </div>
  </div>
</template>

<style lang="scss">

  

</style>
