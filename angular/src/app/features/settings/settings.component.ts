import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmService } from '../../core/services/crm.service';
import { CurrencyService } from '../../core/services/currency.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      
      <app-page-header
        title="Configuración de Inmobiliaria y Usuarios"
        subtitle="Sucursales, equipo comercial, cotización de moneda e integraciones."
      ></app-page-header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left: Sucursales -->
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <h3 class="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Sucursales Activas</span>
            <span class="text-xs text-teal-600 font-semibold">{{ crm.branches().length }} sedes</span>
          </h3>

          <div class="space-y-3">
            @for (b of crm.branches(); track b.id) {
              <div class="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-xs text-slate-800">{{ b.name }}</span>
                  @if (b.isHeadquarters) {
                    <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
                      Casa Central
                    </span>
                  }
                </div>
                <p class="text-xs text-slate-500">{{ b.address }}, {{ b.city }}</p>
                <p class="text-[11px] text-slate-400">📞 {{ b.phone }}</p>
              </div>
            }
          </div>
        </div>

        <!-- Center: Moneda y Parámetros -->
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <h3 class="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Parámetros Económicos
          </h3>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Cotización Dólar Venta (ARS / USD)
              </label>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-500">$</span>
                <input
                  type="number"
                  [value]="currency.usdToArsRate()"
                  (change)="onRateChange($event)"
                  class="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>
              <p class="text-[11px] text-slate-500 mt-1">
                Utilizado para convertir precios de publicaciones en tiempo real.
              </p>
            </div>

            <div class="pt-3 border-t border-slate-100">
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Moneda de Visualización Predeterminada
              </label>
              <div class="flex gap-2">
                <button
                  type="button"
                  (click)="currency.setCurrency('USD')"
                  class="flex-1 py-1.5 text-xs font-bold rounded-lg border cursor-pointer"
                  [class.bg-[#0A192F]]="currency.currencyMode() === 'USD'"
                  [class.text-white]="currency.currencyMode() === 'USD'"
                  [class.border-[#0A192F]]="currency.currencyMode() === 'USD'"
                >
                  USD (Dólares)
                </button>
                <button
                  type="button"
                  (click)="currency.setCurrency('ARS')"
                  class="flex-1 py-1.5 text-xs font-bold rounded-lg border cursor-pointer"
                  [class.bg-[#0A192F]]="currency.currencyMode() === 'ARS'"
                  [class.text-white]="currency.currencyMode() === 'ARS'"
                  [class.border-[#0A192F]]="currency.currencyMode() === 'ARS'"
                >
                  ARS (Pesos)
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Equipo Comercial -->
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <h3 class="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Equipo Comercial</span>
            <span class="text-xs text-teal-600 font-semibold">{{ crm.team().length }} miembros</span>
          </h3>

          <div class="space-y-3">
            @for (user of crm.team(); track user.id) {
              <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div class="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {{ user.name.charAt(0) }}
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-xs font-bold text-slate-800 truncate">{{ user.name }}</h4>
                  <p class="text-[11px] text-teal-600 font-medium">{{ user.role }}</p>
                  <p class="text-[10px] text-slate-400">{{ user.email }}</p>
                </div>
              </div>
            }
          </div>
        </div>

      </div>

    </div>
  `
})
export class SettingsComponent {
  crm = inject(CrmService);
  currency = inject(CurrencyService);

  onRateChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const val = Number(target.value);
    if (val > 0) {
      this.currency.setRate(val);
    }
  }
}
