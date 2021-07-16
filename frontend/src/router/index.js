import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path:'/mes_projets',
    name: 'MesProjets',
    component: () => import('../views/MesProjets.vue'),
  },
  {
    path: '/inscription',
    name: 'Inscription',
    component:() => import('../views/Inscription.vue')
  }, 
  {
    path: '/connexion',
    name: 'Connexion',
    component:() => import('../views/Connexion.vue')
  },
  {
    path: '/profil',
    name: 'Profil',
    component:() => import('../views/Profil.vue')
  },
  {
    path:'/details/:id',
    name:'Details',
    component:() => import('../views/Details.vue')
  },
  {
    path: '/invitation',
    name: 'Invitation',
    component:() => import('../views/Invitation.vue')
  },
  {
    path: '/:id',
    name: 'projetDetails',
    component:() => import('../views/ProjetDetails.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
