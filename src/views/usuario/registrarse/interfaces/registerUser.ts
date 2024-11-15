export interface RegisterUserRequest{
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  esAdministrador: boolean;
}

export interface listarUser{
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
}

export interface updateUser{
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}
