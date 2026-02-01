import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportService } from '../../../../core/services/report.service';
import { UppercaseDirective } from '../../../../shared/directives/uppercase.directive';

@Component({
  selector: 'app-report-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    UppercaseDirective
  ],
  template: `
    <div class="form-container">
      <h2>{{ type === 'Lost' ? 'Perdi uma placa' : 'Encontrei uma placa' }}</h2>
      
      <mat-stepper linear #stepper>
        <!-- Step 1: Basic Info -->
        <mat-step [stepControl]="basicForm">
          <ng-template matStepLabel>Informações Básicas</ng-template>
          <form [formGroup]="basicForm">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Tipo</mat-label>
                <mat-select formControlName="type">
                  <mat-option value="Lost">Perdido (Lost)</mat-option>
                  <mat-option value="Found">Encontrado (Found)</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Placa</mat-label>
                <input matInput formControlName="plate" placeholder="ABC1234" uppercase>
                <mat-error *ngIf="basicForm.get('plate')?.hasError('required')">Placa é obrigatória</mat-error>
              </mat-form-field>
            </div>
            
            <div class="actions">
              <button mat-flat-button color="primary" matStepperNext>Próximo</button>
            </div>
          </form>
        </mat-step>

        <!-- Step 2: Location & Time -->
        <mat-step [stepControl]="locationForm">
          <ng-template matStepLabel>Local e Data</ng-template>
          <form [formGroup]="locationForm">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Cidade</mat-label>
                <input matInput formControlName="city">
                <mat-error *ngIf="locationForm.get('city')?.hasError('required')">Cidade é obrigatória</mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Bairro (opcional)</mat-label>
                <input matInput formControlName="neighborhood">
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Data do Ocorrido</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="eventAt">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descrição (opcional)</mat-label>
              <textarea matInput formControlName="description" rows="3"></textarea>
            </mat-form-field>

            <div class="actions">
              <button mat-button matStepperPrevious>Voltar</button>
              <button mat-flat-button color="primary" matStepperNext>Próximo</button>
            </div>
          </form>
        </mat-step>

        <!-- Step 3: Security / Evidence -->
        <mat-step [stepControl]="securityForm">
          <ng-template matStepLabel>{{ type === 'Lost' ? 'Segurança' : 'Evidência' }}</ng-template>
          <form [formGroup]="securityForm">
            
            <div *ngIf="type === 'Lost'">
              <p class="hint">Para sua segurança e futura validação, informe os <strong>últimos 4 dígitos</strong> do Renavam ou Chassi do veículo.</p>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Segredo (Últimos 4 dígitos)</mat-label>
                <input matInput formControlName="secretLast4" maxlength="4" type="password">
                <mat-error *ngIf="securityForm.get('secretLast4')?.hasError('required')">Obrigatório para validação futura</mat-error>
                <mat-error *ngIf="securityForm.get('secretLast4')?.hasError('pattern')">Deve conter apenas 4 números</mat-error>
              </mat-form-field>
            </div>

            <div *ngIf="type === 'Found'">
              <p class="hint">Adicione uma foto da placa encontrada (opcional, mas recomendado).</p>
              <div class="file-upload">
                <button mat-stroked-button type="button" (click)="fileInput.click()">
                  <mat-icon>cloud_upload</mat-icon> Escolher Foto
                </button>
                <input #fileInput type="file" (change)="onFileSelected($event)" accept="image/*" hidden>
                <span *ngIf="selectedFile">{{ selectedFile.name }}</span>
              </div>
            </div>

            <div class="actions">
              <button mat-button matStepperPrevious>Voltar</button>
              <button mat-flat-button color="primary" matStepperNext>Revisar</button>
            </div>
          </form>
        </mat-step>

        <!-- Step 4: Review -->
        <mat-step>
          <ng-template matStepLabel>Revisão</ng-template>
          <div class="review-content">
            <p><strong>Tipo:</strong> {{ basicForm.value.type }}</p>
            <p><strong>Placa:</strong> {{ basicForm.value.plate }}</p>
            <p><strong>Local:</strong> {{ locationForm.value.city }} - {{ locationForm.value.neighborhood }}</p>
            <p><strong>Data:</strong> {{ locationForm.value.eventAt | date }}</p>
          </div>
          <div class="actions">
            <button mat-button matStepperPrevious>Voltar</button>
            <button mat-flat-button color="accent" (click)="submit()" [disabled]="loading">Confirmar e Criar</button>
          </div>
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: [`
    .form-container { max-width: 800px; margin: 0 auto; padding: 24px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .form-row { display: flex; gap: 16px; flex-wrap: wrap; }
    .form-row mat-form-field { flex: 1; min-width: 200px; }
    .full-width { width: 100%; }
    .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
    .hint { color: #666; margin-bottom: 16px; font-size: 0.9rem; }
    .file-upload { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
    .review-content p { margin-bottom: 8px; }
  `]
})
export class ReportFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reportService = inject(ReportService);
  private snackBar = inject(MatSnackBar);

  loading = false;
  type = 'Lost';
  selectedFile: File | null = null;

  basicForm = this.fb.group({
    type: ['Lost', Validators.required],
    plate: ['', Validators.required]
  });

  locationForm = this.fb.group({
    city: ['', Validators.required],
    neighborhood: [''],
    eventAt: [new Date(), Validators.required],
    description: ['']
  });

  securityForm = this.fb.group({
    secretLast4: [''],
    photo: ['']
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        this.type = params['type'];
        this.basicForm.patchValue({ type: this.type });
        this.updateValidators();
      }
    });

    this.basicForm.get('type')?.valueChanges.subscribe(val => {
      if (val) {
        this.type = val;
        this.updateValidators();
      }
    });
  }

  updateValidators() {
    const secretControl = this.securityForm.get('secretLast4');
    if (this.type === 'Lost') {
      secretControl?.setValidators([Validators.required, Validators.pattern('^[0-9]{4}$')]);
    } else {
      secretControl?.clearValidators();
    }
    secretControl?.updateValueAndValidity();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submit() {
    if (this.basicForm.invalid || this.locationForm.invalid || this.securityForm.invalid) return;
    
    this.loading = true;
    const formData = {
      ...this.basicForm.value,
      ...this.locationForm.value,
      ...this.securityForm.value,
      eventAt: (this.locationForm.value.eventAt as Date).toISOString()
    };

    let obs$;
    if (this.type === 'Lost') {
      obs$ = this.reportService.createLost(formData);
    } else {
      // For Found, we ignore secretLast4
      const { secretLast4, ...foundData } = formData;
      obs$ = this.reportService.createFound(foundData, this.selectedFile!);
    }

    obs$.subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Anúncio criado com sucesso!', 'OK', { duration: 3000 });
        this.router.navigate(['/app/reports']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open('Erro ao criar anúncio.', 'Fechar', { duration: 3000 });
        console.error(err);
      }
    });
  }
}
