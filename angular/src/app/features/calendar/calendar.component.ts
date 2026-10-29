import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmService } from '../../core/services/crm.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      
      <app-page-header
        title="Agenda Comercial y Visitas"
        subtitle="Coordinación de visitas a inmuebles, tareas comerciales y seguimiento de clientes."
        [count]="crm.visits().length"
        actionLabel="Agendar visita"
        (actionClicked)="openNewVisitModal()"
      ></app-page-header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left 2 Cols: Agenda de visitas -->
        <div class="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <h3 class="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Próximas Visitas a Inmuebles</span>
            <span class="text-xs text-slate-500 font-normal">Hoy y próximos días</span>
          </h3>

          <div class="space-y-3">
            @for (vis of crm.visits(); track vis.id) {
              <div class="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-teal-700 text-xs font-mono">{{ vis.time }} hs</span>
                    <span class="text-xs text-slate-500">({{ vis.date }})</span>
                    <app-status-badge [text]="vis.status"></app-status-badge>
                  </div>
                  <h4 class="text-xs font-bold text-slate-900">{{ vis.propertyTitle }}</h4>
                  <p class="text-xs text-slate-500">📍 {{ vis.propertyAddress }}</p>
                  <p class="text-[11px] text-slate-600">👤 Cliente: <span class="font-semibold">{{ vis.contactName }}</span> ({{ vis.contactPhone }})</p>
                </div>

                <div class="text-right shrink-0">
                  <span class="text-xs font-medium text-slate-700 block">Agente: {{ vis.agentName }}</span>
                  <button
                    type="button"
                    (click)="recordFeedback(vis.id)"
                    class="mt-2 text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
                  >
                    Cargar feedback →
                  </button>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Right Col: Tareas pendientes -->
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <h3 class="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Tareas Comerciales
          </h3>

          <div class="space-y-2.5">
            @for (task of crm.tasks(); track task.id) {
              <div 
                class="p-3 rounded-lg border transition-all flex items-start gap-3 cursor-pointer"
                [class.bg-white]="!task.completed"
                [class.bg-slate-50]="task.completed"
                [class.border-slate-200]="!task.completed"
                [class.border-slate-100]="task.completed"
                (click)="crm.toggleTaskCompleted(task.id)"
              >
                <input
                  type="checkbox"
                  [checked]="task.completed"
                  (click)="$event.stopPropagation(); crm.toggleTaskCompleted(task.id)"
                  class="mt-0.5 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <div class="flex-1 space-y-0.5">
                  <p class="text-xs font-medium" [class.line-through]="task.completed" [class.text-slate-400]="task.completed" [class.text-slate-800]="!task.completed">
                    {{ task.title }}
                  </p>
                  <div class="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>Vence: {{ task.dueDate }}</span>
                    <span>•</span>
                    <span [class.text-rose-600]="task.priority === 'Alta'">Prioridad {{ task.priority }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

      </div>

    </div>
  `
})
export class CalendarComponent {
  crm = inject(CrmService);

  openNewVisitModal(): void {
    alert('Modal de coordinación de visita (Angular) listo para conectar.');
  }

  recordFeedback(visitId: string): void {
    alert(`Cargando reporte de visita ${visitId}`);
  }
}
