<script setup>

  import { useMeta } from 'vue-meta'
  import { ref, computed, onMounted } from 'vue'
  import { WebsiteName } from '@/api/constants.js'


  /* app config */
  useMeta({
    title: 'USER',
  })

  const isPwd = ref(true)


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
                <form action=""  class="fit row l-signup-wr-form">
                    <div class="col-12 auth-input">
                        <q-input 
                            borderless 
                            type="text" 
                            v-model="text" 
                            label="First Name" 
                            :rules="[val => !!val || 'Field is required']"
                        />
                    </div>
                    <div class="col-12 auth-input">
                        <q-input 
                            borderless 
                            type="text" 
                            v-model="text" 
                            label="Last Name" 
                            :rules="[val => !!val || 'Field is required']"
                        />
                    </div>
                    <div class="col-12 auth-input">
                        <q-input 
                            borderless 
                            type="tel" 
                            v-model="text" 
                            label="Tel:" 
                            :rules="[val => !!val || 'Field is required']"
                        />
                    </div>
                    <div class="col-12 auth-input">
                        <q-input 
                            borderless 
                            type="email" 
                            v-model="text" 
                            label="Email" 
                            :rules="[val => !!val || 'Field is required']"
                        />
                    </div>
                    <div class="col-12 auth-input">
                        <q-input 
                            borderless 
                            v-model="text" 
                            label="Username" 
                            :rules="[val => !!val || 'Field is required']"
                        />
                    </div>
                    <div class="col-12 auth-input">
                        <q-input 
                            borderless 
                            v-model="password" 
                            :type="isPwd ? 'password' : 'text'" 
                            label="Password"
                            :rules="[val => !!val || 'Field is required']"
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
                            v-model="password" 
                            :type="isPwd ? 'password' : 'text'" 
                            label="Confirm Password"
                            :rules="[val => !!val || 'Field is required']"
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
                        <q-checkbox
                            name="accept_agreement"
                            v-model="acceptAgreement"
                            label="Agree with Terms & Conditions"
                        />
                    </div>
                    <div class="col-12 text-center auth-submit">
                        <q-btn type="submit" size="md" label="Sign Up" />
                    </div>
                </form>
            </q-card-section>
        </q-card>
        <p>Already member? <router-link to="/sing-in">Sign In</router-link></p>
    </div>
  </div>
</template>

<style lang="scss">

  

</style>
