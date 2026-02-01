import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-admin-flags',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="admin-container">
      <h2>Backoffice - Denúncias</h2>
      
      <mat-card>
        <table mat-table [dataSource]="flags" class="full-width">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef="let element">ID</th>
            <td mat-cell *matCellDef="let element">{{ element.id | slice:0:8 }}...</td>
          </ng-container>

          <ng-container matColumnDef="reportId">
            <th mat-header-cell *matHeaderCellDef="let element">Anúncio</th>
            <td mat-cell *matCellDef="let element">{{ element.reportId | slice:0:8 }}...</td>
          </ng-container>

          <ng-container matColumnDef="reason">
            <th mat-header-cell *matHeaderCellDef="let element">Motivo</th>
            <td mat-cell *matCellDef="let element">{{ element.reason }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef="let element">Status</th>
            <td mat-cell *matCellDef="let element">{{ element.status }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef="let element">Ações</th>
            <td mat-cell *matCellDef="let element">
              <button mat-icon-button color="warn" (click)="removeReport(element.reportId)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        
        <div *ngIf="flags.length === 0" class="empty-state">
          Nenhuma denúncia pendente.
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-container { padding: 24px; }
    .full-width { width: 100%; }
    .empty-state { padding: 40px; text-align: center; color: #888; }
  `]
})
export class AdminFlagsComponent implements OnInit {
  private http = inject(HttpClient);
  flags: any[] = [];
  displayedColumns: string[] = ['id', 'reportId', 'reason', 'status', 'actions'];

  ngOnInit() {
    this.loadFlags();
  }

  loadFlags() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/admin/flags`).subscribe(res => {
      this.flags = res;
    });
  }

  removeReport(id: string) {
    if (confirm('Deseja realmente remover este anúncio?')) {
      this.http.post(`${environment.apiBaseUrl}/admin/reports/${id}/remove`, {}).subscribe(() => {
        this.loadFlags();
      });
    }
  }
}
