<script setup lang="ts">
import { ref } from 'vue'
import type { registrarCandidato } from '@/views/candidato/interfaces/registrarCandi'
import imageCompression from 'browser-image-compression'
import candidatos from '@/api/candidatos'
import { useRouter } from 'vue-router'

const router = useRouter();

const DataCandidatos = ref<registrarCandidato>({
  nombre: '',
  apellido: '',
  curso: '',
  file: null,
});

// Manejo de mensajes
const mensajeAdvertencia = ref<string | null>(null);
const mensajeExito = ref<string>('');
const mensajeVisible = ref<boolean>(false);

// Ref para el input de archivo
const fileInput = ref<HTMLInputElement | null>(null);

// Función de validación individual para cada campo
function validarCampo(campo: keyof registrarCandidato) {
  switch (campo) {
    case 'nombre':
      mensajeAdvertencia.value = DataCandidatos.value.nombre.trim()
        ? null
        : 'Por favor, ingrese su nombre';
      break;
    case 'apellido':
      mensajeAdvertencia.value = DataCandidatos.value.apellido.trim()
        ? null
        : 'Por favor, ingrese su apellido';
      break;
    case 'curso':
      mensajeAdvertencia.value = DataCandidatos.value.curso.trim()
        ? null
        : 'Por favor, ingrese su curso';
      break;
    case 'file':
      mensajeAdvertencia.value = DataCandidatos.value.file
        ? null
        : 'Por favor, adjunte un archivo';
      break;
    default:
      throw new Error('Campo no reconocido');
  }
}

// Registrar candidato
async function registrarCandidato() {
  // Validar todos los campos
  if (
    !DataCandidatos.value.nombre ||
    !DataCandidatos.value.apellido ||
    !DataCandidatos.value.curso ||
    !DataCandidatos.value.file
  ) {
    mensajeAdvertencia.value = 'Por favor, complete todos los campos correctamente';
    return;
  }

  try {
    await candidatos.registerCandidato(DataCandidatos.value);
    mensajeExito.value = 'Candidato registrado exitosamente';
    mensajeVisible.value = true;

    // Ocultar mensaje después de 2 segundos y redirigir
    setTimeout(() => {
      mensajeVisible.value = false;
      router.push({ name: 'registrarCandidato' });
    }, 2000);

    // Limpiar los campos
    DataCandidatos.value = { nombre: '', apellido: '', curso: '', file: null };

    // Limpiar el input de archivo
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  } catch (error) {
    console.error('Error al registrar el candidato:', error);
    mensajeAdvertencia.value = 'Ocurrió un error al registrar el candidato.';
  }
}

// Manejar la carga y compresión de la imagen
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    mensajeAdvertencia.value = 'Por favor, seleccione un archivo válido.';
    return;
  }

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
  };

  try {
    DataCandidatos.value.file = await imageCompression(file, options);
  } catch (error) {
    console.error('Error al comprimir la imagen:', error);
    mensajeAdvertencia.value = 'Error al procesar la imagen. Intente con otro archivo.';
  }
};
</script>

<template>
  <section class="register-card">
    <div class="register-card-header">
      <h1>Registrar Candidato</h1>
    </div>
    <div class="register-card-form">
      <input
        v-model="DataCandidatos.nombre"
        @input="validarCampo('nombre')"
        type="text"
        placeholder="Nombre"
      />
      <input
        v-model="DataCandidatos.apellido"
        @input="validarCampo('apellido')"
        type="text"
        placeholder="Apellido"
      />
      <input
        v-model="DataCandidatos.curso"
        @input="validarCampo('curso')"
        type="text"
        placeholder="Curso"
      />
      <label for="file">Foto:</label>
      <input
        type="file"
        @change="handleFileUpload"
        id="file"
        ref="fileInput"
        required
      />
      <button @click="registrarCandidato" type="button">Registrar</button>
    </div>

    <div v-if="mensajeVisible" class="success-message">
      <p>{{ mensajeExito }}</p>
    </div>

    <div v-if="mensajeAdvertencia" class="advert">
      <p>{{ mensajeAdvertencia }}</p>
    </div>
  </section>
</template>


<style scoped>
.register-card-header{
  text-align: center;
  margin-top: 50px;
}
.register-card{
  width: 50%;
  padding: 20px;
  position: relative;

  /*  Centrar*/
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.register-card-form{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin: 40px 0px;
}

.register-card-form input{
  border: none;
  padding: 20px;
  width: 80%;
  border-radius: 10px;
}
.register-card-form button{
  border: none;
  padding: 20px;
  width: 80%;
  border-radius: 10px;
  background-color: rgb(47, 75, 255);
  color: white;
  box-shadow: 1px 1px 20px 1px rgba(0, 149, 255, 0.3);
  margin-top: 10px;
  cursor: pointer;
}
.register-card-form button:hover{
  transform: scale(1.05);
}
.register-card-form button:active {
  transform: scale(1);
}

.register-card-form select {
  border: none;
  border-radius: 10px;
  background-color: white;
  box-shadow: 1px 1px 20px 1px rgba(231, 235, 238, 0.3);
  margin-top: 10px;
  cursor: pointer;
  font-size: 16px;
}
.register-card-form select:hover {
  background-color: #f0f0f0;
}


.advert {
  color: red;
  margin-top: 10px;
  text-align: center;
}
.success-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #dff0d8;
  border: 1px solid #d6e9c6;
  color: #3c763d;
  padding: 15px;
  border-radius: 5px;
  z-index: 2;
  text-align: center;
  width: 300px;
}
</style>
