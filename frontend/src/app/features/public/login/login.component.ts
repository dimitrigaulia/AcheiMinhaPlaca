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
    MatIconModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Entrar</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-stepper linear #stepper>
            <!-- Step 1: Email -->
            <mat-step [stepControl]="emailForm">
              <ng-template matStepLabel>E-mail</ng-template>
              <form [formGroup]="emailForm" (ngSubmit)="requestOtp(stepper)">
                <p>Enviaremos um código de acesso para o seu e-mail.</p>
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Seu e-mail</mat-label>
                  <input matInput formControlName="email" type="email" placeholder="exemplo@email.com">
                  <mat-error *ngIf="emailForm.get('email')?.hasError('required')">E-mail é obrigatório</mat-error>
                  <mat-error *ngIf="emailForm.get('email')?.hasError('email')">E-mail inválido</mat-error>
                </mat-form-field>
                <div class="actions">
                  <button mat-flat-button color="primary" type="submit" [disabled]="emailForm.invalid || loading">
                    Receber Código
                  </button>
                </div>
              </form>

              <div class="divider-container">
                <mat-divider></mat-divider>
                <span class="divider-text">OU</span>
              </div>

              <button mat-stroked-button class="full-width google-btn" (click)="loginWithGoogle()" [disabled]="loading">
                Entrar com Google
              </button>

              <p class="footer-text">
                Não tem uma conta? <a routerLink="/register">Cadastrar-se</a>
              </p>
            </mat-step>

            <!-- Step 2: Code -->
            <mat-step [stepControl]="codeForm">
              <ng-template matStepLabel>Código</ng-template>
              <form [formGroup]="codeForm" (ngSubmit)="verifyOtp()">
                <p>Digite o código de 6 dígitos enviado para <strong>{{ emailForm.get('email')?.value }}</strong>.</p>
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Código</mat-label>
                  <input matInput formControlName="code" placeholder="000000" maxlength="6">
                  <mat-error *ngIf="codeForm.get('code')?.hasError('required')">Código é obrigatório</mat-error>
                </mat-form-field>
                <div class="actions">
                  <button mat-button matStepperPrevious type="button">Voltar</button>
                  <button mat-flat-button color="primary" type="submit" [disabled]="codeForm.invalid || loading">
                    Entrar
                  </button>
                </div>
              </form>
            </mat-step>
          </mat-stepper>
        </mat-card-content>
        <mat-progress-bar mode="indeterminate" *ngIf="loading"></mat-progress-bar>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container { display: flex; justify-content: center; align-items: center; padding: 40px 16px; }
    .login-card { max-width: 400px; width: 100%; }
    .full-width { width: 100%; }
    .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
    .divider-container { position: relative; margin: 24px 0; text-align: center; }
    .divider-text { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: white; padding: 0 10px; color: #888; font-size: 0.8rem; }
    .google-btn { margin-bottom: 16px; }
    .footer-text { text-align: center; margin-top: 16px; font-size: 0.9rem; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = false;

  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  codeForm = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  requestOtp(stepper: any) {
    if (this.emailForm.invalid) return;
    
    this.loading = true;
    const email = this.emailForm.get('email')?.value!;
    
    this.authService.requestOtp(email).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Código enviado para seu e-mail!', 'OK', { duration: 3000 });
        stepper.next();
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open('Erro ao solicitar código. Tente novamente.', 'Fechar', { duration: 3000 });
        console.error(err);
      }
    });
  }

  verifyOtp() {
    if (this.codeForm.invalid) return;

    this.loading = true;
    const email = this.emailForm.get('email')?.value!;
    const code = this.codeForm.get('code')?.value!;

    this.authService.verifyOtp(email, code).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Login realizado com sucesso!', 'OK', { duration: 3000 });
        this.router.navigate(['/app/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open('Código inválido ou expirado.', 'Fechar', { duration: 3000 });
        console.error(err);
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

