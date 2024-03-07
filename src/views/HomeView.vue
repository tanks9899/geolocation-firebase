<template>
  <div class="container">
    <button @click="getCurrentLocation">Get My Current Location</button>
  </div>
</template>

<script setup>
import axios from 'axios'

const getAddress = (lat, long) => {
  axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
    )
    .then((res) => {
      if (res.data.error_message) {
        alert(res.data.error_message)
      } else {
        console.log(res.data.results)
        console.log(res.data.results[0].formatted_address)
      }
    })
    .catch((err) => {
      alert(err)
    })
}

const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (res) => {
        getAddress(res.coords.latitude, res.coords.longitude)
      },
      (err) => {
        alert(
          'Change of mind?\nClick on View Site Information at the top right and Reset permission.'
        )
      }
    )
  } else {
    alert('Your browser does not support geolocation API!')
  }
}
</script>
