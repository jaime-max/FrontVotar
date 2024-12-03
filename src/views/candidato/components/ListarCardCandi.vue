<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { editarCandidatos, listarCandidato } from '@/views/candidato/interfaces/registrarCandi'
import candidatos from '@/api/candidatos'
import votantes from '@/api/votantes'
import IconDelete from '@/views/usuario/registrarse/components/icons/IconDelete.vue'
import IconEdit from '@/views/usuario/registrarse/components/icons/IconEdit.vue'
import imageCompression from 'browser-image-compression'

const totalVotos = ref<number>(0);
const mostrarVotos = ref(false);
const votacionCompleta = ref<boolean>(false);
const mensajeError = ref<string>(''); // Variable para almacenar el mensaje de error
const mostrarErrorVotacion = ref(false); // Bandera para mostrar el error
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

    // Verificar el estado de votación
    const response = await votantes.verificarVotacionCompleta();
    if (response.status === 'success') {
      votacionCompleta.value = true;
      mensajeError.value = ''; // Limpia el mensaje de error
      mostrarErrorVotacion.value = false; // No mostrar error al cargar
    } else {
      votacionCompleta.value = false;
    }
    totalVotos.value = await candidatos.Totalvotos();
  } catch (error) {
    console.error("Error al verificar votación:", error);
  }
});

// Verificar si todos los votantes no descartados han votado
const verificarVotacionCompleta = async () => {
  try {
    const votantesNoDescartados = await votantes.listarVotantesNoDescartados();
    votacionCompleta.value = votantesNoDescartados.every(v => v.votado);
  } catch (error) {
    console.error("Error al verificar votación completa:", error);
  }
};
// Llamar a la verificación al montar el componente
onMounted(async () => {
  await verificarVotacionCompleta();
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

// Función para eliminar un candidato y actualizar el total de votos
const eliminarCandidato = async (id: number) => {
  try {
    // Eliminar el candidato
    await candidatos.eliminarCandidato(id);

    // Refrescar la lista de candidatos después de la eliminación
    ListarCandidatos.value = await candidatos.listarCandidatos();

    // Obtener el total de votos actualizado
    totalVotos.value = await candidatos.Totalvotos();

    // Cerrar el modal de confirmación
    confirmarDeleteCandidato.value = null;
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

// Función para mostrar u ocultar votos
const toggleMostrarVotos = async () => {
  if (votacionCompleta.value) {
    mostrarVotos.value = !mostrarVotos.value;
  } else {
    mostrarErrorVotacion.value = true;
    mensajeError.value = 'El proceso de votación no ha terminado.';
  }
};

// Función para cerrar el modal de error
const cerrarModalError = () => {
  mostrarErrorVotacion.value = false;
  mensajeError.value = '';
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
    <div class="total-votos" >
      <p>Total Votos: {{ totalVotos }}</p>
    </div>

    <!-- Modal pequeño y centrado -->
    <div v-if="mostrarErrorVotacion && !votacionCompleta" class="small-modal-overlay">
      <div class="small-modal">
        <h3 class="modal-title">Atención</h3>
        <p>{{ mensajeError }}</p>
        <button class="modal-button" @click="cerrarModalError">Cerrar</button>
      </div>
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
  background-color: rgb(14, 112, 211);
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
  box-shadow: 1px 1px 20px 1px rgba(244, 213, 92, 0.91);
  cursor: pointer;
  margin-top: 3px;
  color: #FFFF00;
}

.modal {
  display: block; /* Por defecto oculto */
  position: fixed; /* Se mantiene en su lugar en la ventana de visualización */
  z-index: 1000; /* Sitúa el modal encima de otros elementos */
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: auto; /* Añade desplazamiento si es necesario */
  background: rgba(0, 0, 0, 0.5); /* Fondo semi-transparente */
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fefefe; /* Fondo del modal */
  margin: 15% auto; /* Centra vertical y horizontalmente */
  padding: 20px;
  width: 50%; /* Ancho del contenido */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombras suaves */
  animation: fadeIn 0.3s ease-in-out; /* Animación de entrada */
}


.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}
.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
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
  background-color: rgb(14, 112, 211);
  box-shadow: 1px 1px 20px 1px rgba(0, 149, 255, 0.3);
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 20px;
}

.modal-button:hover {
  background-color: rgb(9, 37, 237);
  transform: scale(1.05);
}
.modal-button:active {
  transform: scale(1);
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
  background-color: rgb(14, 112, 211);
  box-shadow: 1px 1px 20px 1px rgba(0, 149, 255, 0.3);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}
.toggle-votes-button:hover {
  background-color: rgb(9, 37, 237);
  transform: scale(1.05);
}
.toggle-votes-button:active {
  transform: scale(1);
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

