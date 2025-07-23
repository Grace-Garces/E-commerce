import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * @type ViewMode
 * @description Define os possíveis modos de visualização do dashboard.
 * 'list': Exibe a lista de produtos.
 * 'create': Exibe o formulário para criar um novo produto.
 * 'edit-search': Exibe um formulário de busca para encontrar um produto a ser editado.
 */
export type ViewMode = 'list' | 'create' | 'edit-search';

/**
 * @Injectable DashboardStateService
 * @description Gerencia o estado de visualização do dashboard de produtos,
 * permitindo que componentes (como o Layout) controlem a tela exibida.
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardStateService {
  /**
   * @property {BehaviorSubject<ViewMode>} viewModeSource - Fonte reativa para o modo de visualização.
   * Inicia com 'list'.
   */
  private viewModeSource = new BehaviorSubject<ViewMode>('list');

  /**
   * @property {Observable<ViewMode>} viewMode$ - Observable público para que outros componentes
   * possam se inscrever e reagir a mudanças no modo de visualização.
   */
  viewMode$ = this.viewModeSource.asObservable();

  /**
   * @method changeView
   * @description Altera o modo de visualização atual do dashboard.
   * @param {ViewMode} mode - O novo modo de visualização a ser emitido.
   */
  changeView(mode: ViewMode): void {
    this.viewModeSource.next(mode);
  }
}