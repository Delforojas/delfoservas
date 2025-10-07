import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { showToast, ToastKey } from './test-messages';

export function handleHttpError(
  err: HttpErrorResponse,
  toast: ToastService,
  form?: FormGroup,
  customKey?: ToastKey
) {

  if (customKey) {
    showToast(toast, customKey, err.error?.message || err.error?.error);
    return;
  }

  switch (err.status) {
    case 0:
      showToast(toast, 'unexpectedError', 'Sin conexión con el servidor.');
      break;

    case 400:
      showToast(toast, 'registerFormInvalid', err.error?.message || 'Solicitud inválida.');
      break;

    case 401:
      showToast(toast, 'loginError');
      break;

    case 409:
      showToast(toast, 'registerConflict', err.error?.message || 'Conflicto en la petición.');
      break;

    default:
      showToast(toast, 'unexpectedError', err.error?.message || 'Error inesperado.');
      break;
  }
}