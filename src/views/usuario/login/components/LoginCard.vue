<script setup lang="ts">
  import LogoApple from '@/views/usuario/login/components/Loginviews/LogoApple.vue'
  import LogoGoogle from '@/views/usuario/login/components/Loginviews/LogoGoogle.vue'
  import LogoFacebook from '@/views/usuario/login/components/Loginviews/LogoFacebook.vue'
  import type {LoginRequest, LoginResponse} from '@/views/usuario/login/interfaces/loginRequest'
  import { useRouter } from 'vue-router'
  import { ref } from 'vue'
  import usuarios from '@/api/usuarios'

  const router = useRouter();

  //Para los iconos
  const iconDimension ={
    width: 40,
    height:40,
  };

  const credentiales = ref<LoginRequest>({
    username:"",
    password:"",
  })

  //Menejo de errores con Modales
  const  errorModal = ref<boolean>(false);
  const mensajeError = ref('');

  //manejo de mensaje de success
  const mensajeExito = ref<string>('');
  const mensajevisible = ref<boolean>(false);

  //mensaje de validacion del formulario
  const validationForm = ref<string | null >(null)



  const googleIcon =()=>{
    window.location.href='https://www.google.com/';
  };
  const facebookIcon =()=>{
    window.location.href='https://www.facebook.com/';
  };
  const appleIcon =()=>{
    window.location.href='https://www.apple.com/mx/mac/';
  };

  function validateForm(){
    if(!credentiales.value.username && !credentiales.value.password){
      validationForm.value = 'Porfavor ingrese su usuario y contraseña'
      return false;
    }
    if(!credentiales.value.username){
      validationForm.value = 'Porfavor ingrese su usuario'
      return false;
    }
    if(!credentiales.value.password){
      validationForm.value = 'Porfavor ingrese su contraseña'
      return false;
    }
    validationForm.value=null;
    return true;
  }

  async function login() {
    if (!validateForm()) {
      return;
    }
    try {
      // Realiza la solicitud de login al backend
      const data: LoginResponse = await usuarios.login(credentiales.value);
      console.log(data);

      // Caso 1: Login exitoso (hay un token válido)
      if (data.token) {
        // Guardar el token en localStorage
        localStorage.setItem('token', data.token);
        mensajeExito.value = 'Login successfully';
        mensajevisible.value = true;

        setTimeout(() => {
          mensajevisible.value = false;
          router.push({ name: "listarUser" }); // Redirecciona al listado de usuarios
        }, 1000);

        return; // Termina la ejecución en caso exitoso
      }

      // Caso 2: Error con mensaje claro del backend
      if (data.mensajeError) {
        mensajeError.value = data.mensajeError; // Muestra el mensaje del backend
        errorModal.value = true; // Activa el modal de error
        return; // No continúa con la ejecución
      }

      // Caso 3: Respuesta inesperada del servidor
      mensajeError.value = "Respuesta inesperada del servidor";
      errorModal.value = true; // Activa el modal de error
    } catch (error) {
      // Manejo de errores inesperados (fallo de conexión, errores del backend, etc.)
      errorModal.value = true;

      if (error instanceof Error) {
        mensajeError.value = error.message; // Usa el mensaje del error capturado
      } else {
        mensajeError.value = 'Error al iniciar sesión'; // Mensaje genérico para errores desconocidos
      }
    }
  }
</script>
<template>
  <section class="login-card">
    <div class="login-card-register">
      <span>¿No estas registrado?
        <router-link to="/registrar/" custom v-slot="{ navigate }">
          <a href="javascript:void(0);" @click="navigate" role="link">Registrate Ahora</a>
        </router-link>
      </span>
    </div>

    <div class="login-card-header">
      <h1>!Hola de Nuevo</h1>
      <span>Biemvenido de vuelta</span>
    </div>

    <div class="login-card-form">
      <input v-model="credentiales.username" type="text" placeholder="Usuario">
      <input v-model="credentiales.password" type="password" placeholder="contrasena">
      <a href="">Recupera tu contrasena</a>
      <button  @click="login" type="button">Iniciar Sesion</button>
    </div>
    <div v-if="validationForm" class="advertencia">
      <p>{{ validationForm }}</p>
    </div>

    <div class="login-card-footer">
      <span>O continua con</span>
      <div class="login-card-button">
        <button @click="googleIcon" class="icon-button"><LogoGoogle :width="iconDimension.width" :height="iconDimension.height" /></button>
        <button @click="appleIcon" class="icon-button"><LogoApple :width="iconDimension.width" :height="iconDimension.height"/></button>
        <button @click="facebookIcon" class="icon-button"><LogoFacebook :width="iconDimension.width" :height="iconDimension.height"/></button>
      </div>
    </div>
  </section>

  <div v-if="errorModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="errorModal=false">&times;</span>
      <h2 class="modal-title">Mensaje de Error</h2>
      <div class="modal-error-content" >
        <p>{{ mensajeError }}</p>
      </div>
    </div>
  </div>

  <div v-if="mensajevisible" class="success-message">
    <p>{{ mensajeExito }}</p>
  </div>
</template>

<style scoped>
.login-card-header{
  text-align: center;
  margin-top: 50px;
}

.login-card{
  width: 50%;
  padding: 20px;
  position: relative;

  /*  Centrar*/
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.login-card-register{
  position: absolute;
  right: 0;
  top: 0;
  margin: 20px;
}
.login-card-form{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin: 40px 0px;
}

.login-card-form input{
  border: none;
  padding: 20px;
  width: 80%;
  border-radius: 10px;
}

.login-card-form button{
  border: none;
  padding: 20px;
  width: 80%;
  border-radius: 10px;
  background-color: rgb(245,97,97);
  color: white;
  box-shadow: 1px 1px 20px 1px rgb(255,0,0,0.301);
  margin-top: 10px;
  cursor: pointer;
}
.login-card-form button:hover{
  transform: scale(1.05);
}
.login-card-form button:active {
  transform: scale(1);
}

.login-card-form a{
  font-size: 13px;
  width: 80%;
  text-align: right;
  text-decoration: none;
  color: rgb(63,63,63);
}
.login-card-footer{
  text-align: center;
}
.login-card-footer span{
  display: block;
  margin-top: 10px;
}
.login-card-button{
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}
.login-card-button button:hover {
  background-color: rgb(1, 1, 1, 0.1);
  border-radius: 5px;
  border: 1px solid white;
}

.icon-button {
  border: 1px solid transparent;
  background-color: transparent;
  cursor: pointer;
  padding: 5px;
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
  width: 30%; /* Ancho del contenido */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
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

/* Estilos adicionales para el título del modal */
.modal-title {
  margin-top: 0;
  font-size: 24px;
  color: #333;
  text-align: center;
}

/* Estilos para el contenido de error dentro del modal */
.modal-error-content{
  padding: 15px;
  background-color: #ffe6e6; /* Fondo rojo claro */
  border: 1px solid #ffcccc; /* Borde rojo claro */
  border-radius: 5px;
  margin: 15% auto;
  width: 70%;
}

.modal-error-content p {
  margin: 0;
  color: #d8000c; /* Color del texto rojo oscuro */
  font-size: 16px;
  text-align: center;
}

.success-message{
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
.advertencia {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>
