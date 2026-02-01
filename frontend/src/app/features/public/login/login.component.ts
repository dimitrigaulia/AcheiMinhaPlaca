import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink, MatCardModule,
    MatButtonModule, MatInputModule, MatFormFieldModule,
    MatProgressBarModule, MatSnackBarModule, MatDividerModule,
    MatIconModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-wrapper">
      <div class="brand-panel">
        <div class="brand-content">
          <div class="logo-area" routerLink="/">
            <mat-icon class="logo-icon">security</mat-icon>
            <span class="logo-text">Placa<span>Segura</span></span>
          </div>
          
          <div class="brand-message">
            <h1>Acesso Seguro à <br>Rede de Proteção.</h1>
            <p>Utilizamos protocolos de criptografia bancária para garantir que suas buscas e devoluções sejam 100% privadas.</p>
          </div>

          <div class="security-badges">
            <div class="badge">
              <mat-icon>verified_user</mat-icon>
              <span>Proteção de Dados LGPD</span>
            </div>
          </div>
        </div>
        <div class="brand-footer">
          &copy; 2026 Sistema de Monitoramento Veicular.
        </div>
      </div>

      <div class="form-panel">
        <div class="form-container">
          <header class="form-header">
            <h2>Bem-vindo de volta</h2>
            <p>Insira suas credenciais para acessar o painel corporativo.</p>
          </header>

          <mat-progress-bar mode="indeterminate" *ngIf="loading" class="form-loader"></mat-progress-bar>

          <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="auth-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>E-mail Corporativo</mat-label>
              <mat-icon matPrefix>alternate_email</mat-icon>
              <input matInput formControlName="email" type="email" placeholder="nome@empresa.com">
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">E-mail institucional inválido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Chave de Acesso</mat-label>
              <mat-icon matPrefix>fingerprint</mat-icon>
              <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password">
              <button mat-icon-button matSuffix (click)="togglePassword()" type="button">
                <mat-icon>{{hidePassword() ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
            </mat-form-field>

            <div class="form-options">
              <a routerLink="/forgot-password" class="forgot-link">Esqueceu a senha?</a>
            </div>

            <button mat-flat-button color="primary" type="submit" 
                    [disabled]="loginForm.invalid || loading" class="submit-btn">
              <span *ngIf="!loading">AUTENTICAR</span>
              <mat-spinner diameter="24" *ngIf="loading"></mat-spinner>
            </button>
          </form>

          <div class="divider-text">
            <span>OU ACESSE COM</span>
          </div>

          <button mat-stroked-button class="google-login-btn" (click)="loginWithGoogle()" [disabled]="loading">
            <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google Logo">
            Entrar com conta Google
          </button>

          <footer class="form-footer">
            Ainda não tem acesso? <a routerLink="/register">Criar conta empresarial</a>
          </footer>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { --primary: #0f172a; --accent: #6366f1; --text-muted: #64748b; }

    .auth-wrapper { display: flex; min-height: 100vh; background: white; }

    /* Painel Esquerdo: Branding */
    .brand-panel {
      flex: 1.2; background: radial-gradient(circle at top left, #1e293b, #0f172a);
      display: flex; flex-direction: column; justify-content: space-between;
      padding: 60px; color: white; position: relative;
    }
    .logo-area { display: flex; align-items: center; gap: 12px; cursor: pointer; }
    .logo-icon { background: var(--accent); color: white; padding: 6px; border-radius: 10px; }
    .logo-text { font-weight: 800; font-size: 1.5rem; letter-spacing: -1px; }
    .logo-text span { color: var(--accent); }

    .brand-message { margin-top: 100px; }
    .brand-message h1 { font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 24px; }
    .brand-message p { font-size: 1.1rem; color: #94a3b8; line-height: 1.6; max-width: 480px; }

    .security-badges { margin-top: 40px; }
    .badge { display: flex; align-items: center; gap: 10px; color: #4ade80; font-weight: 600; font-size: 0.9rem; }

    .brand-footer { color: #475569; font-size: 0.85rem; }

    /* Painel Direito: Formulário */
    .form-panel { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; background: #f8fafc; }
    .form-container { width: 100%; max-width: 420px; }
    
    .form-header { margin-bottom: 40px; }
    .form-header h2 { font-size: 2rem; font-weight: 800; color: var(--primary); margin-bottom: 8px; }
    .form-header p { color: var(--text-muted); font-weight: 500; }

    .auth-form { display: flex; flex-direction: column; gap: 8px; position: relative; }
    .form-loader { position: absolute; top: -10px; left: 0; right: 0; border-radius: 10px; }

    .form-options { display: flex; justify-content: flex-end; margin: -8px 0 24px; }
    .forgot-link { font-size: 0.85rem; color: var(--accent); font-weight: 600; text-decoration: none; }

    .submit-btn { 
      height: 56px; border-radius: 12px; font-weight: 700; font-size: 1rem; 
      letter-spacing: 1px; background: var(--primary);
    }

    .divider-text { 
      text-align: center; margin: 32px 0; border-bottom: 1px solid #e2e8f0; line-height: 0.1em; 
    }
    .divider-text span { background: #f8fafc; padding: 0 15px; color: #94a3b8; font-size: 0.75rem; font-weight: 700; }

    .google-login-btn { 
      width: 100%; height: 56px; border-radius: 12px; border: 1px solid #e2e8f0; 
      background: white; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 12px;
      color: var(--primary); transition: all 0.2s;
    }
    .google-login-btn:hover { background: #f1f5f9; border-color: #cbd5e1; }
    .google-login-btn img { width: 20px; }

    .form-footer { text-align: center; margin-top: 40px; color: var(--text-muted); font-size: 0.9rem; }
    .form-footer a { color: var(--accent); font-weight: 700; text-decoration: none; }

    /* Responsividade */
    @media (max-width: 1024px) {
      .brand-panel { display: none; }
      .form-panel { background: white; }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = false;
  hidePassword = signal(true); // Usando Signal para melhor performance

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  togglePassword() {
    this.hidePassword.set(!this.hidePassword());
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Autenticação confirmada.', 'Sucesso', { 
            duration: 3000, 
            panelClass: ['success-snackbar'] 
        });
        this.router.navigate(['/app/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || 'Falha na autenticação corporativa.';
        this.snackBar.open(msg, 'Fechar', { duration: 5000 });
      }
    });
  }

  loginWithGoogle() {
    this.loading = true;
    setTimeout(() => {
      this.authService.socialLogin('google', 'mock_token').subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/app/dashboard']);
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Erro na integração Google.', 'Fechar', { duration: 3000 });
        }
      });
    }, 1000);
  }
}