import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatIconModule,
    MatToolbarModule,
    MatGridListModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="landing-page">
      <!-- Navbar -->
      <mat-toolbar color="primary" class="navbar">
        <span class="logo">
          <mat-icon>security</mat-icon> PlacaSegura
        </span>
        <span class="spacer"></span>
        <a mat-button routerLink="/login">Entrar</a>
        <a mat-raised-button color="accent" routerLink="/register">Cadastrar</a>
      </mat-toolbar>

      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1>Encontre ou devolva placas de veículos</h1>
          <p class="hero-subtitle">Conectamos quem perdeu com quem encontrou, com total privacidade e segurança.</p>
          <div class="hero-actions">
            <a mat-raised-button color="accent" class="cta-button" routerLink="/register">
              <mat-icon>person_add</mat-icon> Criar Conta Grátis
            </a>
            <a mat-stroked-button class="secondary-button" routerLink="/login">
              <mat-icon>login</mat-icon> Já tenho conta
            </a>
          </div>
        </div>
      </section>

      <!-- Search Section -->
      <section class="search-section">
        <div class="container">
          <h2><mat-icon>search</mat-icon> Busca Rápida</h2>
          <p>Verifique se alguém já encontrou sua placa.</p>
          
          <mat-card class="search-card">
            <mat-card-content>
              <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="search-form">
                <mat-form-field appearance="outline" class="search-field">
                  <mat-label>Cidade</mat-label>
                  <mat-icon matPrefix>location_on</mat-icon>
                  <input matInput formControlName="city" placeholder="Ex: São Paulo">
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="search-field">
                  <mat-label>Placa (parcial)</mat-label>
                  <mat-icon matPrefix>directions_car</mat-icon>
                  <input matInput formControlName="plateMasked" placeholder="Ex: ABC1***">
                </mat-form-field>
                
                <button mat-flat-button color="primary" type="submit" [disabled]="loading" class="search-btn">
                  <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
                  <span *ngIf="!loading">Buscar</span>
                </button>
              </form>
            </mat-card-content>
          </mat-card>

          <!-- Results -->
          <div class="results-container" *ngIf="hasSearched">
            <div *ngIf="results.length > 0; else noResults" class="results-grid">
              <mat-card *ngFor="let item of results" class="result-card" [routerLink]="['/report', item.id]">
                <div class="card-status" [class.found]="item.type === 1">
                  {{ item.type === 1 ? 'ENCONTRADO' : 'PERDIDO' }}
                </div>
                <mat-card-header>
                  <mat-icon mat-card-avatar>{{ item.type === 1 ? 'check_circle' : 'help' }}</mat-icon>
                  <mat-card-title>{{ item.plateMasked }}</mat-card-title>
                  <mat-card-subtitle>{{ item.city }} - {{ item.state }}</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p class="event-date">
                    <mat-icon>event</mat-icon> {{ item.eventAt | date:'shortDate' }}
                  </p>
                </mat-card-content>
                <mat-card-actions align="end">
                  <button mat-button color="primary">VER DETALHES</button>
                </mat-card-actions>
              </mat-card>
            </div>
            <ng-template #noResults>
              <div class="no-results-state" *ngIf="!loading">
                <mat-icon class="large-icon">search_off</mat-icon>
                <p>Nenhum registro encontrado com esses critérios.</p>
              </div>
            </ng-template>
          </div>
        </div>
      </section>

      <!-- How it Works -->
      <section class="features-section">
        <div class="container">
          <h2>Como Funciona</h2>
          <div class="features-grid">
            <mat-card class="feature-card">
              <div class="feature-icon">
                <mat-icon>app_registration</mat-icon>
              </div>
              <mat-card-title>1. Cadastre</mat-card-title>
              <mat-card-content>
                <p>Informe a perda ou o achado de uma placa. Seus dados pessoais ficam protegidos e só são revelados se houver match.</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="feature-card">
              <div class="feature-icon">
                <mat-icon>verified_user</mat-icon>
              </div>
              <mat-card-title>2. Valide</mat-card-title>
              <mat-card-content>
                <p>O dono deve provar que a placa é dele usando um segredo (Renavam/Chassi) antes de abrir contato.</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="feature-card">
              <div class="feature-icon">
                <mat-icon>handshake</mat-icon>
              </div>
              <mat-card-title>3. Recupere</mat-card-title>
              <mat-card-content>
                <p>Combine a entrega em um local seguro (Delegacia ou Posto Policial) através do nosso chat interno.</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <p>&copy; 2026 PlacaSegura. Todos os direitos reservados.</p>
      </footer>
    </div>
  `,
  styles: [`
    .landing-page { display: flex; flex-direction: column; min-height: 100vh; background-color: #fafafa; }
    
    /* Navbar */
    .navbar { position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .logo { display: flex; align-items: center; gap: 8px; font-weight: bold; font-size: 1.2rem; }
    .spacer { flex: 1 1 auto; }
    
    /* Hero Section */
    .hero-section {
      background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
      color: white;
      padding: 100px 20px 120px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .hero-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 60%);
      pointer-events: none;
    }
    .hero-content { max-width: 800px; margin: 0 auto; position: relative; z-index: 1; }
    .hero-content h1 { font-size: 3rem; font-weight: 700; margin-bottom: 24px; line-height: 1.2; letter-spacing: -0.5px; }
    .hero-subtitle { font-size: 1.25rem; opacity: 0.9; margin-bottom: 40px; font-weight: 300; line-height: 1.6; }
    .hero-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
    .cta-button { padding: 0 32px; height: 52px; font-size: 1.1rem; border-radius: 26px; font-weight: 500; }
    .secondary-button { 
      color: white !important; 
      border-color: rgba(255,255,255,0.5) !important; 
      height: 52px; 
      padding: 0 32px; 
      font-size: 1.1rem; 
      border-radius: 26px; 
      background: rgba(255,255,255,0.1); 
      backdrop-filter: blur(10px);
    }
    .secondary-button:hover { background: rgba(255,255,255,0.2); }

    /* Container */
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

    /* Search Section */
    .search-section { padding: 40px 0; margin-top: -60px; position: relative; z-index: 10; }
    .search-section h2 { text-align: center; color: #333; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 500; }
    .search-section p { text-align: center; color: #666; margin-bottom: 24px; font-size: 0.95rem; }
    .search-card { 
      max-width: 900px; 
      margin: 0 auto; 
      border-radius: 16px; 
      overflow: hidden; 
      box-shadow: 0 20px 40px rgba(0,0,0,0.15); 
      background: white;
    }
    .search-form { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; padding: 24px; }
    .search-field { flex: 1; min-width: 250px; margin-bottom: -1.25em; }
    .search-btn { height: 56px; padding: 0 40px; min-width: 140px; margin-top: 4px; border-radius: 28px; font-size: 1.1rem; box-shadow: 0 4px 12px rgba(63, 81, 181, 0.3); }

    /* Features Section */
    .features-section { padding: 100px 0; background-color: #f8f9fa; }
    .features-section h2 { text-align: center; font-size: 2.5rem; margin-bottom: 60px; color: #1a237e; font-weight: 700; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; }
    .feature-card { 
      text-align: center; 
      height: 100%; 
      padding: 40px 24px; 
      border: none; 
      box-shadow: 0 10px 30px rgba(0,0,0,0.05); 
      background: #fff; 
      border-radius: 16px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .feature-card:hover { transform: translateY(-10px); box-shadow: 0 15px 40px rgba(0,0,0,0.1); }
    .feature-icon { 
      width: 80px; height: 80px; background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%); border-radius: 50%; 
      display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; 
      color: #1a237e; 
    }
    .feature-icon mat-icon { font-size: 40px; width: 40px; height: 40px; }
    .feature-card mat-card-title { margin-bottom: 16px; font-weight: 600; }
    
    /* Footer */
    .footer { background: #333; color: #aaa; text-align: center; padding: 24px; margin-top: auto; }

    /* Responsive */
    @media (max-width: 600px) {
      .hero-content h1 { font-size: 2rem; }
      .search-form { flex-direction: column; align-items: stretch; }
      .search-btn { width: 100%; }
      .hero-section { clip-path: none; padding-bottom: 60px; }
      .search-section { margin-top: 0; }
    }
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
    
    // Simulate delay for better UX
    setTimeout(() => {
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
    }, 500);
  }
}
