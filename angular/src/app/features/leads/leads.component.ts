import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmService } from '../../core/services/crm.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { LeadStatus } from '../../models/crm.models';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      
      <app-page-header
        title="Consultas de Portales Inmobiliarios"
        subtitle="Bandeja unificada de mensajes provenientes de Zonaprop, Argenprop, Mercado Libre y Web."
        [count]="crm.leads().length"
      ></app-page-header>

      <div class="grid grid-cols-1 gap-4">
        @for (lead of crm.leads(); track lead.id) {
          <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div class="space-y-1.5 flex-1">
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900 text-sm">{{ lead.contactName }}</span>
                <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {{ lead.portalSource }}
                </span>
                <app-status-badge [text]="lead.status" type="lead"></app-status-badge>
              </div>

              <div class="text-xs text-slate-600 font-medium flex items-center gap-2">
                <span>Inmueble:</span>
                <span class="text-slate-900 font-semibold">{{ lead.propertyTitle }}</span>
                <span class="font-mono text-teal-600 text-[11px]">({{ lead.propertyCode }})</span>
              </div>

              <p class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                "{{ lead.message }}"
              </p>

              <div class="flex items-center gap-4 text-[11px] text-slate-400">
                <span>📞 {{ lead.contactPhone }}</span>
                <span>✉️ {{ lead.contactEmail }}</span>
                <span>⏱️ {{ lead.receivedAt }}</span>
                <span>👤 {{ lead.assignedAgent }}</span>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <select
                [value]="lead.status"
                (change)="onStatusChange(lead.id, $event)"
                class="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="Nueva">Nueva</option>
                <option value="En gestión">En gestión</option>
                <option value="Visita agendada">Visita agendada</option>
                <option value="Respondida">Respondida</option>
                <option value="Descartada">Descartada</option>
              </select>

              <button
                type="button"
                (click)="replyLead(lead)"
                class="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer text-center"
              >
                Responder WhatsApp
              </button>
            </div>

          </div>
        }
      </div>

    </div>
  `
})
export class LeadsComponent {
  crm = inject(CrmService);

  onStatusChange(leadId: string, event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target?.value) {
      this.crm.updateLeadStatus(leadId, target.value as LeadStatus);
    }
  }

  replyLead(lead: { contactName: string; contactPhone: string }): void {
    alert(`Abriendo respuesta directa para ${lead.contactName} (${lead.contactPhone})`);
  }
}
