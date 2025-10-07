import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
 providedIn: 'root'
})
export class AuthGuard implements CanActivate {
 constructor(private auth: AuthService, private router: Router) {}


 canActivate(): Observable<boolean | UrlTree> {
   const token = localStorage.getItem('token');


   if (!token) {

     return of(this.router.createUrlTree(['/login']));
   }


   return this.auth.getUser().pipe(
     map(user => {
       
       return user; 
     }),
     catchError(() => {
       
       localStorage.removeItem('token');
       return of(this.router.createUrlTree(['/login']));
     })
   );
 }
}
