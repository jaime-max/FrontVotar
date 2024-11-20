export interface CambiarContrasenaRequest {
  idUsuario: number;          // ID del usuario que quiere cambiar la contraseña
  contrasenaAntigua: string;  // Contraseña actual del usuario
  nuevaContrasena: string;    // Nueva contraseña
}
export interface JwtPayload {
  sub: string;  // Asumiendo que 'sub' es el nombre de usuario en el token
  exp: number;  // Opcional: Si también necesitas acceder a otros campos del token
}
