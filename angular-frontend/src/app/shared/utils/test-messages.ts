import { ToastService } from '../services/toast.service';

export type ToastKey =
  // --- Auth ---
  | 'loginSuccess'
  | 'loginError'
  | 'registerSuccess'
  | 'classSuccess'
  | 'registerFormInvalid'
  | 'passwordMismatch'
  | 'registerConflict'
  | 'invalidEmail'
  | 'forgotPasswordSuccess'
  | 'passwordResetSuccess'
  | 'passwordResetError'
  | 'unexpectedError'
   
  // --- Dominio ---
  | 'bonosError'
  | 'clasesError'
  | 'vistaClasesError'
  | 'misClasesError'
  | 'alumnosError'
  | 'eliminarClaseError'
  | 'eliminarReservaError'
  | 'tiposClaseError'
  | 'roomsError'
  | 'profesoresError'
  | 'crearClaseError'
  | 'crearClaseFormInvalid'
  | 'walletError'
  | 'cargarUsuarioError'
  | 'reservarSuccess'
  | 'reservarError'
  | 'reservasUsuarioError'
  | 'eliminarReservaSuccess';         // 👈 AÑADIDA


export function showToast(
  toast: ToastService,
  key: ToastKey,
  arg?: string
) {
  switch (key) {
    // --- Auth ---
    case 'loginSuccess':
      toast.showToast(`¡Bienvenido, ${arg || 'Usuario'}!`, 'success'); break;
    case 'loginError':
      toast.showToast('Credenciales incorrectas. Intenta de nuevo.', 'error'); break;
    case 'registerSuccess':
      toast.showToast('Usuario registrado con éxito', 'success'); break;
    case 'classSuccess':
      toast.showToast('Clase creada correctamente ', 'success'); break;
    case 'registerFormInvalid':
      toast.showToast(arg || 'Completa los campos obligatorios.', 'error'); break;
    case 'passwordMismatch':
      toast.showToast('Las contraseñas no coinciden, por favor verifica.', 'error'); break;
    case 'registerConflict':
      toast.showToast(arg || 'El email o el usuario ya existe.', 'error'); break;
    case 'invalidEmail':
      toast.showToast('Introduce un email válido.', 'error'); break;
    case 'forgotPasswordSuccess':
      toast.showToast(arg || 'Si el email existe, recibirás un enlace de recuperación.', 'success'); break;
    case 'passwordResetSuccess':
      toast.showToast('Contraseña actualizada. Inicia sesión.', 'success'); break;
    case 'passwordResetError':
      toast.showToast(arg || 'No se pudo restablecer la contraseña.', 'error'); break;

    // --- Dominio ---
    case 'bonosError':
      toast.showToast(arg || 'Error al cargar los bonos', 'error'); break;
    case 'clasesError':
      toast.showToast(arg || 'Error al cargar clases', 'error'); break;
    case 'vistaClasesError':
      toast.showToast(arg || 'Error al cargar la vista de clases', 'error'); break;
    case 'misClasesError':
      toast.showToast(arg || 'No se pudieron cargar tus clases', 'error'); break;
    case 'alumnosError':
      toast.showToast(arg || 'No se pudieron cargar los alumnos', 'error'); break;
    case 'eliminarClaseError':
      toast.showToast(arg || 'Error al eliminar la clase', 'error'); break;
    case 'eliminarReservaSuccess': 
      toast.showToast(arg || 'Reserva eliminada', 'success'); break; 

    case 'eliminarReservaError':
      toast.showToast(arg || 'No se pudo eliminar la reserva', 'error'); break;
    case 'tiposClaseError':
      toast.showToast(arg || 'Error al cargar tipos de clase', 'error'); break;
    case 'roomsError':
      toast.showToast(arg || 'Error al cargar salas', 'error'); break;
    case 'profesoresError':
      toast.showToast(arg || 'Error al cargar profesores', 'error'); break;
    case 'crearClaseError':
      toast.showToast(arg || 'Error al crear la clase', 'error'); break;
    case 'crearClaseFormInvalid':
      toast.showToast(arg || 'Completa correctamente el formulario', 'error'); break;
    case 'walletError':
      toast.showToast(arg || 'Error cargando wallet del usuario', 'error'); break;
    case 'cargarUsuarioError':
      toast.showToast(arg || 'Error cargando usuario', 'error'); break;
    case 'reservarSuccess':
      toast.showToast(arg || 'Clase reservada con éxito ✅', 'success'); break;
    case 'reservarError':
      toast.showToast(arg || 'Error al reservar la clase', 'error'); break;
    case 'reservasUsuarioError':
      toast.showToast(arg || 'Error cargando reservas del usuario', 'error'); break;

    // --- Fallback ---
    case 'unexpectedError':
    default:
      toast.showToast(arg || 'Error inesperado. Vuelve a intentarlo más tarde.', 'error'); break;
  }
}