import { Component, ElementRef, HostListener, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { DashboardStateService } from '../../../features/products/services/dashboard-state.service';
import { Subscription } from 'rxjs';

/**
 * @Component LayoutComponent
 * @description Define a estrutura principal da página, incluindo interações do sidebar.
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent implements OnInit {
  isSidebarOpen = true;
  isCadastroMenuOpen = false;

  // Referência ao elemento do sidebar no template para checar cliques
  @ViewChild('sidebar') sidebarRef!: ElementRef;

  constructor(
    public authService: AuthService,
    public dashboardState: DashboardStateService // Tornando público para uso no template com async pipe
  ) {}

  ngOnInit(): void {
    // Lógica para fechar o menu cadastro se a visão mudar para lista
    this.dashboardState.viewMode$.subscribe(view => {
      if (view === 'list') {
        this.isCadastroMenuOpen = false;
      }
    });
  }

  /**
   * @HostListener onOutsideClick
   * @description Fecha o sidebar se o clique ocorrer fora dele e do botão de toggle.
   */
  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    if (!this.isSidebarOpen) {
      return;
    }

    const clickedElement = event.target as HTMLElement;
    const isClickInsideSidebar = this.sidebarRef.nativeElement.contains(clickedElement);
    const isToggleButton = clickedElement.closest('#sidebar-toggle');

    if (!isClickInsideSidebar && !isToggleButton) {
      this.isSidebarOpen = false;
    }
  }
  
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  
  toggleCadastroMenu(): void {
    this.isCadastroMenuOpen = !this.isCadastroMenuOpen;
    // Abre o sidebar se ele estiver fechado e o usuário tentar abrir um menu
    if (this.isCadastroMenuOpen && !this.isSidebarOpen) {
      this.isSidebarOpen = true;
    }
  }

  logout(): void {
    this.authService.logout();
  }

  // --- Métodos de Navegação Atualizados ---

  private handleNavigation(): void {
    // Abre o sidebar se estiver fechado ao clicar em um item de menu
    if (!this.isSidebarOpen) {
      this.isSidebarOpen = true;
    }
  }

  navigateToProductList(): void {
    this.handleNavigation();
    this.dashboardState.changeView('list');
  }

  navigateToNewProduct(): void {
    this.handleNavigation();
    this.dashboardState.changeView('create');
    if (!this.isCadastroMenuOpen) {
      this.isCadastroMenuOpen = true;
    }
  }

  navigateToEditProduct(): void {
    this.handleNavigation();
    this.dashboardState.changeView('edit-search');
    if (!this.isCadastroMenuOpen) {
      this.isCadastroMenuOpen = true;
    }
  }
}