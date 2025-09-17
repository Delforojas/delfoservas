import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsideUsuarioComponent } from './modules/menu/aside-usuario.component';
import { AsideProfesorComponent } from './modules/menu/menu5.component';
import { HeaderComponent } from './modules/menu/header.component'; 
import { AuthService } from './shared/services/auth.service';
import { FooterComponent } from './modules/menu/footer.compomonent';


@Component({
  selector: 'app-shell',
  standalone: true,
   imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    AsideUsuarioComponent,
    AsideProfesorComponent,
    FooterComponent
  ],
  templateUrl: './app-shell.component.html'
})
export class AppShellComponent {
  constructor(public auth: AuthService) {}  
}