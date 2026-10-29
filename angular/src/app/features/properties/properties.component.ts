import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CrmService } from '../../core/services/crm.service';
import { CurrencyService } from '../../core/services/currency.service';
import { Property, PropertyStatus } from '../../models/crm.models';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';
import { PropertyDetailModalComponent } from './property-detail-modal.component';
import { PropertyFormModalComponent } from './property-form-modal.component';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    CurrencyFormatPipe,
    PropertyDetailModalComponent,
    PropertyFormModalComponent
  ],
  template: `
    <div class="p-6 space-y-5 max-w-7xl mx-auto">
      
      <!-- Top Header & Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">
            Inventario de Inmuebles
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Gestión completa de cartera, publicación en portales y control de estados comerciales
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <!-- Table / Card Switcher -->
          <div class="flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-lg">
            <button
              type="button"
              (click)="viewMode.set('table')"
              class="p-1.5 rounded-md transition-colors cursor-pointer"
              [class.bg-white]="viewMode() === 'table'"
              [class.text-slate-900]="viewMode() === 'table'"
              [class.shadow-2xs]="viewMode() === 'table'"
              [class.text-slate-500]="viewMode() !== 'table'"
              title="Vista en tabla detallada"
            >
              <span class="material-icons text-base">table_rows</span>
            </button>
            <button
              type="button"
              (click)="viewMode.set('cards')"
              class="p-1.5 rounded-md transition-colors cursor-pointer"
              [class.bg-white]="viewMode() === 'cards'"
              [class.text-slate-900]="viewMode() === 'cards'"
              [class.shadow-2xs]="viewMode() === 'cards'"
              [class.text-slate-500]="viewMode() !== 'cards'"
              title="Vista en tarjetas fotográficas"
            >
              <span class="material-icons text-base">grid_view</span>
            </button>
          </div>

          <!-- New Property Button -->
          <button
            type="button"
            (click)="openCreateModal()"
            class="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <span class="material-icons text-white text-base">add</span>
            <span>Nueva propiedad</span>
          </button>
        </div>
      </div>

      <!-- Filter and Search Bar -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          
          <!-- Text Search -->
          <div class="lg:col-span-4 relative">
            <span class="material-icons text-slate-400 absolute left-3 top-2.5 text-base pointer-events-none">search</span>
            <input
              type="text"
              [value]="searchTerm()"
              (input)="onSearchChange($event)"
              placeholder="Buscar por código, calle o barrio..."
              class="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <!-- Operation Filter -->
          <div class="lg:col-span-2">
            <select
              [value]="filterOperation()"
              (change)="filterOperation.set($any($event.target).value); currentPage.set(1)"
              class="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
            >
              <option value="all">Todas las operaciones</option>
              <option value="Venta">Venta</option>
              <option value="Alquiler">Alquiler</option>
              <option value="Alquiler Temporal">Alquiler Temporal</option>
            </select>
          </div>

          <!-- Type Filter -->
          <div class="lg:col-span-2">
            <select
              [value]="filterType()"
              (change)="filterType.set($any($event.target).value); currentPage.set(1)"
              class="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
            >
              <option value="all">Todos los tipos</option>
              <option value="Departamento">Departamento</option>
              <option value="Casa">Casa</option>
              <option value="PH">PH</option>
              <option value="Oficina">Oficina</option>
              <option value="Terreno">Terreno</option>
              <option value="Local Comercial">Local Comercial</option>
            </select>
          </div>

          <!-- Neighborhood Filter -->
          <div class="lg:col-span-2">
            <select
              [value]="filterNeighborhood()"
              (change)="filterNeighborhood.set($any($event.target).value); currentPage.set(1)"
              class="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
            >
              <option value="all">Todas las zonas</option>
              @for (n of uniqueNeighborhoods(); track n) {
                <option [value]="n">{{ n }}</option>
              }
            </select>
          </div>

          <!-- Status Filter -->
          <div class="lg:col-span-2">
            <select
              [value]="filterStatus()"
              (change)="filterStatus.set($any($event.target).value); currentPage.set(1)"
              class="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
            >
              <option value="all">Todos los estados</option>
              <option value="Disponible">Disponible</option>
              <option value="Reservada">Reservada</option>
              <option value="Vendida">Vendida</option>
              <option value="Alquilada">Alquilada</option>
              <option value="Suspendida">Suspendida</option>
            </select>
          </div>
        </div>

        <!-- Status Summary & Bulk Export -->
        <div class="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
          <div class="flex items-center gap-3">
            <span>Resultados: <strong class="text-slate-800 font-mono">{{ filteredProperties().length }}</strong></span>
            <span>·</span>
            <span>Disponibles: <strong class="text-emerald-700 font-mono">{{ availableCount() }}</strong></span>
            <span>·</span>
            <span>Reservadas: <strong class="text-amber-700 font-mono">{{ reservedCount() }}</strong></span>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              (click)="exportCsv()"
              class="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span class="material-icons text-sm">download</span>
              <span>Exportar CSV</span>
            </button>

            @if (hasActiveFilters()) {
              <button
                type="button"
                (click)="clearFilters()"
                class="text-teal-700 hover:underline font-semibold cursor-pointer"
              >
                Limpiar filtros
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Bulk Actions Floating Bar (When rows selected) -->
      @if (selectedIds().length > 0) {
        <div class="p-3 bg-[#0A192F] text-white rounded-xl shadow-lg border border-[#1E3A5F] flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
          <div class="flex items-center gap-3 text-xs">
            <span class="font-mono font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-500/40">
              {{ selectedIds().length }} seleccionadas
            </span>
            <span class="text-slate-300">Acciones masivas de cartera:</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="bulkChangeStatus('Disponible')"
              class="px-2.5 py-1 text-xs bg-emerald-950 text-emerald-300 border border-emerald-600/40 rounded cursor-pointer"
            >
              Marcar Disponibles
            </button>
            <button
              type="button"
              (click)="bulkChangeStatus('Reservada')"
              class="px-2.5 py-1 text-xs bg-amber-950 text-amber-300 border border-amber-600/40 rounded cursor-pointer"
            >
              Marcar Reservadas
            </button>
            <button
              type="button"
              (click)="bulkChangeStatus('Suspendida')"
              class="px-2.5 py-1 text-xs bg-slate-800 text-slate-300 border border-slate-700 rounded cursor-pointer"
            >
              Archivar
            </button>
            <button
              type="button"
              (click)="bulkDelete()"
              class="px-2.5 py-1 text-xs bg-rose-950 text-rose-300 border border-rose-600/40 rounded cursor-pointer"
            >
              Eliminar
            </button>
            <button
              type="button"
              (click)="selectedIds.set([])"
              class="px-2 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      }

      <!-- TABLE VIEW -->
      @if (viewMode() === 'table') {
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th class="p-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      [checked]="selectedIds().length > 0 && selectedIds().length === pagedProperties().length"
                      (change)="toggleSelectAll()"
                      class="rounded border-slate-300 cursor-pointer"
                    />
                  </th>
                  <th class="p-3.5 cursor-pointer" (click)="setSort('code')">
                    <div class="flex items-center gap-1">
                      <span>Código</span>
                      <span class="material-icons text-xs text-slate-400">unfold_more</span>
                    </div>
                  </th>
                  <th class="p-3.5">Foto</th>
                  <th class="p-3.5 min-w-[220px]">Título / Dirección</th>
                  <th class="p-3.5">Tipo &amp; Operación</th>
                  <th class="p-3.5">Ubicación</th>
                  <th class="p-3.5 cursor-pointer text-right" (click)="setSort('price')">
                    <div class="flex items-center justify-end gap-1">
                      <span>Precio</span>
                      <span class="material-icons text-xs text-slate-400">unfold_more</span>
                    </div>
                  </th>
                  <th class="p-3.5 text-center">Amb / M²</th>
                  <th class="p-3.5 text-center">Estado</th>
                  <th class="p-3.5 text-center">Portales</th>
                  <th class="p-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @if (pagedProperties().length === 0) {
                  <tr>
                    <td colSpan="11" class="p-8 text-center text-slate-400 text-xs">
                      No se encontraron propiedades que coincidan con los filtros aplicados.
                    </td>
                  </tr>
                } @else {
                  @for (prop of pagedProperties(); track prop.id) {
                    <tr 
                      class="hover:bg-slate-50/80 transition-colors"
                      [class.bg-teal-50/40]="selectedIds().includes(prop.id)"
                    >
                      <td class="p-3.5 text-center">
                        <input
                          type="checkbox"
                          [checked]="selectedIds().includes(prop.id)"
                          (change)="toggleSelectOne(prop.id)"
                          class="rounded border-slate-300 cursor-pointer"
                        />
                      </td>

                      <td class="p-3.5 font-mono font-bold text-teal-700 whitespace-nowrap">
                        {{ prop.code }}
                      </td>

                      <td class="p-3.5">
                        <div 
                          (click)="openDetail(prop)"
                          class="w-14 h-10 rounded-md overflow-hidden bg-slate-100 border border-slate-200 shrink-0 cursor-pointer group"
                        >
                          <img 
                            [src]="prop.mainImage" 
                            [alt]="prop.title" 
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            referrerpolicy="no-referrer"
                          />
                        </div>
                      </td>

                      <td class="p-3.5">
                        <button
                          type="button"
                          (click)="openDetail(prop)"
                          class="font-bold text-slate-900 hover:text-teal-700 text-left line-clamp-1 cursor-pointer block"
                        >
                          {{ prop.title }}
                        </button>
                        <div class="text-[11px] text-slate-500 line-clamp-1">
                          {{ prop.address }}
                        </div>
                      </td>

                      <td class="p-3.5 whitespace-nowrap">
                        <span class="font-medium text-slate-800">{{ prop.propertyType }}</span>
                        <span class="block text-[11px] text-slate-400">{{ prop.operation }}</span>
                      </td>

                      <td class="p-3.5 whitespace-nowrap">
                        <span class="font-medium text-slate-800">{{ prop.neighborhood }}</span>
                        <span class="block text-[11px] text-slate-400">{{ prop.city }}</span>
                      </td>

                      <td class="p-3.5 text-right font-mono font-bold text-slate-900 whitespace-nowrap tabular-nums">
                        {{ prop.price | crmCurrency:prop.currency }}
                      </td>

                      <td class="p-3.5 text-center font-mono whitespace-nowrap">
                        <span class="font-semibold text-slate-800">{{ prop.rooms }} amb</span>
                        <span class="block text-[11px] text-slate-400">{{ prop.totalSurface }} m²</span>
                      </td>

                      <td class="p-3.5 text-center whitespace-nowrap">
                        <span 
                          class="inline-block px-2 py-0.5 rounded text-[11px] font-semibold"
                          [class.bg-emerald-50]="prop.status === 'Disponible'"
                          [class.text-emerald-700]="prop.status === 'Disponible'"
                          [class.border]="prop.status === 'Disponible'"
                          [class.border-emerald-200]="prop.status === 'Disponible'"
                          [class.bg-amber-50]="prop.status === 'Reservada'"
                          [class.text-amber-700]="prop.status === 'Reservada'"
                          [class.border-amber-200]="prop.status === 'Reservada'"
                          [class.bg-slate-100]="prop.status === 'Vendida' || prop.status === 'Alquilada'"
                          [class.text-slate-600]="prop.status === 'Vendida' || prop.status === 'Alquilada'"
                          [class.bg-rose-50]="prop.status === 'Suspendida'"
                          [class.text-rose-700]="prop.status === 'Suspendida'"
                        >
                          {{ prop.status }}
                        </span>
                      </td>

                      <!-- Portals status dots -->
                      <td class="p-3.5 text-center whitespace-nowrap">
                        <div class="flex items-center justify-center gap-1.5">
                          <span 
                            class="w-2 h-2 rounded-full cursor-help"
                            [class.bg-rose-500]="prop.portals.zonaprop"
                            [class.bg-slate-200]="!prop.portals.zonaprop"
                            [attr.title]="'Zonaprop: ' + (prop.portals.zonaprop ? 'Conectado' : 'Inactivo')"
                          ></span>
                          <span 
                            class="w-2 h-2 rounded-full cursor-help"
                            [class.bg-blue-500]="prop.portals.argenprop"
                            [class.bg-slate-200]="!prop.portals.argenprop"
                            [attr.title]="'Argenprop: ' + (prop.portals.argenprop ? 'Conectado' : 'Inactivo')"
                          ></span>
                          <span 
                            class="w-2 h-2 rounded-full cursor-help"
                            [class.bg-amber-500]="prop.portals.mercadolibre"
                            [class.bg-slate-200]="!prop.portals.mercadolibre"
                            [attr.title]="'Mercado Libre: ' + (prop.portals.mercadolibre ? 'Conectado' : 'Inactivo')"
                          ></span>
                        </div>
                      </td>

                      <!-- Actions -->
                      <td class="p-3.5 text-right whitespace-nowrap">
                        <div class="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            (click)="openDetail(prop)"
                            class="p-1 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded cursor-pointer"
                            title="Ver ficha completa"
                          >
                            <span class="material-icons text-base">visibility</span>
                          </button>
                          <button
                            type="button"
                            (click)="openEditModal(prop)"
                            class="p-1 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded cursor-pointer"
                            title="Editar propiedad"
                          >
                            <span class="material-icons text-base">edit</span>
                          </button>
                          <button
                            type="button"
                            (click)="duplicateProp(prop.id)"
                            class="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
                            title="Duplicar propiedad"
                          >
                            <span class="material-icons text-base">content_copy</span>
                          </button>
                          <button
                            type="button"
                            (click)="deleteProp(prop)"
                            class="p-1 text-slate-500 hover:text-rose-700 hover:bg-slate-100 rounded cursor-pointer"
                            title="Eliminar propiedad"
                          >
                            <span class="material-icons text-base">delete_outline</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination Bar -->
          <div class="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              Mostrando {{ pagedProperties().length }} de {{ filteredProperties().length }} propiedades
            </span>

            <div class="flex items-center gap-1">
              <button
                type="button"
                [disabled]="currentPage() === 1"
                (click)="currentPage.set(currentPage() - 1)"
                class="px-2.5 py-1 bg-white border border-slate-200 rounded disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
              >
                Anterior
              </button>
              
              <span class="px-2 py-1 font-mono font-bold text-slate-800">
                {{ currentPage() }} / {{ totalPages() }}
              </span>

              <button
                type="button"
                [disabled]="currentPage() >= totalPages()"
                (click)="currentPage.set(currentPage() + 1)"
                class="px-2.5 py-1 bg-white border border-slate-200 rounded disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      }

      <!-- CARDS / GRID VIEW -->
      @if (viewMode() === 'cards') {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (prop of pagedProperties(); track prop.id) {
            <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group">
              
              <!-- Card Image & Overlay Badges -->
              <div 
                class="relative h-48 bg-slate-100 overflow-hidden cursor-pointer"
                (click)="openDetail(prop)"
              >
                <img 
                  [src]="prop.mainImage" 
                  [alt]="prop.title" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  referrerpolicy="no-referrer"
                />
                <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-[#0A192F]/85 text-white backdrop-blur-xs font-mono">
                    {{ prop.code }}
                  </span>
                  <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/90 text-slate-800 backdrop-blur-xs">
                    {{ prop.operation }}
                  </span>
                </div>
                <div class="absolute top-2.5 right-2.5">
                  <span 
                    class="px-2 py-0.5 rounded text-[11px] font-semibold backdrop-blur-xs"
                    [class.bg-emerald-500]="prop.status === 'Disponible'"
                    [class.text-white]="prop.status === 'Disponible'"
                    [class.bg-amber-500]="prop.status === 'Reservada'"
                    [class.text-white]="prop.status === 'Reservada'"
                    [class.bg-slate-700]="prop.status === 'Vendida' || prop.status === 'Alquilada'"
                    [class.text-white]="prop.status === 'Vendida' || prop.status === 'Alquilada'"
                    [class.bg-rose-600]="prop.status === 'Suspendida'"
                    [class.text-white]="prop.status === 'Suspendida'"
                  >
                    {{ prop.status }}
                  </span>
                </div>

                <div class="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                  {{ prop.propertyType }}
                </div>
              </div>

              <!-- Card Body -->
              <div class="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div class="flex items-baseline justify-between mb-1">
                    <span class="text-xl font-bold text-slate-900 font-mono">
                      {{ prop.price | crmCurrency:prop.currency }}
                    </span>
                    @if (prop.expenses > 0) {
                      <span class="text-xs text-slate-500 font-mono">Exp: $ {{ prop.expenses | number }}</span>
                    }
                  </div>

                  <h3 
                    (click)="openDetail(prop)"
                    class="text-xs font-bold text-slate-800 line-clamp-1 mb-1 hover:text-teal-600 cursor-pointer"
                  >
                    {{ prop.title }}
                  </h3>
                  
                  <p class="text-xs text-slate-500 mb-3 line-clamp-1">
                    {{ prop.address }}, {{ prop.neighborhood }}
                  </p>

                  <!-- Specs row -->
                  <div class="grid grid-cols-4 gap-1 py-2.5 border-y border-slate-100 text-xs text-slate-600 text-center font-mono">
                    <div>
                      <span class="block font-bold text-slate-800">{{ prop.totalSurface }}m²</span>
                      <span class="text-[10px] text-slate-400">Total</span>
                    </div>
                    <div>
                      <span class="block font-bold text-slate-800">{{ prop.rooms }}</span>
                      <span class="text-[10px] text-slate-400">Amb</span>
                    </div>
                    <div>
                      <span class="block font-bold text-slate-800">{{ prop.bedrooms }}</span>
                      <span class="text-[10px] text-slate-400">Dorm</span>
                    </div>
                    <div>
                      <span class="block font-bold text-slate-800">{{ prop.garages }}</span>
                      <span class="text-[10px] text-slate-400">Coch</span>
                    </div>
                  </div>
                </div>

                <!-- Footer with Portals & Actions -->
                <div class="pt-3 mt-3 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-1.5">
                    <span class="text-[11px] text-slate-400">Portales:</span>
                    <span 
                      class="w-2 h-2 rounded-full" 
                      [class.bg-rose-500]="prop.portals.zonaprop" 
                      [class.bg-slate-200]="!prop.portals.zonaprop"
                      title="Zonaprop"
                    ></span>
                    <span 
                      class="w-2 h-2 rounded-full" 
                      [class.bg-blue-500]="prop.portals.argenprop" 
                      [class.bg-slate-200]="!prop.portals.argenprop"
                      title="Argenprop"
                    ></span>
                    <span 
                      class="w-2 h-2 rounded-full" 
                      [class.bg-amber-500]="prop.portals.mercadolibre" 
                      [class.bg-slate-200]="!prop.portals.mercadolibre"
                      title="Mercado Libre"
                    ></span>
                  </div>

                  <div class="flex items-center gap-1">
                    <button
                      type="button"
                      (click)="openDetail(prop)"
                      class="px-2 py-1 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded transition-colors cursor-pointer"
                    >
                      Ver ficha
                    </button>
                    <button
                      type="button"
                      (click)="openEditModal(prop)"
                      class="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 cursor-pointer"
                      title="Editar"
                    >
                      <span class="material-icons text-sm">edit</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          }
        </div>

        <!-- Cards Pagination -->
        <div class="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Página {{ currentPage() }} de {{ totalPages() }} ({{ filteredProperties().length }} propiedades)</span>
          <div class="flex items-center gap-2">
            <button
              type="button"
              [disabled]="currentPage() === 1"
              (click)="currentPage.set(currentPage() - 1)"
              class="px-3 py-1 bg-slate-50 border border-slate-200 rounded disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
            >
              Anterior
            </button>
            <button
              type="button"
              [disabled]="currentPage() >= totalPages()"
              (click)="currentPage.set(currentPage() + 1)"
              class="px-3 py-1 bg-slate-50 border border-slate-200 rounded disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        </div>
      }

      <!-- Detailed Property Sheet Modal -->
      @if (selectedProperty()) {
        <app-property-detail-modal
          [property]="selectedProperty()"
          (close)="selectedPropertyId.set(null)"
          (edit)="onEditFromDetail($event)"
        ></app-property-detail-modal>
      }

      <!-- Create / Edit Property Modal -->
      @if (isFormModalOpen()) {
        <app-property-form-modal
          [propertyToEdit]="propertyEditing()"
          (close)="isFormModalOpen.set(false)"
          (saved)="onPropertySaved()"
        ></app-property-form-modal>
      }

    </div>
  `
})
export class PropertiesComponent {
  crm = inject(CrmService);
  currency = inject(CurrencyService);

  readonly viewMode = signal<'table' | 'cards'>('table');
  readonly searchTerm = signal<string>('');
  readonly filterOperation = signal<string>('all');
  readonly filterType = signal<string>('all');
  readonly filterNeighborhood = signal<string>('all');
  readonly filterStatus = signal<string>('all');

  readonly sortField = signal<'price' | 'updatedAt' | 'totalSurface' | 'code'>('updatedAt');
  readonly sortOrder = signal<'asc' | 'desc'>('desc');

  readonly selectedIds = signal<string[]>([]);
  readonly currentPage = signal<number>(1);
  readonly itemsPerPage = 6;

  readonly selectedPropertyId = signal<string | null>(null);
  readonly selectedProperty = computed(() => {
    const id = this.selectedPropertyId();
    if (!id) return null;
    return this.crm.properties().find(p => p.id === id) || null;
  });
  readonly isFormModalOpen = signal<boolean>(false);
  readonly propertyEditing = signal<Property | null>(null);

  readonly uniqueNeighborhoods = computed(() => {
    const set = new Set(this.crm.properties().map(p => p.neighborhood));
    return Array.from(set);
  });

  readonly availableCount = computed(() => 
    this.crm.properties().filter(p => p.status === 'Disponible').length
  );

  readonly reservedCount = computed(() => 
    this.crm.properties().filter(p => p.status === 'Reservada').length
  );

  readonly hasActiveFilters = computed(() => {
    return !!this.searchTerm() || 
      this.filterOperation() !== 'all' || 
      this.filterType() !== 'all' || 
      this.filterNeighborhood() !== 'all' || 
      this.filterStatus() !== 'all';
  });

  readonly filteredProperties = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const op = this.filterOperation();
    const type = this.filterType();
    const zone = this.filterNeighborhood();
    const status = this.filterStatus();
    const field = this.sortField();
    const order = this.sortOrder();

    return this.crm.properties().filter(p => {
      const matchSearch = !term ||
        p.code.toLowerCase().includes(term) ||
        p.title.toLowerCase().includes(term) ||
        p.address.toLowerCase().includes(term) ||
        p.neighborhood.toLowerCase().includes(term);

      const matchOp = op === 'all' || p.operation === op;
      const matchType = type === 'all' || p.propertyType === type;
      const matchZone = zone === 'all' || p.neighborhood === zone;
      const matchStatus = status === 'all' || p.status === status;

      return matchSearch && matchOp && matchType && matchZone && matchStatus;
    }).sort((a, b) => {
      let result = 0;
      if (field === 'price') {
        result = a.price - b.price;
      } else if (field === 'totalSurface') {
        result = a.totalSurface - b.totalSurface;
      } else if (field === 'code') {
        result = a.code.localeCompare(b.code);
      } else {
        result = a.updatedAt.localeCompare(b.updatedAt);
      }
      return order === 'asc' ? result : -result;
    });
  });

  readonly totalPages = computed(() => {
    const count = this.filteredProperties().length;
    return Math.ceil(count / this.itemsPerPage) || 1;
  });

  readonly pagedProperties = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * this.itemsPerPage;
    return this.filteredProperties().slice(start, start + this.itemsPerPage);
  });

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.currentPage.set(1);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.filterOperation.set('all');
    this.filterType.set('all');
    this.filterNeighborhood.set('all');
    this.filterStatus.set('all');
    this.currentPage.set(1);
  }

  setSort(field: 'price' | 'updatedAt' | 'totalSurface' | 'code'): void {
    if (this.sortField() === field) {
      this.sortOrder.update(o => o === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortOrder.set('desc');
    }
  }

  toggleSelectAll(): void {
    const current = this.selectedIds();
    const paged = this.pagedProperties();
    if (current.length === paged.length) {
      this.selectedIds.set([]);
    } else {
      this.selectedIds.set(paged.map(p => p.id));
    }
  }

  toggleSelectOne(id: string): void {
    this.selectedIds.update(list => 
      list.includes(id) ? list.filter(i => i !== id) : [...list, id]
    );
  }

  bulkChangeStatus(status: PropertyStatus): void {
    const ids = this.selectedIds();
    ids.forEach(id => this.crm.updateProperty(id, { status }));
    this.selectedIds.set([]);
  }

  bulkDelete(): void {
    const ids = this.selectedIds();
    if (confirm(`¿Confirma eliminar las ${ids.length} propiedades seleccionadas?`)) {
      ids.forEach(id => this.crm.deleteProperty(id));
      this.selectedIds.set([]);
    }
  }

  exportCsv(): void {
    const rows = this.filteredProperties().map(p => 
      `"${p.code}","${p.title}","${p.address}","${p.propertyType}","${p.operation}","${p.price} ${p.currency}","${p.totalSurface}m2","${p.status}"`
    );
    const csvContent = "data:text/csv;charset=utf-8,Código,Título,Dirección,Tipo,Operación,Precio,Superficie,Estado\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nexo_propiedades_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  openDetail(property: Property): void {
    this.selectedPropertyId.set(property.id);
  }

  openCreateModal(): void {
    this.propertyEditing.set(null);
    this.isFormModalOpen.set(true);
  }

  openEditModal(property: Property): void {
    this.propertyEditing.set(property);
    this.isFormModalOpen.set(true);
  }

  onEditFromDetail(property: Property): void {
    this.selectedPropertyId.set(null);
    this.openEditModal(property);
  }

  duplicateProp(id: string): void {
    this.crm.duplicateProperty(id);
  }

  deleteProp(property: Property): void {
    if (confirm(`¿Confirma eliminar la propiedad ${property.code} — ${property.title}?`)) {
      this.crm.deleteProperty(property.id);
      if (this.selectedPropertyId() === property.id) {
        this.selectedPropertyId.set(null);
      }
    }
  }

  onPropertySaved(): void {
    this.isFormModalOpen.set(false);
  }
}
