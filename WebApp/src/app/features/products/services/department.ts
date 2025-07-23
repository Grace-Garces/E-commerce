import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../../../shared/models/department.model';

/**
 * @Injectable DepartmentService
 * @description Fornece métodos para buscar dados de departamentos da API.
 */
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost:5269/api/departments';

  constructor(private http: HttpClient) { }

  /**
   * @method getDepartments
   * @description Busca a lista completa de departamentos.
   * @returns {Observable<Department[]>} Observable com a lista de departamentos.
   */
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }
}