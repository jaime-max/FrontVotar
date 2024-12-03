<script setup lang="ts">
import { ref } from 'vue'
import type {RegisterUserRequest} from '@/views/usuario/registrarse/interfaces/registerUser'
import usuarios from '@/api/usuarios'
import {useRouter} from 'vue-router'

const router = useRouter();

const DataUser = ref<RegisterUserRequest>({
  nombre:"",
  apellido:"",
  email:"",
  telefono:"",
  password:"",
  esAdministrador:false
})
//manejo de mensajes
const mensajeAdvertencia = ref<string|null>(null);

//Manejo de mensajes success
const mensajeExito = ref<string>("");
const mensajeVisible = ref<boolean>(false);

//validar un correo electronico
function validarEmail(email:string): boolean{
  const request = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return request.test(email);
}

// Validar que el teléfono contenga solo números
function validarTelefono(telefono: string): boolean {
  const request = /^[0-9]+$/;
  return request.test(telefono);
}


// Función de validación individual para cada campo
function validarCampo(campo: keyof RegisterUserRequest) {
  switch (campo) {
    case 'nombre':
      mensajeAdvertencia.value = DataUser.value.nombre.trim() ? null : "Por favor, ingrese su nombre";
      break;
    case 'apellido':
      mensajeAdvertencia.value = DataUser.value.apellido.trim() ? null : "Por favor, ingrese su apellido";
      break;
    case 'email':
      mensajeAdvertencia.value = validarEmail(DataUser.value.email) ? null : "Por favor, ingrese un correo electrónico válido";
      break;
    case 'telefono':
      mensajeAdvertencia.value = validarTelefono(DataUser.value.telefono) ? null : "Por favor, ingrese un número de teléfono válido";
      break;
    case 'password':
      mensajeAdvertencia.value = DataUser.value.password.trim() ? null : "Por favor, ingrese una contraseña";
      break;
  }
}
//registrar Usuario
async function registrarUsuario(){
  // Validar todos los campos antes de intentar registrar
  if(!DataUser.value.nombre || !DataUser.value.apellido || !validarEmail(DataUser.value.email) ||
    !validarTelefono(DataUser.value.telefono) || !DataUser.value.password){
    mensajeAdvertencia.value = "Por favor, complete todos los campos correctamente";
    return;
  }
  try{
    await usuarios.registerUser(DataUser.value)
    mensajeExito.value = 'Usuario Registrado';
    mensajeVisible.value=true;

    //Ocultar mensaje
    setTimeout(()=>{
      mensajeVisible.value=false;
      router.push({ name: "login" });
    }, 1000);

    //limpiar los campos
    DataUser.value.nombre="";
    DataUser.value.apellido="";
    DataUser.value.email="";
    DataUser.value.telefono="";
    DataUser.value.password="";

  }catch (error){
    console.log("Error al registrar usuario:",error)
  }
}
</script>

<template>
  <section class="register-card">
    <div class="register-card-header">
      <h1>Registrar Usuario</h1>
    </div>
    <div class="register-card-form">
      <div class="input-group">
        <input v-model="DataUser.nombre" @input="validarCampo('nombre')" type="text" placeholder="Nombre" />
      </div>
      <div class="input-group">
        <input v-model="DataUser.apellido" @input="validarCampo('apellido')" type="text" placeholder="Apellido" />
      </div>
      <div class="input-group">
        <input v-model="DataUser.email" @input="validarCampo('email')" type="email" placeholder="Correo" />
      </div>
      <div class="input-group">
        <input v-model="DataUser.telefono" @input="validarCampo('telefono')" type="tel" placeholder="Teléfono" />
      </div>
      <div class="input-group">
        <input v-model="DataUser.password" @input="validarCampo('password')" type="password" placeholder="Contraseña" />
      </div>
      <div class="input-group select-group">
        <select v-model="DataUser.esAdministrador">
          <option :value="true">Administrador</option>
          <option :value="false">Usuario</option>
        </select>
      </div>
      <button @click="registrarUsuario" type="button">Registrar</button>
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
/* Fondo global para centrar el formulario en pantalla */
body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background-color: #f3f4f6;
}

/* Contenedor del formulario */
.register-card {
  width: 100%;
  max-width: 450px;
  padding: 30px;
  background-color: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

/* Estilo del encabezado */
.register-card-header h1 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

/* Estilo del formulario */
.register-card-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Agrupar los inputs */
.input-group {
  display: flex;
  flex-direction: column;
}

/* Estilo de los inputs */
.register-card-form input,
.register-card-form select {
  padding: 14px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s ease;
}

/* Efecto cuando el input tiene focus */
.register-card-form input:focus,
.register-card-form select:focus {
  border-color: #47aaff;
  box-shadow: 0 0 5px rgba(71, 170, 255, 0.5);
}

/* Estilo de los select */
.register-card-form select {
  background-color: #fafafa;
}

/* Botón de registro */
.register-card-form button {
  padding: 15px;
  font-size: 16px;
  background-color: #47aaff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(0, 149, 255, 0.3);
  transition: all 0.3s ease;
}

/* Efecto al hacer hover sobre el botón */
.register-card-form button:hover {
  background-color: #339bd7;
  transform: scale(1.05);
}

/* Efecto al hacer click sobre el botón */
.register-card-form button:active {
  transform: scale(1);
}

/* Estilo para los mensajes de éxito y advertencia */
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
  width: 300px;
  text-align: center;
}

.advert {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.select-group select {
  cursor: pointer;
}
</style>
