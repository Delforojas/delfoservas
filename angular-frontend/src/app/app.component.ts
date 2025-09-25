import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsideUsuarioComponent } from './shared/components/aside-usuario.component';
import { AsideProfesorComponent } from './shared/components/aside-profesor.component';
import { HeaderComponent } from './shared/components/header.component'; 
import { AuthService } from './shared/services/auth.service';
import { FooterComponent } from './shared/components/footer.compomonent';
import { ToastComponent } from "./shared/components/toast/toast.component";



@Component({
  selector: 'app-root',
  standalone: true,
   imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    AsideProfesorComponent,
    FooterComponent,
    ToastComponent
],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(public auth: AuthService) {}  
}