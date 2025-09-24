import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'; 
import { ToastService } from '../../shared/services/toast.service';




@Component({
 selector: 'app-login',
 standalone: true,
 templateUrl: './login.html',
 imports:[FormsModule, ReactiveFormsModule, RouterModule ],


})
export class LoginComponent {
 form: FormGroup;


 constructor(private fb: FormBuilder, private auth: AuthService, private router: Router ,private toast: ToastService) {
   this.form = this.fb.group({
     email: ['', [Validators.required, Validators.email]],
     password: ['', Validators.required]
   });
 }


 submit(): void {
   this.auth.login(this.form.value).subscribe({
     next: res => {
       localStorage.setItem('token', res.token);

      this.toast.showToast(`¡Bienvenido, ${this.form.value.email}!`, 'success');

       this.router.navigate(['/dashboard']);
     },
     error: err => {
        this.toast.showToast(err.error.message || 'Error al iniciar sesión', 'error');
      }
   });
 }
}
