<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import votantes from '@/api/votantes'; // Importa la API que contiene el método validarVotante

// Variables reactivas
const cedula = ref('');
const router = useRouter();
const mensaje = ref('');

// Función para manejar el envío del formulario
const ingresar = async () => {
  if (cedula.value.trim() === '') {
    alert('Por favor, ingresa tu cédula.');
    return;
  }

  try {
    // Llamamos a la API para validar al votante
    const response = await votantes.validarVotante(cedula.value);

    if (response.status === 'success') {
      // Guardar el estado de validación en el almacenamiento local
      localStorage.setItem('validado', 'true');
      // Si la validación es exitosa, redirigimos a la lista de candidatos
      await router.push({ name: 'votarCandidato', query: { cedula: cedula.value } });
    } else {
      // Si no es exitoso, mostramos el mensaje correspondiente
      mensaje.value = response.message;
    }
  } catch (error) {
    mensaje.value = 'Ocurrió un error al validar al votante.';
    console.error(error);
  }
};
</script>



<template>
  <div class="cedula-container">
    <h2>Ingrese su Cédula</h2>
    <form @submit.prevent="ingresar">
      <input
        v-model="cedula"
        type="text"
        placeholder="Ingrese su cédula"
        maxlength="10"
      />
      <button type="submit">Ingresar a Votar</button>
    </form>

    <!-- Mostrar mensaje de error si no es válido -->
    <p v-if="mensaje" class="error-message">{{ mensaje }}</p>
  </div>
</template>

<style scoped>
.cedula-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}
input {
  padding: 10px;
  margin-bottom: 20px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>


