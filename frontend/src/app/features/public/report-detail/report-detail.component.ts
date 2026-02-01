import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ReportService } from '../../../core/services/report.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule],
  template: `
    <div class="detail-container" *ngIf="report">
      <mat-card>
        <img mat-card-image *ngIf="report.photoUrl" [src]="getPhotoUrl(report.photoUrl)" alt="Foto da placa">
        <mat-card-header>
          <div mat-card-avatar class="avatar-icon">
            <mat-icon>{{ report.type === 'Lost' ? 'search_off' : 'check_circle' }}</mat-icon>
          </div>
          <mat-card-title>{{ report.plateMasked }}</mat-card-title>
          <mat-card-subtitle>{{ report.type === 'Lost' ? 'Perdido' : 'Encontrado' }} em {{ report.city }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="info-row">
            <strong>Bairro:</strong> {{ report.neighborhood || 'Não informado' }}
          </div>
          <div class="info-row">
            <strong>Data:</strong> {{ report.eventAt | date:'medium' }}
          </div>
          <div class="info-row description" *ngIf="report.description">
            <p>{{ report.description }}</p>
          </div>
          
          <mat-chip-set class="status-chips">
            <mat-chip>{{ report.status }}</mat-chip>
          </mat-chip-set>
        </mat-card-content>
        <mat-card-actions align="end">
          <a mat-button routerLink="/">Voltar</a>
          <a mat-raised-button color="primary" routerLink="/login">Entrar para Reivindicar</a>
        </mat-card-actions>
      </mat-card>
    </div>
    
    <div *ngIf="!report && !loading" class="not-found">
      <p>Anúncio não encontrado.</p>
      <a mat-button routerLink="/">Voltar</a>
    </div>
  `,
  styles: [`
    .detail-container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .avatar-icon { display: flex; justify-content: center; align-items: center; background: #eee; border-radius: 50%; color: #555; }
    .info-row { margin-bottom: 8px; }
    .description { margin-top: 16px; font-style: italic; color: #555; }
    .status-chips { margin-top: 16px; }
    .not-found { text-align: center; margin-top: 40px; }
  `]
})
export class PublicReportDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private reportService = inject(ReportService);

  report: any = null;
  loading = true;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reportService.getById(id).subscribe({
        next: (res) => {
          this.report = res;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  getPhotoUrl(path: string) {
    if (!path) return '';
    return `${environment.apiBaseUrl}${path}`;
  }
}
