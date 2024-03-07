<template>
  <div class="container">
    <div class="header">
      <button class="sign-out">Sign Out</button>
    </div>
    <div class="content">
      <button @click="getCurrentLocation" style="margin-bottom: 25px">
        Get My Current Location
      </button>
      <div class="map-location-container">
        <div class="map-section">
          <GMapMap
            :center="center"
            :zoom="7"
            map-type-id="terrain"
            style="width: 500px; height: 300px"
          >
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
        <div class="location-info">
          <h2>Location Information:</h2>
          <ul>
            <li><strong>Country:</strong> {{ location_data.country }}</li>
            <li><strong>Country Area:</strong> {{ location_data.country_area }}</li>
            <li><strong>Country Calling Code:</strong> {{ location_data.country_calling_code }}</li>
            <li><strong>Country Capital:</strong> {{ location_data.country_capital }}</li>
            <li><strong>Country Code:</strong> {{ location_data.country_code }}</li>
            <li><strong>Country Code ISO3:</strong> {{ location_data.country_code_iso3 }}</li>
            <li><strong>Country Population:</strong> {{ location_data.country_population }}</li>
            <li><strong>Country TLD:</strong> {{ location_data.country_tld }}</li>
            <li><strong>Currency Name:</strong> {{ location_data.currency_name }}</li>
            <li><strong>Currency Symbol:</strong> {{ location_data.currency_symbol }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
// free do mounted on signin and redicrect to home page if logged in
const location_data = ref({})
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
      location_data.value = {
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

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 55vh;
}

.header {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.sign-out {
  margin-right: 20px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.map-location-container {
  display: flex;
}

.map-section {
  margin-right: 20px;
}

.location-info {
  margin-left: 20px;
}
</style>
