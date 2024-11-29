<script setup lang="ts">
import { onMounted,ref} from 'vue';
import type { listarUser, updateUser } from '@/views/usuario/registrarse/interfaces/registerUser'
import usuarios from '@/api/usuarios'
import { useRouter } from 'vue-router'
import IconDelete from '@/views/usuario/registrarse/components/icons/IconDelete.vue'
import IconEdit from '@/views/usuario/registrarse/components/icons/IconEdit.vue'
import AppHeader from '@/components/AppHeader.vue'
const appHeaderRef = ref();

const useLogout = () => {
  if (appHeaderRef.value) {
    appHeaderRef.value.logout(); // Llama a la función expuesta
  } else {
    console.error('No se pudo acceder a AppHeader.');
  }
};
const iconDimension ={
  width:20,
  height:20,
};

const Listusuarios = ref<listarUser[]>([]);
const editarUser = ref<updateUser|null>(null);
const confirmarDeletUser = ref<listarUser| null>(null);
const router = useRouter(); // Creamos una instancia del router
const nombreAnterior = ref<string | null>(null);

onMounted(async ()=>{
  Listusuarios.value=await usuarios.listarUsuario();
})

const selecionarUsuario = async (usuario: listarUser) => {
  // Al seleccionar un usuario, guarda su nombre original
  nombreAnterior.value = usuario.nombre;

  // Configura los datos del usuario a editar
  editarUser.value = {
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    telefono: usuario.telefono,
  };
};

const actualizarUsuario = async (e: Event) => {
  e.preventDefault(); // Prevenir recarga de página

  if (editarUser.value && nombreAnterior.value !== null) {
    console.log('Nombre anterior:', nombreAnterior.value);

    try {
      // Llama al método del servicio para actualizar el usuario
      const usuarioActualizado = await usuarios.editarUsuario({ ...editarUser.value });
      console.log('Usuario actualizado desde el backend:', usuarioActualizado);

      // Verifica si el nombre cambió
      if (usuarioActualizado.nombre === nombreAnterior.value) {
        console.log('No hubo cambios en el nombre de usuario, redirigiendo a la lista...');
        await router.push({ name: 'listarUser' }); // Redirige a la lista de usuarios
      } else {
        console.log('El nombre del usuario cambió, cerrando sesión...');


        // Llama a la función de logout
        useLogout();

        // Redirige al login con un mensaje
        await router.push({
          name: 'login',
          query: { mensaje: 'Nombre de usuario actualizado. Por favor inicia sesión nuevamente con el nuevo nombre.' },
        });
      }

      // Limpia el estado
      editarUser.value = null;
      nombreAnterior.value = null; // Limpia la variable de nombre anterior
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  }
};

const eliminar = async (id: number)=>{
  await usuarios.eliminarUsuario(id);
  Listusuarios.value = await usuarios.listarUsuario();
  confirmarDeletUser.value=null;

}

const confirmarEliminar = (usuario: listarUser) => {
  confirmarDeletUser.value=usuario;
}

const cerrarModal=()=>{
  editarUser.value=null;
  confirmarDeletUser.value=null;
}

</script>

<template>
  <AppHeader ref="appHeaderRef" />
  <div class="candi-container">
    <h2>Lista de Usuarios</h2>
    <table class="candi-table">
      <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Apellido</th>
        <th>Email</th>
        <th>Telefono</th>
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="usuario in Listusuarios " :key="usuario.id">
        <td>{{ usuario.id }}</td>
        <td>{{ usuario.nombre }}</td>
        <td>{{ usuario.apellido }}</td>
        <td>{{ usuario.email }}</td>
        <td>{{ usuario.telefono }}</td>
        <td>
          <div class="table-button">
            <button @click="selecionarUsuario(usuario)" type="button" class="edit"><IconEdit :width="iconDimension.width" :height="iconDimension.height"/></button>
            <button @click="confirmarEliminar(usuario)" type="button" class="delete"><IconDelete :width="iconDimension.width" :height="iconDimension.height"/></button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <!-- Modal para editar al usuario -->
    <div  v-if="editarUser!=null" class="modal">
      <div class="modal-content">
        <span class="close" @click="cerrarModal">&times;</span>
        <h2 class="modal-title">Editar Usuario</h2>
        <form class="modal-form">
          <input v-model="editarUser.nombre" class="modal-input" placeholder="Nombre" />
          <input v-model="editarUser.apellido" class="modal-input" placeholder="Apellido" />
          <input v-model="editarUser.email" class="modal-input" placeholder="Correo Electronico" />
          <input v-model="editarUser.telefono" class="modal-input" placeholder="Telefono" />
          <button @click="actualizarUsuario" class="modal-button"  type="button">Editar Usuario</button>

        </form>
      </div>
    </div>

  </div>

  <!-- Modal de confirmación para eliminar un usuario -->
  <div v-if="confirmarDeletUser != null" class="modal">
    <div class="modal-content">
      <span class="close" @click="cerrarModal">&times;</span>
      <h2 class="modal-title">Confirmar Eliminación</h2>
      <div class="modal-body">
        <p>¿Estás seguro de que deseas eliminar al usuario {{ confirmarDeletUser.nombre }}?</p>
        <div class="button-container">
          <button @click="eliminar(confirmarDeletUser.id)" class="modal-button" type="button">Confirmar</button>
          <button @click="cerrarModal" class="modal-button cancel-button" type="button">Cancelar</button>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.candi-container {
  max-width: 1000px; /* Máximo ancho del contenedor */
  margin: 5px auto; /* Centra el contenedor */
  padding: 20px; /* Espaciado interno */
  background-color: #f9f9f9; /* Fondo claro */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Sombra suave */
  border: 1px solid #3175c8;
}
h2 {
  text-align: center; /* Centra el título */
  color: #333; /* Color del texto */
  margin-bottom: 20px; /* Margen inferior */
}
.candi-table {
  width: 100%; /* Tabla ocupa el 100% del ancho */
  border-collapse: collapse; /* Combina bordes */
  margin-bottom: 20px; /* Margen inferior */
}
.candi-table th, .candi-table td {
  padding: 12px; /* Espaciado interno */
  text-align: left; /* Alineación del texto */
  border-bottom: 1px solid #ddd; /* Línea divisoria */
}

.candi-table th {
  background-color: rgb(14, 112, 211); /* Color de fondo de encabezados */
  color: white; /* Color del texto de encabezados */
}

.candi-table tr:hover {
  background-color: #f1f1f1; /* Color de fondo al pasar el mouse */
}



thead {
  background-color: #f2f2f2;
}

th, td {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}

.table-button{
  display: flex;
  /*justify-content: center;*/
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
.table-button button.delete:hover{
  transform: scale(1.05);
}
.table-button button.delete:active{
  transform: scale(1);
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
.table-button button.edit:hover{
  transform: scale(1.05);
}
.table-button button.edit:active{
  transform: scale(1);
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

/* Estilos para el contenido del modal */
.modal-content {
  background-color: #fefefe; /* Fondo del modal */
  margin: 15% auto; /* Centra vertical y horizontalmente */
  padding: 20px;
  width: 50%; /* Ancho del contenido */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombras suaves */
  animation: fadeIn 0.3s ease-in-out; /* Animación de entrada */
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
/* Estilos para el botón de cierre */
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

/* Estilos para el título del modal */
.modal-title {
  margin-bottom: 10px;
}

/* Estilos para el formulario dentro del modal */
.modal-form {
  margin-top: 20px;
}

/* Estilos para los campos de entrada del formulario */
.modal-input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  box-sizing: border-box; /* Asegura que el padding no aumente el ancho */
}
/* Estilos para el botón del formulario */
.modal-button {
  background-color: #007bff;
  box-shadow: 1px 1px 20px 1px rgba(0, 149, 255, 0.3);
  color: white; /* Color del texto */
  padding: 10px 20px; /* Espaciado interior */
  border: none; /* Sin borde */
  cursor: pointer; /* Cursor al pasar por encima */
  border-radius: 4px; /* Bordes redondeados */
  margin-top: 20px; /* Espacio superior */
}

.modal-button:hover {
  background-color: #0056b3;
  transform: scale(1.05); /* Cambia el color de fondo al pasar por encima */
}
.modal-button:active {
  transform: scale(1); /* Cambia el color de fondo al pasar por encima */
}

/* Estilos para el cuerpo del modal */
.modal-body {
  padding: 15px;
  text-align: center;
}

.modal-body p {
  margin-bottom: 20px;
  font-size: 16px;
  color: #555;
}

/* Estilos para el botón de cancelar */
.cancel-button {
  background-color: #f44336; /* Color de fondo para el botón de cancelar */
}

.cancel-button:hover {
  background-color: #d32f2f; /* Cambia el color de fondo al pasar por encima */
}
/* Estilos para el contenedor de botones */
.button-container {
  display: flex; /* Para alinear los botones horizontalmente */
  justify-content: space-between; /* Espacio uniforme entre los botones */
}
</style>
