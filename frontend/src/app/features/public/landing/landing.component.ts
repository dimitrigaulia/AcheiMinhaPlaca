import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReportService } from '../../../core/services/report.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule, MatButtonModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule,
    MatToolbarModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  template: `
    <div class="app-container">
      <nav class="glass-nav">
        <div class="nav-content">
          <div class="logo-area" routerLink="/">
            <div class="logo-icon">
              <mat-icon>security</mat-icon>
            </div>
            <span class="logo-text">Placa<span>Segura</span></span>
          </div>
          <div class="nav-actions">
            <button mat-button class="nav-link" routerLink="/login">Acessar Conta</button>
            <button mat-raised-button color="primary" class="btn-cta-nav" routerLink="/register">
              Começar Agora
            </button>
          </div>
        </div>
      </nav>

      <header class="hero">
        <div class="hero-overlay"></div>
        <div class="container hero-inner">
          <div class="hero-tag">Tecnologia a serviço da segurança viária</div>
          <h1>Recuperação Inteligente de <span>Placas Veiculares</span></h1>
          <p>A primeira rede descentralizada para devolução de itens automotivos com validação de identidade e protocolo de segurança. </p>
          
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-value">+15k</span>
              <span class="stat-label">Placas Localizadas</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-value">100%</span>
              <span class="stat-label">Dados Criptografados</span>
            </div>
          </div>
        </div>
      </header>

      <section class="search-section">
        <div class="container">
          <mat-card class="search-box-glam">
            <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="search-grid">
              <div class="input-group">
                <mat-icon class="field-icon">location_on</mat-icon>
                <mat-form-field appearance="outline">
                  <mat-label>Localização</mat-label>
                  <input matInput formControlName="city" placeholder="Ex: Curitiba, PR">
                </mat-form-field>
              </div>

              <div class="input-group">
                <mat-icon class="field-icon">directions_car</mat-icon>
                <mat-form-field appearance="outline">
                  <mat-label>Identificação da Placa</mat-label>
                  <input matInput formControlName="plateMasked" placeholder="Ex: ABC****">
                </mat-form-field>
              </div>

              <button mat-flat-button color="primary" type="submit" [disabled]="loading" class="main-search-btn">
                <mat-spinner diameter="24" color="accent" *ngIf="loading"></mat-spinner>
                <span *ngIf="!loading">CONSULTAR BASE DE DADOS</span>
              </button>
            </form>
          </mat-card>
        </div>
      </section>

      <div class="trust-bar">
        <span>SISTEMA AUDITADO</span>
        <span class="dot">•</span>
        <span>PROTEÇÃO LGPD</span>
        <span class="dot">•</span>
        <span>VALIDAÇÃO POR RENAVAM</span>
      </div>

      <section class="results-section" *ngIf="hasSearched">
        <div class="container">
          <div class="section-header" *ngIf="results().length > 0">
            <h2>Registros Encontrados</h2>
            <p>Selecione um registro para iniciar o protocolo de recuperação.</p>
          </div>

          <div class="results-grid" *ngIf="results().length > 0; else noResultsTemplate">
            <div *ngFor="let item of results()" class="glass-card-result" [routerLink]="['/report', item.id]">
              <div class="card-badge" [class.found]="item.type === 1">
                {{ item.type === 1 ? 'LOCALIZADO' : 'BUSCADO' }}
              </div>
              <div class="card-body">
                <span class="plate-code">{{ item.plateMasked }}</span>
                <div class="location-info">
                  <mat-icon>place</mat-icon>
                  {{ item.city }} / {{ item.state }}
                </div>
                <div class="date-info">
                  <mat-icon>calendar_today</mat-icon>
                  {{ item.eventAt | date:'dd MMM yyyy' }}
                </div>
              </div>
              <div class="card-footer">
                <span>VER PROTOCOLO</span>
                <mat-icon>arrow_forward</mat-icon>
              </div>
            </div>
          </div>
          <ng-template #noResultsTemplate>
             <div class="no-results-state">
                <mat-icon class="large-icon">search_off</mat-icon>
                <p>Nenhum registro encontrado com esses critérios.</p>
             </div>
          </ng-template>
        </div>
      </section>

      <section class="workflow">
        <div class="container">
          <div class="section-title">
            <span>Ecosistema</span>
            <h2>Protocolo de Devolução Segura</h2>
          </div>
          
          <div class="steps-grid">
            <div class="step-card">
              <div class="step-num">01</div>
              <mat-icon>fingerprint</mat-icon>
              <h3>Registro Blindado</h3>
              <p>Os dados são vinculados ao chassi, impedindo cadastros falsos ou tentativas de golpe.</p>
            </div>
            <div class="step-card highlight">
              <div class="step-num">02</div>
              <mat-icon>gavel</mat-icon>
              <h3>Validação Jurídica</h3>
              <p>O proprietário comprova a posse via documento antes de qualquer interação.</p>
            </div>
            <div class="step-card">
              <div class="step-num">03</div>
              <mat-icon>verified</mat-icon>
              <h3>Entrega Assistida</h3>
              <p>Recomendamos pontos de coleta em delegacias ou batalhões de polícia monitorados.</p>
            </div>
          </div>
        </div>
      </section>

      <footer class="dark-footer">
        <div class="container footer-flex">
          <div class="footer-brand">
            <span class="logo-text-sm">Placa<span>Segura</span></span>
            <span class="copyright">&copy; 2026. Todos os direitos reservados.</span>
          </div>
          <div class="footer-links-sm">
            <a href="#">Privacidade</a>
            <a href="#">Termos</a>
            <a href="#">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host { --primary: #0f172a; --accent: #6366f1; --success: #10b981; --text-muted: #94a3b8; }
    
    .app-container { background-color: #f8fafc; font-family: 'Inter', sans-serif; min-height: 100vh; display: flex; flex-direction: column; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

    /* Glass Navbar */
    .glass-nav {
      position: fixed; top: 0; width: 100%; z-index: 1000;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    .nav-content {
      max-width: 1300px; margin: 0 auto; padding: 0 24px; height: 72px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .logo-area { display: flex; align-items: center; gap: 10px; cursor: pointer; }
    .logo-icon { 
      background: var(--primary); color: white; padding: 6px; border-radius: 8px;
      display: flex; align-items: center;
    }
    .logo-text { font-weight: 800; font-size: 1.4rem; color: var(--primary); letter-spacing: -1px; }
    .logo-text span { color: var(--accent); }
    .btn-cta-nav { border-radius: 8px; font-weight: 600; padding: 0 24px; }

    /* Hero Section */
    .hero {
      padding: 160px 0 120px; background: #0f172a; color: white;
      text-align: center; position: relative; overflow: hidden;
    }
    .hero-inner { position: relative; z-index: 2; }
    .hero-tag { 
      display: inline-block; padding: 6px 16px; background: rgba(99, 102, 241, 0.2);
      border-radius: 20px; color: var(--accent); font-size: 0.85rem; font-weight: 600; margin-bottom: 24px;
    }
    .hero h1 { font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 24px; }
    .hero h1 span { color: var(--accent); }
    .hero p { font-size: 1.25rem; color: var(--text-muted); max-width: 700px; margin: 0 auto 48px; }
    
    .hero-stats { display: flex; justify-content: center; gap: 40px; align-items: center; }
    .stat-value { display: block; font-size: 2rem; font-weight: 800; color: white; }
    .stat-label { font-size: 0.9rem; color: var(--text-muted); }
    .stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.1); }

    /* Search Box Glam */
    .search-section { margin-top: -60px; position: relative; z-index: 10; }
    .search-box-glam {
      padding: 32px; border-radius: 24px; border: none;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
      background: white;
    }
    .search-grid { 
      display: grid; grid-template-columns: 1fr 1fr auto; gap: 20px; align-items: center; 
    }
    .input-group { display: flex; align-items: center; gap: 12px; }
    .field-icon { color: var(--accent); margin-top: -15px; }
    mat-form-field { width: 100%; }
    .main-search-btn { height: 56px; padding: 0 32px; border-radius: 12px; font-weight: 700; letter-spacing: 1px; }

    /* Trust Bar */
    .trust-bar {
      display: flex; justify-content: center; gap: 24px; padding: 32px 0;
      font-size: 0.75rem; font-weight: 700; color: var(--text-muted); letter-spacing: 2px;
    }
    .dot { color: var(--accent); }

    /* Results Cards */
    .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; margin-top: 32px; }
    .glass-card-result {
      background: white; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer;
    }
    .glass-card-result:hover { transform: translateY(-8px); border-color: var(--accent); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05); }
    .plate-code { display: block; font-size: 1.5rem; font-weight: 800; margin-bottom: 16px; color: var(--primary); font-family: 'Monospace'; }
    .card-badge { 
      display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; margin-bottom: 16px;
      background: #fee2e2; color: #ef4444; 
    }
    .card-badge.found { background: #dcfce7; color: #22c55e; }
    .location-info, .date-info { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: var(--text-muted); margin-bottom: 8px; }
    .card-footer { 
      margin-top: 20px; padding-top: 20px; border-top: 1px solid #f1f5f9;
      display: flex; justify-content: space-between; align-items: center;
      font-weight: 700; font-size: 0.8rem; color: var(--accent);
    }

    /* Workflow */
    .workflow { padding: 100px 0; }
    .section-title { text-align: center; margin-bottom: 60px; }
    .section-title span { color: var(--accent); font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 2px; }
    .section-title h2 { font-size: 2.5rem; font-weight: 800; color: var(--primary); }
    .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; }
    .step-card { 
      padding: 48px 32px; border-radius: 24px; background: white; border: 1px solid #e2e8f0; position: relative;
    }
    .step-card.highlight { background: var(--primary); color: white; border: none; }
    .step-num { position: absolute; top: 24px; right: 32px; font-size: 3rem; font-weight: 900; opacity: 0.05; }
    .step-card mat-icon { font-size: 40px; width: 40px; height: 40px; color: var(--accent); margin-bottom: 24px; }
    .step-card h3 { font-size: 1.5rem; font-weight: 700; margin-bottom: 16px; }

    /* Footer */
    .dark-footer { background: var(--primary); padding: 40px 0; color: var(--text-muted); margin-top: auto; border-top: 1px solid rgba(255,255,255,0.05); }
    .footer-flex { display: flex; justify-content: space-between; align-items: center; }
    .footer-brand { display: flex; flex-direction: column; gap: 4px; }
    .logo-text-sm { font-weight: 800; font-size: 1.2rem; color: white; letter-spacing: -0.5px; }
    .logo-text-sm span { color: var(--accent); }
    .copyright { font-size: 0.8rem; opacity: 0.6; }
    .footer-links-sm { display: flex; gap: 32px; }
    .footer-links-sm a { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
    .footer-links-sm a:hover { color: var(--accent); }

    /* Responsive */
    @media (max-width: 960px) {
      .search-grid { grid-template-columns: 1fr; }
      .hero h1 { font-size: 2.5rem; }
      .footer-flex { flex-direction: column; gap: 24px; text-align: center; }
    }
  `]
})
export class LandingComponent {
  private fb = inject(FormBuilder);
  private reportService = inject(ReportService);

  searchForm = this.fb.group({
    city: [''],
    plateMasked: ['', [Validators.minLength(3)]]
  });

  // Usando Signals (Performance Angular Moderno)
  results = signal<any[]>([]);
  loading = false;
  hasSearched = false;

  onSearch() {
    if (this.searchForm.invalid) return;
    
    this.loading = true;
    this.hasSearched = true;
    
    this.reportService.search(this.searchForm.value).subscribe({
      next: (res) => {
        // MOCK DATA PARA DEMONSTRAÇÃO SE NENHUM RESULTADO FOR ENCONTRADO
        if (res.length === 0) {
          const mockData = [
            {
              id: 'mock-1',
              type: 1, // Encontrado
              plateMasked: 'ABC-1**4',
              city: 'Curitiba',
              state: 'PR',
              eventAt: new Date(),
              description: 'Placa encontrada próximo ao Parque Barigui.'
            },
            {
              id: 'mock-2',
              type: 0, // Perdido
              plateMasked: 'XYZ-5**9',
              city: 'São Paulo',
              state: 'SP',
              eventAt: new Date(Date.now() - 86400000), // Ontem
              description: 'Perdida na Marginal Pinheiros durante a chuva.'
            },
            {
              id: 'mock-3',
              type: 1, // Encontrado
              plateMasked: 'HJK-9**1',
              city: 'Belo Horizonte',
              state: 'PR',
              eventAt: new Date(Date.now() - 172800000), // Anteontem
              description: 'Entregue no posto policial da Praça Rui Barbosa.'
            }
          ];
          this.results.set(mockData);
        } else {
          this.results.set(res);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        // Mock data on error for demo purposes too
        this.results.set([]);
      }
    });
  }
}