<script setup lang="ts">
import {onMounted,ref} from 'vue';
import type { listarCandidato} from '@/views/candidato/interfaces/registrarCandi'
import candidatos from '@/api/candidatos'
import IconDelete from '@/views/usuario/registrarse/components/icons/IconDelete.vue'
import IconEdit from '@/views/usuario/registrarse/components/icons/IconEdit.vue'

const ListarCandidatos = ref<listarCandidato[]>([]);

onMounted(async ()=>{
  ListarCandidatos.value = await candidatos.listarCandidatos();
  console.log("candidatos", ListarCandidatos)
})

</script>

<template>
  <div class="candi-container">
    <h2>Lista de Candidato</h2>
    <table class="candi-table">
      <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Apellido</th>
        <th>Curso</th>
        <th>Votos</th>
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="usuario in ListarCandidatos" :key="usuario.id">
        <td>{{ usuario.id }}</td>
        <td>{{ usuario.nombre }}</td>
        <td>{{ usuario.apellido }}</td>
        <td>{{ usuario.curso }}</td>
        <td>{{ usuario.votos }}</td>
        <td>

        </td>
      </tr>
      </tbody>
    </table>
    <!-- Modal para editar al usuario -->


  </div>

  <!-- Modal de confirmación para eliminar clase -->


</template>

<style scoped>
.candi-container {
  max-width: 1000px; /* Máximo ancho del contenedor */
  margin: auto; /* Centra el contenedor */
  padding: 20px; /* Espaciado interno */
  background-color: #f9f9f9; /* Fondo claro */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Sombra suave */
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
  background-color: #4CAF50; /* Color de fondo de encabezados */
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
  z-index: 1; /* Sitúa el modal encima de otros elementos */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto; /* Añade desplazamiento si es necesario */
  background-color: rgba(0, 0, 0, 0.5); /* Fondo oscuro semitransparente */
}

/* Estilos para el contenido del modal */
.modal-content {
  background-color: #fefefe; /* Fondo del modal */
  margin: 15% auto; /* Centra vertical y horizontalmente */
  padding: 20px;
  border: 1px solid #888;
  width: 50%; /* Ancho del contenido */
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
  background-color: #4caf50; /* Color de fondo */
  color: white; /* Color del texto */
  padding: 10px 20px; /* Espaciado interior */
  border: none; /* Sin borde */
  cursor: pointer; /* Cursor al pasar por encima */
  border-radius: 4px; /* Bordes redondeados */
  margin-top: 20px; /* Espacio superior */
}

.modal-button:hover {
  background-color: #45a049; /* Cambia el color de fondo al pasar por encima */
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
