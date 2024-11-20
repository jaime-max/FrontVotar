import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/usuario/login/LoginView.vue'
import RegistrarUser from '@/views/usuario/registrarse/RegistrarUser.vue'
import ListarUser from '@/views/usuario/registrarse/ListarUser.vue'
import RegistrarCandidato from '@/views/candidato/RegistrarCandidato.vue'
import ListarCandidato from '@/views/candidato/ListarCandidato.vue'
import GestionVotaciones from '@/views/candidato/GestionVotaciones.vue'
import CambiarContra from '@/views/usuario/updateContrasena/CambiarContra.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/camiarContrasena/',
      name: 'camiarContrasena',
      component: CambiarContra,
      meta: { requiresAuth: true }
    },
    {
      path: '/registrar/',
      name: 'registrar',
      component: RegistrarUser
    },
    {
      path: '/listarUser/',
      name: 'listarUser',
      component: ListarUser,
      meta: { requiresAuth: true }
    },
    {
      path: '/registrarCandidato/',
      name: 'registrarCandidato',
      component: RegistrarCandidato,
      meta: { requiresAuth: true }
    },
    {
      path: '/listarCandidato/',
      name: 'listarCandidato',
      component: ListarCandidato,
      meta: { requiresAuth: true }
    },
    {
      path: '/votarCandidato/',
      name: 'votarCandidato',
      component: GestionVotaciones,
      meta: { requiresAuth: true }
    },

  ]

})
// Lógica de protección de rutas
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token');
    if (!token) {
      return next({ name: 'login' });  // Redirigir a login si no hay token
    }
  }
  next();  // Continuar con la navegación si no hay restricciones
});
export default router
