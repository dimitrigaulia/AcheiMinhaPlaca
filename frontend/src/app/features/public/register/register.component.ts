import { Component, inject } from '@angular/core';
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
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDividerModule,
    MatIconModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Criar Conta</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onRegister()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nome Completo</mat-label>
              <input matInput formControlName="fullName" placeholder="Ex: João Silva">
              <mat-error *ngIf="registerForm.get('fullName')?.hasError('required')">Nome é obrigatório</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>E-mail</mat-label>
              <input matInput formControlName="email" type="email" placeholder="exemplo@email.com">
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">E-mail é obrigatório</mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">E-mail inválido</mat-error>
            </mat-form-field>

            <div class="actions">
              <button mat-flat-button color="primary" type="submit" [disabled]="registerForm.invalid || loading">
                Cadastrar
              </button>
            </div>
          </form>

          <div class="divider-container">
            <mat-divider></mat-divider>
            <span class="divider-text">OU</span>
          </div>

          <button mat-stroked-button class="full-width google-btn" (click)="loginWithGoogle()" [disabled]="loading">
            <mat-icon svgIcon="google_icon" *ngIf="false"></mat-icon> <!-- Add icon if available -->
            Entrar com Google
          </button>

          <p class="footer-text">
            Já tem uma conta? <a routerLink="/login">Entrar</a>
          </p>
        </mat-card-content>
        <mat-progress-bar mode="indeterminate" *ngIf="loading"></mat-progress-bar>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container { display: flex; justify-content: center; align-items: center; padding: 40px 16px; }
    .login-card { max-width: 400px; width: 100%; }
    .full-width { width: 100%; }
    .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
    .divider-container { position: relative; margin: 24px 0; text-align: center; }
    .divider-text { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: white; padding: 0 10px; color: #888; font-size: 0.8rem; }
    .google-btn { margin-bottom: 16px; }
    .footer-text { text-align: center; margin-top: 16px; font-size: 0.9rem; }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = false;

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    fullName: ['', Validators.required]
  });

  onRegister() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    const { email, fullName } = this.registerForm.value;

    this.authService.register(email!, fullName!).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Conta criada com sucesso!', 'OK', { duration: 3000 });
        this.router.navigate(['/app/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open('Erro ao criar conta. E-mail já pode estar em uso.', 'Fechar', { duration: 3000 });
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
