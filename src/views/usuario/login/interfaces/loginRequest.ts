export interface LoginRequest{
  username: string;
  password: string;
}

export interface LoginResponse{
  token: string | null;      // El token puede ser `null` en caso de error
  mensajeError: string | null; // El mensaje de error estará presente en caso de fallo
}
