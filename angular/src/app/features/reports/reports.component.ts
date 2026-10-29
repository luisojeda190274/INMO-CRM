import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmService } from '../../core/services/crm.service';
import { CurrencyService } from '../../core/services/currency.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, StatCardComponent, CurrencyFormatPipe],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      
      <app-page-header
        title="Reportes y Estadísticas Comerciales"
        subtitle="Métricas de conversión, rendimiento por portal y efectividad del equipo de asesores."
      ></app-page-header>

      <!-- KPI Overview -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <app-stat-card
          title="Tasa de conversión de leads"
          value="18.4%"
          subtext="Consultas que se transforman en visitas"
          iconText="🎯"
          iconBgClass="bg-emerald-50"
          iconColorClass="text-emerald-600"
          badge="+3.2%"
          badgeLabel="vs. trimestre anterior"
        ></app-stat-card>

        <app-stat-card
          title="Días promedio en cartera"
          value="42 días"
          subtext="Desde alta hasta reserva"
          iconText="⏱️"
          iconBgClass="bg-blue-50"
          iconColorClass="text-blue-600"
          badge="Óptimo"
          badgeLabel="Meta: < 60 días"
        ></app-stat-card>

        <app-stat-card
          title="Comisiones estimadas"
          [value]="(crm.totalPortfolioValueUSD() * 0.03 | crmCurrency:'USD')"
          subtext="Base arancel broker 3% / 4%"
          iconText="💼"
          iconBgClass="bg-purple-50"
          iconColorClass="text-purple-600"
          badge="Proyección"
          badgeLabel="Q2 2026"
        ></app-stat-card>
      </div>

      <!-- Ranking de Portales por Generación de Consultas -->
      <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <h3 class="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Distribución de Consultas por Canal
        </h3>

        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-bold text-slate-800">Zonaprop</span>
              <span class="font-semibold text-slate-600">46% (128 consultas)</span>
            </div>
            <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div class="bg-teal-500 h-full rounded-full" style="width: 46%"></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-bold text-slate-800">Argenprop</span>
              <span class="font-semibold text-slate-600">28% (78 consultas)</span>
            </div>
            <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div class="bg-blue-500 h-full rounded-full" style="width: 28%"></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-bold text-slate-800">Mercado Libre Inmuebles</span>
              <span class="font-semibold text-slate-600">18% (50 consultas)</span>
            </div>
            <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div class="bg-amber-500 h-full rounded-full" style="width: 18%"></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-bold text-slate-800">Sitio Web Propio & Redes</span>
              <span class="font-semibold text-slate-600">8% (22 consultas)</span>
            </div>
            <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div class="bg-purple-500 h-full rounded-full" style="width: 8%"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class ReportsComponent {
  crm = inject(CrmService);
  currency = inject(CurrencyService);
}
