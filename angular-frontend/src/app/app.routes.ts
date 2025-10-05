import { Routes } from '@angular/router';

import { RegisterComponent } from './modules/register/register.component';
import { LoginComponent } from './modules/login/login.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { canMatchRoles } from './role.guard';
import { CrearClaseComponent } from './modules/menu/crear-clase.component';
import { ClasesProfesorComponent } from './modules/menu/clases-profesor.component';
import { ClasesAdminComponent } from './modules/menu/clases-admin.component';
import { UsuarioBonosComponent } from './modules/menu/bonos-usuario.component';
import { UsuarioReservasComponent } from './modules/menu/reservas-usuario.component';
import { UsuarioPagosComponent } from './modules/menu/pagos-usuario.component';
import { ClasesReservaComponent } from './modules/menu/reservar-clase.component';




export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  {

    path: 'dashboard',
    component: AppComponent,
    canActivate: [AuthGuard],
    children: [
      // 👇 redirección por defecto al entrar a /menu5
      { path: '', redirectTo: 'reservasclase', pathMatch: 'full' },

      // 🔒 rutas solo para ADMIN o TEACHER
      {
        path: '',
        canMatch: [canMatchRoles(['ROLE_ADMIN', 'ROLE_TEACHER'])],
        children: [
          { path: 'crear', component: CrearClaseComponent },
          { path: 'admin', component: ClasesAdminComponent },
          { path: 'profe', component: ClasesProfesorComponent },
          { path: 'pagos', component: UsuarioPagosComponent },
        ]
      },

      // ✅ rutas sin restricción
      { path: 'bonos', component: UsuarioBonosComponent },
      { path: 'reservas', component: UsuarioReservasComponent },
      { path: 'pagosusuario', component: UsuarioPagosComponent },
      { path: 'reservasclase', component: ClasesReservaComponent },



    ]
  },

  { path: '**', redirectTo: 'login' }
];