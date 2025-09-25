# 🛠️ Actualizaciones Proyecto Symfony + Angular + Docker

---
# 📌 Gestión de Errores y Notificaciones (Angular + Symfony)

## ✅ Avances implementados
- **Centralización de errores**  
  Se creó el helper `handleHttpError` en `shared/utils/http-error.ts` para gestionar los errores HTTP desde un solo punto, evitando duplicación de código en los componentes.
  
- **Sistema unificado de toasts**  
  En `shared/utils/test-messages.ts` se definió un **mapa de claves (`ToastKey`)** con todos los mensajes de éxito y error de la aplicación (login, clases, reservas, bonos, etc.).  
  Cada error o éxito se maneja llamando a:

  ```ts
  showToast(this.toast, 'clasesError');

  o en el caso de errores HTTP:
  handleHttpError(err, this.toast, undefined, 'alumnosError');

### 🔧 Mensajes personalizados por contexto

Usamos claves (`ToastKey`) para mostrar mensajes coherentes en cada parte de la app. Así evitamos repetir textos y mantenemos el mismo tono en toda la UI.

- **Autenticación**
  - `loginSuccess`, `loginError`, `registerSuccess`, `registerConflict`, `passwordResetSuccess`, `passwordResetError`, etc.
- **Dominio**
  - Clases, reservas, alumnos, bonos, profesores, salas, wallet…
  - Ejemplos: `clasesError`, `alumnosError`, `reservarError`, `reservarSuccess`, `bonosError`, `walletError`, etc.
- **Éxitos**
  - Mensajes claros cuando una acción se completa: `reservarSuccess`, `eliminarReservaSuccess`, etc.

> Todos los componentes usan `handleHttpError` y `showToast` en lugar de `alert` o strings duplicados.

```ts
// Ejemplos
showToast(this.toast, 'clasesError');
handleHttpError(err, this.toast, undefined, 'alumnosError');
### 🧩 Componentes adaptados

Estos componentes ya migraron al sistema centralizado de errores/toasts:

- `ClasesAdminComponent`
- `ClasesProfesorComponent`
- `CrearClaseComponent`
- `ClasesReservaComponent`
- `UsuarioBonosComponent`
- `UsuarioReservasComponent`
- `UsuarioPagosComponent`

---

## 🛠️ Beneficios

- Código **más limpio y mantenible**.  
- **Menos repetición** de mensajes en los componentes.  
- Mejor **experiencia de usuario** con notificaciones consistentes.  
- **Escalabilidad**: añadir un nuevo mensaje = agregar un `ToastKey` en `test-messages.ts` y listo.  