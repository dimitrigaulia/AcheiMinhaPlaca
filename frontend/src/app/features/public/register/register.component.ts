import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

// Validador de Senhas Iguais
const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirm = control.get('confirmPassword');
  return password && confirm && password.value !== confirm.value ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink, MatButtonModule,
    MatInputModule, MatFormFieldModule, MatProgressBarModule,
    MatSnackBarModule, MatDividerModule, MatIconModule,
    MatCheckboxModule, MatProgressSpinnerModule
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
            <div class="tag">CONTA CORPORATIVA</div>
            <h1>Junte-se à maior rede de <span>proteção veicular.</span></h1>
            <p>Cadastre-se para monitorar perdas, achados e receber alertas em tempo real sobre seus veículos.</p>
          </div>

          <div class="features-list">
            <div class="feature-item">
              <mat-icon>verified</mat-icon>
              <div>
                <strong>Identidade Validada</strong>
                <span>Processo rigoroso contra fraudes.</span>
              </div>
            </div>
            <div class="feature-item">
              <mat-icon>history_edu</mat-icon>
              <div>
                <strong>Histórico de Recuperação</strong>
                <span>Acompanhe o status de cada item reportado.</span>
              </div>
            </div>
          </div>
        </div>
        <div class="brand-footer">
          Infraestrutura segura protegida por AES-256.
        </div>
      </div>

      <div class="form-panel">
        <div class="form-container">
          <header class="form-header">
            <h2>Criar nova conta</h2>
            <p>Preencha os dados institucionais para começar.</p>
          </header>

          <mat-progress-bar mode="indeterminate" *ngIf="loading" class="form-loader"></mat-progress-bar>

          <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="auth-form">
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nome Completo</mat-label>
              <mat-icon matPrefix>person</mat-icon>
              <input matInput formControlName="fullName" placeholder="Ex: João Silva">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>E-mail Profissional</mat-label>
              <mat-icon matPrefix>mail</mat-icon>
              <input matInput formControlName="email" type="email" placeholder="nome@empresa.com">
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">E-mail inválido</mat-error>
            </mat-form-field>

            <div class="form-grid-row">
              <mat-form-field appearance="outline">
                <mat-label>Senha</mat-label>
                <mat-icon matPrefix>lock</mat-icon>
                <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password">
                <button mat-icon-button matSuffix (click)="togglePassword('pass')" type="button">
                  <mat-icon>{{hidePassword() ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-hint>Mín. 8 caracteres e símbolos</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Confirmar</mat-label>
                <mat-icon matPrefix>shield</mat-icon>
                <input matInput [type]="hideConfirmPassword() ? 'password' : 'text'" formControlName="confirmPassword">
                <button mat-icon-button matSuffix (click)="togglePassword('conf')" type="button">
                  <mat-icon>{{hideConfirmPassword() ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
              </mat-form-field>
            </div>

            <div class="terms-area">
              <mat-checkbox formControlName="termsAccepted" color="primary">
                Eu concordo com os <a href="#">Termos de Serviço</a> e a <a href="#">Política de Privacidade</a>.
              </mat-checkbox>
            </div>

            <button mat-flat-button color="primary" type="submit" 
                    [disabled]="registerForm.invalid || loading" class="submit-btn">
              <span *ngIf="!loading">FINALIZAR CADASTRO</span>
              <mat-spinner diameter="24" *ngIf="loading"></mat-spinner>
            </button>
          </form>

          <div class="divider-text">
            <span>OU CADASTRE COM</span>
          </div>

          <button mat-stroked-button class="google-btn" (click)="loginWithGoogle()">
            <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google">
            Registrar com Google
          </button>

          <footer class="form-footer">
            Já possui acesso? <a routerLink="/login">Fazer Login</a>
          </footer>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { --primary: #0f172a; --accent: #6366f1; --text-muted: #64748b; }

    .auth-wrapper { display: flex; min-height: 100vh; background: white; }

    /* Lado Esquerdo - Branding */
    .brand-panel {
      flex: 1.1; background: #0f172a; padding: 60px; color: white;
      display: flex; flex-direction: column; justify-content: space-between;
      border-right: 1px solid rgba(255,255,255,0.05);
    }
    .logo-area { display: flex; align-items: center; gap: 12px; cursor: pointer; }
    .logo-icon { background: var(--accent); color: white; padding: 6px; border-radius: 10px; }
    .logo-text { font-weight: 800; font-size: 1.5rem; letter-spacing: -1px; }
    .logo-text span { color: var(--accent); }

    .brand-message { margin-top: 60px; }
    .tag { font-size: 0.7rem; font-weight: 800; color: var(--accent); letter-spacing: 2px; margin-bottom: 16px; }
    .brand-message h1 { font-size: 3rem; font-weight: 800; line-height: 1.1; margin-bottom: 20px; }
    .brand-message h1 span { color: var(--accent); }
    .brand-message p { color: #94a3b8; font-size: 1.1rem; line-height: 1.6; max-width: 440px; }

    .features-list { margin-top: 48px; display: flex; flex-direction: column; gap: 32px; }
    .feature-item { display: flex; gap: 16px; align-items: flex-start; }
    .feature-item mat-icon { color: var(--accent); font-size: 28px; width: 28px; height: 28px; }
    .feature-item strong { display: block; font-size: 1rem; margin-bottom: 4px; }
    .feature-item span { color: #64748b; font-size: 0.9rem; }

    .brand-footer { color: #475569; font-size: 0.8rem; }

    /* Lado Direito - Form */
    .form-panel { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; background: #f8fafc; }
    .form-container { width: 100%; max-width: 480px; }

    .form-header { margin-bottom: 32px; }
    .form-header h2 { font-size: 2rem; font-weight: 800; color: var(--primary); margin-bottom: 8px; }
    .form-header p { color: var(--text-muted); }

    .auth-form { display: flex; flex-direction: column; gap: 4px; position: relative; }
    .form-loader { position: absolute; top: -20px; left: 0; right: 0; }

    .form-grid-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .full-width { width: 100%; }

    .terms-area { margin: 12px 0 24px; }
    .terms-area a { color: var(--accent); font-weight: 600; text-decoration: none; }
    ::ng-deep .mat-mdc-checkbox-label { font-size: 0.85rem !important; color: var(--text-muted) !important; }

    .submit-btn { height: 56px; border-radius: 12px; font-weight: 700; font-size: 1rem; background: var(--primary); margin-top: 8px; }

    .divider-text { text-align: center; margin: 32px 0; border-bottom: 1px solid #e2e8f0; line-height: 0.1em; }
    .divider-text span { background: #f8fafc; padding: 0 15px; color: #94a3b8; font-size: 0.7rem; font-weight: 800; }

    .google-btn { 
      width: 100%; height: 56px; border-radius: 12px; background: white; font-weight: 600;
      display: flex; align-items: center; justify-content: center; gap: 12px; border: 1px solid #e2e8f0;
    }
    .google-btn img { width: 20px; }

    .form-footer { text-align: center; margin-top: 32px; font-size: 0.9rem; color: var(--text-muted); }
    .form-footer a { color: var(--accent); font-weight: 700; text-decoration: none; }

    /* Mobile */
    @media (max-width: 1024px) {
      .brand-panel { display: none; }
      .form-panel { background: white; padding: 24px; }
      .form-grid-row { grid-template-columns: 1fr; }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = false;
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  registerForm = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required, 
      Validators.minLength(8), 
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    ]],
    confirmPassword: ['', Validators.required],
    termsAccepted: [false, Validators.requiredTrue]
  }, { validators: passwordMatchValidator });

  togglePassword(type: 'pass' | 'conf') {
    if (type === 'pass') this.hidePassword.set(!this.hidePassword());
    else this.hideConfirmPassword.set(!this.hideConfirmPassword());
  }

  onRegister() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    const { confirmPassword, ...registerData } = this.registerForm.value;

    this.authService.register(registerData as any).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Conta corporativa criada!', 'Sucesso', { duration: 3000 });
        this.router.navigate(['/app/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || 'Falha ao processar cadastro.';
        this.snackBar.open(msg, 'Erro', { duration: 5000 });
      }
    });
  }

  loginWithGoogle() {
    // Mesma lógica de mock do login
  }
}