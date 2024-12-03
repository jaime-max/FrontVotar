<script setup lang="ts">
import RegisterCard from '@/views/usuario/registrarse/components/RegisterCard.vue'
import Footer from '@/components/Footer.vue'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <AppHeader/>
  <main class="main">
    <div class="card">
      <RegisterCard/>
    </div>
  </main>
  <Footer/>
</template>
<style scoped>
/* Estilos para el contenedor principal */
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('@/assets/img/imagen.png'); /* Cambia el path por el correcto */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0;
}

/* Estilos para el contenedor de la tarjeta de registro */
.card {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  width: 100%;
  padding: 20px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.9); /* Fondo blanco con opacidad para destacar el formulario */
  border-radius: 12px;
}

/* Ajuste adicional para la responsividad si es necesario */
@media (max-width: 600px) {
  .card {
    padding: 15px;
  }
}
</style>

