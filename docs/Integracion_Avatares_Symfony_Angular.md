# 🧩 Integración de Avatares entre **Symfony (Backend)** y **Angular (Frontend)**

> 📘 Este documento explica paso a paso cómo se configuró la **gestión y visualización de imágenes (avatars)**  
> entre el backend en **Symfony** y el frontend en **Angular**, incluyendo cómo se sincronizan los assets  
> y cómo Angular puede mostrar las imágenes sin funciones adicionales.

---

## 🎯 Objetivo general

✅ Cuando un usuario sube un avatar desde el frontend,  
Symfony lo guarda en `/public/uploads/avatars`  
y devuelve la ruta correspondiente al frontend.

✅ Angular debe poder mostrar esas imágenes correctamente:
- En **modo desarrollo** (`ng serve`)
- En **modo producción** (`ng build`)

Todo esto sin romper rutas, sin necesidad de funciones `getAvatarUrl()`,  
y con soporte para fallback (`assets/default-avatar.png`).

---

## ⚙️ Configuración en **Symfony (Backend)**

### 📁 Carpeta de almacenamiento

Las imágenes se guardan en:

```
symfony-backend/app/public/uploads/avatars/
```

Symfony mueve el archivo a esta carpeta y guarda su nombre en la base de datos.  
Cuando un usuario se registra o consulta su perfil, la API responde con algo como:

```json
{
  "avatar": "http://localhost:8000/uploads/avatars/pf_68ed7251b003d4.61686232.jpg"
}
```

🧠 De esta forma, Angular no necesita construir la URL manualmente,  
ya que el backend devuelve la ruta completa.

---

## 💾 Configuración en **Angular (Frontend)**

### 📄 `angular.json`

Para que Angular copie automáticamente las imágenes desde Symfony al hacer `ng build`,  
se añadió esta sección dentro de `projects.angular-frontend.architect.build.options.assets` 👇

```json
"assets": [
  "src/assets",
  {
    "glob": "**/*",
    "input": "../symfony-backend/app/public/uploads",
    "output": "/uploads"
  }
]
```

#### 🔍 Explicación

| Clave | Descripción |
|-------|--------------|
| `"glob": "**/*"` | Copia **todos los archivos y carpetas** dentro de `uploads/`. |
| `"input"` | Indica **de dónde copiar** los archivos (carpeta pública del backend). |
| `"output"` | Indica **dónde colocarlos** dentro del build de Angular. |

---

### 🛠️ Resultado tras el build

Al ejecutar:
```bash
ng build
```

Angular genera:
```
angular-frontend/dist/angular-frontend/
```

Y dentro de esa carpeta se crea automáticamente:
```
dist/angular-frontend/uploads/avatars/
```

🔗 Esta carpeta contendrá una **copia sincronizada** de las imágenes del backend:
```
symfony-backend/app/public/uploads/avatars/
```

De esa forma, al desplegar el proyecto, las imágenes estarán accesibles igual que en Symfony.

---

## 🌍 Archivo `environment.ts`

Para no depender de URLs fijas como `http://localhost:8000`,  
se configuraron variables globales en `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  endpointUrl: 'http://localhost:8000/api',
  base: 'http://localhost:8000'
};
```

#### 🧠 Explicación

| Variable | Uso |
|-----------|-----|
| `endpointUrl` | Define la base para todas las peticiones HTTP al backend (`/api/...`). |
| `base` | Define la URL raíz del servidor Symfony (para rutas de imágenes o archivos). |

📦 Cuando despliegues en producción, solo tendrás que cambiar esta línea:
```ts
base: 'https://api.delfoapps.com'
```

---

## 🧠 Visualización del avatar en Angular

Una vez alineadas las rutas, puedes mostrar las imágenes directamente sin lógica adicional:

```html
<img
  [src]="user?.avatar || 'assets/default-avatar.png'"
  alt="Avatar"
  class="w-10 h-10 rounded-full object-cover"
/>
```

O en listas (por ejemplo, clases y alumnos):

```html
<img
  [src]="alumno.avatar || 'assets/default-avatar.png'"
  alt="Avatar"
  class="w-12 h-12 rounded-full object-cover"
/>
```

### ✅ Casos posibles

| Situación | Resultado |
|------------|------------|
| El backend devuelve la URL completa | Se muestra la imagen directamente. |
| El usuario no tiene avatar | Se muestra `assets/default-avatar.png`. |

---

## 🧱 Resultado final

| Componente | Descripción |
|-------------|--------------|
| 🖥️ **Symfony** | Guarda los archivos en `/public/uploads/avatars` y devuelve rutas absolutas. |
| ⚙️ **Angular** | Copia los uploads al `dist/` y los usa directamente sin procesar rutas. |
| 🌐 **Deploy** | Totalmente preparado: solo cambiar `environment.base` si cambia el dominio. |

---

## 💡 Ejemplo completo del flujo

1. Usuario se registra → sube avatar.  
2. Symfony lo guarda en `app/public/uploads/avatars/`.  
3. API responde con la URL completa del avatar.  
4. Angular la recibe y la muestra directamente.  
5. Si se hace build (`ng build`), las imágenes se copian automáticamente a `dist/uploads/`.

---

## 🚀 Tips finales

- Mantén tu carpeta `uploads/avatars/` dentro de **`public/`** (nunca en `src/`).
- Usa nombres únicos para los archivos (como `uniqid()` en PHP).
- Limpia los builds viejos con:
  ```bash
  rm -rf dist/
  ```
- Y si cambias el dominio del backend, **solo** modifica:
  ```ts
  environment.base
  ```

---

🧠 **Resumen rápido:**
> Has conectado correctamente Symfony y Angular para compartir imágenes.  
> Ahora tus avatares funcionan tanto en desarrollo como en producción,  
> sin rutas rotas, sin funciones extra y con fallback visual integrado.

---

✍️ _Autor: Delfo Rojas_  
💻 _Integración Symfony ↔ Angular (gestión de avatares)_
