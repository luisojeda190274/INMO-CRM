import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmService } from '../../core/services/crm.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { Property } from '../../models/crm.models';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      
      <app-page-header
        title="Publicaciones y Difusión en Portales"
        subtitle="Matriz de sincronización en tiempo real hacia Zonaprop, Argenprop, Mercado Libre y Properati."
      ></app-page-header>

      <!-- Portal Quotas Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        @for (portal of crm.portals(); track portal.id) {
          <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-slate-800">{{ portal.name }}</span>
              <span class="w-2.5 h-2.5 rounded-full" [class.bg-emerald-500]="portal.connected" [class.bg-slate-300]="!portal.connected"></span>
            </div>
            <div class="text-xl font-bold text-slate-900">
              {{ portal.publishedCount }} <span class="text-xs text-slate-400 font-normal">/ {{ portal.quotaLimit }} cupos</span>
            </div>
            <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Destacados: <strong>{{ portal.featuredRemaining }}</strong></span>
              <span>{{ portal.connected ? 'Sincronizado' : 'Desconectado' }}</span>
            </div>
          </div>
        }
      </div>

      <!-- Sync Matrix Table -->
      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div class="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-600">
            Matriz de Difusión de Inmuebles
          </h3>
          <span class="text-xs text-slate-500">
            Hacé clic en cualquier casilla para activar o desactivar la sincronización.
          </span>
        </div>

        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-100/70 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <th class="p-3">Inmueble</th>
              <th class="p-3 text-center">Zonaprop</th>
              <th class="p-3 text-center">Argenprop</th>
              <th class="p-3 text-center">Mercado Libre</th>
              <th class="p-3 text-center">Properati</th>
              <th class="p-3 text-center">Web Propia</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (prop of crm.properties(); track prop.id) {
              <tr class="hover:bg-slate-50/80 transition-colors">
                <td class="p-3">
                  <div class="font-bold text-slate-900">{{ prop.code }} — {{ prop.title }}</div>
                  <div class="text-[11px] text-slate-500">{{ prop.address }} · {{ prop.operation }}</div>
                </td>
                
                <td class="p-3 text-center">
                  <button
                    type="button"
                    (click)="crm.togglePortalSync(prop.id, 'zonaprop')"
                    class="px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer"
                    [class.bg-emerald-100]="prop.portals.zonaprop"
                    [class.text-emerald-800]="prop.portals.zonaprop"
                    [class.bg-slate-100]="!prop.portals.zonaprop"
                    [class.text-slate-400]="!prop.portals.zonaprop"
                  >
                    {{ prop.portals.zonaprop ? '✓ Activo' : '— Inactivo' }}
                  </button>
                </td>

                <td class="p-3 text-center">
                  <button
                    type="button"
                    (click)="crm.togglePortalSync(prop.id, 'argenprop')"
                    class="px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer"
                    [class.bg-emerald-100]="prop.portals.argenprop"
                    [class.text-emerald-800]="prop.portals.argenprop"
                    [class.bg-slate-100]="!prop.portals.argenprop"
                    [class.text-slate-400]="!prop.portals.argenprop"
                  >
                    {{ prop.portals.argenprop ? '✓ Activo' : '— Inactivo' }}
                  </button>
                </td>

                <td class="p-3 text-center">
                  <button
                    type="button"
                    (click)="crm.togglePortalSync(prop.id, 'mercadolibre')"
                    class="px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer"
                    [class.bg-emerald-100]="prop.portals.mercadolibre"
                    [class.text-emerald-800]="prop.portals.mercadolibre"
                    [class.bg-slate-100]="!prop.portals.mercadolibre"
                    [class.text-slate-400]="!prop.portals.mercadolibre"
                  >
                    {{ prop.portals.mercadolibre ? '✓ Activo' : '— Inactivo' }}
                  </button>
                </td>

                <td class="p-3 text-center">
                  <button
                    type="button"
                    (click)="crm.togglePortalSync(prop.id, 'properati')"
                    class="px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer"
                    [class.bg-emerald-100]="prop.portals.properati"
                    [class.text-emerald-800]="prop.portals.properati"
                    [class.bg-slate-100]="!prop.portals.properati"
                    [class.text-slate-400]="!prop.portals.properati"
                  >
                    {{ prop.portals.properati ? '✓ Activo' : '— Inactivo' }}
                  </button>
                </td>

                <td class="p-3 text-center">
                  <button
                    type="button"
                    (click)="crm.togglePortalSync(prop.id, 'ownWebsite')"
                    class="px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer"
                    [class.bg-emerald-100]="prop.portals.ownWebsite"
                    [class.text-emerald-800]="prop.portals.ownWebsite"
                    [class.bg-slate-100]="!prop.portals.ownWebsite"
                    [class.text-slate-400]="!prop.portals.ownWebsite"
                  >
                    {{ prop.portals.ownWebsite ? '✓ Activo' : '— Inactivo' }}
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

    </div>
  `
})
export class PublicationsComponent {
  crm = inject(CrmService);
}
