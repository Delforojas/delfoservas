import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root' 
})
export class NavigationService {
  constructor(private router: Router) {}

  
  goTo(path: string): void {
    this.router.navigateByUrl(path);
  }

 goToRole(role: string): void {
  if (role === 'ROLE_ADMIN') {
    this.goTo('/admin');
  } else if (role === 'ROLE_TEACHER') {
    this.goTo('/teacher');
  } else {
    this.goTo('/user'); 
}
 }
}