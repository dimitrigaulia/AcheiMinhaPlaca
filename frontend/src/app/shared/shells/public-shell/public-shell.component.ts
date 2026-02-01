import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-public-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary">
      <span class="brand" routerLink="/">PlacaSegura</span>
      <span class="spacer"></span>
      <a mat-button routerLink="/login">Entrar</a>
    </mat-toolbar>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .brand { cursor: pointer; font-weight: bold; }
    .container { max-width: 1100px; margin: 0 auto; padding: 16px; }
  `]
})
export class PublicShellComponent {}
