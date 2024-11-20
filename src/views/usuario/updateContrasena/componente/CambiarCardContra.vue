<script setup lang="ts">
import { onMounted, ref } from 'vue'
import usuarios from '@/api/usuarios'
import * as jwt_decode from 'jwt-decode';
 // Asegúrate de que estás importando correctamente jwt-decode
import type { CambiarContrasenaRequest, JwtPayload } from '@/views/usuario/updateContrasena/interface/cambiarContrasena'


const idUsuario = ref<number | null>(null);
const username = ref<string | null>(null);
const contrasenaAntigua = ref<string>('');
const nuevaContrasena = ref<string>('');
const mensajeExito = ref<string | null>(null);
const mensajeError = ref<string | null>(null);
const enProceso = ref<boolean>(false);

// Función para obtener el username del token JWT
const obtenerUsername = () => {
  const token = localStorage.getItem('token'); // Reemplaza con tu clave para el token JWT
  if (token) {
    try {
      // Decodifica el token y usa el tipo JwtPayload
      const decoded = jwt_decode.jwtDecode<JwtPayload>(token);  // Aquí aplicas el tipo JwtPayload
      username.value = decoded.sub;  // Extrae el nombre de usuario del token
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      mensajeError.value = 'Token inválido o mal formado.';
    }
  } else {
    mensajeError.value = 'No se encontró el token de autenticación.';
  }
};

const obtenerIdUsuario = async () => {
  if (!username.value) {
    mensajeError.value = 'No se pudo obtener el nombre del usuario desde el token.';
    return;
  }

  try {
    // Accede a response.data para obtener el número
    idUsuario.value = await usuarios.obtenerIdPorNombre(username.value);  // response ya es un número, no un objeto
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    mensajeError.value = 'Error al obtener el ID del usuario.';
  }
};


onMounted(async () => {
  obtenerUsername();
  await obtenerIdUsuario();
});

const cambiarContrasena = async () => {
  if (enProceso.value) return;
  if (!idUsuario.value) {
    mensajeError.value = 'No se pudo identificar al usuario.';
    return;
  }

  if (!contrasenaAntigua.value || !nuevaContrasena.value) {
    mensajeError.value = 'Por favor, completa todos los campos.';
    return;
  }

  if (nuevaContrasena.value.length < 8) {
    mensajeError.value = 'La nueva contraseña debe tener al menos 8 caracteres.';
    return;
  }

  const payload: CambiarContrasenaRequest = {
    idUsuario: idUsuario.value,
    contrasenaAntigua: contrasenaAntigua.value,
    nuevaContrasena: nuevaContrasena.value,
  };

  enProceso.value = true; // Indica que la solicitud está en curso

  try {
    await usuarios.cambiarContrasena(payload);
    mensajeExito.value = '¡Contraseña cambiada con éxito!';
    mensajeError.value = null;
    contrasenaAntigua.value = '';
    nuevaContrasena.value = '';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    mensajeError.value = 'Error al cambiar la contraseña. Verifica tus datos.';
    mensajeExito.value = null;
  } finally {
    enProceso.value = false; // Restablece el estado
  }
};
</script>


<template>
  <div>
    <h2>Cambiar Contraseña</h2>
    <form @submit.prevent="cambiarContrasena">
      <div>
        <label for="contrasenaAntigua">Contraseña Actual:</label>
        <input
          type="password"
          id="contrasenaAntigua"
          v-model="contrasenaAntigua"
          placeholder="Ingresa tu contraseña actual"
        />
      </div>
      <div>
        <label for="nuevaContrasena">Nueva Contraseña:</label>
        <input
          type="password"
          id="nuevaContrasena"
          v-model="nuevaContrasena"
          placeholder="Ingresa tu nueva contraseña"
        />
      </div>
      <button :disabled="enProceso" type="submit">Cambiar Contraseña</button>
    </form>

    <div v-if="mensajeExito" class="success-message">
      <p>{{ mensajeExito }}</p>
    </div>
    <div v-if="mensajeError" class="error-message">
      <p>{{ mensajeError }}</p>
    </div>
  </div>
</template>

<style scoped>
.success-message {
  color: #28a745;
  font-weight: bold;
  margin-top: 10px;
}

.error-message {
  color: #dc3545;
  font-weight: bold;
  margin-top: 10px;
}
</style>
