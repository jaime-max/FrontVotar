<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import votantes from '@/api/votantes'; // Importa la API que contiene el método validarVotante

// Variables reactivas
const cedula = ref('');
const router = useRouter();
const mensajeError = ref<string>('');
const mensajeExito = ref<string>('');

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
      mensajeExito.value=response.message;
      setTimeout(()=>{
        router.push({ name: 'votarCandidato', query: { cedula: cedula.value } });
      }, 2000);
    } else {
      // Si no es exitoso, mostramos el mensaje correspondiente
      mensajeError.value = response.message;
      cedula.value='';
    }
  } catch (error) {
    mensajeError.value = 'Ocurrió un error al validar al votante.';
    console.error(error);
  }
};

// Función para cerrar el modal de error
const cerrarModalError = () => {
  mensajeError.value = '';
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

    <!-- Modal pequeño y centrado error -->
    <div v-if="mensajeError" class="small-modal-overlay">
      <div class="small-modal">
        <h3 class="modal-title">Atención</h3>
        <p>{{ mensajeError }}</p><br>
        <button class="modal-button" @click="cerrarModalError">Cerrar</button>
      </div>
    </div>

    <!-- Modal pequeño y centrado exito-->
    <div v-if="mensajeExito" class="small-modal-overlay">
      <div class="small-modal">
        <h3 class="modal-title">Atención</h3>
        <p>{{ mensajeExito }}</p>
      </div>
    </div>
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
/* Estilos del modal pequeño */
.small-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5); /* Fondo semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Asegúrate de que esté encima del contenido */
}

.small-modal {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 300px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombras suaves */
  animation: fadeIn 0.3s ease-in-out; /* Animación de entrada */
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.modal-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-button:hover {
  background-color: #0056b3; /* Color más oscuro al pasar el mouse */
}
.modal-button:active {
  transform: scale(1);
}

/* Animación para que el modal aparezca suavemente */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>


