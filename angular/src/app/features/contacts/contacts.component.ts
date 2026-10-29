import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmService } from '../../core/services/crm.service';
import { CurrencyService } from '../../core/services/currency.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { Contact, ContactCategory } from '../../models/crm.models';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      
      <app-page-header
        title="Directorio de Contactos"
        subtitle="Gestión de propietarios, compradores, inquilinos e inversores vinculados al CRM."
        [count]="filteredContacts().length"
        actionLabel="Nuevo contacto"
        (actionClicked)="openNewContactModal()"
      ></app-page-header>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2">
        @for (cat of categories; track cat) {
          <button
            type="button"
            (click)="selectedCategory.set(cat)"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
            [class.bg-[#0A192F]]="selectedCategory() === cat"
            [class.text-white]="selectedCategory() === cat"
            [class.bg-white]="selectedCategory() !== cat"
            [class.text-slate-600]="selectedCategory() !== cat"
            [class.border]="selectedCategory() !== cat"
            [class.border-slate-200]="selectedCategory() !== cat"
          >
            {{ cat }}
          </button>
        }
      </div>

      <!-- Contacts Table -->
      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <th class="p-3">Nombre completo</th>
              <th class="p-3">Categoría</th>
              <th class="p-3">Contacto</th>
              <th class="p-3">Origen</th>
              <th class="p-3">Presupuesto máx.</th>
              <th class="p-3">Asignado</th>
              <th class="p-3">Último contacto</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (c of filteredContacts(); track c.id) {
              <tr class="hover:bg-slate-50/80 transition-colors">
                <td class="p-3">
                  <div class="font-bold text-slate-900">{{ c.fullName }}</div>
                  <div class="text-[11px] text-slate-500 flex gap-1 mt-0.5">
                    @for (tag of c.tags; track tag) {
                      <span class="bg-slate-100 px-1 rounded text-[10px] text-slate-600">{{ tag }}</span>
                    }
                  </div>
                </td>
                <td class="p-3">
                  <span class="inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                    {{ c.category }}
                  </span>
                </td>
                <td class="p-3">
                  <div class="text-slate-800 font-medium">{{ c.phone }}</div>
                  <div class="text-slate-400 text-[11px]">{{ c.email }}</div>
                </td>
                <td class="p-3 text-slate-600 font-mono">{{ c.origin }}</td>
                <td class="p-3 font-semibold text-slate-800">
                  @if (c.budgetMax) {
                    {{ c.budgetCurrency || 'USD' }} {{ c.budgetMax | number }}
                  } @else {
                    <span class="text-slate-400">-</span>
                  }
                </td>
                <td class="p-3 text-slate-700 font-medium">{{ c.assignedAgent }}</td>
                <td class="p-3 text-slate-500">{{ c.lastContact }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

    </div>
  `
})
export class ContactsComponent {
  crm = inject(CrmService);
  currency = inject(CurrencyService);

  readonly categories = ['Todos', 'Comprador', 'Propietario', 'Inquilino', 'Inversor', 'Colega'];
  readonly selectedCategory = signal<string>('Todos');

  readonly filteredContacts = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'Todos') return this.crm.contacts();
    return this.crm.contacts().filter(c => c.category === cat);
  });

  openNewContactModal(): void {
    alert('Formulario de Alta de Contacto (Angular) listo para conectar.');
  }
}
