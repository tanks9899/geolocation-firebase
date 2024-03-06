import { getAuth, onAuthStateChanged } from 'firebase/auth'
import firebase from 'firebase/compat/app'
import { createRouter, createWebHistory } from 'vue-router'
import firebaseConfig from '../firebaseConfig'

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const auth = getAuth()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'signin',
      component: () => import('../views/SignInView.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const user = await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe()
        resolve(user)
      })
    })

    if (user) {
      next()
    } else {
      next({ path: '/' })
    }
  } else {
    next()
  }
})

export default router
