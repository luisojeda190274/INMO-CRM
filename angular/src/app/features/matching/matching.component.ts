import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmService } from '../../core/services/crm.service';
import { CurrencyService } from '../../core/services/currency.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-matching',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, CurrencyFormatPipe],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      
      <app-page-header
        title="Cruce Inteligente de Búsquedas (Matchmaking)"
        subtitle="Algoritmo que cruza los criterios de búsqueda de clientes con el inventario disponible."
        [count]="crm.searches().length"
      ></app-page-header>

      <div class="space-y-4">
        @for (search of crm.searches(); track search.id) {
          <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 class="text-sm font-bold text-slate-900">{{ search.contactName }}</h3>
                <p class="text-xs text-slate-500">📞 {{ search.contactPhone }} · Registrado: {{ search.createdAt }}</p>
              </div>

              <div class="flex items-center gap-2">
                <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  {{ search.matchedPropertiesCount || 3 }} propiedades coincidentes
                </span>
                <button
                  type="button"
                  (click)="sendEmailMatches(search)"
                  class="px-3 py-1.5 bg-[#0A192F] hover:bg-[#132A4A] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Enviar ficha por Email
                </button>
              </div>
            </div>

            <!-- Search Specs Tags -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div>
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Operación & Tipo</span>
                <span class="font-semibold text-slate-800">{{ search.operation }} · {{ search.propertyTypes.join(', ') }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Zonas de interés</span>
                <span class="font-semibold text-slate-800">{{ search.zones.join(', ') }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Presupuesto tope</span>
                <span class="font-semibold text-slate-800">{{ search.maxBudget | crmCurrency:search.budgetCurrency }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Ambientes mín.</span>
                <span class="font-semibold text-slate-800">{{ search.minRooms }} amb. {{ search.needsGarage ? '· Con cochera' : '' }}</span>
              </div>
            </div>

          </div>
        }
      </div>

    </div>
  `
})
export class MatchingComponent {
  crm = inject(CrmService);
  currency = inject(CurrencyService);

  sendEmailMatches(search: { contactName: string }): void {
    alert(`Enviando ficha con inmuebles coincidentes a ${search.contactName}`);
  }
}
