<script setup lang="ts">


import Footer from '@/components/Footer.vue'
import CambiarCardContra from '@/views/usuario/updateContrasena/componente/CambiarCardContra.vue'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
<AppHeader/>
  <main class="main">
    <div class="card">
      <CambiarCardContra/>
    </div>
  </main>
  <Footer/>
</template>

<style scoped>
.main {
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/img/imagen.png'); /* Cambia el path por el correcto */
  background-size: cover; /* Asegura que la imagen ocupe todo el fondo */
  background-position: center; /* Centra la imagen */
  background-repeat: no-repeat; /* Evita que la imagen se repita */

  /* Centrar el contenido */
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  max-width: 900px;
  width: 400px;
  height: 500px;
  border: 3px solid white;
  border-radius: 30px;
  background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(247,255,255,0.7) 100%); /* Fondo semi-transparente */
  padding: 8px;
  display: flex;
}
</style>
