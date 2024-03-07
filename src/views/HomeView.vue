<template>
  <div class="container">
    <div class="header">
      <button class="sign-out" @click="userSignOut">Sign Out</button>
    </div>
    <div class="content">
      <button @click="getCurrentLocation" style="margin-bottom: 25px">
        Get My Current Location
      </button>
      <div v-if="display" class="map-location-container">
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
        <div v-if="display" class="location-info">
          <h2>Location Information:</h2>
          <ul>
            <li><strong>Country:</strong> {{ location_data.country }}</li>
            <li><strong>Country Calling Code:</strong> {{ location_data.country_calling_code }}</li>
            <li><strong>Country Code:</strong> {{ location_data.country_code }}</li>
            <li><strong>Country Code ISO3:</strong> {{ location_data.country_code_iso3 }}</li>
            <li><strong>Country Name:</strong> {{ location_data.country_name }}</li>
            <li><strong>Currency:</strong> {{ location_data.currency }}</li>
            <li><strong>Currency Name:</strong> {{ location_data.currency_name }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { getAuth, signOut } from 'firebase/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const location_data = ref({})
const display = ref(false)
const center = ref({ lat: 0, lng: 0 })
const markers = ref([
  {
    position: {
      lat: 0,
      lng: 0
    }
  }
])
const router = useRouter()

const getAddress = (lat, lng) => {
  axios
    .get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${import.meta.env.VITE_OPEN_CAGE_API_KEY}`
    )
    .then((res) => {
      const result = res.data.results[0]
      location_data.value = {
        country: result.components.country_code.toUpperCase(),
        country_calling_code: result.annotations.callingcode,
        country_code: result.components.country_code.toUpperCase(),
        country_code_iso3: result.components['ISO_3166-1_alpha-3'],
        country_name: result.components.country,
        currency: result.annotations.currency.iso_code,
        currency_name: result.annotations.currency.name
      }
      display.value = true
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
      () => {
        alert(
          'Change of mind?\nClick on View Site Information at the top right and Reset permission.'
        )
      }
    )
  } else {
    alert('Your browser does not support geolocation API!')
  }
}

const userSignOut = () => {
  signOut(getAuth())
    .then(() => {
      router.push('/')
    })
    .catch((err) => {
      alert(err)
    })
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
