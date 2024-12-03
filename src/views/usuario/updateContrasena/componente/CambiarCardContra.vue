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
const repetirNuevaContrasena = ref<string>('');
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
    // Accede a response data para obtener el número
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

  if (!contrasenaAntigua.value || !nuevaContrasena.value || !repetirNuevaContrasena.value) {
    mensajeError.value = 'Por favor, completa todos los campos.';
    return;
  }

  if (nuevaContrasena.value.length < 8) {
    mensajeError.value = 'La nueva contraseña debe tener al menos 8 caracteres.';
    return;
  }
  if (nuevaContrasena.value !== repetirNuevaContrasena.value) {
    mensajeError.value = 'Las contraseñas nuevas no coinciden.';
    return;
  }

  const payload: CambiarContrasenaRequest = {
    idUsuario: idUsuario.value,
    contrasenaAntigua: contrasenaAntigua.value,
    nuevaContrasena: nuevaContrasena.value,
    repetirNuevaContrasena: repetirNuevaContrasena.value,
  };

  enProceso.value = true; // Indica que la solicitud está en curso

  try {
    await usuarios.cambiarContrasena(payload);
    mensajeExito.value = '¡Contraseña cambiada con éxito!';
    mensajeError.value = null;
    contrasenaAntigua.value = '';
    nuevaContrasena.value = '';
    repetirNuevaContrasena.value = '';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    mensajeError.value = '¡Contraseña Antigua incorrecta';
    mensajeExito.value = null;
  } finally {
    enProceso.value = false; // Restablece el estado
  }
};
</script>


<template>
  <div class="login-card">
    <div class="login-card-header">
      <h1>Cambiar Contraseña</h1>
    </div>
    <div class="login-card-form">
      <input
        type="password"
        id="contrasenaAntigua"
        v-model="contrasenaAntigua"
        placeholder="Ingresa tu contraseña actual"
      />
      <input
        type="password"
        id="nuevaContrasena"
        v-model="nuevaContrasena"
        placeholder="Ingresa tu nueva contraseña"
      />
      <input
        type="password"
        id="repetirNuevaContrasena"
        v-model="repetirNuevaContrasena"
        placeholder="Repite tu nueva contraseña"
      />
      <button :disabled="enProceso" @click="cambiarContrasena" type="button">
        Cambiar Contraseña
      </button>
    </div>
    <div v-if="mensajeExito" class="success-message">
      <p>{{ mensajeExito }}</p>
    </div>
    <div v-if="mensajeError" class="error-message">
      <p>{{ mensajeError }}</p>
    </div>
  </div>
</template>

<style scoped>
.login-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%; /* Ajustar al tamaño del contenedor principal */
  height: 100%; /* Ajustar al tamaño del contenedor principal */
  padding: 20px;
}

.login-card-header {
  text-align: center;
  margin-bottom: 20px;
}

.login-card-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.login-card-form input {
  width: 90%;
  padding: 15px;
  border-radius: 10px;
  border: 2px solid #e0e0e0;
  outline: none;
  box-sizing: border-box;
  font-size: 16px;
}

.login-card-form input:focus {
  border-color: #47aaff;
  box-shadow: 0 0 5px rgba(71, 170, 255, 0.5);
}

.login-card-form button {
  width: 90%;
  padding: 15px;
  border-radius: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.login-card-form button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.login-card-form button:active {
  transform: scale(1);
}

.success-message,
.error-message {
  width: 90%;
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
}

.success-message {
  color: #28a745;
}

.error-message {
  color: #dc3545;
}
</style>

