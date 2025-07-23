import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../shared/models/product.model';
import { Department } from '../../../../shared/models/department.model';
import { ProductService } from '../../services/product';
import { DepartmentService } from '../../services/department';
import { ProductListComponent } from '../../components/product-list/product-list';
import { ProductFormComponent } from '../../components/product-form/product-form';
import { Subject, Subscription, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DashboardStateService } from '../../services/dashboard-state.service';

@Component({
  selector: 'app-products-dashboard',
  standalone: true,
  imports: [CommonModule, ProductListComponent, ProductFormComponent],
  templateUrl: './products-dashboard.html',
  styleUrls: ['./products-dashboard.css']
})
export class ProductsDashboardComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  departments: Department[] = [];
  isLoading = true;
  currentView: 'list' | 'form' = 'list';
  productToEdit: Product | null = null;
  formMode: 'create' | 'edit' | 'edit-search' = 'create';

  // Estado dos Pop-ups
  showConfirmation = false;
  confirmationTitle = '';
  confirmationMessage = '';
  confirmAction!: () => void;

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  private searchSubject = new Subject<string>();
  private viewSubscription!: Subscription;
  private currentSearchTerm = '';
  private currentDepartmentCode = '';

  constructor(
    private productService: ProductService,
    private departmentService: DepartmentService,
    private dashboardState: DashboardStateService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.viewSubscription = this.dashboardState.viewMode$.subscribe(mode => {
      if (mode === 'create') this.showCreateForm();
      else if (mode === 'edit-search') this.showEditSearchForm();
      else this.currentView = 'list';
    });
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(searchTerm => {
      this.currentSearchTerm = searchTerm;
      this.loadProducts();
    });
  }

  ngOnDestroy(): void {
    this.viewSubscription.unsubscribe();
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.departmentService.getDepartments().subscribe(deps => {
      this.departments = deps;
      this.loadProducts(); 
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts(this.currentSearchTerm, this.currentDepartmentCode).subscribe(prods => {
      this.products = prods;
      this.isLoading = false;
    });
  }

  // Lógica dos Pop-ups
  private displayNotification(message: string, type: 'success' | 'error' = 'success'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => this.showNotification = false, 4000); // Aumentado para 4 segundos
  }

  onConfirm(): void {
    this.confirmAction();
    this.showConfirmation = false;
  }

  onCancelConfirmation(): void {
    this.showConfirmation = false;
    this.loadProducts();
  }

  // Lógica das Ações
  handleDeleteRequest(product: Product): void {
    this.confirmationTitle = 'Confirmar Exclusão';
    this.confirmationMessage = `Tem certeza que deseja deletar o produto "${product.description}"?`;
    this.confirmAction = () => {
      this.productService.deleteProduct(product.id).subscribe(() => {
        this.displayNotification(`Produto "${product.description}" deletado com sucesso.`);
        this.loadProducts();
      });
    };
    this.showConfirmation = true;
  }

  handleStatusChangeRequest({ product, newStatus }: { product: Product, newStatus: boolean }): void {
    const actionText = newStatus ? 'ativar' : 'inativar';
    this.confirmationTitle = `Confirmar Alteração de Status`;
    this.confirmationMessage = `Tem certeza que deseja ${actionText} o produto "${product.description}"?`;
    this.confirmAction = () => {
      const updatedProduct = { ...product, status: newStatus };
      this.productService.updateProduct(product.id, updatedProduct).subscribe(() => {
        this.displayNotification(`Status de "${product.description}" alterado com sucesso.`);
        this.loadProducts();
      });
    };
    this.showConfirmation = true;
  }

  handleSave(productData: Product | Omit<Product, 'id'>): void {
    const isCreating = !('id' in productData);
    const operation: Observable<any> = isCreating
      ? this.productService.createProduct(productData)
      : this.productService.updateProduct((productData as Product).id, productData);

    operation.subscribe({
      next: (createdProduct) => {
        if (isCreating) {
          this.displayNotification(`Produto "${(createdProduct as Product).description}" criado com sucesso.`, 'success');
        } else {
          this.displayNotification(`Produto "${(productData as Product).description}" alterado com sucesso.`, 'success');
        }
        this.dashboardState.changeView('list');
        this.loadProducts();
      },
      error: (err) => {
        if (err.status === 409) { // 409 Conflict (código duplicado)
          this.displayNotification(err.error.message, 'error');
        } else {
          this.displayNotification('Ocorreu um erro ao salvar o produto.', 'error');
        }
        console.error('Erro ao salvar produto:', err);
      }
    });
  }

  // Navegação entre telas
  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchTerm);
  }
  onDepartmentChange(event: Event): void {
    this.currentDepartmentCode = (event.target as HTMLSelectElement).value;
    this.loadProducts();
  }
  showCreateForm(): void {
    this.productToEdit = null;
    this.formMode = 'create';
    this.currentView = 'form';
  }
  showEditForm(product: Product): void {
    this.productToEdit = product;
    this.formMode = 'edit';
    this.currentView = 'form';
  }
  showEditSearchForm(): void {
    this.productToEdit = null;
    this.formMode = 'edit-search';
    this.currentView = 'form';
  }
  handleCancel(): void {
    this.dashboardState.changeView('list');
  }
}