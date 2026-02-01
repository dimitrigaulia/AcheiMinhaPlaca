import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AuthService } from '../../../core/services/auth.service';

function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cpf = control.value;
    if (!cpf) return null;
    
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return { invalidCpf: true };
    if (/^(\d)\1+$/.test(cleanCpf)) return { invalidCpf: true };

    let sum = 0;
    let remainder;
    for (let i = 1; i <= 9; i++) sum = sum + parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cleanCpf.substring(9, 10))) return { invalidCpf: true };

    sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cleanCpf.substring(10, 11))) return { invalidCpf: true };

    return null;
  };
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirm = control.get('confirmPassword');
  return password && confirm && password.value !== confirm.value ? { passwordMismatch: true } : null;
}

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
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <div class="header-content">
            <mat-icon class="header-icon" color="primary">person_add</mat-icon>
            <mat-card-title>Criar sua conta</mat-card-title>
            <mat-card-subtitle>Preencha seus dados para começar</mat-card-subtitle>
          </div>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onRegister()">
            
            <div class="form-grid">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nome Completo (Opcional)</mat-label>
                <mat-icon matPrefix>badge</mat-icon>
                <input matInput formControlName="fullName" placeholder="Seu nome completo">
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>E-mail</mat-label>
                <mat-icon matPrefix>email</mat-icon>
                <input matInput formControlName="email" type="email">
                <mat-error *ngIf="registerForm.get('email')?.hasError('required')">Obrigatório</mat-error>
                <mat-error *ngIf="registerForm.get('email')?.hasError('email')">E-mail inválido</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Senha</mat-label>
                <mat-icon matPrefix>lock</mat-icon>
                <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button" tabindex="-1">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="registerForm.get('password')?.hasError('required')">Obrigatório</mat-error>
                <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">Mínimo 8 caracteres</mat-error>
                <mat-error *ngIf="registerForm.get('password')?.hasError('pattern')">Requer letra, número e especial</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Confirmar Senha</mat-label>
                <mat-icon matPrefix>lock_reset</mat-icon>
                <input matInput [type]="hideConfirmPassword ? 'password' : 'text'" formControlName="confirmPassword">
                 <button mat-icon-button matSuffix (click)="hideConfirmPassword = !hideConfirmPassword" type="button" tabindex="-1">
                  <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched">
                  Senhas não conferem
                </mat-error>
              </mat-form-field>
            </div>

            <div class="terms-container">
              <mat-checkbox formControlName="termsAccepted" color="primary">
                Li e aceito os <a href="#" (click)="$event.preventDefault()">Termos de Uso</a> e Política de Privacidade.
              </mat-checkbox>
              <mat-error *ngIf="registerForm.get('termsAccepted')?.hasError('required') && registerForm.get('termsAccepted')?.touched" class="terms-error">
                Você deve aceitar os termos.
              </mat-error>
            </div>

            <div class="actions">
              <button mat-flat-button color="primary" type="submit" [disabled]="registerForm.invalid || loading" class="submit-btn">
                Criar Conta
              </button>
            </div>
          </form>

          <div class="divider-container">
            <mat-divider></mat-divider>
            <span class="divider-text">OU</span>
          </div>

          <button mat-stroked-button class="full-width google-btn" (click)="loginWithGoogle()" [disabled]="loading">
            <mat-icon>login</mat-icon>
            Entrar com Google
          </button>

          <p class="footer-text">
            Já tem uma conta? <a routerLink="/login">Entrar</a>
          </p>
        </mat-card-content>
        <mat-progress-bar mode="indeterminate" *ngIf="loading" class="card-loader"></mat-progress-bar>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container { 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      padding: 40px 16px; 
      background-color: #fafafa;
      min-height: 100vh;
    }
    .register-card { 
      max-width: 600px; 
      width: 100%; 
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    .header-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 100%;
      margin-bottom: 24px;
    }
    .header-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }
    @media (min-width: 600px) {
      .form-grid {
        grid-template-columns: 1fr 1fr;
      }
      .full-width { grid-column: 1 / -1; }
    }
    
    .terms-container { margin: 16px 0; }
    .terms-error { font-size: 0.75rem; color: #f44336; margin-left: 12px; display: block; margin-top: 4px; }

    .actions { margin-top: 24px; }
    .submit-btn { width: 100%; height: 48px; font-size: 1.1rem; }

    .divider-container { position: relative; margin: 32px 0 24px; text-align: center; }
    .divider-text { 
      position: absolute; top: -10px; left: 50%; transform: translateX(-50%); 
      background: white; padding: 0 10px; color: #888; font-size: 0.8rem; 
    }
    .google-btn { width: 100%; margin-bottom: 16px; height: 48px; color: #555; }
    
    .footer-text { text-align: center; margin-top: 16px; font-size: 0.9rem; color: #666; }
    .footer-text a { color: #3f51b5; text-decoration: none; font-weight: 500; }
    .footer-text a:hover { text-decoration: underline; }

    .card-loader { position: absolute; bottom: 0; left: 0; right: 0; }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  registerForm = this.fb.group({
    fullName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)]],
    confirmPassword: ['', Validators.required],
    termsAccepted: [false, Validators.requiredTrue]
  }, { validators: passwordMatchValidator });

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.registerForm.value;

    // Clean up data if necessary (remove confirmPassword)
    const { confirmPassword, ...registerData } = formValue;

    this.authService.register(registerData as any).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Conta criada com sucesso!', 'OK', { duration: 3000 });
        this.router.navigate(['/app/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || 'Erro ao criar conta. Verifique os dados.';
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
