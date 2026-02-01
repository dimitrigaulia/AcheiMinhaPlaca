import { Routes } from '@angular/router';
import { PublicShellComponent } from './shared/shells/public-shell/public-shell.component';
import { AppShellComponent } from './shared/shells/app-shell/app-shell.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicShellComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/public/landing/landing.component').then(m => m.LandingComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./features/public/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'report/:id',
        loadComponent: () => import('./features/public/report-detail/report-detail.component').then(m => m.PublicReportDetailComponent)
      }
    ]
  },
  {
    path: 'app',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/app/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/app/reports/report-list/report-list.component').then(m => m.ReportListComponent)
      },
      {
        path: 'reports/new',
        loadComponent: () => import('./features/app/reports/report-form/report-form.component').then(m => m.ReportFormComponent)
      },
      {
        path: 'search',
        loadComponent: () => import('./features/app/search/search.component').then(m => m.SearchComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
