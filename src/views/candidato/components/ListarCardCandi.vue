<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { editarCandidatos, listarCandidato } from '@/views/candidato/interfaces/registrarCandi'
import candidatos from '@/api/candidatos'
import IconDelete from '@/views/usuario/registrarse/components/icons/IconDelete.vue'
import IconEdit from '@/views/usuario/registrarse/components/icons/IconEdit.vue'
import imageCompression from 'browser-image-compression'
const totalVotos = ref<number>(0);
const mostrarVotos = ref(false);

const iconDimension = {
  width: 20,
  height: 20,
};

const ListarCandidatos = ref<listarCandidato[]>([]);
const editarCand = ref<editarCandidatos | null>(null);
const confirmarDeleteCandidato = ref<listarCandidato | null>(null);
let fotoComprimida: File | null = null; // Almacena la imagen comprimida

// Función para obtener los candidatos al montar el componente
onMounted(async () => {
  try {
    ListarCandidatos.value = await candidatos.listarCandidatos();
    console.log("Candidatos:", ListarCandidatos.value);
  } catch (error) {
    console.error("Error al listar candidatos:", error);
  }
});

// Función para seleccionar un candidato y abrir el modal de edición
const seleccionarCandidato = (candidato: listarCandidato) => {
  if (candidato && candidato.id) {
    editarCand.value = {
      id: candidato.id,
      nombre: candidato.nombre,
      apellido: candidato.apellido,
      curso: candidato.curso,
      file: null // Se inicializa como null
    };
  }
};

// Función para comprimir la imagen (si es necesario)
const comprimirImagen = async (file: File) => {
  const opciones = {
    maxSizeMB: 5,
    maxWidthOrHeight: 1980, // Asegúrate de que no sea demasiado grande
    useWebWorker: true,
    quality: 0.9, // Alta calidad
    keepAspectRatio: true, // Mantiene las proporciones
  };

  if (editarCand.value) {
    try {
      return await imageCompression(file, opciones); // Comprime la imagen
    } catch (error) {
      console.error('Error al comprimir la imagen', error);
      return file; // En caso de error, usa el archivo original
    }
  } else {
    console.error("No hay candidato para editar");
    return file;
  }
};

// Función para manejar el cambio de archivo en el input
const manejarCambioArchivo = async (event: Event) => {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (file) {
    fotoComprimida = await comprimirImagen(file); // Almacena la imagen comprimida
  }
};

// Función para actualizar candidato (sin usar FormData)
const actualizarCandidato = async () => {
  if (editarCand.value) {
    if (!editarCand.value.nombre || !editarCand.value.apellido || !editarCand.value.curso) {
      console.error('Todos los campos son obligatorios');
      return;
    }
    try {
      await candidatos.EditarCandi({
        id: editarCand.value.id,
        nombre: editarCand.value.nombre,
        apellido: editarCand.value.apellido,
        curso: editarCand.value.curso,
        file: fotoComprimida, // Se envía la imagen comprimida
      });
      ListarCandidatos.value = await candidatos.listarCandidatos(); // Refresca la lista de candidatos
      editarCand.value = null; // Cierra el modal después de la actualización
      fotoComprimida = null; // Resetea la imagen
    } catch (error) {
      console.error('Error al actualizar el candidato', error);
    }
  }
};

// Función para eliminar un candidato
const eliminarCandidato = async (id: number) => {
  try {
    await candidatos.eliminarCandidato(id);
    ListarCandidatos.value = await candidatos.listarCandidatos(); // Refresca la lista de candidatos
    confirmarDeleteCandidato.value = null; // Cierra el modal de confirmación
  } catch (error) {
    console.error('Error en eliminar el candidato', error);
  }
};

// Función para confirmar la eliminación del candidato
const confirmarEliminarCandidato = (candidato: listarCandidato) => {
  confirmarDeleteCandidato.value = candidato;
};

// Función para cerrar los modales
const cerrarModal = () => {
  editarCand.value = null;
  confirmarDeleteCandidato.value = null;
};

// Función para obtener el total de votos al montar el componente
onMounted(async () => {
  try {
    totalVotos.value = await candidatos.Totalvotos();
  } catch (error) {
    console.error("Error al obtener el total de votos:", error);
  }
});
const toggleMostrarVotos = () => {
  mostrarVotos.value = !mostrarVotos.value;
};
</script>

<template>
  <div class="candi-container">
    <h2>Lista de Candidatos</h2>
    <table class="candi-table">
      <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Apellido</th>
        <th>Curso</th>
        <th>Acciones</th>
        <th v-if="mostrarVotos">Votos</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="candidato in ListarCandidatos" :key="candidato.id">
        <td>{{ candidato.id }}</td>
        <td>
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
        <td>
          <div class="table-button">
            <button @click="seleccionarCandidato(candidato)" type="button" class="edit">
              <IconEdit :width="iconDimension.width" :height="iconDimension.height" />
            </button>
            <button @click="confirmarEliminarCandidato(candidato)" type="button" class="delete">
              <IconDelete :width="iconDimension.width" :height="iconDimension.height" />
            </button>
          </div>
        </td>
        <td v-if="mostrarVotos">{{ candidato.votos }}</td>
      </tr>
      </tbody>
    </table>

    <!-- Modal para editar candidato -->
    <div v-if="editarCand != null" class="modal">
      <div class="modal-content">
        <span class="close" @click="cerrarModal">&times;</span>
        <h2 class="modal-title">Editar Candidato</h2>
        <form class="modal-form" @submit.prevent="actualizarCandidato">
          <input v-if="editarCand" v-model="editarCand.nombre" class="modal-input" placeholder="Nombre" />
          <input v-if="editarCand" v-model="editarCand.apellido" class="modal-input" placeholder="Apellido" />
          <input v-if="editarCand" v-model="editarCand.curso" class="modal-input" placeholder="Curso" />
          <input type="file" class="modal-input" @change="manejarCambioArchivo" />
          <button type="submit" class="modal-button">Editar Candidato</button>
        </form>
      </div>
    </div>
    <button class="toggle-votes-button" @click="toggleMostrarVotos">
      {{ mostrarVotos ? 'Ocultar Votos' : 'Mostrar Votos' }}
    </button>

    <!-- Mostrar el total de votos -->
    <div class="total-votos">
      <p>Total Votos: {{ totalVotos }}</p>
    </div>

    <!-- Modal de confirmación para eliminar candidato -->
    <div v-if="confirmarDeleteCandidato != null" class="modal">
      <div class="modal-content">
        <span class="close" @click="cerrarModal">&times;</span>
        <h2 class="modal-title">Confirmar Eliminación</h2>
        <div class="modal-body">
          <p>¿Estás seguro de que deseas eliminar al candidato {{ confirmarDeleteCandidato.nombre }}?</p>
          <div class="button-container">
            <button @click="eliminarCandidato(confirmarDeleteCandidato.id)" class="modal-button" type="button">
              Confirmar
            </button>
            <button @click="cerrarModal" class="modal-button cancel-button" type="button">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.candi-container {
  max-width: 1500px; /* Aumentar el máximo ancho del contenedor */
  margin: auto; /* Centra el contenedor */
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

.candi-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  table-layout: auto; /* Fija el tamaño de las columnas */
}

.candi-table th, .candi-table td {
  padding: 20px; /* Aumentar el espaciado interno */
  text-align: left;
  border-bottom: 1px solid #ddd;
  word-wrap: break-word; /* Evita que el texto se salga de la celda */
}

.candi-table th {
  background-color: #4CAF50;
  color: white;
}
/* Ajustar el ancho de la columna ID */
.candi-table th:nth-child(1),
.candi-table td:nth-child(1) {
  width: 8%; /* Reducir el ancho de la columna ID */
}

/* Ajustar el ancho de la columna Nombre */
.candi-table th:nth-child(2),
.candi-table td:nth-child(2) {
  min-width: 25%; /* Usa un ancho mínimo para la columna Nombre */
  white-space: normal; /* Permite que el texto se ajuste si es largo */
  overflow: hidden;
  text-overflow: ellipsis; /* Agrega puntos suspensivos si el texto es muy largo */
}

.candi-table tr:hover {
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
  box-shadow: 1px 1px 20px 1px rgba(244, 213, 92, 0.3);
  cursor: pointer;
  margin-top: 3px;
  color: #FFFF00;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
}

.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.modal-title {
  margin-bottom: 10px;
}

.modal-form {
  margin-top: 20px;
}

.modal-input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
}

.modal-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 20px;
}

.modal-button:hover {
  background-color: #45a049;
}

.modal-body {
  padding: 15px;
  text-align: center;
}

.modal-body p {
  margin-bottom: 20px;
  font-size: 16px;
  color: #555;
}

.cancel-button {
  background-color: #f44336;
}

.cancel-button:hover {
  background-color: #d32f2f;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.toggle-votes-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.toggle-votes-button:hover {
  background-color: #45a049;
}

.total-votos {
  margin-bottom: 20px;
  font-size: 18px;
  color: #050505;
}

/* Ajuste para las imágenes */
.candidato-info {
  display: flex;
  align-items: center;
}

.candidato-img {
  width: 160px; /* Mantén el tamaño pequeño */
  height: 160px;
  border-radius: 5%; /* Bordes redondeados */
  object-fit: cover; /* Mantén el ajuste adecuado */
  margin-right: 10px;
  image-rendering: pixelated; /* Probar con 'crisp-edges' o 'pixelated' */

}
</style>

