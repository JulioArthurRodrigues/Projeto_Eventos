import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  senha = '';
  erro = signal('');;

  entrar() {
    this.erro.set('');
    this.authService.login(this.email, this.senha).subscribe({
      next: () => {
        this.router.navigate(['/eventos']);
      },
      error: () => {
        this.erro.set('Login inválido');
      }
    });
  }
}
