import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../shared/models/product.model';

/**
 * @Injectable ProductService
 * @description Fornece métodos para interagir com a API de produtos (CRUD).
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5269/api/products';

  constructor(private http: HttpClient) { }

  /**
   * @method getProducts
   * @description Busca uma lista de produtos, com filtros opcionais.
   * @param {string} [searchTerm] - Termo para busca por código ou descrição.
   * @param {string} [departmentCode] - Código do departamento para filtrar.
   * @returns {Observable<Product[]>} Observable com a lista de produtos.
   */
  getProducts(searchTerm?: string, departmentCode?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (searchTerm?.trim()) {
      params = params.append('searchTerm', searchTerm);
    }
    if (departmentCode?.trim()) {
      params = params.append('departmentCode', departmentCode);
    }
    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  /**
   * @method getProductById
   * @description Busca um único produto pelo seu ID.
   * @param {string} id - O ID do produto.
   * @returns {Observable<Product>} Observable com o produto encontrado.
   */
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * @method createProduct
   * @description Cria um novo produto.
   * @param {Omit<Product, 'id'>} product - O objeto do produto sem o ID.
   * @returns {Observable<Product>} Observable com o produto recém-criado.
   */
  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  /**
   * @method updateProduct
   * @description Atualiza um produto existente.
   * @param {string} id - O ID do produto a ser atualizado.
   * @param {Partial<Product>} product - Os dados do produto a serem atualizados.
   * @returns {Observable<void>} Observable que completa ao finalizar a operação.
   */
  updateProduct(id: string, product: Partial<Product>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, product);
  }

  /**
   * @method deleteProduct
   * @description Deleta um produto pelo seu ID.
   * @param {string} id - O ID do produto a ser deletado.
   * @returns {Observable<void>} Observable que completa ao finalizar a operação.
   */
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}