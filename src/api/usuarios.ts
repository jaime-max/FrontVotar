import apiUser from '@/api/api-user'
import type { updateUser,listarUser ,RegisterUserRequest, } from '@/views/usuario/registrarse/interfaces/registerUser';
import type {LoginRequest, LoginResponse} from '@/views/usuario/login/interfaces/loginRequest'
import type { CambiarContrasenaRequest } from '@/views/usuario/updateContrasena/interface/cambiarContrasena'
import { AxiosError } from 'axios';

export  default {
  async registerUser(DataUser:RegisterUserRequest){
    const response = await apiUser.post<string>('/api/usuarios', DataUser)
    return response.data
  },

  // El tipo de retorno es AxiosResponse<number>, pero solo necesitamos el valor de data
  async obtenerIdPorNombre(nombre: string): Promise<number> {
    const response = await apiUser.get<number>(`/api/usuarios/idPorNombre/${nombre}`);
    return response.data;  // Retorna el valor de data que es un número
  },
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiUser.post<LoginResponse>('/api/usuarios/login', credentials);
      return response.data; // Si el login es exitoso, retorna el token o el mensaje.
    } catch (error) {
      // Verificamos si el error es de tipo AxiosError
      if (error instanceof AxiosError && error.response && error.response.data) {
        return error.response.data; // Devuelve el mensaje de error específico del backend.
      } else {
        // Si el error no es un AxiosError, devuelve un mensaje genérico.
        throw new Error('Error desconocido al intentar iniciar sesión.');
      }
    }
  },

  async listarUsuario():Promise<listarUser[]>{
    const response = await apiUser.get<listarUser[]>('/api/usuarios');
    return response.data
  },
  async editarUsuario(DataUser: updateUser): Promise<listarUser> {
    const response = await apiUser.put<listarUser>(`/api/usuarios/${DataUser.id}`, DataUser);
    return response.data;  // Devuelve el usuario actualizado
  },

  async eliminarUsuario(id:number):Promise<void>{
    await apiUser.delete(`/api/usuarios/${id}`)
  },
  async cambiarContrasena(payload: CambiarContrasenaRequest): Promise<void> {
    await apiUser.put('/api/usuarios/cambiarContrasena', payload);
  }
}
