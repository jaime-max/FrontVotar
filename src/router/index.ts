import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/usuario/login/LoginView.vue'
import RegistrarUser from '@/views/usuario/registrarse/RegistrarUser.vue'
import ListarUser from '@/views/usuario/registrarse/ListarUser.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/registrar/',
      name: 'registrar',
      component: RegistrarUser
    },
    {
      path: '/listarUser/',
      name: 'listarUser',
      component: ListarUser
    },
  ]
})

export default router
