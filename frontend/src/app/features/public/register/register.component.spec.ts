import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideNativeDateAdapter } from '@angular/material/core';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: any;
  let snackBarSpy: any;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = {
      register: vi.fn(),
      socialLogin: vi.fn()
    };
    snackBarSpy = {
      open: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, BrowserAnimationsModule],
      providers: [
        provideNativeDateAdapter(),
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('cpf validator should reject invalid CPF', () => {
    const cpfControl = component.registerForm.get('cpf');
    cpfControl?.setValue('11111111111'); // Invalid
    expect(cpfControl?.valid).toBeFalsy();
    expect(cpfControl?.errors?.['invalidCpf']).toBeTruthy();
  });

  it('cpf validator should accept valid CPF', () => {
    const cpfControl = component.registerForm.get('cpf');
    cpfControl?.setValue('11144477735'); // Valid
    expect(cpfControl?.valid).toBeTruthy();
  });

  it('password match validator should work', () => {
    component.registerForm.patchValue({
      password: 'Password@123',
      confirmPassword: 'Password@123'
    });
    // Check form group error
    expect(component.registerForm.hasError('passwordMismatch')).toBeFalsy();

    component.registerForm.patchValue({
      confirmPassword: 'Password@124'
    });
    component.registerForm.updateValueAndValidity();
    
    expect(component.registerForm.hasError('passwordMismatch')).toBeTruthy();
  });
});
