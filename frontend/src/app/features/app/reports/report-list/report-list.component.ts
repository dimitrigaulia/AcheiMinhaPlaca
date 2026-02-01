import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportService } from '../../../../core/services/report.service';
import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule
  ],
  template: `
    <div class="list-container">
      <h2>Meus Anúncios</h2>
      
      <div *ngIf="loading" class="loading">Carregando...</div>
      
      <div *ngIf="!loading && reports.length === 0" class="empty-state">
        <mat-icon>inbox</mat-icon>
        <p>Você ainda não tem anúncios.</p>
      </div>

      <div class="grid" *ngIf="reports.length > 0">
        <mat-card *ngFor="let report of reports" class="report-card">
          <mat-card-header>
            <div mat-card-avatar class="avatar" [class.lost]="report.type === 'Lost'" [class.found]="report.type === 'Found'">
              <mat-icon>{{ report.type === 'Lost' ? 'search_off' : 'check_circle' }}</mat-icon>
            </div>
            <mat-card-title>{{ report.plateMasked }}</mat-card-title>
            <mat-card-subtitle>{{ report.city }} • {{ report.eventAt | date:'shortDate' }}</mat-card-subtitle>
            <span class="spacer"></span>
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item *ngIf="report.status === 'Active'" (click)="closeReport(report)">
                <mat-icon>check</mat-icon>
                <span>Encerrar</span>
              </button>
              <button mat-menu-item (click)="removeReport(report)">
                <mat-icon color="warn">delete</mat-icon>
                <span class="warn-text">Remover</span>
              </button>
            </mat-menu>
          </mat-card-header>
          <mat-card-content>
            <mat-chip-set>
              <mat-chip>{{ report.status }}</mat-chip>
              <mat-chip>{{ report.type }}</mat-chip>
            </mat-chip-set>
            <p *ngIf="report.description" class="desc">{{ report.description }}</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .list-container { padding: 16px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; margin-top: 16px; }
    .avatar { display: flex; align-items: center; justify-content: center; color: white; }
    .avatar.lost { background-color: #f44336; }
    .avatar.found { background-color: #4caf50; }
    .spacer { flex: 1 1 auto; }
    .desc { margin-top: 8px; color: #666; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .empty-state { text-align: center; margin-top: 48px; color: #888; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; }
    .warn-text { color: #f44336; }
  `]
})
export class ReportListComponent implements OnInit {
  private reportService = inject(ReportService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  reports: any[] = [];
  loading = true;

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.loading = true;
    this.reportService.getMine().subscribe({
      next: (res) => {
        this.reports = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  closeReport(report: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Encerrar Anúncio', message: 'Deseja marcar este anúncio como resolvido/encerrado?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reportService.close(report.id).subscribe(() => {
          this.snackBar.open('Anúncio encerrado.', 'OK', { duration: 3000 });
          this.loadReports();
        });
      }
    });
  }

  removeReport(report: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { 
        title: 'Remover Anúncio', 
        message: 'Tem certeza que deseja remover este anúncio? Esta ação não pode ser desfeita.',
        confirmText: 'Remover'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reportService.remove(report.id).subscribe(() => {
          this.snackBar.open('Anúncio removido.', 'OK', { duration: 3000 });
          this.loadReports();
        });
      }
    });
  }
}
