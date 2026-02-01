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
          <mat-card-title>Crie sua conta</mat-card-title>
          <mat-card-subtitle>Preencha seus dados para começar</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onRegister()">
            
            <!-- Dados Pessoais -->
            <h3 class="section-title">Dados Pessoais</h3>
            <div class="form-grid">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nome Completo</mat-label>
                <input matInput formControlName="fullName" placeholder="Seu nome completo">
                <mat-error *ngIf="registerForm.get('fullName')?.hasError('required')">Obrigatório</mat-error>
                <mat-error *ngIf="registerForm.get('fullName')?.hasError('minlength')">Mínimo 5 caracteres</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>CPF</mat-label>
                <input matInput formControlName="cpf" placeholder="000.000.000-00" maxlength="14">
                <mat-error *ngIf="registerForm.get('cpf')?.hasError('required')">Obrigatório</mat-error>
                <mat-error *ngIf="registerForm.get('cpf')?.hasError('invalidCpf')">CPF inválido</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Data de Nascimento</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="birthDate">
                <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error *ngIf="registerForm.get('birthDate')?.hasError('required')">Obrigatório</mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Celular</mat-label>
                <input matInput formControlName="phoneNumber" placeholder="(XX) XXXXX-XXXX">
                <mat-error *ngIf="registerForm.get('phoneNumber')?.hasError('required')">Obrigatório</mat-error>
              </mat-form-field>
            </div>

            <!-- Endereço -->
            <h3 class="section-title">Endereço</h3>
            <div class="form-grid address-grid">
              <mat-form-field appearance="outline" class="cep-field">
                <mat-label>CEP</mat-label>
                <input matInput formControlName="zipCode" placeholder="00000-000">
                <mat-error *ngIf="registerForm.get('zipCode')?.hasError('required')">Obrigatório</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="street-field">
                <mat-label>Logradouro</mat-label>
                <input matInput formControlName="street">
                <mat-error *ngIf="registerForm.get('street')?.hasError('required')">Obrigatório</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Número</mat-label>
                <input matInput formControlName="number">
                <mat-error *ngIf="registerForm.get('number')?.hasError('required')">Obrigatório</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Complemento</mat-label>
                <input matInput formControlName="complement">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Bairro</mat-label>
                <input matInput formControlName="neighborhood">
                <mat-error *ngIf="registerForm.get('neighborhood')?.hasError('required')">Obrigatório</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Cidade</mat-label>
                <input matInput formControlName="city">
                <mat-error *ngIf="registerForm.get('city')?.hasError('required')">Obrigatório</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Estado</mat-label>
                <input matInput formControlName="state" placeholder="UF" maxlength="2">
                <mat-error *ngIf="registerForm.get('state')?.hasError('required')">Obrigatório</mat-error>
              </mat-form-field>
            </div>

            <!-- Acesso -->
            <h3 class="section-title">Dados de Acesso</h3>
            <div class="form-grid">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>E-mail</mat-label>
                <input matInput formControlName="email" type="email">
                <mat-error *ngIf="registerForm.get('email')?.hasError('required')">Obrigatório</mat-error>
                <mat-error *ngIf="registerForm.get('email')?.hasError('email')">E-mail inválido</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Senha</mat-label>
                <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="registerForm.get('password')?.hasError('required')">Obrigatório</mat-error>
                <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">Mínimo 8 caracteres</mat-error>
                <mat-error *ngIf="registerForm.get('password')?.hasError('pattern')">Requer letra, número e especial</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Confirmar Senha</mat-label>
                <input matInput [type]="hideConfirmPassword ? 'password' : 'text'" formControlName="confirmPassword">
                 <button mat-icon-button matSuffix (click)="hideConfirmPassword = !hideConfirmPassword" type="button">
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
            <mat-icon>login</mat-icon> <!-- Placeholder for Google Icon -->
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
    .register-container { 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      padding: 40px 16px; 
      background-color: #f5f5f5;
      min-height: 100vh;
    }
    .register-card { 
      max-width: 800px; 
      width: 100%; 
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    mat-card-header {
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 16px;
    }
    .section-title {
      font-size: 1rem;
      font-weight: 500;
      color: #333;
      margin: 16px 0 8px;
      border-left: 4px solid #3f51b5;
      padding-left: 8px;
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
      .address-grid {
        grid-template-columns: 1fr 1fr 1fr;
      }
      .cep-field { grid-column: span 1; }
      .street-field { grid-column: span 2; }
    }
    .full-width { grid-column: 1 / -1; width: 100%; }
    
    .terms-container { margin: 16px 0; }
    .terms-error { font-size: 0.75rem; color: #f44336; margin-left: 12px; }

    .actions { display: flex; justify-content: center; margin-top: 24px; }
    .submit-btn { width: 100%; max-width: 300px; padding: 24px; font-size: 1.1rem; }

    .divider-container { position: relative; margin: 32px 0 24px; text-align: center; }
    .divider-text { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: white; padding: 0 10px; color: #888; font-size: 0.8rem; }
    .google-btn { width: 100%; margin-bottom: 16px; padding: 20px; }
    .footer-text { text-align: center; margin-top: 16px; font-size: 0.9rem; }
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
    fullName: ['', [Validators.required, Validators.minLength(5)]],
    cpf: ['', [Validators.required, cpfValidator()]],
    birthDate: ['', Validators.required],
    phoneNumber: ['', Validators.required], // Mask logic should be in directive, simplified here
    
    zipCode: ['', Validators.required],
    street: ['', Validators.required],
    number: ['', Validators.required],
    complement: [''],
    neighborhood: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],

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
