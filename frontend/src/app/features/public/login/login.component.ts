import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <div class="header-content">
            <mat-icon class="lock-icon" color="primary">lock</mat-icon>
            <mat-card-title>Acessar Conta</mat-card-title>
            <mat-card-subtitle>Bem-vindo de volta ao PlacaSegura</mat-card-subtitle>
          </div>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>E-mail</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input matInput formControlName="email" type="email" placeholder="exemplo@email.com">
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">E-mail é obrigatório</mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">E-mail inválido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Senha</mat-label>
              <mat-icon matPrefix>lock</mat-icon>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button" tabindex="-1">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Senha é obrigatória</mat-error>
            </mat-form-field>

            <div class="forgot-password">
              <a routerLink="/forgot-password" class="link-small">Esqueci minha senha</a>
            </div>

            <div class="actions">
              <button mat-flat-button color="primary" type="submit" [disabled]="loginForm.invalid || loading" class="full-width submit-btn">
                <span *ngIf="!loading">Entrar</span>
                <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              </button>
            </div>
          </form>

          <div class="divider-container">
            <mat-divider></mat-divider>
            <span class="divider-text">OU</span>
          </div>

          <button mat-stroked-button class="full-width google-btn" (click)="loginWithGoogle()" [disabled]="loading">
            <mat-icon>login</mat-icon> Entrar com Google
          </button>

          <p class="footer-text">
            Não tem uma conta? <a routerLink="/register">Cadastrar-se</a>
          </p>
        </mat-card-content>
        <mat-progress-bar mode="indeterminate" *ngIf="loading" class="card-loader"></mat-progress-bar>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container { 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      min-height: 100vh; 
      padding: 20px; 
      background-color: #fafafa;
    }
    .login-card { 
      max-width: 400px; 
      width: 100%; 
      border-radius: 16px; 
      box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
      overflow: hidden;
    }
    .header-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 24px;
      text-align: center;
      width: 100%;
    }
    .lock-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
    .full-width { width: 100%; }
    .forgot-password { text-align: right; margin-bottom: 16px; margin-top: -8px; }
    .link-small { font-size: 0.85rem; text-decoration: none; color: #3f51b5; }
    .link-small:hover { text-decoration: underline; }
    
    .actions { margin-bottom: 16px; }
    .submit-btn { height: 48px; font-size: 1rem; }
    
    .divider-container { position: relative; margin: 24px 0; text-align: center; }
    .divider-text { 
      position: absolute; top: -10px; left: 50%; transform: translateX(-50%); 
      background: white; padding: 0 10px; color: #888; font-size: 0.8rem; 
    }
    
    .google-btn { height: 48px; margin-bottom: 16px; color: #555; }
    .footer-text { text-align: center; margin-top: 16px; font-size: 0.9rem; color: #666; }
    .footer-text a { color: #3f51b5; text-decoration: none; font-weight: 500; }
    .footer-text a:hover { text-decoration: underline; }
    
    .card-loader { position: absolute; bottom: 0; left: 0; right: 0; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = false;
  hidePassword = true;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onLogin() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Login realizado com sucesso!', 'OK', { duration: 3000 });
        this.router.navigate(['/app/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || 'Erro ao realizar login.';
        this.snackBar.open(msg, 'Fechar', { duration: 3000 });
      }
    });
  }

  loginWithGoogle() {
    this.loading = true;
    // Mocking Google Login for MVP
    setTimeout(() => {
      this.authService.socialLogin('google', 'mock_token').subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Login realizado com Google!', 'OK', { duration: 3000 });
          this.router.navigate(['/app/dashboard']);
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Erro no login social.', 'Fechar', { duration: 3000 });
        }
      });
    }, 1000);
  }
}

