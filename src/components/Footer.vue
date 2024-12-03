<script setup lang="ts">

</script>

<template>
  <footer class="app-footer">
    <div class="footer-content">
      <p>&copy; 2024 <span class="brand">UEDMO</span>. Todos los Derechos Reservados.</p>
      <nav class="footer-nav">
        <a href="#about" class="footer-link">Sobre Nosotros</a>
        <a href="#privacy" class="footer-link">Política de Privacidad</a>
        <a href="#contact" class="footer-link">Contacto</a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: linear-gradient(90deg, #264d9f 0%, #1b386f 100%);
  color: #f0f0f0;
  padding: 15px 30px;
  text-align: center;
  position: fixed;
  width: 100%;
  bottom: 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.brand {
  font-weight: bold;
  color: #ffdd57;
}

.footer-nav {
  display: flex;
  gap: 15px;
  margin-top: 5px;
}

.footer-link {
  text-decoration: none;
  color: #f0f0f0;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #ffdd57;
}

@media (min-width: 768px) {
  .footer-content {
    flex-direction: row;
  }

  .footer-nav {
    margin-top: 0;
  }
}
</style>
