<script setup lang="ts">
import BannerCard from '@/views/usuario/login/components/BannerCard.vue'
import LoginCard from '@/views/usuario/login/components/LoginCard.vue'
import Header from '@/components/AppHeader.vue'
import Footer from '@/components/Footer.vue'

</script>

<template>
  <Header/>
  <main class="main">
    <div class="card">
      <BannerCard/>
      <LoginCard/>
    </div>
  </main>
  <Footer/>
</template>

<style scoped>
.main{
  width: 100vw;
  height: 100vh;
  background: rgba(235, 235, 235);


  /*Centrar*/
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
  background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(247,255,255,0.3) 100%);
  padding: 8px;
  display: flex;
}
</style>
