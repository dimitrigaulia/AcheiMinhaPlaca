import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dashboard-grid">
      <mat-card class="action-card lost" routerLink="/app/reports/new" [queryParams]="{type: 'Lost'}">
        <mat-card-header>
          <mat-icon mat-card-avatar>search_off</mat-icon>
          <mat-card-title>Perdi uma placa</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Cadastre o desaparecimento da sua placa para que quem encontrar possa devolver.</p>
        </mat-card-content>
      </mat-card>

      <mat-card class="action-card found" routerLink="/app/reports/new" [queryParams]="{type: 'Found'}">
        <mat-card-header>
          <mat-icon mat-card-avatar>check_circle</mat-icon>
          <mat-card-title>Encontrei uma placa</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Cadastre uma placa encontrada para ajudar o dono a recuperá-la.</p>
        </mat-card-content>
      </mat-card>

      <mat-card class="action-card mine" routerLink="/app/reports">
        <mat-card-header>
          <mat-icon mat-card-avatar>list</mat-icon>
          <mat-card-title>Meus Anúncios</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Gerencie seus anúncios ativos, veja status e encerre casos resolvidos.</p>
        </mat-card-content>
      </mat-card>

      <mat-card class="action-card search" routerLink="/app/search">
        <mat-card-header>
          <mat-icon mat-card-avatar>search</mat-icon>
          <mat-card-title>Buscar</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Pesquise por placas perdidas ou encontradas na sua região.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; padding: 24px 0; }
    .action-card { cursor: pointer; transition: transform 0.2s; height: 100%; }
    .action-card:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .action-card mat-icon { background: #eee; padding: 8px; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
  `]
})
export class DashboardComponent {}
