import { Component, Input, Output, EventEmitter, inject, signal, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Property, PropertyType, OperationType, PropertyStatus } from '../../models/crm.models';
import { CrmService } from '../../core/services/crm.service';

const PRESET_PHOTOS = [
  { label: 'Semipiso Moderno', url: '/src/assets/images/prop_modern_apartment_1792675050749.jpg' },
  { label: 'Penthouse Terraza', url: '/src/assets/images/prop_penthouse_terrace_1792675051692.jpg' },
  { label: 'Casa Residencial', url: '/src/assets/images/prop_suburban_house_1792675050795.jpg' },
  { label: 'PH Reciclado', url: '/src/assets/images/prop_ph_remodelado_1792675051761.jpg' },
  { label: 'Oficina Corporativa', url: '/src/assets/images/prop_modern_office_1792675051673.jpg' }
];

const AMENITIES_LIST = [
  'Balcón terraza',
  'Cochera fija cubierta',
  'Piscina & Solarium',
  'SUM equipado',
  'Seguridad 24 hs',
  'Parrilla individual',
  'Gimnasio',
  'Aire Acondicionado Split',
  'Calefacción por losa radiante',
  'Lavadero independiente',
  'Apto Profesional',
  'Mascotas permitidas'
];

@Component({
  selector: 'app-property-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
      (click)="close.emit()"
    >
      <div 
        class="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        (click)="$event.stopPropagation()"
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 bg-[#0A192F] text-white flex items-center justify-between shrink-0 border-b border-[#1E3A5F]">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-teal-500 text-[#0A192F] flex items-center justify-center font-bold text-sm shadow-xs">
              <span class="material-icons text-base">apartment</span>
            </div>
            <div>
              <h2 class="text-sm md:text-base font-bold text-white">
                {{ propertyToEdit ? 'Editar Propiedad ' + propertyToEdit.code : 'Cargar Nueva Propiedad' }}
              </h2>
              <p class="text-xs text-slate-400">
                Ficha técnica, ubicación geográfica, fotos y portales inmobiliarios
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            @if (!propertyToEdit) {
              <button
                type="button"
                (click)="fillSampleData()"
                class="px-2.5 py-1 text-xs font-medium text-teal-300 bg-[#132A4A] hover:bg-[#1E3A5F] border border-teal-500/30 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                title="Completar formulario automáticamente con datos realistas"
              >
                <span class="material-icons text-xs">auto_fix_high</span>
                <span class="hidden sm:inline">Datos de ejemplo</span>
              </button>
            }

            <button
              type="button"
              (click)="close.emit()"
              class="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#132A4A] transition-colors cursor-pointer"
            >
              <span class="material-icons text-base">close</span>
            </button>
          </div>
        </div>

        <!-- Stepper Tabs -->
        <div class="px-6 bg-slate-100/80 border-b border-slate-200 flex items-center gap-1 overflow-x-auto shrink-0">
          <button
            type="button"
            (click)="activeTab.set('general')"
            class="px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 cursor-pointer flex items-center gap-1.5"
            [class.border-teal-600]="activeTab() === 'general'"
            [class.text-teal-700]="activeTab() === 'general'"
            [class.bg-white]="activeTab() === 'general'"
            [class.border-transparent]="activeTab() !== 'general'"
            [class.text-slate-600]="activeTab() !== 'general'"
          >
            <span class="material-icons text-xs">info</span>
            <span>1. Datos principales</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('location')"
            class="px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 cursor-pointer flex items-center gap-1.5"
            [class.border-teal-600]="activeTab() === 'location'"
            [class.text-teal-700]="activeTab() === 'location'"
            [class.bg-white]="activeTab() === 'location'"
            [class.border-transparent]="activeTab() !== 'location'"
            [class.text-slate-600]="activeTab() !== 'location'"
          >
            <span class="material-icons text-xs">place</span>
            <span>2. Ubicación y mapa</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('specs')"
            class="px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 cursor-pointer flex items-center gap-1.5"
            [class.border-teal-600]="activeTab() === 'specs'"
            [class.text-teal-700]="activeTab() === 'specs'"
            [class.bg-white]="activeTab() === 'specs'"
            [class.border-transparent]="activeTab() !== 'specs'"
            [class.text-slate-600]="activeTab() !== 'specs'"
          >
            <span class="material-icons text-xs">tune</span>
            <span>3. Medidas &amp; Amenities</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('photos')"
            class="px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 cursor-pointer flex items-center gap-1.5"
            [class.border-teal-600]="activeTab() === 'photos'"
            [class.text-teal-700]="activeTab() === 'photos'"
            [class.bg-white]="activeTab() === 'photos'"
            [class.border-transparent]="activeTab() !== 'photos'"
            [class.text-slate-600]="activeTab() !== 'photos'"
          >
            <span class="material-icons text-xs">photo_camera</span>
            <span>4. Fotos ({{ galleryImages().length }})</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('portals')"
            class="px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 cursor-pointer flex items-center gap-1.5"
            [class.border-teal-600]="activeTab() === 'portals'"
            [class.text-teal-700]="activeTab() === 'portals'"
            [class.bg-white]="activeTab() === 'portals'"
            [class.border-transparent]="activeTab() !== 'portals'"
            [class.text-slate-600]="activeTab() !== 'portals'"
          >
            <span class="material-icons text-xs">share</span>
            <span>5. Portales</span>
          </button>
        </div>

        <!-- Form Body -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex-1 overflow-y-auto p-6 space-y-6">
          
          <!-- TAB 1: GENERAL -->
          @if (activeTab() === 'general') {
            <div class="space-y-4">
              <!-- Title -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
                  Título de la publicación <span class="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  formControlName="title"
                  placeholder="Ej: Semipiso 4 ambientes con balcón terraza y cochera fija"
                  class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <!-- Type & Operation -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Tipo de inmueble</label>
                  <select
                    formControlName="propertyType"
                    class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                  >
                    <option value="Departamento">Departamento</option>
                    <option value="Casa">Casa</option>
                    <option value="PH">PH</option>
                    <option value="Oficina">Oficina</option>
                    <option value="Terreno">Terreno</option>
                    <option value="Local Comercial">Local Comercial</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Tipo de Operación</label>
                  <select
                    formControlName="operation"
                    class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                  >
                    <option value="Venta">Venta</option>
                    <option value="Alquiler">Alquiler</option>
                    <option value="Alquiler Temporal">Alquiler Temporal</option>
                  </select>
                </div>
              </div>

              <!-- Price & Currency & Expenses -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Moneda</label>
                  <select
                    formControlName="currency"
                    class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                  >
                    <option value="USD">Dólares (USD)</option>
                    <option value="ARS">Pesos (ARS)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">
                    Precio de Lista <span class="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    formControlName="price"
                    class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Expensas mensuales ($)</label>
                  <input
                    type="number"
                    formControlName="expenses"
                    class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                  />
                </div>
              </div>

              <!-- Agent & Status -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Asesor a cargo</label>
                  <select
                    formControlName="assignedAgent"
                    class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                  >
                    @for (member of crm.team(); track member.id) {
                      <option [value]="member.name">{{ member.name }} ({{ member.role }})</option>
                    }
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Estado de disponibilidad</label>
                  <select
                    formControlName="status"
                    class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
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
          }

          <!-- TAB 2: UBICACIÓN Y MAPA -->
          @if (activeTab() === 'location') {
            <div class="space-y-4">
              <!-- Address & neighborhood -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="sm:col-span-2">
                  <label class="block text-xs font-bold text-slate-700 mb-1">
                    Dirección (Calle y Altura) <span class="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    formControlName="address"
                    placeholder="Ej: Av. del Libertador 2450, Piso 9 D"
                    class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Barrio / Zona</label>
                  <input
                    type="text"
                    formControlName="neighborhood"
                    placeholder="Ej: Palermo Chico"
                    class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Ciudad / Municipio</label>
                  <input
                    type="text"
                    formControlName="city"
                    placeholder="Ej: CABA"
                    class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Provincia</label>
                  <input
                    type="text"
                    value="Buenos Aires / CABA"
                    readonly
                    class="w-full text-xs px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-600"
                  />
                </div>
              </div>

              <!-- Interactive Location Card / Simulated Map Coordinates -->
              <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="material-icons text-teal-600 text-sm">map</span>
                    <span class="text-xs font-bold text-slate-900">Geolocalización en mapa</span>
                  </div>
                  <span class="text-[11px] text-teal-700 font-mono bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Lat: -34.5829 · Lng: -58.4035
                  </span>
                </div>

                <!-- Stylized Map Canvas -->
                <div class="h-44 rounded-lg bg-[#0e223d] border border-slate-300 overflow-hidden relative flex items-center justify-center">
                  <div class="absolute inset-0 opacity-20 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  
                  <!-- Center Marker -->
                  <div class="relative z-10 flex flex-col items-center animate-bounce">
                    <span class="material-icons text-teal-400 text-3xl drop-shadow-md">location_on</span>
                    <span class="px-2 py-0.5 rounded bg-black/80 text-[10px] text-white font-mono shadow-sm">
                      {{ form.get('address')?.value || 'Ubicación seleccionada' }}
                    </span>
                  </div>

                  <div class="absolute bottom-2 right-2 bg-white/90 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono shadow-2xs">
                    Centro: {{ form.get('neighborhood')?.value || 'Recoleta' }}, {{ form.get('city')?.value || 'CABA' }}
                  </div>
                </div>

                <div class="flex items-center justify-between text-xs text-slate-500">
                  <span>Marcador verificado por servicio de cartografía</span>
                  <button
                    type="button"
                    (click)="adjustCoordinates()"
                    class="text-teal-600 hover:text-teal-700 font-medium cursor-pointer"
                  >
                    Ajustar marcador manualmente
                  </button>
                </div>
              </div>
            </div>
          }

          <!-- TAB 3: MEDIDAS Y AMENITIES -->
          @if (activeTab() === 'specs') {
            <div class="space-y-4">
              <!-- Surfaces -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Superficie Total (m²)</label>
                  <input
                    type="number"
                    formControlName="totalSurface"
                    class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Superficie Cubierta (m²)</label>
                  <input
                    type="number"
                    formControlName="coveredSurface"
                    class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Ambientes</label>
                  <input
                    type="number"
                    formControlName="rooms"
                    class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Dormitorios</label>
                  <input
                    type="number"
                    formControlName="bedrooms"
                    class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                  />
                </div>
              </div>

              <!-- Bathrooms & Garages -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Baños</label>
                  <input
                    type="number"
                    formControlName="bathrooms"
                    class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Cocheras</label>
                  <input
                    type="number"
                    formControlName="garages"
                    class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Disposición</label>
                  <select
                    formControlName="disposition"
                    class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                  >
                    <option value="Frente">Frente</option>
                    <option value="Contrafrente">Contrafrente</option>
                    <option value="Lateral">Lateral</option>
                    <option value="Interno">Interno</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Orientación</label>
                  <select
                    formControlName="orientation"
                    class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                  >
                    <option value="Norte">Norte</option>
                    <option value="Sur">Sur</option>
                    <option value="Este">Este</option>
                    <option value="Oeste">Oeste</option>
                    <option value="Noreste">Noreste</option>
                  </select>
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Descripción de la propiedad</label>
                <textarea
                  formControlName="description"
                  rows="3"
                  placeholder="Detalles de la propiedad, estado de conservación, luminosidad y entorno..."
                  class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed"
                ></textarea>
              </div>

              <!-- Amenities Checkboxes -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-2">Amenities y características destacadas</label>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  @for (amenity of amenities; track amenity) {
                    <label class="flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs cursor-pointer select-none">
                      <input
                        type="checkbox"
                        [checked]="isAmenitySelected(amenity)"
                        (change)="toggleAmenity(amenity)"
                        class="rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
                      />
                      <span class="text-slate-800">{{ amenity }}</span>
                    </label>
                  }
                </div>
              </div>
            </div>
          }

          <!-- TAB 4: FOTOS Y MULTIMEDIA -->
          @if (activeTab() === 'photos') {
            <div class="space-y-5">
              <!-- Preset Architectural Library -->
              <div>
                <span class="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                  1. Seleccionar de la fototeca arquitectónica de Nexo:
                </span>
                <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  @for (preset of presetPhotos; track preset.url) {
                    <div
                      (click)="addPresetPhoto(preset.url)"
                      class="rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-102 group relative h-24 bg-slate-100"
                      [class.border-teal-500]="galleryImages().includes(preset.url)"
                      [class.border-slate-200]="!galleryImages().includes(preset.url)"
                    >
                      <img [src]="preset.url" [alt]="preset.label" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
                      <div class="absolute inset-x-0 bottom-0 bg-slate-950/70 p-1 text-[9px] text-white text-center truncate">
                        {{ preset.label }}
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Custom URL Input -->
              <div>
                <span class="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                  2. O ingresar URL directa de fotografía:
                </span>
                <div class="flex gap-2">
                  <input
                    type="text"
                    #customPhotoInput
                    placeholder="https://ejemplo.com/foto-alta-resolucion.jpg"
                    class="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    (click)="addCustomPhoto(customPhotoInput)"
                    class="px-4 py-2 bg-[#132A4A] hover:bg-[#1E3A5F] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Agregar URL
                  </button>
                </div>
              </div>

              <!-- Current Gallery Strip -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Galería actual del inmueble ({{ galleryImages().length }} fotos)
                  </span>
                  <span class="text-[11px] text-slate-500">Hacé clic en una foto para definirla como portada</span>
                </div>

                <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  @for (img of galleryImages(); track img; let i = $index) {
                    <div class="relative h-24 rounded-lg overflow-hidden border-2 group bg-slate-100"
                      [class.border-teal-500]="selectedMainImage() === img"
                      [class.border-slate-300]="selectedMainImage() !== img"
                    >
                      <img [src]="img" class="w-full h-full object-cover cursor-pointer" (click)="selectedMainImage.set(img)" referrerpolicy="no-referrer" />
                      
                      @if (selectedMainImage() === img) {
                        <span class="absolute top-1 left-1 px-1.5 py-0.2 rounded text-[8px] font-bold bg-teal-500 text-white">
                          PORTADA
                        </span>
                      }

                      <button
                        type="button"
                        (click)="removePhoto(img)"
                        class="absolute top-1 right-1 w-5 h-5 rounded bg-rose-600/90 hover:bg-rose-700 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Eliminar de galería"
                      >
                        ✕
                      </button>
                    </div>
                  }
                </div>
              </div>
            </div>
          }

          <!-- TAB 5: PORTALES -->
          @if (activeTab() === 'portals') {
            <div class="space-y-4">
              <div class="p-4 bg-teal-50 border border-teal-200 rounded-xl">
                <h3 class="text-xs font-bold text-teal-900">Configuración de Difusión Inicial</h3>
                <p class="text-[11px] text-teal-700 mt-0.5">
                  Seleccioná en qué portales inmobiliarios querés publicar automáticamente este inmueble al guardar.
                </p>
              </div>

              <div class="space-y-2 border border-slate-200 rounded-xl p-4 bg-slate-50">
                <label class="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <div class="flex items-center gap-3">
                    <span class="w-7 h-7 rounded bg-rose-50 text-rose-600 font-bold text-xs flex items-center justify-center">ZP</span>
                    <div>
                      <span class="text-xs font-bold text-slate-900 block">Zonaprop</span>
                      <span class="text-[10px] text-slate-500">Publicar en red principal de clasificados</span>
                    </div>
                  </div>
                  <input type="checkbox" formControlName="zonaprop" class="rounded text-teal-600 cursor-pointer" />
                </label>

                <label class="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <div class="flex items-center gap-3">
                    <span class="w-7 h-7 rounded bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">AP</span>
                    <div>
                      <span class="text-xs font-bold text-slate-900 block">Argenprop</span>
                      <span class="text-[10px] text-slate-500">Enviar al feed XML de propiedades</span>
                    </div>
                  </div>
                  <input type="checkbox" formControlName="argenprop" class="rounded text-teal-600 cursor-pointer" />
                </label>

                <label class="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <div class="flex items-center gap-3">
                    <span class="w-7 h-7 rounded bg-amber-50 text-amber-600 font-bold text-xs flex items-center justify-center">ML</span>
                    <div>
                      <span class="text-xs font-bold text-slate-900 block">Mercado Libre Inmuebles</span>
                      <span class="text-[10px] text-slate-500">Sincronizar publicación directa</span>
                    </div>
                  </div>
                  <input type="checkbox" formControlName="mercadolibre" class="rounded text-teal-600 cursor-pointer" />
                </label>

                <label class="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <div class="flex items-center gap-3">
                    <span class="w-7 h-7 rounded bg-purple-50 text-purple-600 font-bold text-xs flex items-center justify-center">PR</span>
                    <div>
                      <span class="text-xs font-bold text-slate-900 block">Properati</span>
                      <span class="text-[10px] text-slate-500">Red internacional Lifull Connect</span>
                    </div>
                  </div>
                  <input type="checkbox" formControlName="properati" class="rounded text-teal-600 cursor-pointer" />
                </label>
              </div>
            </div>
          }

          <!-- Footer Actions -->
          <div class="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              (click)="close.emit()"
              class="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <div class="flex items-center gap-2">
              <button
                type="submit"
                [disabled]="form.invalid"
                class="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span class="material-icons text-sm">check</span>
                <span>{{ propertyToEdit ? 'Guardar Cambios' : 'Publicar Inmueble' }}</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  `
})
export class PropertyFormModalComponent implements OnInit, OnChanges {
  @Input() propertyToEdit: Property | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  crm = inject(CrmService);

  readonly activeTab = signal<'general' | 'location' | 'specs' | 'photos' | 'portals'>('general');
  readonly presetPhotos = PRESET_PHOTOS;
  readonly amenities = AMENITIES_LIST;

  readonly galleryImages = signal<string[]>([PRESET_PHOTOS[0].url]);
  readonly selectedMainImage = signal<string>(PRESET_PHOTOS[0].url);
  readonly selectedAmenities = signal<string[]>([
    'Balcón terraza',
    'Cochera fija cubierta',
    'Seguridad 24 hs'
  ]);

  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5)] }),
    propertyType: new FormControl<PropertyType>('Departamento', { nonNullable: true }),
    operation: new FormControl<OperationType>('Venta', { nonNullable: true }),
    currency: new FormControl<'USD' | 'ARS'>('USD', { nonNullable: true }),
    price: new FormControl<number>(250000, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    expenses: new FormControl<number>(120000, { nonNullable: true }),
    address: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    neighborhood: new FormControl('Palermo', { nonNullable: true }),
    city: new FormControl('CABA', { nonNullable: true }),
    totalSurface: new FormControl<number>(85, { nonNullable: true }),
    coveredSurface: new FormControl<number>(76, { nonNullable: true }),
    rooms: new FormControl<number>(3, { nonNullable: true }),
    bedrooms: new FormControl<number>(2, { nonNullable: true }),
    bathrooms: new FormControl<number>(2, { nonNullable: true }),
    garages: new FormControl<number>(1, { nonNullable: true }),
    disposition: new FormControl<'Frente' | 'Contrafrente' | 'Lateral' | 'Interno'>('Frente', { nonNullable: true }),
    orientation: new FormControl<'Norte' | 'Sur' | 'Este' | 'Oeste' | 'Noreste' | 'Noroeste'>('Noreste', { nonNullable: true }),
    description: new FormControl('Excelente departamento con gran luminosidad, terminaciones de categoría y balcón terraza.', { nonNullable: true }),
    assignedAgent: new FormControl('Martín Somoza', { nonNullable: true }),
    status: new FormControl<PropertyStatus>('Disponible', { nonNullable: true }),
    zonaprop: new FormControl<boolean>(true, { nonNullable: true }),
    argenprop: new FormControl<boolean>(true, { nonNullable: true }),
    mercadolibre: new FormControl<boolean>(true, { nonNullable: true }),
    properati: new FormControl<boolean>(false, { nonNullable: true })
  });

  ngOnInit(): void {
    this.populateIfEditing();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['propertyToEdit']) {
      this.populateIfEditing();
    }
  }

  populateIfEditing(): void {
    if (!this.propertyToEdit) return;
    const p = this.propertyToEdit;
    this.form.patchValue({
      title: p.title,
      propertyType: p.propertyType,
      operation: p.operation,
      currency: p.currency,
      price: p.price,
      expenses: p.expenses,
      address: p.address,
      neighborhood: p.neighborhood,
      city: p.city,
      totalSurface: p.totalSurface,
      coveredSurface: p.coveredSurface,
      rooms: p.rooms,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      garages: p.garages,
      disposition: p.disposition || 'Frente',
      orientation: p.orientation || 'Norte',
      description: p.description,
      assignedAgent: p.assignedAgent,
      status: p.status,
      zonaprop: p.portals.zonaprop,
      argenprop: p.portals.argenprop,
      mercadolibre: p.portals.mercadolibre,
      properati: p.portals.properati
    });

    if (p.galleryImages && p.galleryImages.length > 0) {
      this.galleryImages.set([...p.galleryImages]);
      this.selectedMainImage.set(p.mainImage || p.galleryImages[0]);
    }

    if (p.features && p.features.length > 0) {
      this.selectedAmenities.set([...p.features]);
    }
  }

  fillSampleData(): void {
    this.form.patchValue({
      title: 'Semipiso 3 amb con balcón terraza y cochera fija',
      address: 'Av. Coronel Díaz 2140, Piso 7',
      neighborhood: 'Palermo Chico',
      city: 'CABA',
      propertyType: 'Departamento',
      operation: 'Venta',
      price: 285000,
      currency: 'USD',
      expenses: 145000,
      totalSurface: 96,
      coveredSurface: 84,
      rooms: 3,
      bedrooms: 2,
      bathrooms: 2,
      garages: 1,
      disposition: 'Frente',
      orientation: 'Noreste',
      description: 'Impecable semipiso con palier privado, cocina independiente con comedor diario, suite principal y balcón terraza con vista abierta.',
      assignedAgent: 'Martín Somoza',
      status: 'Disponible',
      zonaprop: true,
      argenprop: true,
      mercadolibre: true,
      properati: true
    });
    this.galleryImages.set([PRESET_PHOTOS[0].url, PRESET_PHOTOS[1].url]);
    this.selectedMainImage.set(PRESET_PHOTOS[0].url);
  }

  adjustCoordinates(): void {
    alert('Ubicación geográfica sincronizada con el mapa interactivo (-34.5829, -58.4035). Marcador posicionado en el centro del lote.');
  }

  isAmenitySelected(amenity: string): boolean {
    return this.selectedAmenities().includes(amenity);
  }

  toggleAmenity(amenity: string): void {
    this.selectedAmenities.update(list => 
      list.includes(amenity) ? list.filter(a => a !== amenity) : [...list, amenity]
    );
  }

  addPresetPhoto(url: string): void {
    this.galleryImages.update(list => list.includes(url) ? list : [...list, url]);
    this.selectedMainImage.set(url);
  }

  addCustomPhoto(input: HTMLInputElement): void {
    const url = input.value.trim();
    if (!url) return;
    this.galleryImages.update(list => [url, ...list]);
    this.selectedMainImage.set(url);
    input.value = '';
  }

  removePhoto(img: string): void {
    this.galleryImages.update(list => {
      const filtered = list.filter(i => i !== img);
      if (this.selectedMainImage() === img && filtered.length > 0) {
        this.selectedMainImage.set(filtered[0]);
      }
      return filtered.length > 0 ? filtered : [PRESET_PHOTOS[0].url];
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const val = this.form.getRawValue();

    const portals = {
      zonaprop: val.zonaprop,
      argenprop: val.argenprop,
      mercadolibre: val.mercadolibre,
      properati: val.properati,
      ownWebsite: true
    };

    const mainImage = this.selectedMainImage() || this.galleryImages()[0] || PRESET_PHOTOS[0].url;

    if (this.propertyToEdit) {
      this.crm.updateProperty(this.propertyToEdit.id, {
        title: val.title,
        propertyType: val.propertyType,
        operation: val.operation,
        price: Number(val.price),
        currency: val.currency,
        expenses: Number(val.expenses),
        address: val.address,
        neighborhood: val.neighborhood,
        city: val.city,
        totalSurface: Number(val.totalSurface),
        coveredSurface: Number(val.coveredSurface),
        rooms: Number(val.rooms),
        bedrooms: Number(val.bedrooms),
        bathrooms: Number(val.bathrooms),
        garages: Number(val.garages),
        disposition: val.disposition,
        orientation: val.orientation,
        description: val.description,
        assignedAgent: val.assignedAgent,
        status: val.status,
        portals,
        mainImage,
        galleryImages: this.galleryImages(),
        features: this.selectedAmenities()
      });
    } else {
      this.crm.addProperty({
        title: val.title,
        propertyType: val.propertyType,
        operation: val.operation,
        price: Number(val.price),
        currency: val.currency,
        expenses: Number(val.expenses),
        address: val.address,
        neighborhood: val.neighborhood,
        city: val.city,
        totalSurface: Number(val.totalSurface),
        coveredSurface: Number(val.coveredSurface),
        rooms: Number(val.rooms),
        bedrooms: Number(val.bedrooms),
        bathrooms: Number(val.bathrooms),
        garages: Number(val.garages),
        disposition: val.disposition,
        orientation: val.orientation,
        description: val.description,
        assignedAgent: val.assignedAgent,
        status: val.status,
        portals,
        mainImage,
        galleryImages: this.galleryImages(),
        features: this.selectedAmenities(),
        featured: false
      });
    }

    this.saved.emit();
    this.close.emit();
  }
}
