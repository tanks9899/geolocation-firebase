<template>
  <div class="container">
    <button @click="getCurrentLocation" style="margin-top: 10vh">Get My Current Location</button>
    <h2>{{ address }}</h2>
    <GMapMap :center="center" :zoom="7" map-type-id="terrain" style="width: 500px; height: 300px">
      <GMapCluster>
        <GMapMarker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          :clickable="true"
          :draggable="true"
          @click="center = m.position"
        />
      </GMapCluster>
    </GMapMap>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'

const address = ref('')
const center = ref({ lat: 0, lng: 0 })
const markers = ref([
  {
    position: {
      lat: 0,
      lng: 0
    }
  }
])

const getAddress = (lat, long) => {
  axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
    )
    .then((res) => {
      if (res.data.error_message) {
        alert(res.data.error_message)
      } else {
        address.value = res.data.results[0].formatted_address
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
        center.value.lat = res.coords.latitude
        center.value.lng = res.coords.longitude
        markers.value[0].position.lat = res.coords.latitude
        markers.value[0].position.lng = res.coords.longitude
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

<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh;
}
</style>
