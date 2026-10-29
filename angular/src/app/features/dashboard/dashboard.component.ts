import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { CrmService } from '../../core/services/crm.service';
import { CurrencyService } from '../../core/services/currency.service';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule,
    CurrencyFormatPipe
  ],
  template: `
    <div class="p-6 space-y-6 max-w-7xl mx-auto">
      
      <!-- Welcome & Quick actions bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">
            Panel de Control Comercial
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Actividad de la sucursal y estado de cartera en tiempo real · {{ crm.currentBranch().name }}
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <button
            type="button"
            (click)="crm.openWelcomeTour(0)"
            class="flex items-center gap-1.5 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            title="Abrir recorrido guiado de bienvenida"
          >
            <span class="material-icons text-teal-600 text-sm">auto_awesome</span>
            <span class="hidden sm:inline">Ayuda para comenzar</span>
          </button>
          
          <a
            routerLink="/properties"
            class="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer no-underline"
          >
            <span class="material-icons text-white text-sm">add</span>
            <span>Publicar inmueble</span>
          </a>

          <a
            routerLink="/opportunities"
            class="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer no-underline"
          >
            <span class="material-icons text-slate-500 text-sm">layers</span>
            <span>Ver Pipeline</span>
          </a>
        </div>
      </div>

      <!-- Primary KPI Grid (7 Key Indicators) -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        
        <!-- Total Properties -->
        <a 
          routerLink="/properties"
          class="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-teal-500/50 hover:shadow-2xs transition-all cursor-pointer group no-underline block"
        >
          <div class="flex items-center justify-between text-slate-400 group-hover:text-teal-600 mb-2">
            <span class="material-icons text-base">apartment</span>
            <span class="text-[10px] text-slate-400 font-medium">Inventario</span>
          </div>
          <div class="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {{ totalProperties() }}
          </div>
          <div class="text-[11px] text-slate-500 font-medium mt-1 truncate">
            Total inmuebles
          </div>
        </a>

        <!-- Published -->
        <a 
          routerLink="/publications"
          class="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-teal-500/50 hover:shadow-2xs transition-all cursor-pointer group no-underline block"
        >
          <div class="flex items-center justify-between text-slate-400 group-hover:text-emerald-600 mb-2">
            <span class="material-icons text-emerald-600 text-base">share</span>
            <span class="text-[10px] text-emerald-600 font-medium">Portales</span>
          </div>
          <div class="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {{ publishedProperties() }}
          </div>
          <div class="text-[11px] text-slate-500 font-medium mt-1 truncate">
            Publicadas
          </div>
        </a>

        <!-- Reserved -->
        <a 
          routerLink="/properties"
          class="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-teal-500/50 hover:shadow-2xs transition-all cursor-pointer group no-underline block"
        >
          <div class="flex items-center justify-between text-slate-400 group-hover:text-amber-600 mb-2">
            <span class="material-icons text-amber-600 text-base">bookmark</span>
            <span class="text-[10px] text-amber-600 font-medium">Boleto</span>
          </div>
          <div class="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {{ reservedProperties() }}
          </div>
          <div class="text-[11px] text-slate-500 font-medium mt-1 truncate">
            Reservadas
          </div>
        </a>

        <!-- Inquiries / Leads -->
        <a 
          routerLink="/leads"
          class="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-teal-500/50 hover:shadow-2xs transition-all cursor-pointer group no-underline block"
        >
          <div class="flex items-center justify-between text-slate-400 group-hover:text-cyan-600 mb-2">
            <span class="material-icons text-cyan-600 text-base">chat</span>
            <span class="text-[10px] text-cyan-600 font-medium">Leads</span>
          </div>
          <div class="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {{ totalLeads() }}
          </div>
          <div class="text-[11px] text-slate-500 font-medium mt-1 truncate">
            Consultas recibidas
          </div>
        </a>

        <!-- Active Opportunities -->
        <a 
          routerLink="/opportunities"
          class="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-teal-500/50 hover:shadow-2xs transition-all cursor-pointer group no-underline block"
        >
          <div class="flex items-center justify-between text-slate-400 group-hover:text-indigo-600 mb-2">
            <span class="material-icons text-indigo-600 text-base">layers</span>
            <span class="text-[10px] text-indigo-600 font-medium">Pipeline</span>
          </div>
          <div class="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {{ activeOpportunities().length }}
          </div>
          <div class="text-[11px] text-slate-500 font-medium mt-1 truncate">
            Oportunidades
          </div>
        </a>

        <!-- Scheduled Visits -->
        <a 
          routerLink="/calendar"
          class="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-teal-500/50 hover:shadow-2xs transition-all cursor-pointer group no-underline block"
        >
          <div class="flex items-center justify-between text-slate-400 group-hover:text-purple-600 mb-2">
            <span class="material-icons text-purple-600 text-base">calendar_today</span>
            <span class="text-[10px] text-purple-600 font-medium">Agenda</span>
          </div>
          <div class="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {{ scheduledVisits().length }}
          </div>
          <div class="text-[11px] text-slate-500 font-medium mt-1 truncate">
            Visitas agendadas
          </div>
        </a>

        <!-- Pending Tasks -->
        <a 
          routerLink="/calendar"
          class="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-teal-500/50 hover:shadow-2xs transition-all cursor-pointer group no-underline block"
        >
          <div class="flex items-center justify-between text-slate-400 group-hover:text-rose-600 mb-2">
            <span class="material-icons text-rose-600 text-base">check_box</span>
            <span class="text-[10px] text-rose-600 font-medium">To-Do</span>
          </div>
          <div class="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {{ pendingTasks().length }}
          </div>
          <div class="text-[11px] text-slate-500 font-medium mt-1 truncate">
            Tareas pendientes
          </div>
        </a>
      </div>

      <!-- Analytics Charts Grid (3 Charts) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Chart 1: Monthly Inquiries Evolution -->
        <div class="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-2xs">
          <div>
            <div class="flex items-center justify-between mb-1">
              <h3 class="text-sm font-bold text-slate-900">Evolución de Consultas</h3>
              <span class="text-xs font-semibold text-emerald-600 flex items-center gap-1 font-mono">
                <span class="material-icons text-xs">trending_up</span> +33% mes
              </span>
            </div>
            <p class="text-xs text-slate-500 mb-6">Leads recibidos en los últimos 6 meses</p>

            <!-- Custom Bar Chart -->
            <div class="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100">
              @for (item of monthlyInquiries; track item.month; let idx = $index) {
                <div class="flex-1 flex flex-col items-center gap-2 group">
                  <span class="text-[10px] font-mono font-medium text-slate-500 group-hover:text-teal-600 tabular-nums">
                    {{ item.count }}
                  </span>
                  <div class="w-full bg-slate-100 rounded-t h-32 flex items-end">
                    <div 
                      [style.height.%]="getBarHeight(item.count)"
                      class="w-full rounded-t transition-all duration-300"
                      [class.bg-teal-600]="idx === monthlyInquiries.length - 1"
                      [class.group-hover:bg-teal-700]="idx === monthlyInquiries.length - 1"
                      [class.bg-slate-300]="idx !== monthlyInquiries.length - 1"
                      [class.group-hover:bg-slate-400]="idx !== monthlyInquiries.length - 1"
                    ></div>
                  </div>
                  <span class="text-[11px] font-medium text-slate-600">
                    {{ item.month }}
                  </span>
                </div>
              }
            </div>
          </div>
          
          <div class="mt-4 pt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Promedio mensual: <strong class="text-slate-800 font-mono">33.3</strong></span>
            <a 
              routerLink="/reports"
              class="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1 cursor-pointer no-underline"
            >
              Ver reporte detallado <span class="material-icons text-xs">chevron_right</span>
            </a>
          </div>
        </div>

        <!-- Chart 2: Property Distribution by Operation -->
        <div class="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-2xs">
          <div>
            <div class="flex items-center justify-between mb-1">
              <h3 class="text-sm font-bold text-slate-900">Distribución por Operación</h3>
              <span class="text-xs text-slate-400 font-mono">{{ totalProperties() }} propiedades</span>
            </div>
            <p class="text-xs text-slate-500 mb-6">Composición del inventario activo</p>

            <!-- Segmented Bar & Stats -->
            <div class="space-y-4">
              <div class="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div 
                  [style.width.%]="(ventasCount() / (totalProperties() || 1)) * 100" 
                  class="bg-[#0A192F] h-full" 
                  [attr.title]="'Venta: ' + ventasCount()"
                ></div>
                <div 
                  [style.width.%]="(alquileresCount() / (totalProperties() || 1)) * 100" 
                  class="bg-teal-500 h-full" 
                  [attr.title]="'Alquiler: ' + alquileresCount()"
                ></div>
                <div 
                  [style.width.%]="(temporariosCount() / (totalProperties() || 1)) * 100" 
                  class="bg-amber-400 h-full" 
                  [attr.title]="'Temporario: ' + temporariosCount()"
                ></div>
              </div>

              <div class="space-y-2.5 pt-2">
                <div class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#0A192F]"></span>
                    <span class="text-slate-700 font-medium">Venta tradicional</span>
                  </div>
                  <div class="flex items-center gap-3 font-mono">
                    <span class="font-bold text-slate-900">{{ ventasCount() }}</span>
                    <span class="text-slate-400 w-10 text-right">
                      {{ Math.round((ventasCount() / (totalProperties() || 1)) * 100) }}%
                    </span>
                  </div>
                </div>

                <div class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                    <span class="text-slate-700 font-medium">Alquiler tradicional</span>
                  </div>
                  <div class="flex items-center gap-3 font-mono">
                    <span class="font-bold text-slate-900">{{ alquileresCount() }}</span>
                    <span class="text-slate-400 w-10 text-right">
                      {{ Math.round((alquileresCount() / (totalProperties() || 1)) * 100) }}%
                    </span>
                  </div>
                </div>

                <div class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span class="text-slate-700 font-medium">Alquiler temporario / amoblado</span>
                  </div>
                  <div class="flex items-center gap-3 font-mono">
                    <span class="font-bold text-slate-900">{{ temporariosCount() }}</span>
                    <span class="text-slate-400 w-10 text-right">
                      {{ Math.round((temporariosCount() / (totalProperties() || 1)) * 100) }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Objetivo captación: <strong class="text-slate-800">70% Venta</strong></span>
            <a 
              routerLink="/properties"
              class="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1 cursor-pointer no-underline"
            >
              Explorar inventario <span class="material-icons text-xs">chevron_right</span>
            </a>
          </div>
        </div>

        <!-- Chart 3: Opportunities Pipeline Funnel -->
        <div class="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-2xs">
          <div>
            <div class="flex items-center justify-between mb-1">
              <h3 class="text-sm font-bold text-slate-900">Embudo de Oportunidades</h3>
              <span class="text-xs font-semibold text-teal-600 font-mono">
                {{ activeOpportunities().length }} en curso
              </span>
            </div>
            <p class="text-xs text-slate-500 mb-4">Etapas de negociación comercial</p>

            <!-- Funnel Rows -->
            <div class="space-y-2">
              @for (f of funnelStages; track f.stage) {
                <div class="space-y-1">
                  <div class="flex justify-between text-xs">
                    <span class="text-slate-600 font-medium">{{ f.stage }}</span>
                    <span class="font-mono font-bold text-slate-900">{{ f.count }}</span>
                  </div>
                  <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div [style.width]="f.width" class="h-full rounded-full" [class]="f.color"></div>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Volumen estimado: <strong class="text-slate-800 font-mono">USD 2.2M</strong></span>
            <a 
              routerLink="/opportunities"
              class="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1 cursor-pointer no-underline"
            >
              Abrir Kanban <span class="material-icons text-xs">chevron_right</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Operational Triple-Section: Consultas Recientes, Próximas Visitas, Tareas Pendientes -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Recent Inquiries List -->
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-2xs">
          <div class="p-4 border-b border-slate-200 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-icons text-teal-600 text-sm">chat</span>
              <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Últimas Consultas
              </h3>
            </div>
            <a 
              routerLink="/leads"
              class="text-xs text-teal-600 hover:text-teal-700 font-medium cursor-pointer no-underline"
            >
              Ver todas ({{ crm.leads().length }})
            </a>
          </div>

          <div class="divide-y divide-slate-100 flex-1">
            @for (l of crm.leads().slice(0, 4); track l.id) {
              <a 
                routerLink="/leads"
                class="p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer group block no-underline"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-semibold text-slate-900 group-hover:text-teal-700">
                    {{ l.contactName }}
                  </span>
                  <span class="text-[10px] text-slate-400 font-mono">{{ l.receivedAt }}</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-slate-600 mb-1.5">
                  <span class="text-[11px] font-mono text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                    {{ l.propertyCode }}
                  </span>
                  <span class="text-[11px] text-slate-400 font-medium">vía {{ l.portalSource }}</span>
                </div>
                <p class="text-xs text-slate-600 line-clamp-2 italic">
                  "{{ l.message }}"
                </p>
              </a>
            }
          </div>
        </div>

        <!-- Upcoming Scheduled Visits -->
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-2xs">
          <div class="p-4 border-b border-slate-200 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-icons text-purple-600 text-sm">calendar_today</span>
              <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Próximas Visitas
              </h3>
            </div>
            <a 
              routerLink="/calendar"
              class="text-xs text-teal-600 hover:text-teal-700 font-medium cursor-pointer no-underline"
            >
              Agenda completa ({{ crm.visits().length }})
            </a>
          </div>

          <div class="divide-y divide-slate-100 flex-1">
            @for (v of crm.visits().slice(0, 3); track v.id) {
              <a 
                routerLink="/calendar"
                class="p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer group block no-underline"
              >
                <div class="flex items-center justify-between mb-1">
                  <div class="flex items-center gap-1.5 text-xs font-bold text-purple-900 font-mono">
                    <span class="material-icons text-purple-600 text-xs">schedule</span>
                    <span>{{ v.date }} · {{ v.time }} hs</span>
                  </div>
                  <span class="text-[10px] font-medium px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    {{ v.status }}
                  </span>
                </div>

                <div class="text-xs font-semibold text-slate-900 group-hover:text-purple-700 truncate">
                  {{ v.contactName }}
                </div>
                <div class="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                  <span class="material-icons text-slate-400 text-xs">place</span>
                  <span class="truncate">{{ v.propertyTitle }} ({{ v.propertyCode }})</span>
                </div>
                <div class="text-[11px] text-slate-400 mt-1">
                  Asignado: {{ v.agentName }}
                </div>
              </a>
            }
          </div>
        </div>

        <!-- Actionable Pending Tasks -->
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-2xs">
          <div class="p-4 border-b border-slate-200 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-icons text-rose-600 text-sm">check_box</span>
              <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Tareas Pendientes
              </h3>
            </div>
            <button 
              type="button"
              (click)="showAddTask.set(!showAddTask())"
              class="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-0.5 cursor-pointer"
            >
              <span class="material-icons text-xs">add</span>
              {{ showAddTask() ? 'Cancelar' : 'Nueva tarea' }}
            </button>
          </div>

          <!-- Quick Add Task form -->
          @if (showAddTask()) {
            <form [formGroup]="taskForm" (ngSubmit)="onCreateTask()" class="p-3 bg-slate-50 border-b border-slate-200 flex gap-2">
              <input
                type="text"
                formControlName="title"
                placeholder="Descripción de la tarea..."
                class="flex-1 text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <button
                type="submit"
                [disabled]="taskForm.invalid"
                class="px-3 py-1.5 bg-teal-600 disabled:opacity-50 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Agregar
              </button>
            </form>
          }

          <div class="divide-y divide-slate-100 flex-1">
            @for (t of crm.tasks().slice(0, 4); track t.id) {
              <div class="p-3.5 flex items-start gap-3 hover:bg-slate-50/80 transition-colors">
                <input
                  type="checkbox"
                  [checked]="t.completed"
                  (change)="crm.toggleTaskCompleted(t.id)"
                  class="mt-0.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
                />
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2 mb-0.5">
                    <span 
                      class="text-xs font-medium truncate"
                      [class.line-through]="t.completed"
                      [class.text-slate-400]="t.completed"
                      [class.text-slate-900]="!t.completed"
                    >
                      {{ t.title }}
                    </span>
                    <span 
                      class="text-[9px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0"
                      [class.bg-rose-50]="t.priority === 'Alta'"
                      [class.text-rose-700]="t.priority === 'Alta'"
                      [class.border]="t.priority === 'Alta'"
                      [class.border-rose-200]="t.priority === 'Alta'"
                      [class.bg-amber-50]="t.priority === 'Media'"
                      [class.text-amber-700]="t.priority === 'Media'"
                      [class.bg-slate-100]="t.priority === 'Baja'"
                      [class.text-slate-600]="t.priority === 'Baja'"
                    >
                      {{ t.priority }}
                    </span>
                  </div>

                  <div class="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>Vence: {{ t.dueDate }}</span>
                    <span>·</span>
                    <span class="truncate">{{ t.assignedTo }}</span>
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
export class DashboardComponent {
  crm = inject(CrmService);
  currency = inject(CurrencyService);

  readonly Math = Math;

  readonly showAddTask = signal<boolean>(false);
  readonly taskForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] })
  });

  // Computed metrics
  readonly totalProperties = computed(() => this.crm.properties().length);
  readonly publishedProperties = computed(() => 
    this.crm.properties().filter(p => Object.values(p.portals).some(Boolean)).length
  );
  readonly reservedProperties = computed(() => 
    this.crm.properties().filter(p => p.status === 'Reservada').length
  );
  readonly totalLeads = computed(() => this.crm.leads().length);
  readonly activeOpportunities = computed(() => 
    this.crm.opportunities().filter(o => o.stage !== 'cierre_ganado' && o.stage !== 'cierre_perdido')
  );
  readonly scheduledVisits = computed(() => 
    this.crm.visits().filter(v => v.status === 'Programada')
  );
  readonly pendingTasks = computed(() => 
    this.crm.tasks().filter(t => !t.completed)
  );

  // Operation counts
  readonly ventasCount = computed(() => 
    this.crm.properties().filter(p => p.operation === 'Venta').length
  );
  readonly alquileresCount = computed(() => 
    this.crm.properties().filter(p => p.operation === 'Alquiler').length
  );
  readonly temporariosCount = computed(() => 
    this.crm.properties().filter(p => p.operation === 'Alquiler Temporal').length
  );

  // Inquiries trend data
  readonly monthlyInquiries = [
    { month: 'May', count: 18 },
    { month: 'Jun', count: 24 },
    { month: 'Jul', count: 31 },
    { month: 'Ago', count: 29 },
    { month: 'Sep', count: 42 },
    { month: 'Oct', count: 56 },
  ];
  readonly maxInquiries = 56;

  // Funnel stages
  readonly funnelStages = [
    { stage: 'Contacto & Calificación', count: 4, width: '100%', color: 'bg-slate-300' },
    { stage: 'Visitas Coordinadas', count: 3, width: '75%', color: 'bg-teal-400' },
    { stage: 'Negociación y Ofertas', count: 2, width: '50%', color: 'bg-teal-600' },
    { stage: 'Reserva & Boleto', count: 1, width: '25%', color: 'bg-amber-500' },
  ];

  getBarHeight(count: number): number {
    return Math.round((count / this.maxInquiries) * 100);
  }

  onCreateTask(): void {
    if (this.taskForm.invalid) return;
    const title = this.taskForm.getRawValue().title.trim();
    if (!title) return;

    this.crm.addTask({
      title,
      dueDate: new Date().toISOString().split('T')[0],
      assignedTo: 'Martín Somoza',
      priority: 'Media'
    });

    this.taskForm.reset();
    this.showAddTask.set(false);
  }
}
