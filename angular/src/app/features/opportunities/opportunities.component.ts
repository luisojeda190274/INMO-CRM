import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmService } from '../../core/services/crm.service';
import { CurrencyService } from '../../core/services/currency.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';
import { OpportunityStage, Opportunity } from '../../models/crm.models';

interface StageColumn {
  stage: OpportunityStage;
  title: string;
  badgeClass: string;
}

@Component({
  selector: 'app-opportunities',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, CurrencyFormatPipe],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      
      <app-page-header
        title="Pipeline de Oportunidades (Kanban)"
        subtitle="Embudo de ventas inmobiliarias desde la calificación inicial hasta la reserva y escrituración."
        [count]="crm.opportunities().length"
      ></app-page-header>

      <!-- Kanban Board -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
        @for (col of stages; track col.stage) {
          <div class="bg-slate-100 rounded-xl p-3 border border-slate-200 flex flex-col min-w-[260px]">
            <!-- Column Header -->
            <div class="flex items-center justify-between mb-3 px-1">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full" [class]="col.badgeClass"></span>
                <span class="text-xs font-bold text-slate-800">{{ col.title }}</span>
              </div>
              <span class="text-[11px] font-semibold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                {{ getDealsInStage(col.stage).length }}
              </span>
            </div>

            <!-- Cards -->
            <div class="space-y-3 flex-1">
              @for (deal of getDealsInStage(col.stage); track deal.id) {
                <div class="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-2">
                  <div class="flex items-start justify-between gap-2">
                    <h4 class="text-xs font-bold text-slate-900 leading-snug">{{ deal.title }}</h4>
                    <span class="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                      {{ deal.probability }}%
                    </span>
                  </div>

                  <p class="text-[11px] text-slate-600 font-medium">
                    👤 {{ deal.contactName }}
                  </p>

                  <div class="text-[11px] text-slate-500 font-mono">
                    🏠 {{ deal.propertyCode }} · {{ deal.propertyTitle }}
                  </div>

                  <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span class="font-bold text-slate-900">
                      {{ deal.expectedValue | crmCurrency:deal.currency }}
                    </span>
                    <span class="text-[10px] text-slate-400">
                      Cierre: {{ deal.expectedCloseDate }}
                    </span>
                  </div>
                </div>
              }

              @if (getDealsInStage(col.stage).length === 0) {
                <div class="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[11px] text-slate-400">
                  Sin operaciones
                </div>
              }
            </div>

          </div>
        }
      </div>

    </div>
  `
})
export class OpportunitiesComponent {
  crm = inject(CrmService);
  currency = inject(CurrencyService);

  readonly stages: StageColumn[] = [
    { stage: 'primer_contacto', title: '1. Primer Contacto', badgeClass: 'bg-blue-500' },
    { stage: 'visita_coordinada', title: '2. Visita Coordinada', badgeClass: 'bg-amber-500' },
    { stage: 'negociacion_oferta', title: '3. Negociación / Oferta', badgeClass: 'bg-purple-500' },
    { stage: 'reserva_boleto', title: '4. Reserva / Cierre', badgeClass: 'bg-emerald-500' }
  ];

  getDealsInStage(stage: OpportunityStage): Opportunity[] {
    return this.crm.opportunities().filter(o => o.stage === stage);
  }
}
