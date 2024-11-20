<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { listarCandidato } from '@/views/candidato/interfaces/registrarCandi';
import candidatos from '@/api/candidatos';

// Variables reactivas
const Candidatos = ref<listarCandidato[]>([]);
const showModal = ref(false);
const selectCandidato = ref<listarCandidato | null>(null);
const successMessage = ref(false);
const searchQuery = ref('');

// Computed para filtrar candidatos
const candidatosFiltrados = computed(() => {
  if (!searchQuery.value) {
    return Candidatos.value;
  }
  return Candidatos.value.filter(candidato =>
    candidato.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    candidato.apellido.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Función para votar por un candidato
const votar = async () => {
  if (!selectCandidato.value) return;
  try {
    // Llama al servicio para votar
    await candidatos.Votar(selectCandidato.value.id);
    // Aumenta el conteo de votos localmente
    selectCandidato.value.votos += 1;
    successMessage.value = true;

    // Oculta el mensaje de éxito después de 1 segundo
    setTimeout(() => {
      successMessage.value = false;
    }, 1000);
  } catch (error) {
    console.error('Error al votar por el candidato:', error);
  } finally {
    showModal.value = false; // Cierra el modal
  }
};

// Función para abrir el modal con el candidato seleccionado
const confirmarVoto = (candidato: listarCandidato) => {
  selectCandidato.value = candidato;
  showModal.value = true;
};

// Función para obtener la lista de candidatos desde el servicio
const obtenerCandidatos = async () => {
  try {
    Candidatos.value = await candidatos.listarCandidatos();
    console.log(Candidatos.value);
  } catch (error) {
    console.error('Error al obtener los candidatos:', error);
  }
};

// Llamada inicial para obtener los candidatos
onMounted(() => {
  obtenerCandidatos();
});
</script>

<template>
  <div class="candi-container">
    <h2>Lista de Candidatos</h2>
    <div class="buscador-candidatos">
      <input v-model="searchQuery" type="text" placeholder="Buscar por nombre o apellido" />
    </div>

    <table class="candi-table">
      <thead>
      <tr>
        <th>Nombre</th>
        <th>Apellido</th>
        <th>Curso</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="candidato in candidatosFiltrados" :key="candidato.id">
        <td class="vote-button" @click="confirmarVoto(candidato)">
          <div class="candidato-info">
            <img
              v-if="candidato.foto"
              :src="candidato.foto"
              alt="Foto del candidato"
              class="candidato-img"
            />
            {{ candidato.nombre }}
          </div>
        </td>
        <td>{{ candidato.apellido }}</td>
        <td>{{ candidato.curso }}</td>
      </tr>
      </tbody>
    </table>

    <!-- Modal para confirmar voto -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>Confirmación de Voto</h3>
        <p>¿Estás seguro de que quieres votar por {{ selectCandidato?.nombre }}?</p>
        <button class="modal-button" @click="votar">Sí</button>
        <button class="modal-button" @click="showModal = false">Cancelar</button>
      </div>
    </div>

    <!-- Mensaje de éxito -->
    <div v-if="successMessage" class="success-message">
      ¡Tu voto ha sido registrado exitosamente!
    </div>
  </div>
</template>

<style scoped>
.candi-container {
   max-width: 1500px;
   margin: auto;
   padding: 20px;
   background-color: #f9f9f9;
   border-radius: 8px;
   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}
/* Estilos del buscador */
.buscador-candidatos {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  align-items: center; /* Centra el contenido horizontalmente */
}

.buscador-candidatos h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.buscador-candidatos input {
  padding: 12px;
  font-size: 16px;
  width: 100%;
  max-width: 400px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.buscador-candidatos input:focus {
  border-color: #4CAF50; /* Color del borde al hacer foco */
  outline: none;
}

.candi-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  table-layout: auto;
}

.candi-table th,
.candi-table td {
  padding: 20px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  word-wrap: break-word;
}
.candi-table th:nth-child(1),
.candi-table td:nth-child(1) {
  width: 150px; /* Ajusta el ancho de la columna de "Nombre" */
  white-space: nowrap; /* Evita que el texto se divida en varias líneas */
  overflow: hidden; /* Evita que el contenido se desborde */
  text-overflow: ellipsis; /* Agrega "..." si el contenido es demasiado largo */
}
.candi-table th:nth-child(2),
.candi-table td:nth-child(2) {
  width: 150px; /* Ajusta el ancho de la columna de "Apellido" */
  white-space: nowrap; /* Evita que el texto se divida en varias líneas */
  overflow: hidden; /* Evita que el contenido se desborde */
  text-overflow: ellipsis; /* Agrega "..." si el contenido es demasiado largo */
}
.candi-table th:nth-child(3),
.candi-table td:nth-child(3) {
  width: 150px; /* Ajusta el ancho de la columna de "Apellido" */
  white-space: nowrap; /* Evita que el texto se divida en varias líneas */
  overflow: hidden; /* Evita que el contenido se desborde */
  text-overflow: ellipsis; /* Agrega "..." si el contenido es demasiado largo */
}

.candi-table th {
  background-color: #4CAF50;
  color: white;
}

.candi-table tr:hover {
  background-color: #f1f1f1;
}

.candidato-info {
  display: flex;
  align-items: center;
}

.candidato-img {
  width: 160px;
  height: 160px;
  border-radius: 5%;
  object-fit: cover;
  margin-right: 10px;
}
.vote-button {
  padding: 8px 16px; /* Espaciado interno del botón */
  /*background-color: #4CAF50; /* Color de fondo del botón */
  color: #050505; /* Color del texto */
  border: none; /* Sin bordes */
  border-radius: 5px; /* Bordes redondeados */
  cursor: pointer; /* Cambia el cursor al pasar el mouse */
}

.vote-button:hover {
  background-color: #45a049; /* Color de fondo al pasar el mouse */
}
/* Estilos para el modal */
.modal {
  position: fixed; /* Posición fija */
  top: 0; /* Posiciona en la parte superior */
  left: 0; /* Posiciona a la izquierda */
  width: 100%; /* Ancho completo */
  height: 100%; /* Altura completa */
  background-color: rgba(0, 0, 0, 0.5); /* Fondo oscuro semi-transparente */
  display: flex; /* Flexbox para centrar contenido */
  align-items: center; /* Centra verticalmente */
  justify-content: center; /* Centra horizontalmente */
}

.modal-content {
  background-color: white; /* Fondo blanco del modal */
  border-radius: 8px; /* Bordes redondeados */
  padding: 20px; /* Espaciado interno */
  text-align: center; /* Centra el texto */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* Sombra del modal */
}

.modal-button {
  padding: 10px 20px; /* Espaciado interno del botón del modal */
  background-color: #4CAF50; /* Color de fondo del botón */
  color: white; /* Color del texto */
  border: none; /* Sin bordes */
  border-radius: 5px; /* Bordes redondeados */
  cursor: pointer; /* Cambia el cursor al pasar el mouse */
  margin: 5px; /* Margen entre botones */
}

.modal-button:hover {
  background-color: #45a049; /* Color de fondo al pasar el mouse */
}

/* Estilo para el mensaje de éxito */
.success-message {
  background-color: #dff0d8; /* Fondo verde claro */
  color: #3c763d; /* Color del texto */
  border: 1px solid #d6e9c6; /* Borde verde */
  border-radius: 5px; /* Bordes redondeados */
  padding: 10px; /* Espaciado interno */
  text-align: center; /* Centra el texto */
  margin-top: 20px; /* Margen superior */
}
/* Estilos de responsividad */
@media (max-width: 768px) {
  .candi-container {
    padding: 15px;
  }

  .candi-table th, .candi-table td {
    padding: 12px;
  }

  .buscador-candidatos input {
    max-width: 100%;
  }
}
</style>
