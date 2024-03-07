<template>
  <div class="container">
    <button @click="getCurrentLocation" style="margin-top: 10vh">Get My Current Location</button>
    <button>SignOut</button>
    <h2>
      {{ address }}
    </h2>
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
// free do mounted on signin and redicrect to home page if logged in
const address = ref({})
const center = ref({ lat: 0, lng: 0 })
const markers = ref([
  {
    position: {
      lat: 0,
      lng: 0
    }
  }
])

const getAddress = (lat, lng) => {
  axios
    .get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${import.meta.env.VITE_OPEN_CAGE_API_KEY}`
    )
    .then((res) => {
      const result = res.data.results[0]
      address.value = {
        country: result.components.country,
        country_area: result.annotations.UN_M49.regions.ASIA,
        country_calling_code: result.annotations.callingcode,
        country_capital: result.annotations.flag,
        country_code: result.components.country_code.toUpperCase(),
        country_code_iso3: result.components['ISO_3166-1_alpha-3'],
        country_population: result.annotations.UN_M49.regions.MY,
        country_tld: result.components.country_code.toUpperCase(),
        currency_name: result.annotations.currency.name,
        currency_symbol: result.annotations.currency.symbol
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
