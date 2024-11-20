<script setup lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router'; // Importa el router para redirigir después de cerrar sesión

const router = useRouter(); // Asegúrate de usar useRouter en setup

function logout() {
  // Eliminar el token del localStorage
  localStorage.removeItem('token');

  // Redirigir a la página de login
  router.push({ name: 'login' }); // Asegúrate de que el nombre de la ruta sea correcto
}
defineComponent({
  name: 'AppHeader'  // Renombramos el componente a AppHeader
});
</script>

<template>
  <header class="app-header">
    <nav>
      <ul class="nav-left">
        <li><router-link to="/listarUser/" custom v-slot="{ navigate }">
          <a href="javascript:void(0);" @click="navigate" role="link">
            <div>Lista de Usuarios</div>
          </a>
        </router-link></li>
        <li><router-link to="/registrarCandidato/" custom v-slot="{ navigate }">
          <a href="javascript:void(0);" @click="navigate" role="link">
            <div>Registrar Candidatos</div>
          </a>
        </router-link></li>
        <li><router-link to="/listarCandidato/" custom v-slot="{ navigate }">
          <a href="javascript:void(0);" @click="navigate" role="link">
            <div>Listar Candidatos</div>
          </a>
        </router-link></li>
        <li><router-link to="/votarCandidato/" custom v-slot="{ navigate }">
          <a href="javascript:void(0);" @click="navigate" role="link">
            <div>Votar por Candidato</div>
          </a>
        </router-link></li>
      </ul>
      <ul class="nav-right">
        <li><router-link to="/registrar/" custom v-slot="{ navigate }">
          <a href="javascript:void(0);" @click="navigate" role="link">
            <div>Registrarse</div>
          </a>
        </router-link></li>
        <li><router-link to="/" custom v-slot="{ navigate }">
          <a href="javascript:void(0);" @click="navigate" role="link">
            <div>Iniciar Sesion</div>
          </a>
        </router-link></li>
        <li><router-link to="/camiarContrasena/" custom v-slot="{ navigate }">
          <a href="javascript:void(0);" @click="navigate" role="link">
            <div>Cambiar contraseña</div>
          </a>
        </router-link></li>
        <li><a href="javascript:void(0);" @click="logout">
          <div>Cerrar Sesion</div>
        </a></li>
      </ul>
    </nav>
  </header>
</template>


<style scoped>
.app-header {
  background-color: #333;
  color: white;
  padding: 10px 20px;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav ul {
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
}

.nav-left {
  display: flex;
  gap: 80px;
}

.nav-right {
  display: flex;
  gap: 80px;
}

nav ul li a {
  color: white;
  text-decoration: none;
}
</style>
