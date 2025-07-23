import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../../shared/models/product.model';
import { Department } from '../../../../shared/models/department.model';
import { DepartmentService } from '../../services/department';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css']
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() product: Product | null = null;
  @Input() mode: 'create' | 'edit' | 'edit-search' = 'create';
  @Input() allProducts: Product[] | null = [];
  @Output() save = new EventEmitter<Product | Omit<Product, 'id'>>();
  @Output() cancel = new EventEmitter<void>();

  productForm!: FormGroup;
  departments$!: Observable<Department[]>;
  filteredProducts: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.departments$ = this.departmentService.getDepartments();
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.productForm) {
      this.updateForm();
    }
  }

  initializeForm(): void {
    this.productForm = this.fb.group({
      code: [{value: '', disabled: true}, Validators.required],
      description: ['', Validators.required],
      departmentCode: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      status: [true]
    });
    this.updateForm();
  }
  
  updateForm(): void {
    if (this.product) {
      this.productForm.patchValue(this.product);
      this.productForm.get('code')?.disable();
    } else {
      this.productForm.reset({ status: true });
      this.productForm.get('code')?.enable();
    }
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    if (query.length < 2 || !this.allProducts) {
      this.filteredProducts = [];
      return;
    }
    this.filteredProducts = this.allProducts.filter(p =>
      p.description.toLowerCase().includes(query) ||
      p.code.toLowerCase().includes(query)
    );
  }

  selectProduct(product: Product): void {
    this.product = product;
    this.updateForm();
    this.filteredProducts = [];
    (document.getElementById('product-search') as HTMLInputElement).value = '';
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }
    const formData = this.product
      ? { ...this.product, ...this.productForm.getRawValue() }
      : this.productForm.value;
      
    this.save.emit(formData);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}