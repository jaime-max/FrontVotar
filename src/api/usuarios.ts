import type { updateUser,listarUser ,RegisterUserRequest, } from '@/views/usuario/registrarse/interfaces/registerUser';
import type {LoginRequest} from '@/views/usuario/login/interfaces/loginRequest'
import apiUser from '@/api/api-user'

export  default {
  async registerUser(DataUser:RegisterUserRequest){
    const response = await apiUser.post<string>('/api/usuarios', DataUser)
    return response.data
  },
  async login(credentials: LoginRequest){
    const response = await apiUser.post<string>('/api/usuarios/login',credentials)
    return response.data
  },
  async listarUsuario():Promise<listarUser[]>{
    const response = await apiUser.get<listarUser[]>('/api/usuarios');
    return response.data
  },
  async editarUsuario(DataUser:updateUser): Promise<void>{
    await apiUser.put(`/api/usuarios/${DataUser.id}`,DataUser)
  },
  async eliminarUsuario(id:number):Promise<void>{
    await apiUser.delete(`/api/usuarios/${id}`)
  }
}
