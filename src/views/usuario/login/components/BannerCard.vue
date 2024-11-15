<script setup lang="ts">

</script>

<template>
  <section class="banner-card">
    <img src="../../../../assets/img/banner.png" alt="" class="image" />
  </section>
</template>

<style scoped>
.banner-card{
  height: 100%;
  width: 50%;
  background-color: rgba(228, 139, 228);
  border-radius: 20px;

  /*centrar la imagen:el padre centra al hijo debe tener un alto y ancho para tener como referencia*/
  display: flex;
  justify-content: center;
  align-items: center;

}
.image{
  width: 70%;

}

</style>
