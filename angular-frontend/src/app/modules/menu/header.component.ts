// src/app/components/header/header.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';

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