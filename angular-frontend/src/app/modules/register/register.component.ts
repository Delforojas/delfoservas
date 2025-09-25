import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../shared/services/toast.service';
import { handleHttpError } from '../../shared/utils/http-error';
import { showToast } from '../../shared/utils/test-messages';
import { NavigationService } from '../../shared/services/navigation.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class RegisterComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast : ToastService,
    private navigation: NavigationService
  ) {
    this.form = this.fb.group({
      nombre: [''],
      email: [''],
      password: ['']
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.auth.register(this.form.value).subscribe({
      next: () => {
        showToast(this.toast, 'registerSuccess');
        this.navigation.goTo ('login')
      },
      error: (err: HttpErrorResponse) => {
        handleHttpError(err, this.toast, this.form);
        },
      });
  }
}