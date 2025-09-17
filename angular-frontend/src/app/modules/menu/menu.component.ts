import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';



@Component({
 selector: 'app-menu',
 standalone: true,
 templateUrl: './menu.html',
 imports:[CommonModule , RouterModule],
})
export class MenuComponent implements OnInit {
 user: any;


 constructor(private auth: AuthService) {}


 ngOnInit(): void {
   this.auth.getUser().subscribe({
     next: data => this.user = data,
     error: () => alert('No autorizado o token inválido')
   });
 }


 logout(): void {
   this.auth.logout();
 }
}
