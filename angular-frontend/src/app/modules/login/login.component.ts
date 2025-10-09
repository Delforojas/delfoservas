import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'; 
import { ToastService } from '../../shared/services/toast.service';
import { handleHttpError } from '../../shared/utils/http-error';
import { showToast } from '../../shared/utils/test-messages';
import { NavigationService } from '../../shared/services/navigation.service';
import { FooterComponent } from '@shared/components/footer.compomonent';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
 selector: 'app-login',
 standalone: true,
 templateUrl: './login.html',
 styleUrls: ['./login.component.css'],
 imports:[FormsModule, ReactiveFormsModule, RouterModule ,FooterComponent],


})
export class LoginComponent {
 form: FormGroup;


 constructor(private fb: FormBuilder, private auth: AuthService, private router: Router ,private toast: ToastService,
  private navigation:NavigationService ) {
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
}