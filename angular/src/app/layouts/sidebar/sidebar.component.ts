import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CrmService } from '../../core/services/crm.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  badge?: () => number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside 
      class="relative flex flex-col shrink-0 bg-[#0A192F] text-slate-300 transition-all duration-200 border-r border-[#1E3A5F] h-full"
      [class.w-18]="crm.isSidebarCollapsed()"
      [class.w-64]="!crm.isSidebarCollapsed()"
    >
      <!-- Brand Header -->
      <div class="flex items-center justify-between h-16 px-4 border-b border-[#1E3A5F]">
        @if (!crm.isSidebarCollapsed()) {
          <div class="flex items-center gap-2.5 overflow-hidden">
            <div class="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-[#0A192F] font-bold text-lg shadow-sm">
              N
            </div>
            <div class="flex flex-col truncate">
              <span class="text-white font-bold tracking-tight text-sm leading-tight">
                Nexo Inmobiliario
              </span>
              <span class="text-[11px] text-teal-400 font-medium tracking-wide">
                CRM & Broker SaaS
              </span>
            </div>
          </div>
        } @else {
          <div class="mx-auto w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-[#0A192F] font-bold text-lg shadow-sm">
            N
          </div>
        }

        <button 
          type="button"
          (click)="crm.toggleSidebar()"
          class="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#132A4A] transition-colors cursor-pointer"
          [class.mx-auto]="crm.isSidebarCollapsed()"
          [class.mt-2]="crm.isSidebarCollapsed()"
          [attr.title]="crm.isSidebarCollapsed() ? 'Expandir menú' : 'Contraer menú'"
          [attr.aria-label]="crm.isSidebarCollapsed() ? 'Expandir menú' : 'Contraer menú'"
        >
          <span class="material-icons text-base align-middle leading-none">
            {{ crm.isSidebarCollapsed() ? 'chevron_right' : 'chevron_left' }}
          </span>
        </button>
      </div>

      <!-- Multi-tenant Branch Selector (if expanded) -->
      @if (!crm.isSidebarCollapsed()) {
        <div class="px-3 py-3 border-b border-[#142B49] bg-[#0c1e38]/70">
          <label class="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Inmobiliaria / Sucursal
          </label>
          <div class="relative">
            <select
              [value]="crm.selectedBranchId()"
              (change)="onBranchChange($event)"
              class="w-full text-xs font-medium text-slate-200 bg-[#132A4A] border border-[#1E3A5F] rounded-md py-1.5 px-2.5 pr-7 focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer appearance-none"
            >
              @for (b of crm.branches(); track b.id) {
                <option [value]="b.id" class="bg-[#0A192F] text-slate-200">
                  {{ b.name }}
                </option>
              }
            </select>
            <span class="material-icons text-teal-400 text-sm absolute right-2.5 top-2 pointer-events-none">
              apartment
            </span>
          </div>
          <div class="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
            <span class="material-icons text-teal-400 text-xs">verified_user</span>
            <span class="truncate">CUCICBA Mat. 6841 · CMCPSI 5920</span>
          </div>
        </div>
      }

      <!-- Navigation List -->
      <nav class="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
        @for (item of navItems; track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="bg-teal-500/15 text-teal-300 font-semibold border-l-2 border-teal-400"
            [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-[#132A4A] transition-colors group relative cursor-pointer no-underline"
            [attr.title]="crm.isSidebarCollapsed() ? item.label : null"
          >
            <span class="material-icons text-base shrink-0 transition-colors text-slate-400 group-hover:text-slate-200 group-[.border-l-2]:text-teal-400">
              {{ item.icon }}
            </span>
            
            @if (!crm.isSidebarCollapsed()) {
              <span class="truncate flex-1 text-left">
                {{ item.label }}
              </span>

              @if (item.badge && item.badge() > 0) {
                <span class="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 tabular-nums">
                  {{ item.badge() }}
                </span>
              }
            } @else {
              @if (item.badge && item.badge() > 0) {
                <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400"></span>
              }
            }
          </a>
        }
      </nav>

      <!-- Bottom Broker Status / Quick user info -->
      <div class="p-3 border-t border-[#1E3A5F] bg-[#081528]">
        @if (!crm.isSidebarCollapsed()) {
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2.5 overflow-hidden">
              <div class="w-7 h-7 rounded-full bg-teal-600/30 border border-teal-400/40 text-teal-300 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                MS
              </div>
              <div class="flex flex-col truncate">
                <span class="text-xs font-medium text-white truncate">
                  Martín Somoza
                </span>
                <span class="text-[10px] text-slate-400 truncate">
                  Broker Líder · Torres Prop.
                </span>
              </div>
            </div>
            <button
              type="button"
              (click)="crm.openWelcomeTour()"
              class="p-1 rounded text-teal-400 hover:text-teal-300 hover:bg-[#132A4A] transition-colors cursor-pointer shrink-0"
              title="Abrir asistente de bienvenida"
            >
              <span class="material-icons text-sm">help_outline</span>
            </button>
          </div>
        } @else {
          <div 
            class="w-7 h-7 mx-auto rounded-full bg-teal-600/30 border border-teal-400/40 text-teal-300 flex items-center justify-center text-xs font-bold font-mono cursor-pointer"
            (click)="crm.openWelcomeTour()"
            title="Martín Somoza - Abrir asistente"
          >
            MS
          </div>
        }
      </div>
    </aside>
  `
})
export class SidebarComponent {
  crm = inject(CrmService);

  readonly navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/properties', label: 'Propiedades', icon: 'apartment' },
    { path: '/contacts', label: 'Contactos', icon: 'people' },
    { path: '/leads', label: 'Consultas', icon: 'chat', badge: () => this.crm.newLeadsCount() },
    { path: '/opportunities', label: 'Oportunidades', icon: 'layers' },
    { path: '/calendar', label: 'Agenda y visitas', icon: 'calendar_today', badge: () => this.crm.pendingTasksCount() },
    { path: '/matching', label: 'Búsquedas de clientes', icon: 'compare_arrows' },
    { path: '/publications', label: 'Publicaciones', icon: 'share' },
    { path: '/reports', label: 'Reportes', icon: 'insights' },
    { path: '/settings', label: 'Usuarios y config.', icon: 'settings' },
    { path: '/tutorials', label: 'Ayuda y tutoriales', icon: 'school' },
  ];

  onBranchChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target?.value) {
      this.crm.setSelectedBranchId(target.value);
    }
  }
}
