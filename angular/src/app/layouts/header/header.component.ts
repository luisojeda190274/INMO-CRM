import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CurrencyService } from '../../core/services/currency.service';
import { NotificationService } from '../../core/services/notification.service';
import { CrmService } from '../../core/services/crm.service';
import { filter } from 'rxjs';

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard general',
  '/properties': 'Inventario de propiedades',
  '/contacts': 'Directorio de contactos',
  '/leads': 'Consultas de portales',
  '/opportunities': 'Pipeline de oportunidades',
  '/calendar': 'Agenda y visitas',
  '/matching': 'Cruce inteligente de clientes',
  '/publications': 'Publicaciones y portales',
  '/reports': 'Reportes y estadísticas',
  '/settings': 'Usuarios y configuración',
  '/tutorials': 'Ayuda y tutoriales interactivos',
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between gap-6 shrink-0 z-20">
      
      <!-- Zone 1: Breadcrumbs & Current View Title -->
      <div class="flex items-center gap-2.5 min-w-0">
        <span class="text-xs font-semibold text-teal-600 hidden sm:inline">
          Nexo Inmobiliario
        </span>
        <span class="text-slate-300 hidden sm:inline">/</span>
        <h1 class="text-base font-bold text-slate-900 truncate">
          {{ currentTitle() }}
        </h1>
      </div>

      <!-- Zone 2: Global Search Bar trigger & Currency Selector -->
      <div class="flex items-center gap-3 flex-1 max-w-md justify-center">
        <!-- Search Trigger Input Simulation -->
        <div 
          class="flex-1 flex items-center justify-between gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg transition-colors group cursor-pointer"
          (click)="focusSearch()"
        >
          <div class="flex items-center gap-2 truncate">
            <span class="material-icons text-slate-400 group-hover:text-slate-600 text-sm">search</span>
            <span class="truncate">Buscar propiedades, clientes, códigos...</span>
          </div>
          <kbd class="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
            ⌘K
          </kbd>
        </div>

        <!-- Currency Switcher (USD / ARS) -->
        <div class="hidden lg:flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium">
          <button
            type="button"
            (click)="currency.setCurrency('USD')"
            class="px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            [class.bg-white]="currency.currencyMode() === 'USD'"
            [class.text-slate-900]="currency.currencyMode() === 'USD'"
            [class.shadow-2xs]="currency.currencyMode() === 'USD'"
            [class.font-semibold]="currency.currencyMode() === 'USD'"
            [class.text-slate-600]="currency.currencyMode() !== 'USD'"
            title="Mostrar valores de referencia en USD"
          >
            USD
          </button>
          <button
            type="button"
            (click)="currency.setCurrency('ARS')"
            class="px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            [class.bg-white]="currency.currencyMode() === 'ARS'"
            [class.text-slate-900]="currency.currencyMode() === 'ARS'"
            [class.shadow-2xs]="currency.currencyMode() === 'ARS'"
            [class.font-semibold]="currency.currencyMode() === 'ARS'"
            [class.text-slate-600]="currency.currencyMode() !== 'ARS'"
            [attr.title]="'Mostrar valores en Pesos Argentinos (TC Ref: $' + currency.usdToArsRate() + ')'"
          >
            ARS
          </button>
        </div>
      </div>

      <!-- Zone 3: Actions, Notifications, Help & Profile -->
      <div class="flex items-center gap-3 shrink-0">
        <!-- Quick New Property Action Button -->
        <a
          routerLink="/properties"
          class="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap no-underline"
        >
          <span class="material-icons text-base">add</span>
          <span class="hidden sm:inline">Nueva propiedad</span>
        </a>

        <!-- Notifications Popover -->
        <div class="relative">
          <button
            type="button"
            (click)="toggleNotifications()"
            class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors cursor-pointer"
            aria-label="Ver notificaciones"
          >
            <span class="material-icons text-lg">notifications</span>
            @if (notification.unreadCount() > 0) {
              <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500"></span>
            }
          </button>

          @if (isNotifOpen()) {
            <div class="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <div class="p-3 border-b border-slate-100 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-slate-900">Notificaciones</span>
                  @if (notification.unreadCount() > 0) {
                    <span class="text-[10px] font-mono font-semibold px-1.5 py-0.2 bg-teal-50 text-teal-700 border border-teal-200 rounded">
                      {{ notification.unreadCount() }} nuevas
                    </span>
                  }
                </div>
                @if (notification.unreadCount() > 0) {
                  <button
                    type="button"
                    (click)="notification.markAllAsRead()"
                    class="text-[11px] text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span class="material-icons text-xs">done_all</span>
                    Marcar leídas
                  </button>
                }
              </div>

              <div class="max-h-72 overflow-y-auto divide-y divide-slate-100">
                @for (n of notification.notifications(); track n.id) {
                  <div
                    (click)="onNotificationClick(n.id)"
                    class="p-3 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    [class.bg-teal-50/40]="!n.read"
                  >
                    <div class="flex items-center justify-between mb-0.5">
                      <span class="text-xs font-semibold text-slate-900">{{ n.title }}</span>
                      <span class="text-[10px] text-slate-400 tabular-nums">{{ n.time }}</span>
                    </div>
                    <p class="text-xs text-slate-600 line-clamp-2">{{ n.description }}</p>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- Help Popover -->
        <div class="relative">
          <button
            type="button"
            (click)="toggleHelp()"
            class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Ayuda y soporte"
          >
            <span class="material-icons text-lg">help_outline</span>
          </button>

          @if (isHelpOpen()) {
            <div class="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="material-icons text-teal-600 text-sm">info</span>
                <h2 class="text-xs font-bold text-slate-900">Centro de Ayuda & Tutoriales</h2>
              </div>
              <p class="text-xs text-slate-600 mb-3 leading-relaxed">
                Aprendé a dominar las funciones de Nexo Inmobiliario con tutoriales guiados en vivo sobre las pantallas reales.
              </p>

              <div class="space-y-1.5 text-xs">
                <!-- Onboarding Welcome Tour Entry -->
                <button
                  type="button"
                  (click)="startOnboarding()"
                  class="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 text-teal-900 font-bold hover:bg-teal-100 flex items-center justify-between cursor-pointer transition-all shadow-2xs mb-1"
                >
                  <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                      <span class="material-icons text-sm">auto_awesome</span>
                    </div>
                    <div>
                      <span class="text-xs font-bold block text-slate-900">Ayuda para comenzar</span>
                      <span class="text-[10px] text-teal-700 font-normal">Recorrido guiado de 4 pasos por el CRM</span>
                    </div>
                  </div>
                  <span class="material-icons text-teal-600 text-sm shrink-0">chevron_right</span>
                </button>

                <a
                  routerLink="/tutorials"
                  (click)="isHelpOpen.set(false)"
                  class="w-full p-2 rounded-lg bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 flex items-center justify-between cursor-pointer no-underline"
                >
                  <span>Abrir Centro de Tutoriales</span>
                  <span class="material-icons text-xs">open_in_new</span>
                </a>

                <div class="pt-2 border-t border-slate-100 space-y-1">
                  <span class="text-[10px] uppercase font-bold text-slate-400 block px-1">
                    Tutoriales disponibles:
                  </span>
                  <a
                    routerLink="/tutorials"
                    (click)="isHelpOpen.set(false)"
                    class="w-full p-1.5 rounded hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-between cursor-pointer no-underline"
                  >
                    <span>1. Cómo cargar una propiedad</span>
                    <span class="text-[10px] text-teal-600 font-mono">8 pasos</span>
                  </a>
                  <a
                    routerLink="/tutorials"
                    (click)="isHelpOpen.set(false)"
                    class="w-full p-1.5 rounded hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-between cursor-pointer no-underline"
                  >
                    <span>2. Cómo sincronizar publicaciones</span>
                    <span class="text-[10px] text-teal-600 font-mono">5 pasos</span>
                  </a>
                  <a
                    routerLink="/tutorials"
                    (click)="isHelpOpen.set(false)"
                    class="w-full p-1.5 rounded hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-between cursor-pointer no-underline"
                  >
                    <span>3. Conectar portales al CRM</span>
                    <span class="text-[10px] text-teal-600 font-mono">Guía técnica</span>
                  </a>
                </div>

                <div class="p-2 text-slate-500 text-[11px] bg-slate-50 rounded mt-2">
                  Atención técnica: soporte&#64;nexoinmobiliario.com
                </div>
              </div>
            </div>
          }
        </div>

        <!-- User Profile Badge -->
        <a 
          routerLink="/settings"
          class="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer group no-underline"
        >
          <div class="w-8 h-8 rounded-full bg-[#0A192F] text-teal-300 flex items-center justify-center font-mono text-xs font-bold border border-teal-500/30">
            MS
          </div>
          <div class="hidden xl:flex flex-col text-left">
            <span class="text-xs font-semibold text-slate-800 leading-tight group-hover:text-teal-600 transition-colors">
              Martín Somoza
            </span>
            <span class="text-[10px] text-slate-500">
              Torres &amp; Asoc.
            </span>
          </div>
          <span class="material-icons text-slate-400 group-hover:text-slate-600 text-sm">keyboard_arrow_down</span>
        </a>
      </div>
    </header>
  `
})
export class HeaderComponent {
  currency = inject(CurrencyService);
  notification = inject(NotificationService);
  crm = inject(CrmService);
  private router = inject(Router);

  readonly currentPath = signal<string>(this.router.url);
  readonly currentTitle = computed(() => {
    const path = this.currentPath();
    const cleanPath = path.split('?')[0];
    return ROUTE_TITLES[cleanPath] || 'Nexo Inmobiliario';
  });

  readonly isNotifOpen = signal<boolean>(false);
  readonly isHelpOpen = signal<boolean>(false);

  constructor() {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe((event) => {
      this.currentPath.set(event.urlAfterRedirects);
    });
  }

  toggleNotifications(): void {
    this.isNotifOpen.update(v => !v);
    if (this.isNotifOpen()) {
      this.isHelpOpen.set(false);
    }
  }

  toggleHelp(): void {
    this.isHelpOpen.update(v => !v);
    if (this.isHelpOpen()) {
      this.isNotifOpen.set(false);
    }
  }

  onNotificationClick(id: string): void {
    this.notification.markAsRead(id);
    this.isNotifOpen.set(false);
  }

  startOnboarding(): void {
    this.crm.openWelcomeTour(0);
    this.isHelpOpen.set(false);
  }

  focusSearch(): void {
    this.router.navigate(['/properties']);
  }
}
