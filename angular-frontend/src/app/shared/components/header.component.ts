import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { environment } from 'app/environments/environments';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
})
export class HeaderComponent implements OnInit {
  user: any = null;

  constructor(private auth: AuthService) {}
 ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return; 
    
    this.auth.getUser().subscribe({
      next: u => this.user = u,
      error: _ => this.user = null
    });
  }
  logout(): void {
    localStorage.removeItem('token');
    location.href = '/login';
  }
   getAvatarUrl(): string {
    if (!this.user?.avatar) return 'assets/default-avatar.png';

    // Si ya viene con http (por ejemplo, devuelta completa desde el backend)
    if (this.user.avatar.startsWith('http')) {
      return this.user.avatar;
    }

    // Si no, la completamos con la base del backend (que ya tienes en environment)
    return `${environment.base}/${this.user.avatar}`;
  }
  
}