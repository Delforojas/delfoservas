import { Routes } from '@angular/router';
import { TasksComponent } from './modules/tasks/tasks.component';
import { UsersComponent } from './components/users/users';
import { TipoclaseComponent } from './components/tipoclase/tipoclase';
import { RoomComponent } from './components/room/room';
import { WalletComponent } from './components/wallet/wallet';
import { ReservationComponent } from './components/reservation/reservation'; 
import { ClaseComponent } from './components/clase/clase';
import { BonosComponent } from './components/bonos/bonos'; 
import { VistasComponent } from './components/vistas/vistas'// 
import { RegisterComponent } from './modules/register/register.component';
import { LoginComponent } from './modules/login/login.component';
import { MenuComponent } from './modules/menu/menu.component';
import { MenuComponent2 } from './modules/menu/menu2.component';
import { MenuComponent3 } from './modules/menu/menu3.component';
import { Menu4Component } from './modules/menu/menu4component';
import { AppShellComponent } from './app-shell.component';
import { MainLayoutComponent } from './components/MainLayoutComponent/main-layout.component';
import { AuthGuard } from './auth.guard';
import { canMatchRoles } from './role.guard';
import { CrearClaseComponent } from './modules/menu/crear-clase.component';
import { ClasesProfesorComponent } from './modules/menu/clases-profesor.component';
import { ClasesAdminComponent } from './modules/menu/clases-admin.component';
import { UsuarioBonosComponent } from './modules/menu/bonos-usuario.component';
import { UsuarioReservasComponent } from './modules/menu/reservas-usuario.component';
import { UsuarioPagosComponent } from './modules/menu/pagos-usuario.component';
import { ClasesReservaComponent } from './modules/menu/reservar-clase.component';
import { PagosComponent } from './modules/menu/gestion-pagos';



export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  {
    
  path: 'menu5',
  component: AppShellComponent,
  canActivate: [AuthGuard],
  children: [
    // 👇 redirección por defecto al entrar a /menu5
    { path: '', redirectTo: 'reservasclase', pathMatch: 'full' },

    // 🔒 rutas solo para ADMIN o TEACHER
    {
      path: '',
      canMatch: [canMatchRoles(['ROLE_ADMIN','ROLE_TEACHER'])],
      children: [
        { path: 'crear', component: CrearClaseComponent },
        { path: 'admin', component: ClasesAdminComponent },
        { path: 'profe', component: ClasesProfesorComponent },
        { path: 'pagos', component: PagosComponent },
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