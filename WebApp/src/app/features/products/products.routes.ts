import { Routes } from '@angular/router';
import { ProductsDashboardComponent } from './pages/products-dashboard/products-dashboard';

/**
 * @const PRODUCT_ROUTES
 * @description Define as rotas para o módulo de produtos.
 * A rota raiz do módulo ('/products') renderiza o ProductsDashboardComponent.
 */
export const PRODUCT_ROUTES: Routes = [
    {
        path: '',
        component: ProductsDashboardComponent
    }
];