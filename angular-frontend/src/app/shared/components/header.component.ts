import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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

  constructor(
    private auth: AuthService,
    private router: Router

  ) {}
 ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return; 
    
    this.auth.getUser().subscribe({
      next: u => this.user = u,
      error: _ => this.user = null
    });
  }
  isAuthRoute(): boolean {
    const current = this.router.url;
    return current.includes('/login') || current.includes('/register');
  }
  logout(): void {
    localStorage.removeItem('token');
    location.href = '/login';
  }
 
  
}