import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../shared/models/product.model';

/**
 * @Component ProductListComponent
 * @description Componente responsável por exibir uma lista de produtos em uma tabela.
 * Recebe a lista de produtos via Input e emite eventos para ações como editar, deletar ou alterar status.
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent {
  /**
   * @Input
   * @description A lista de produtos a ser exibida.
   */
  @Input() products: Product[] | null = [];

  /**
   * @Output
   * @description Emite o produto que o usuário deseja editar.
   */
  @Output() editProduct = new EventEmitter<Product>();

  /**
   * @Output
   * @description Emite o produto que o usuário solicitou para deletar.
   */
  @Output() deleteRequest = new EventEmitter<Product>();

  /**
   * @Output
   * @description Emite o produto e o novo status quando o usuário altera o switch.
   */
  @Output() statusChangeRequest = new EventEmitter<{ product: Product, newStatus: boolean }>();

  /**
   * @method onEdit
   * @description Propaga o evento de edição para o componente pai.
   * @param {Product} product - O produto a ser editado.
   */
  onEdit(product: Product): void {
    this.editProduct.emit(product);
  }

  /**
   * @method onDelete
   * @description Propaga o evento de exclusão para o componente pai.
   * @param {Product} product - O produto a ser deletado.
   */
  onDelete(product: Product): void {
    this.deleteRequest.emit(product);
  }

  /**
   * @method onStatusChange
   * @description Captura a mudança do switch e propaga o evento para o componente pai.
   * @param {Product} product - O produto cujo status foi alterado.
   * @param {Event} event - O evento do input para obter o novo valor (checked).
   */
  onStatusChange(product: Product, event: Event): void {
    const newStatus = (event.target as HTMLInputElement).checked;
    this.statusChangeRequest.emit({ product, newStatus });
  }
}