<script setup lang="ts">

import AppHeader from '@/components/AppHeader.vue'
import Footer from '@/components/Footer.vue'
import ValidarVotantesCard from '@/views/ votantes/components/ValidarVotantesCard.vue'
</script>

<template>
<AppHeader/>
  <main class="main">
    <div class="card">
      <ValidarVotantesCard/>
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
}
.card {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 350px;
  width: 70%;
  padding: 10px;
  box-shadow: 4px 15px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.9); /* Fondo blanco con opacidad para destacar el formulario */
  border-radius: 12px;

}
</style>
