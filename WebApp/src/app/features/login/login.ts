import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

/**
 * @Component LoginComponent
 * @description Gerencia a tela e a lógica de autenticação do usuário.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  /**
   * @property {FormGroup} loginForm - Formulário reativo para coletar as credenciais do usuário.
   */
  loginForm: FormGroup;

  /**
   * @property {string | null} error - Mensagem de erro a ser exibida em caso de falha no login.
   */
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializa o formulário com valores padrão e validações.
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  /**
   * @method onSubmit
   * @description Método executado ao submeter o formulário de login.
   * Valida o formulário e chama o serviço de autenticação.
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        // Navega para a página principal (dashboard) após o login bem-sucedido.
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error('Erro no login:', err);
        this.error = 'Email ou senha inválidos.';
      }
    });
  }
}