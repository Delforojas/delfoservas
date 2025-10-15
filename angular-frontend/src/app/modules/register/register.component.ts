import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../shared/services/auth.service';
import { UsersService } from '../../shared/services/user.service';
import { ToastService } from '../../shared/services/toast.service';
import { NavigationService } from '../../shared/services/navigation.service';
import { handleHttpError } from '../../shared/utils/http-error';
import { showToast } from '../../shared/utils/test-messages';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class RegisterComponent {
  form: FormGroup;
  selectedFile?: File;
  previewUrl?: string; // 👈 Nueva variable para mostrar la imagen

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService,
    private navigation: NavigationService,
    private user: UsersService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      avatar: [null],
    },
  { validators: this.passwordMatchValidator });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;

      // ⚡ Generamos la previsualización
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = e.target?.result as string;
      reader.readAsDataURL(file);

      console.log('📸 Archivo seleccionado:', file.name);
    } else {
      this.selectedFile = undefined;
      this.previewUrl = undefined;
      console.log('⚠️ No se seleccionó ningún archivo');
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    const formData = new FormData();
    formData.append('nombre', this.form.get('nombre')?.value);
    formData.append('email', this.form.get('email')?.value);
    formData.append('password', this.form.get('password')?.value);

    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile);
    }

    this.user.register(formData).subscribe({
      next: () => {
        showToast(this.toast, 'registerSuccess');
        this.navigation.goTo('login');
      },
      error: (err: HttpErrorResponse) => {
        handleHttpError(err, this.toast, this.form);
      },
    });
  }

clearImage(): void {
  this.selectedFile = undefined;
  this.previewUrl = undefined;
  console.log('🗑️ Imagen eliminada');
}
passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
          const password = control.get('password');
          const confirmPassword = control.get('confirmPassword');
          if (!password || !confirmPassword) return null;
          return password.value === confirmPassword.value ? null : { mismatch: true };
        } 
}