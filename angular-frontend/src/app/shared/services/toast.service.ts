import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  success(arg0: string) {
    throw new Error("Method not implemented.");
  }
  toasts: { message: string; type: 'success' | 'error' | 'info' }[] = [];

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toasts.push({ message, type });
    setTimeout(() => this.removeToast(), 4000);
  }

  removeToast() {
    this.toasts.shift();
  }
}