import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'; // 👈 Asegura este import



@Component({
 selector: 'app-login',
 standalone: true,
 templateUrl: './login.html',
 imports:[FormsModule, ReactiveFormsModule, RouterModule],


})
export class LoginComponent {
 form: FormGroup;


 constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
   this.form = this.fb.group({
     email: ['', [Validators.required, Validators.email]],
     password: ['', Validators.required]
   });
 }


 submit(): void {
   this.auth.login(this.form.value).subscribe({
     next: res => {
       localStorage.setItem('token', res.token);
       this.router.navigate(['/dashboard']);
     },
     error: err => alert(err.error.message || 'Error al iniciar sesión')
   });
 }
}
