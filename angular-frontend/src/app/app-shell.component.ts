import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsideUsuarioComponent } from './shared/components/aside-usuario.component';
import { AsideProfesorComponent } from './shared/components/aside-profesor-component';
import { HeaderComponent } from './shared/components/header.component'; 
import { AuthService } from './shared/services/auth.service';
import { FooterComponent } from './shared/components/footer.compomonent';


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