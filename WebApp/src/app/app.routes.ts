import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout';
import { LoginComponent } from './features/login/login';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'products',
        loadChildren: () => import('./features/products/products.routes').then(r => r.PRODUCT_ROUTES)
      },
      { path: '', redirectTo: 'products', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
