import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Navigation } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { NavigationService } from '../../shared/services/navigation.service';
//import { FooterComponent } from '@shared/components/footer.compomonent';
import { handleHttpError } from '../../shared/utils/http-error';
import { showToast } from '../../shared/utils/test-messages';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,     // ✅ necesario para que routerLink funcione
      // ✅ tu footer reutilizable
  ],
})
export class LoginComponent {
 form: FormGroup;


 constructor(private fb: FormBuilder, private auth: AuthService, private router: Router ,private toast: ToastService,
  public navigation:NavigationService ) {
   this.form = this.fb.group({
     email: ['', [Validators.required, Validators.email]],
     password: ['', Validators.required]
   });
 }
ngOnInit(): void {
   
    localStorage.removeItem('token');
  }

   submit(): void {
    if (this.form.invalid) return;
    this.auth.login(this.form.value).subscribe({
      next: () => {
        showToast(this.toast, 'loginSuccess', this.form.value.email || 'Usuario');
      
        this.navigation.goTo('dashboard');
      },
      error: (err) => handleHttpError(err, this.toast, this.form),
    });
  }
  goToRegister() {
  console.log('Se llamó goToRegister');
  this.navigation.goTo('register');
}
}