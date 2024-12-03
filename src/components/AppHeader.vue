<script setup lang="ts">
import { useRouter } from 'vue-router'; // Importa el router para redirigir después de cerrar sesión

const router = useRouter(); // Asegúrate de usar useRouter en setup

function logout() {
  // Eliminar el token del localStorage
  localStorage.removeItem('token');

  // Redirigir a la página de login
  router.push({ name: 'login' }); // Asegúrate de que el nombre de la ruta sea correcto
}

// Exportar la función logout para que otros componentes puedan utilizarla
defineExpose({
  logout,
});
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo">
        <h1>UEDMO</h1>
      </div>
      <nav class="navigation">
        <ul class="nav-links">
          <li><router-link to="/listarUser/">Lista de Usuarios</router-link></li>
          <li><router-link to="/registrarCandidato/">Registrar Candidatos</router-link></li>
          <li><router-link to="/listarCandidato/">Lista Candidatos</router-link></li>
          <li><router-link to="/listaVotantes/">Lista Votantes</router-link></li>
          <li><router-link to="/validarVotantes/">Votar por Candidato</router-link></li>
        </ul>
        <ul class="nav-right">
          <li><router-link to="/camiarContrasena/">Cambiar Contraseña</router-link></li>
          <li><router-link to="/">Iniciar Sesion</router-link></li>
          <li><a href="javascript:void(0);" @click="logout">Cerrar Sesión</a></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: linear-gradient(90deg, #264d9f, #1b386f);
  color: white;
  padding: 10px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.logo {
  flex: 0 0 auto;
}

.logo h1 {
  font-size: 20px;
  font-weight: bold;
  color: #ffdd57;
  margin: 0;
}

.navigation {
  display: flex;
  justify-content: space-between;
  flex: 1;
}

.nav-links, .nav-right {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 0;
  gap: 10px;
}

.nav-links {
  flex: 2;
}

.nav-right {
  justify-content: flex-end;
  gap: 15px;
}

.nav-links li, .nav-right li {
  font-size: 14px;
}

.nav-links li a, .nav-right li a {
  color: white;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.nav-links li a:hover, .nav-right li a:hover {
  background-color: #ffdd57;
  color: #1b386f;
}

@media (max-width: 768px) {
  .nav-links, .nav-right {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .nav-right {
    align-items: flex-end;
  }

  .nav-links li, .nav-right li {
    width: 100%;
  }

  .logo h1 {
    font-size: 18px;
  }
}
</style>
