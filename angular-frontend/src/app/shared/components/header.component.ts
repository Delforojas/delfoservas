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
 
  
}