import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReportService } from '../../../core/services/report.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="search-container">
      <h2>Buscar Placas</h2>
      
      <mat-card class="search-card">
        <mat-card-content>
          <form [formGroup]="searchForm" (ngSubmit)="onSearch()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Cidade</mat-label>
                <input matInput formControlName="city">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Placa (parcial)</mat-label>
                <input matInput formControlName="plateMasked" placeholder="ABC1***">
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Data Inicial</mat-label>
                <input matInput [matDatepicker]="pickerFrom" formControlName="dateFrom">
                <mat-datepicker-toggle matIconSuffix [for]="pickerFrom"></mat-datepicker-toggle>
                <mat-datepicker #pickerFrom></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Data Final</mat-label>
                <input matInput [matDatepicker]="pickerTo" formControlName="dateTo">
                <mat-datepicker-toggle matIconSuffix [for]="pickerTo"></mat-datepicker-toggle>
                <mat-datepicker #pickerTo></mat-datepicker>
              </mat-form-field>
            </div>

            <div class="actions">
              <button mat-flat-button color="primary" type="submit" [disabled]="loading">
                <mat-icon>search</mat-icon> Buscar
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <div class="results-grid" *ngIf="results.length > 0">
        <mat-card *ngFor="let item of results" class="result-card" [routerLink]="['/report', item.id]">
          <mat-card-header>
            <div mat-card-avatar class="avatar">
              <mat-icon>{{ item.type === 'Lost' ? 'search_off' : 'check_circle' }}</mat-icon>
            </div>
            <mat-card-title>{{ item.plateMasked }}</mat-card-title>
            <mat-card-subtitle>{{ item.city }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Data: {{ item.eventAt | date:'short' }}</p>
            <p *ngIf="item.description" class="truncate">{{ item.description }}</p>
          </mat-card-content>
        </mat-card>
      </div>
      
      <div *ngIf="hasSearched && results.length === 0" class="no-results">
        <p>Nenhum resultado encontrado.</p>
      </div>
    </div>
  `,
  styles: [`
    .search-container { padding: 16px; max-width: 900px; margin: 0 auto; }
    .search-card { margin-bottom: 24px; }
    .form-row { display: flex; gap: 16px; flex-wrap: wrap; }
    .form-row mat-form-field { flex: 1; min-width: 200px; }
    .actions { display: flex; justify-content: flex-end; }
    .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .result-card { cursor: pointer; transition: transform 0.2s; }
    .result-card:hover { transform: translateY(-2px); }
    .avatar { display: flex; justify-content: center; align-items: center; background: #eee; border-radius: 50%; }
    .no-results { text-align: center; color: #777; margin-top: 32px; }
    .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  `]
})
export class SearchComponent {
  private fb = inject(FormBuilder);
  private reportService = inject(ReportService);

  searchForm = this.fb.group({
    city: [''],
    plateMasked: [''],
    dateFrom: [null],
    dateTo: [null]
  });

  results: any[] = [];
  loading = false;
  hasSearched = false;

  onSearch() {
    this.loading = true;
    this.hasSearched = true;
    
    // Convert dates to ISO string if present
    const formVal = this.searchForm.value;
    const params: any = { ...formVal };
    if (formVal.dateFrom) params.dateFrom = (formVal.dateFrom as Date).toISOString();
    if (formVal.dateTo) params.dateTo = (formVal.dateTo as Date).toISOString();

    this.reportService.search(params).subscribe({
      next: (res) => {
        this.results = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.results = [];
      }
    });
  }
}
