import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReportService } from '../../../core/services/report.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  template: `
    <div class="hero">
      <h1>Encontre ou devolva placas de veículos</h1>
      <p>Conectamos quem perdeu com quem encontrou, com total privacidade e segurança.</p>
      <div class="cta-group">
        <a mat-flat-button color="primary" routerLink="/login">Começar Agora</a>
        <a mat-stroked-button routerLink="/login">Entrar</a>
      </div>
    </div>

    <div class="how-it-works">
      <h2>Como funciona</h2>
      <div class="steps">
        <mat-card>
          <mat-card-header>
            <mat-card-title>1. Cadastre</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Informe a perda ou o achado de uma placa. Seus dados pessoais ficam protegidos.</p>
          </mat-card-content>
        </mat-card>
        <mat-card>
          <mat-card-header>
            <mat-card-title>2. Valide</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>O dono deve provar que a placa é dele usando um segredo (Renavam/Chassi).</p>
          </mat-card-content>
        </mat-card>
        <mat-card>
          <mat-card-header>
            <mat-card-title>3. Recupere</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Combine a entrega em um local seguro através do nosso chat interno.</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>

    <div class="search-section">
      <h2>Busca Rápida</h2>
      <form [formGroup]="searchForm" (ngSubmit)="onSearch()">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Cidade</mat-label>
            <input matInput formControlName="city" placeholder="Ex: São Paulo">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Placa (parcial)</mat-label>
            <input matInput formControlName="plateMasked" placeholder="Ex: ABC1***">
          </mat-form-field>
          <button mat-flat-button color="primary" type="submit" [disabled]="loading">
            <mat-icon>search</mat-icon> Buscar
          </button>
        </div>
      </form>

      <div class="results" *ngIf="results.length > 0">
        <h3>Resultados encontrados</h3>
        <div class="result-list">
          <mat-card *ngFor="let item of results" class="result-card" [routerLink]="['/report', item.id]">
            <mat-card-header>
              <mat-card-title>{{ item.plateMasked }}</mat-card-title>
              <mat-card-subtitle>{{ item.type }} - {{ item.city }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>Data: {{ item.eventAt | date:'short' }}</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
      
      <div *ngIf="hasSearched && results.length === 0" class="no-results">
        <p>Nenhum resultado encontrado para esta busca.</p>
      </div>
    </div>
  `,
  styles: [`
    .hero { text-align: center; padding: 60px 20px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); margin-bottom: 40px; border-radius: 8px; }
    .hero h1 { font-size: 2.5rem; margin-bottom: 16px; }
    .hero p { font-size: 1.2rem; color: #555; margin-bottom: 32px; }
    .cta-group { display: flex; gap: 16px; justify-content: center; }
    
    .how-it-works { margin-bottom: 60px; }
    .how-it-works h2, .search-section h2 { text-align: center; margin-bottom: 32px; }
    .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; }
    
    .search-section { padding: 40px; background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .form-row { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
    .form-row mat-form-field { flex: 1; min-width: 200px; }
    
    .results { margin-top: 32px; }
    .result-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    .result-card { cursor: pointer; transition: transform 0.2s; }
    .result-card:hover { transform: translateY(-2px); }
    .no-results { text-align: center; margin-top: 24px; color: #777; }
  `]
})
export class LandingComponent {
  private fb = inject(FormBuilder);
  private reportService = inject(ReportService);

  searchForm = this.fb.group({
    city: [''],
    plateMasked: ['']
  });

  results: any[] = [];
  loading = false;
  hasSearched = false;

  onSearch() {
    if (this.searchForm.invalid) return;
    
    this.loading = true;
    this.hasSearched = true;
    this.reportService.search(this.searchForm.value).subscribe({
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
