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
      <input v-model="DataUser.nombre" @input="validarCampo('nombre')" type="text" placeholder="Nombre">
      <input v-model="DataUser.apellido" @input="validarCampo('apellido')" type="text" placeholder="Apellido">
      <input v-model="DataUser.email" @input="validarCampo('email')" type="text" placeholder="Correo">
      <input v-model="DataUser.telefono" @input="validarCampo('telefono')" type="text" placeholder="telefono">
      <input v-model="DataUser.password" @input="validarCampo('password')"  type="password" placeholder="password">
      <!-- Select para elegir si es administrador o usuario normal -->
      <select v-model="DataUser.esAdministrador">
        <option :value="true">Administrador</option>
        <option :value="false">Usuario</option>
      </select>
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
