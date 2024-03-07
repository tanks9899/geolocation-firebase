<template>
  <div class="container">
    <h1>Welcome to Geolocation App</h1>
    <br />
    <div id="firebaseui-auth-container"></div>
    <div id="loader">Loading...</div>
  </div>
</template>

<script setup>
import firebase from 'firebase/compat/app'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth())

const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function () {
      return true
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none'
    }
  },
  signInFlow: 'popup',
  signinSuccessUrl: 'http://localhost:5173/home',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ]
}

const checkCurrentUser = () => {
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      router.push('/home')
    } else {
      console.log('Not logging in!')
    }
  })
}

onMounted(() => {
  checkCurrentUser()
  ui.start('#firebaseui-auth-container', uiConfig)
})
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh;
}
</style>
