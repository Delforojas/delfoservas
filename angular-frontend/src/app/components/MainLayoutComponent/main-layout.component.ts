import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';          
import { RouterOutlet } from '@angular/router';         
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent implements OnInit {
  user: any = null;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.getUser().subscribe({
      next: u => this.user = u,        // u.nombre viene del backend
      error: _ => this.user = null     // si el token no vale, no muestra nada
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    location.href = '/login';
  }
}