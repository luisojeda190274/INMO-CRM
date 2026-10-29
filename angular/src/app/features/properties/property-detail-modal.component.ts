import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Property, PropertyStatus } from '../../models/crm.models';
import { CrmService } from '../../core/services/crm.service';
import { CurrencyService } from '../../core/services/currency.service';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-property-detail-modal',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    CurrencyFormatPipe, 
    StatusBadgeComponent
  ],
  template: `
    @if (property) {
      <div 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
        (click)="onBackdropClick($event)"
      >
        <div 
          class="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
          (click)="$event.stopPropagation()"
        >
          
          <!-- Top Modal Header -->
          <div class="px-6 py-4 bg-[#0A192F] text-white flex items-center justify-between shrink-0 border-b border-[#1E3A5F]">
            <div class="flex items-center gap-3 truncate">
              <span class="font-mono text-xs font-bold text-teal-400 bg-teal-950 px-2.5 py-1 rounded border border-teal-500/30">
                {{ property.code }}
              </span>
              <div class="truncate">
                <h2 class="text-sm md:text-base font-bold truncate text-white">
                  {{ property.title }}
                </h2>
                <p class="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                  <span class="material-icons text-teal-400 text-xs shrink-0">place</span>
                  <span>{{ property.address }}, {{ property.neighborhood }}, {{ property.city }}</span>
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button
                type="button"
                (click)="copyShareLink()"
                class="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[#132A4A] hover:bg-[#1E3A5F] text-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Copiar enlace público de la propiedad"
              >
                <span class="material-icons text-xs text-teal-400">
                  {{ isCopied() ? 'check' : 'share' }}
                </span>
                <span class="hidden sm:inline">{{ isCopied() ? 'Copiado' : 'Compartir' }}</span>
              </button>

              <button
                type="button"
                (click)="close.emit()"
                class="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#132A4A] transition-colors cursor-pointer"
                aria-label="Cerrar ficha"
              >
                <span class="material-icons text-base">close</span>
              </button>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div class="px-6 bg-slate-100/80 border-b border-slate-200 flex items-center gap-1 overflow-x-auto shrink-0">
            @for (tab of tabs; track tab.id) {
              <button
                type="button"
                (click)="activeTab.set(tab.id)"
                class="px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 cursor-pointer flex items-center gap-1.5"
                [class.border-teal-600]="activeTab() === tab.id"
                [class.text-teal-700]="activeTab() === tab.id"
                [class.bg-white]="activeTab() === tab.id"
                [class.shadow-2xs]="activeTab() === tab.id"
                [class.border-transparent]="activeTab() !== tab.id"
                [class.text-slate-600]="activeTab() !== tab.id"
                [class.hover:text-slate-900]="activeTab() !== tab.id"
              >
                <span class="material-icons text-xs">{{ tab.icon }}</span>
                <span>{{ tab.label }}</span>
                @if (tab.badge !== undefined) {
                  <span class="ml-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                    {{ tab.badge }}
                  </span>
                }
              </button>
            }
          </div>

          <!-- Modal Body Content -->
          <div class="p-6 overflow-y-auto flex-1 space-y-6">
            
            <!-- TAB 1: DATOS GENERALES -->
            @if (activeTab() === 'general') {
              <div class="space-y-6">
                
                <!-- KPI Banner -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span class="text-[10px] text-slate-500 uppercase font-semibold block mb-0.5">Precio de lista</span>
                    <div class="text-xl font-bold text-slate-900 font-mono tabular-nums">
                      {{ property.price | crmCurrency:property.currency }}
                    </div>
                    @if (property.expenses > 0) {
                      <span class="text-[11px] text-slate-500 font-mono">
                        Expensas: $ {{ property.expenses | number }}
                      </span>
                    }
                  </div>

                  <div>
                    <span class="text-[10px] text-slate-500 uppercase font-semibold block mb-0.5">Operación &amp; Tipo</span>
                    <div class="text-sm font-bold text-slate-800">
                      {{ property.propertyType }}
                    </div>
                    <span class="text-xs text-teal-700 font-medium font-mono">
                      {{ property.operation }}
                    </span>
                  </div>

                  <div>
                    <span class="text-[10px] text-slate-500 uppercase font-semibold block mb-0.5">Superficie</span>
                    <div class="text-sm font-bold text-slate-800 font-mono">
                      {{ property.totalSurface }} m² totales
                    </div>
                    <span class="text-xs text-slate-500 font-mono">
                      {{ property.coveredSurface }} m² cubiertos
                    </span>
                  </div>

                  <div>
                    <span class="text-[10px] text-slate-500 uppercase font-semibold block mb-1">Estado de Comercialización</span>
                    <div class="flex items-center gap-2">
                      <select
                        [value]="property.status"
                        (change)="onStatusChange($event)"
                        class="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-300 bg-white cursor-pointer focus:outline-none focus:border-teal-500"
                      >
                        <option value="Disponible">Disponible</option>
                        <option value="Reservada">Reservada</option>
                        <option value="Vendida">Vendida</option>
                        <option value="Alquilada">Alquilada</option>
                        <option value="Suspendida">Suspendida</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Specs Grid -->
                <div>
                  <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Distribución y Ambientes</h3>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
                      <span class="material-icons text-teal-600 text-lg">meeting_room</span>
                      <div>
                        <span class="text-xs text-slate-500 block">Ambientes</span>
                        <span class="text-sm font-bold text-slate-900 font-mono">{{ property.rooms }}</span>
                      </div>
                    </div>

                    <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
                      <span class="material-icons text-teal-600 text-lg">bed</span>
                      <div>
                        <span class="text-xs text-slate-500 block">Dormitorios</span>
                        <span class="text-sm font-bold text-slate-900 font-mono">{{ property.bedrooms }}</span>
                      </div>
                    </div>

                    <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
                      <span class="material-icons text-teal-600 text-lg">bathtub</span>
                      <div>
                        <span class="text-xs text-slate-500 block">Baños</span>
                        <span class="text-sm font-bold text-slate-900 font-mono">{{ property.bathrooms }}</span>
                      </div>
                    </div>

                    <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
                      <span class="material-icons text-teal-600 text-lg">directions_car</span>
                      <div>
                        <span class="text-xs text-slate-500 block">Cocheras</span>
                        <span class="text-sm font-bold text-slate-900 font-mono">{{ property.garages }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Description -->
                <div>
                  <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Memoria descriptiva</h3>
                  <div class="p-4 bg-slate-50/80 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {{ property.description }}
                  </div>
                </div>

                <!-- Features & Amenities Pills -->
                @if (property.features && property.features.length > 0) {
                  <div>
                    <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Servicios y Amenities</h3>
                    <div class="flex flex-wrap gap-2">
                      @for (feat of property.features; track feat) {
                        <span class="px-2.5 py-1 text-xs font-medium rounded-lg bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                          <span class="material-icons text-teal-600 text-xs">check</span>
                          {{ feat }}
                        </span>
                      }
                    </div>
                  </div>
                }

                <!-- People Responsible (Owner & Agent) -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                  <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-teal-600/10 text-teal-700 flex items-center justify-center font-bold text-xs">
                      AG
                    </div>
                    <div>
                      <span class="text-[10px] text-slate-400 font-medium uppercase block">Asesor a cargo</span>
                      <span class="text-xs font-bold text-slate-900">{{ property.assignedAgent }}</span>
                      <span class="text-[11px] text-slate-500 block">Sucursal {{ crm.currentBranch().name }}</span>
                    </div>
                  </div>

                  <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-blue-600/10 text-blue-700 flex items-center justify-center font-bold text-xs">
                      PR
                    </div>
                    <div>
                      <span class="text-[10px] text-slate-400 font-medium uppercase block">Propietario</span>
                      <span class="text-xs font-bold text-slate-900">{{ property.ownerName || 'Carlos Benvenutto' }}</span>
                      <span class="text-[11px] text-slate-500 block">Contacto autorizado · Directo</span>
                    </div>
                  </div>
                </div>

                <!-- Modal Bottom Actions -->
                <div class="flex items-center justify-between pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    (click)="onDeleteProperty()"
                    class="px-3.5 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span class="material-icons text-sm">delete_outline</span>
                    Eliminar propiedad
                  </button>

                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      (click)="onDuplicateProperty()"
                      class="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span class="material-icons text-sm">content_copy</span>
                      Duplicar
                    </button>
                    <button
                      type="button"
                      (click)="edit.emit(property)"
                      class="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span class="material-icons text-sm">edit</span>
                      Editar ficha
                    </button>
                  </div>
                </div>

              </div>
            }

            <!-- TAB 2: MULTIMEDIA Y FOTOS -->
            @if (activeTab() === 'media') {
              <div class="space-y-6">
                <!-- Large Image Preview -->
                <div class="h-80 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 relative group">
                  <img 
                    [src]="selectedPhotoUrl() || property.mainImage" 
                    [alt]="property.title"
                    class="w-full h-full object-cover"
                    referrerpolicy="no-referrer"
                  />
                  <div class="absolute bottom-3 left-3 bg-[#0A192F]/80 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-lg">
                    Foto {{ activePhotoIndex() + 1 }} de {{ (property.galleryImages?.length || 1) }}
                  </div>
                </div>

                <!-- Thumbnails Strip -->
                <div>
                  <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Galería de imágenes</h3>
                  <div class="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    @for (img of (property.galleryImages || [property.mainImage]); track img; let i = $index) {
                      <div 
                        (click)="setActivePhoto(img, i)"
                        class="h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all"
                        [class.border-teal-500]="(selectedPhotoUrl() || property.mainImage) === img"
                        [class.border-slate-200]="(selectedPhotoUrl() || property.mainImage) !== img"
                      >
                        <img [src]="img" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
                      </div>
                    }
                  </div>
                </div>

                <!-- Add image by URL -->
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 class="text-xs font-bold text-slate-800 mb-2">Agregar imagen a la galería</h4>
                  <div class="flex gap-2">
                    <input
                      type="text"
                      #newImgInput
                      placeholder="https://ejemplo.com/foto-inmueble.jpg"
                      class="flex-1 text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <button
                      type="button"
                      (click)="onAddPhoto(newImgInput)"
                      class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Añadir foto
                    </button>
                  </div>
                </div>
              </div>
            }

            <!-- TAB 3: PUBLICACIONES Y PORTALES -->
            @if (activeTab() === 'portals') {
              <div class="space-y-4">
                <div class="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between">
                  <div>
                    <h3 class="text-xs font-bold text-teal-900">Difusión Multicanal Automática</h3>
                    <p class="text-[11px] text-teal-700 mt-0.5">
                      Sincronizá el inmueble de forma instantánea mediante API directa y feed XML con los portales inmobiliarios líderes.
                    </p>
                  </div>
                  <span class="material-icons text-teal-600 text-2xl">sync</span>
                </div>

                <div class="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <!-- Zonaprop -->
                  <div class="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                        ZP
                      </div>
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="text-xs font-bold text-slate-900">Zonaprop</span>
                          <span 
                            class="px-1.5 py-0.2 rounded text-[10px] font-semibold"
                            [class.bg-emerald-50]="property.portals.zonaprop"
                            [class.text-emerald-700]="property.portals.zonaprop"
                            [class.bg-slate-100]="!property.portals.zonaprop"
                            [class.text-slate-500]="!property.portals.zonaprop"
                          >
                            {{ property.portals.zonaprop ? 'Sincronizado' : 'Inactivo' }}
                          </span>
                        </div>
                        <span class="text-[11px] text-slate-500">API Partner Oficial · Multiposting activo</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      (click)="crm.togglePortalSync(property.id, 'zonaprop')"
                      class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      [class.bg-rose-50]="property.portals.zonaprop"
                      [class.text-rose-700]="property.portals.zonaprop"
                      [class.border]="property.portals.zonaprop"
                      [class.border-rose-200]="property.portals.zonaprop"
                      [class.bg-teal-600]="!property.portals.zonaprop"
                      [class.text-white]="!property.portals.zonaprop"
                    >
                      {{ property.portals.zonaprop ? 'Desconectar' : 'Sincronizar ahora' }}
                    </button>
                  </div>

                  <!-- Argenprop -->
                  <div class="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                        AP
                      </div>
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="text-xs font-bold text-slate-900">Argenprop</span>
                          <span 
                            class="px-1.5 py-0.2 rounded text-[10px] font-semibold"
                            [class.bg-emerald-50]="property.portals.argenprop"
                            [class.text-emerald-700]="property.portals.argenprop"
                            [class.bg-slate-100]="!property.portals.argenprop"
                            [class.text-slate-500]="!property.portals.argenprop"
                          >
                            {{ property.portals.argenprop ? 'Sincronizado' : 'Inactivo' }}
                          </span>
                        </div>
                        <span class="text-[11px] text-slate-500">Feed XML diario automatizado</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      (click)="crm.togglePortalSync(property.id, 'argenprop')"
                      class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      [class.bg-rose-50]="property.portals.argenprop"
                      [class.text-rose-700]="property.portals.argenprop"
                      [class.border]="property.portals.argenprop"
                      [class.border-rose-200]="property.portals.argenprop"
                      [class.bg-teal-600]="!property.portals.argenprop"
                      [class.text-white]="!property.portals.argenprop"
                    >
                      {{ property.portals.argenprop ? 'Desconectar' : 'Sincronizar ahora' }}
                    </button>
                  </div>

                  <!-- Mercado Libre -->
                  <div class="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                        ML
                      </div>
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="text-xs font-bold text-slate-900">Mercado Libre Inmuebles</span>
                          <span 
                            class="px-1.5 py-0.2 rounded text-[10px] font-semibold"
                            [class.bg-emerald-50]="property.portals.mercadolibre"
                            [class.text-emerald-700]="property.portals.mercadolibre"
                            [class.bg-slate-100]="!property.portals.mercadolibre"
                            [class.text-slate-500]="!property.portals.mercadolibre"
                          >
                            {{ property.portals.mercadolibre ? 'Sincronizado' : 'Inactivo' }}
                          </span>
                        </div>
                        <span class="text-[11px] text-slate-500">Publicación Oro Premium · Sincronización instantánea</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      (click)="crm.togglePortalSync(property.id, 'mercadolibre')"
                      class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      [class.bg-rose-50]="property.portals.mercadolibre"
                      [class.text-rose-700]="property.portals.mercadolibre"
                      [class.border]="property.portals.mercadolibre"
                      [class.border-rose-200]="property.portals.mercadolibre"
                      [class.bg-teal-600]="!property.portals.mercadolibre"
                      [class.text-white]="!property.portals.mercadolibre"
                    >
                      {{ property.portals.mercadolibre ? 'Desconectar' : 'Sincronizar ahora' }}
                    </button>
                  </div>

                  <!-- Properati -->
                  <div class="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                        PR
                      </div>
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="text-xs font-bold text-slate-900">Properati</span>
                          <span 
                            class="px-1.5 py-0.2 rounded text-[10px] font-semibold"
                            [class.bg-emerald-50]="property.portals.properati"
                            [class.text-emerald-700]="property.portals.properati"
                            [class.bg-slate-100]="!property.portals.properati"
                            [class.text-slate-500]="!property.portals.properati"
                          >
                            {{ property.portals.properati ? 'Sincronizado' : 'Inactivo' }}
                          </span>
                        </div>
                        <span class="text-[11px] text-slate-500">Red Lifull Connect</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      (click)="crm.togglePortalSync(property.id, 'properati')"
                      class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      [class.bg-rose-50]="property.portals.properati"
                      [class.text-rose-700]="property.portals.properati"
                      [class.border]="property.portals.properati"
                      [class.border-rose-200]="property.portals.properati"
                      [class.bg-teal-600]="!property.portals.properati"
                      [class.text-white]="!property.portals.properati"
                    >
                      {{ property.portals.properati ? 'Desconectar' : 'Sincronizar ahora' }}
                    </button>
                  </div>
                </div>
              </div>
            }

            <!-- TAB 4: CONSULTAS VINCULADAS -->
            @if (activeTab() === 'leads') {
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Consultas recibidas ({{ matchingLeads().length }})
                  </h3>
                </div>

                @if (matchingLeads().length === 0) {
                  <div class="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                    <span class="material-icons text-slate-400 text-3xl mb-1">mark_chat_read</span>
                    <p class="text-xs text-slate-500 font-medium">No hay consultas pendientes para esta propiedad.</p>
                  </div>
                } @else {
                  <div class="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                    @for (lead of matchingLeads(); track lead.id) {
                      <div class="p-4 hover:bg-slate-50 transition-colors">
                        <div class="flex items-center justify-between mb-1">
                          <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-slate-900">{{ lead.contactName }}</span>
                            <span class="text-[11px] font-mono text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                              {{ lead.portalSource }}
                            </span>
                          </div>
                          <span class="text-[10px] text-slate-400 font-mono">{{ lead.receivedAt }}</span>
                        </div>
                        <p class="text-xs text-slate-600 italic">"{{ lead.message }}"</p>
                        <div class="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                          <span>📧 {{ lead.contactEmail }}</span>
                          <span>📞 {{ lead.contactPhone }}</span>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            }

            <!-- TAB 5: HISTORIAL Y NOTAS -->
            @if (activeTab() === 'history') {
              <div class="space-y-4">
                <!-- Add note form -->
                <form [formGroup]="noteForm" (ngSubmit)="onAddNote()" class="flex gap-2">
                  <input
                    type="text"
                    formControlName="text"
                    placeholder="Escribir una nota comercial o técnica sobre el inmueble..."
                    class="flex-1 text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <button
                    type="submit"
                    [disabled]="noteForm.invalid"
                    class="px-4 py-2 bg-teal-600 disabled:opacity-50 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Guardar nota
                  </button>
                </form>

                <!-- Notes Timeline -->
                <div class="space-y-3">
                  @for (note of (property.notesList || defaultNotes); track note.id) {
                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div class="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span class="font-bold text-slate-800">{{ note.author }}</span>
                        <span class="font-mono text-slate-400">{{ note.date }}</span>
                      </div>
                      <p class="text-slate-700">{{ note.text }}</p>
                    </div>
                  }
                </div>
              </div>
            }

          </div>

        </div>
      </div>
    }
  `
})
export class PropertyDetailModalComponent {
  @Input() property: Property | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Property>();

  crm = inject(CrmService);
  currency = inject(CurrencyService);

  readonly activeTab = signal<'general' | 'media' | 'portals' | 'leads' | 'history'>('general');
  readonly selectedPhotoUrl = signal<string | null>(null);
  readonly activePhotoIndex = signal<number>(0);
  readonly isCopied = signal<boolean>(false);

  readonly noteForm = new FormGroup({
    text: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] })
  });

  readonly defaultNotes = [
    {
      id: 'note-1',
      date: '10/09/2026',
      author: 'Martín Somoza',
      text: 'Tasación inicial realizada en USD 360.000 con autorización exclusiva por 120 días.'
    },
    {
      id: 'note-2',
      date: '18/09/2026',
      author: 'Valentina Rossi',
      text: 'Se tomaron fotografías profesionales y plano de mensura aprobado por escribanía.'
    }
  ];

  get tabs() {
    const leadsCount = this.matchingLeads().length;
    return [
      { id: 'general' as const, label: 'Datos generales', icon: 'info' },
      { id: 'media' as const, label: 'Multimedia y fotos', icon: 'photo_camera', badge: this.property?.galleryImages?.length || 1 },
      { id: 'portals' as const, label: 'Portales', icon: 'share' },
      { id: 'leads' as const, label: 'Consultas', icon: 'chat', badge: leadsCount },
      { id: 'history' as const, label: 'Historial', icon: 'history' },
    ];
  }

  matchingLeads() {
    if (!this.property) return [];
    return this.crm.leads().filter(l => 
      l.propertyId === this.property?.id || 
      l.propertyCode === this.property?.code
    );
  }

  onBackdropClick(event: MouseEvent): void {
    this.close.emit();
  }

  setActivePhoto(url: string, index: number): void {
    this.selectedPhotoUrl.set(url);
    this.activePhotoIndex.set(index);
  }

  onStatusChange(event: Event): void {
    if (!this.property) return;
    const target = event.target as HTMLSelectElement;
    if (target?.value) {
      this.crm.updateProperty(this.property.id, { status: target.value as PropertyStatus });
    }
  }

  copyShareLink(): void {
    if (!this.property) return;
    navigator.clipboard?.writeText(window.location.origin + '/properties?code=' + this.property.code);
    this.isCopied.set(true);
    setTimeout(() => this.isCopied.set(false), 2000);
  }

  onAddPhoto(input: HTMLInputElement): void {
    if (!this.property || !input.value.trim()) return;
    const currentGallery = this.property.galleryImages || [this.property.mainImage];
    const updated = [input.value.trim(), ...currentGallery];
    this.crm.updateProperty(this.property.id, { galleryImages: updated });
    input.value = '';
    this.selectedPhotoUrl.set(updated[0]);
  }

  onAddNote(): void {
    if (!this.property || this.noteForm.invalid) return;
    const text = this.noteForm.getRawValue().text.trim();
    if (!text) return;
    this.crm.addPropertyNote(this.property.id, text, 'Martín Somoza');
    this.noteForm.reset();
  }

  onDuplicateProperty(): void {
    if (!this.property) return;
    this.crm.duplicateProperty(this.property.id);
    this.close.emit();
  }

  onDeleteProperty(): void {
    if (!this.property) return;
    if (confirm(`¿Confirma eliminar la propiedad ${this.property.code} — ${this.property.title}?`)) {
      this.crm.deleteProperty(this.property.id);
      this.close.emit();
    }
  }
}
