<script setup lang="ts">
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
import RegisterCardCandi from '@/views/candidato/components/RegisterCardCandi.vue'
</script>

<template>
  <Header/>
  <main class="main">
    <div class="card">
      <RegisterCardCandi/>
    </div>
  </main>
  <Footer/>
</template>

<style scoped>

.main{
  width: 100vw;
  height: 100vh;
  background: rgba(235,235,235);

  /*Centrar el card*/
  display: flex;
  justify-content: center;
  align-items: center;
}
.card{
  max-width: 900px;
  width: 800px;
  height: 600px;
  border: 3px solid white;
  border-radius: 30px;
  background: linear-gradient(90deg,rgba(255,255,255,1) 0%, rgba(247,255,255,0.3) 100%);
  padding: 8px;
  display: flex;
}

</style>

