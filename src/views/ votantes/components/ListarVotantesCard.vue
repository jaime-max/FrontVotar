<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AxiosError } from 'axios';  // Importamos AxiosError
import candidatos from '@/api/candidatos'
import votantes from '@/api/votantes'
import type { listarVotantes } from '@/views/ votantes/interfaces/votantes'



// Referencias
const fileInput = ref<File | null>(null);
const mensaje = ref<string | null>(null);
const votantesNoDescartados = ref<listarVotantes[]>([]);
const votantesRegistrados = ref<listarVotantes[]>([]);
const descartados = ref<Record<number, boolean>>({}); // Nuevo: Objeto para rastrear votantes descartados

// Obtener la lista de votantes registrados
const obtenerVotantes = async () => {
  try {
    votantesRegistrados.value = await votantes.listaVotantes();
  } catch (error) {
    console.error('Error al cargar los votantes:', error);
  }
};

// Obtener la lista de votantes no descartados
const obtenerVotantesNoDescartados = async () => {
  try {
    votantesNoDescartados.value = await votantes.listarVotantesNoDescartados();
  } catch (error) {
    console.error('Error al obtener votantes no descartados:', error);
  }
};

// Descartar votante
const descartarVotante = async (id: number) => {
  try {
    const response = await votantes.descartarVotante(id);
    mensaje.value = `✅ ${response.message}`;
    descartados.value[id] = true; // Actualizamos el estado de "descartado"
    // Limpiar el mensaje después de 3 segundos
    setTimeout(() => {
      mensaje.value = null;
      obtenerVotantes(); // Refrescar la lista de votantes
    }, 3000);
  } catch (error: unknown) {  // Usamos 'unknown' en lugar de un tipo más específico
    if (error instanceof AxiosError) {  // Verificamos si el error es un AxiosError
      mensaje.value = `❌ ${error.response?.data?.message || 'Error desconocido'}`;
    } else {
      mensaje.value = '❌ Error desconocido';
    }
    // Limpiar el mensaje después de 3 segundos
    setTimeout(() => {
      mensaje.value = null;
    }, 3000);
  }
};


// Subir votantes
const cargarVotantes = async () => {
  if (!fileInput.value) {
    mensaje.value = '❌ Por favor, selecciona un archivo antes de cargar.';
    // Limpiar el mensaje después de 3 segundos
    setTimeout(() => {
      mensaje.value = null;
    }, 3000);
    return;
  }

  try {
    const response = await candidatos.subirVotantes(fileInput.value);
    mensaje.value = `✅ ${response}`;
    setTimeout(() => {
      mensaje.value = null;
      obtenerVotantes();
    }, 3000);
  } catch (error: unknown) {
    if (error instanceof Error) {
      mensaje.value = `❌ ${error.message}`;
    } else {
      mensaje.value = '❌ Error desconocido';
    }
    // Limpiar el mensaje después de 3 segundos
    setTimeout(() => {
      mensaje.value = null;
    }, 3000);
  }
};

// Manejar el cambio de archivo
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    fileInput.value = target.files[0];
    mensaje.value = null;
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  obtenerVotantes();
  obtenerVotantesNoDescartados();
});
</script>

<template>
  <div class="cargar-votantes">
    <h1>Cargar Votantes</h1>
    <div class="formulario">
      <input type="file" @change="onFileChange" />
      <button @click="cargarVotantes">Cargar</button>
    </div>
    <div v-if="mensaje" :class="mensaje.startsWith('❌') ? 'mensaje error' : 'mensaje exito'">
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
        <th>Votos Anulados</th>
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="votante in votantesRegistrados" :key="votante.id">
        <td>{{ votante.id }}</td>
        <td>{{ votante.cedula }}</td>
        <td>{{ votante.nombre }}</td>
        <td>{{ votante.votado ? 'Sí' : 'No' }}</td>
        <td>{{ votante.descartado ? 'Voto Anulado' : 'Voto No Anulado'}}</td>
        <td>
          <button class="button" @click.prevent="descartarVotante(votante.id)">Descartar</button>
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
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #007bff;
  box-shadow: 1px 1px 20px 1px rgba(0, 149, 255, 0.3);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.formulario button:hover {
  background-color: #0056b3;
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
  max-width: 1000px; /* Máximo ancho del contenedor */
  margin: 5px auto; /* Centra el contenedor */
  padding: 20px; /* Espaciado interno */
  background-color: #f9f9f9; /* Fondo claro */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Sombra suave */
  border: 1px solid #3175c8;
}
h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}
.votant-table {
  width: 100%; /* Tabla ocupa el 100% del ancho */
  border-collapse: collapse; /* Combina bordes */
  margin-bottom: 20px; /* Margen inferior */
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
.candi-table tr:hover {
  background-color: #f1f1f1; /* Color de fondo al pasar el mouse */
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
.button{
  background-color: #f44336;
  box-shadow: 1px 1px 20px 1px rgb(198, 68, 68);
  color: white; /* Color del texto */
  padding: 10px 20px; /* Espaciado interior */
  border: none; /* Sin borde */
  cursor: pointer; /* Cursor al pasar por encima */
  border-radius: 4px; /* Bordes redondeados */
  margin-top: 20px; /* Espacio superior */
  transition: background-color 0.3s ease, transform 0.3s ease;
}
.button:hover{
  background-color: #d32f2f;
  transform: scale(1.05); /* Cambia el color de fondo al pasar por encima */
}
button:active{
  transform: scale(1); /* Cambia el color de fondo al pasar por encima */
}
</style>
