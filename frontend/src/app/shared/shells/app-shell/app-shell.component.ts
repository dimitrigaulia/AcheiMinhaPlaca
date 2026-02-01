import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, NgIf } from '@angular/common';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    AsyncPipe,
    NgIf
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport
          [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
          [mode]="(isHandset$ | async) ? 'over' : 'side'"
          [opened]="(isHandset$ | async) === false">
        <mat-toolbar>Menu</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/app/dashboard" routerLinkActive="active" (click)="closeOnMobile()">Dashboard</a>
          <a mat-list-item routerLink="/app/reports" routerLinkActive="active" (click)="closeOnMobile()">Meus Anúncios</a>
          <a mat-list-item routerLink="/app/search" routerLinkActive="active" (click)="closeOnMobile()">Buscar</a>
          <a mat-list-item *ngIf="(user$ | async)?.role === 'Admin'" routerLink="/app/admin" routerLinkActive="active" (click)="closeOnMobile()">Backoffice</a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="drawer.toggle()"
            *ngIf="isHandset$ | async">
            <mat-icon>menu</mat-icon>
          </button>
          <span>PlacaSegura</span>
          <span class="spacer"></span>
          <button mat-button (click)="logout()">Sair</button>
        </mat-toolbar>
        <div class="container">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container { height: 100%; }
    .sidenav { width: 250px; }
    .spacer { flex: 1 1 auto; }
    .container { padding: 16px; max-width: 1100px; margin: 0 auto; }
    .active { background: rgba(0,0,0,0.05); }
  `]
})
export class AppShellComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private authService = inject(AuthService);
  private router = inject(Router);

  user$ = this.authService.currentUser$;
  @ViewChild('drawer') drawer!: MatSidenav;

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  closeOnMobile() {
    this.isHandset$.subscribe(isHandset => {
      if (isHandset) {
        this.drawer.close();
      }
    });
  }
}
