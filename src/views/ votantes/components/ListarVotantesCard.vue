<script setup lang="ts">
import { ref } from 'vue'
import candidatos from '@/api/candidatos'
import votantes from '@/api/votantes'
import type { listarVotantes } from '@/views/ votantes/interfaces/votantes'
import IconEdit from '@/views/usuario/registrarse/components/icons/IconEdit.vue'
import IconDelete from '@/views/usuario/registrarse/components/icons/IconDelete.vue'

const iconDimension ={
  width: 20,
  height: 20,
};



// Referencias para el archivo y mensajes
const fileInput = ref<File | null>(null);
const mensaje = ref<string | null>(null);
const votante = ref<listarVotantes[]>([]);  // Aquí guardamos la lista de votantes

// Manejar el cambio del archivo
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    fileInput.value = target.files[0];
    mensaje.value = null; // Limpiar el mensaje al seleccionar un archivo nuevo
  }
};

// Cargar votantes al backend
const cargarVotantes = async () => {
  if (!fileInput.value) {
    mensaje.value = '❌ Por favor, selecciona un archivo antes de cargar.';
    return;
  }

  try {
    const response = await candidatos.subirVotantes(fileInput.value);
    mensaje.value = `✅ ${response}`;

    // Limpiar el mensaje después de 3 segundos y recargar la página
    setTimeout(() => {
      mensaje.value = null;  // Eliminar el mensaje
      window.location.reload();  // Recargar la página
    }, 3000); // 3 segundos
  } catch (error) {
    mensaje.value = `❌ ${error instanceof Error ? error.message : 'Error desconocido al cargar votantes.'}`;

    // Limpiar el mensaje después de 3 segundos y recargar la página
    setTimeout(() => {
      mensaje.value = null;  // Eliminar el mensaje
      window.location.reload();  // Recargar la página
    }, 3000); // 3 segundos
  }
};

// Obtener los votantes desde la API
const obtenerVotantes = async () => {
  try {
    // Llamamos a la API para obtener los votantes
    votante.value = await votantes.listaVotantes(); // Asignamos la respuesta a la variable reactiva
  } catch (error) {
    console.error("Error al cargar los votantes:", error);
  }
};

// Llamamos a la función de obtener votantes cuando se carga el componente
obtenerVotantes();
</script>

<template>
  <div class="cargar-votantes">
    <!-- Contenedor para el formulario de carga de votantes -->
      <h1>Cargar Votantes</h1>
      <div class="formulario">
        <label for="file"></label>
        <input
          type="file"
          id="file"
          ref="fileInput"
          @change="onFileChange"
          required
        />
        <button @click="cargarVotantes" type="button">Cargar</button>
      </div>

      <!-- Mensaje de error o éxito -->
      <div v-if="mensaje" :class="mensaje.startsWith('❌') ? 'mensaje error' : mensaje.startsWith('✅') ? 'mensaje exito' : ''">
        {{ mensaje }}
      </div>
  </div>

  <div class="votant-container">
    <h2>Votantes Registrados</h2>
      <table class="votant-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>Cédula</th>
          <th>Nombre</th>
          <th>Votado</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="votantes in votante" :key="votantes.id">
          <td>{{ votantes.id }}</td>
          <td>{{ votantes.cedula }}</td>
          <td>{{ votantes.nombre }}</td>
          <td>{{ votantes.votado ? 'Sí' : 'No' }}</td>
          <td>
            <div class="table-button">
              <button @s.prevent="" type="button" class="edit">
                <IconEdit :width="iconDimension.width" :height="iconDimension.height" />
              </button>
              <button @p.prevent="" type="button" class="delete">
                <IconDelete :width="iconDimension.width" :height="iconDimension.height" />
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
  </div>

</template>

<style scoped>
/* Estilo principal */
.cargar-votantes {
  font-family: Arial, sans-serif;
  max-width: 330px; /* Reducido el ancho de la sección */
  margin: 5px auto;
  padding: 5px 5px;
  border: 1px solid #3175c8;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Título */
.cargar-votantes h1 {
  font-size: 1.2em; /* Reducir tamaño de la fuente */
  margin-bottom: 15px;
  color: #333;
  text-align: center;
}

/* Formulario */
.formulario {
  display: flex;
  flex-direction: column;
  gap: 1px; /* Reducido espacio entre los elementos */
}

.formulario input[type="file"] {
  display: block;
  margin: 10px auto;
  padding: 5px 2px;
  font-size: 0.8em; /* Reducido tamaño de la fuente */
  border: 1px solid #3175c8;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background-color: #fff;
}

.formulario button {
  display: block;
  margin: 10px auto;
  padding: 8px 20px;
  font-size: 0.9em; /* Reducido tamaño de la fuente */
  color: #fff;
  background-color: rgb(14, 112, 211);
  box-shadow: 1px 1px 20px 1px rgba(0, 149, 255, 0.3);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.formulario button:hover {
  background-color: rgb(9, 37, 237);
  transform: scale(1.05);
}
.formulario button:active {
  transform: scale(1);
}



/* Estilos para el mensaje */
.mensaje {
  margin-top: 15px;
  font-size: 0.9em;
  padding: 8px;
  border-radius: 4px;
  text-align: center;
}

/* Estilo de éxito */
.mensaje.exito {
  color: #155724;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
}

/* Estilo de error (Texto rojo, fondo rojo claro) */
.mensaje.error {
  color: #dc3545; /* Texto rojo */
  background-color: #f8d7da; /* Fondo rojo claro */
  border: 1px solid #f5c6cb; /* Borde claro */
}
/* Estilo de la Tabla */
.votant-container {
  max-width: 1000px; /* Aumentar el máximo ancho del contenedor */
  margin: 5px auto; /* Centra el contenedor */
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #3175c8;
}
h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}
.votant-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  table-layout: auto; /* Fija el tamaño de las columnas */
}

.votant-table th, .votant-table td {
  padding: 20px; /* Aumentar el espaciado interno */
  text-align: left;
  border-bottom: 1px solid #ddd;
  word-wrap: break-word; /* Evita que el texto se salga de la celda */
}
.votant-table th {
  background-color: rgb(14, 112, 211);
  color: white;
}
/* Ajustar el ancho de la columna ID */
.votant-table th:nth-child(1),
.votant-table td:nth-child(1) {
  width: 8%; /* Reducir el ancho de la columna ID */
}

/* Ajustar el ancho de la columna Nombre */
.votant-table th:nth-child(2),
.votant-table td:nth-child(2) {
  min-width: 25%; /* Usa un ancho mínimo para la columna Nombre */
  white-space: normal; /* Permite que el texto se ajuste si es largo */
  overflow: hidden;
  text-overflow: ellipsis; /* Agrega puntos suspensivos si el texto es muy largo */
}

.votant-table tr:hover {
  background-color: #f1f1f1;
}

thead {
  background-color: #f2f2f2;
}

th, td {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 20px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}

.table-button{
  display: flex;
  gap: 10px;
}

.table-button button.delete{
  border: none;
  padding: 5px;
  border-radius: 3px;
  background-color: rgb(227, 176, 176);
  box-shadow: 1px 1px 20px 1px rgb(255,0,0,0.301);
  cursor: pointer;
  margin-top: 3px;
  color: #f60202;
}

.table-button button.edit{
  border: none;
  padding: 5px;
  border-radius: 3px;
  background-color: rgb(234, 219, 153);
  box-shadow: 1px 1px 20px 1px rgba(244, 213, 92, 0.91);
  cursor: pointer;
  margin-top: 3px;
  color: #FFFF00;
}
</style>
