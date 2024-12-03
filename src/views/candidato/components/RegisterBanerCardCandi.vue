<script setup lang="ts">

</script>

<template>
  <section class="banner-card">
    <img src="@/assets/img/register.jpg" alt="" class="image" />
  </section>
</template>

<style scoped>
.banner-card {
  height: 100%;
  width: 50%;
  background-color: rgba(105, 133, 211, 0.83);
  border-radius: 20px;
  overflow: hidden; /* Asegura que la imagen no salga del contenedor con bordes redondeados */

  /* Centrar contenido */
  display: flex;
  justify-content: center;
  align-items: center;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Asegura que la imagen cubra el área manteniendo las proporciones */
  object-position: center; /* Centra la imagen dentro del contenedor */
}
</style>
