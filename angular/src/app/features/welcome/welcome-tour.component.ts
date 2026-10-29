import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CrmService } from '../../core/services/crm.service';

interface TourStep {
  title: string;
  badge: string;
  description: string;
  bullets: string[];
  route?: string;
  routeLabel?: string;
}

@Component({
  selector: 'app-welcome-tour',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (crm.isWelcomeTourOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          
          <!-- Modal Header -->
          <div class="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold text-sm">
                ✦
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900">
                  {{ currentStepIndex === 0 ? '¡Bienvenido a Nexo Inmobiliario!' : currentStep.title }}
                </h3>
                <p class="text-xs text-slate-500">
                  {{ currentStepIndex === 0 ? 'Paso inicial' : 'Paso ' + currentStepIndex + ' de 4' }}
                </p>
              </div>
            </div>
            
            <button
              type="button"
              (click)="crm.closeWelcomeTour()"
              class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6">
            @if (currentStepIndex === 0) {
              <!-- Step 0: Welcome greeting -->
              <div class="text-center py-4">
                <div class="mx-auto w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center text-3xl mb-4">
                  🏢
                </div>
                <h4 class="text-lg font-bold text-slate-900 mb-2">Gestioná tu inmobiliaria con eficiencia</h4>
                <p class="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Gestioná tus propiedades, clientes, consultas y publicaciones desde un solo lugar. 
                  Te acompañamos para que puedas empezar en unos pocos pasos.
                </p>
                <div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    (click)="crm.setWelcomeTourStep(1)"
                    class="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Empezar recorrido
                  </button>
                  <button
                    type="button"
                    (click)="crm.closeWelcomeTour()"
                    class="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Lo veo después
                  </button>
                </div>
              </div>
            } @else {
              <!-- Steps 1 to 4 -->
              <div>
                <div class="mb-4">
                  <span class="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200 mb-2">
                    {{ currentStep.badge }}
                  </span>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    {{ currentStep.description }}
                  </p>
                </div>

                <div class="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2 mb-4">
                  @for (bullet of currentStep.bullets; track bullet) {
                    <div class="flex items-start gap-2 text-xs text-slate-700">
                      <span class="text-teal-600 font-bold">✓</span>
                      <span>{{ bullet }}</span>
                    </div>
                  }
                </div>

                @if (currentStep.route) {
                  <div class="mb-4">
                    <button
                      type="button"
                      (click)="goToModule(currentStep.route)"
                      class="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Ir a la sección {{ currentStep.routeLabel }} →</span>
                    </button>
                  </div>
                }

                <!-- Step progress dots -->
                <div class="flex items-center justify-center gap-1.5 pt-2">
                  @for (step of [1,2,3,4]; track step) {
                    <span 
                      class="h-1.5 rounded-full transition-all"
                      [class.w-6]="crm.welcomeTourStep() === step"
                      [class.bg-teal-600]="crm.welcomeTourStep() === step"
                      [class.w-1.5]="crm.welcomeTourStep() !== step"
                      [class.bg-slate-200]="crm.welcomeTourStep() !== step"
                    ></span>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Modal Footer -->
          @if (currentStepIndex > 0) {
            <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                (click)="crm.closeWelcomeTour()"
                class="text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Saltar recorrido
              </button>

              <div class="flex items-center gap-2">
                @if (currentStepIndex > 1) {
                  <button
                    type="button"
                    (click)="crm.setWelcomeTourStep(currentStepIndex - 1)"
                    class="px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    Anterior
                  </button>
                }

                @if (currentStepIndex < 4) {
                  <button
                    type="button"
                    (click)="crm.setWelcomeTourStep(currentStepIndex + 1)"
                    class="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs cursor-pointer"
                  >
                    Siguiente
                  </button>
                } @else {
                  <button
                    type="button"
                    (click)="crm.completeWelcomeTour()"
                    class="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs cursor-pointer"
                  >
                    Finalizar
                  </button>
                }
              </div>
            </div>
          }
        </div>
      </div>
    }
  `
})
export class WelcomeTourComponent {
  crm = inject(CrmService);
  private router = inject(Router);

  readonly steps: TourStep[] = [
    {
      title: '¡Bienvenido!',
      badge: 'Inicio',
      description: '',
      bullets: []
    },
    {
      title: 'Cargá tus propiedades',
      badge: 'Módulo Propiedades',
      description: 'Registrá un inmueble, completá sus datos clave (ambientes, superficies, expensas), subí fotografías y configurá su visibilidad.',
      bullets: [
        'Código único autogenerado estilo NEX-1042',
        'Precios en USD o ARS con cálculo automático de tipo de cambio',
        'Ficha técnica con distribución, orientación y amenities'
      ],
      route: '/properties',
      routeLabel: 'Propiedades'
    },
    {
      title: 'Configurá tus publicaciones',
      badge: 'Módulo Publicaciones',
      description: 'Sincronizá tu cartera con los principales portales inmobiliarios: Zonaprop, Argenprop, Mercado Libre y Properati.',
      bullets: [
        'Matriz de sincronización en tiempo real con cupos y destacados',
        'Conexión mediante APIs oficiales y feeds XML/JSON estandarizados',
        'Prevención de discrepancias de precio y estado'
      ],
      route: '/publications',
      routeLabel: 'Publicaciones'
    },
    {
      title: 'Organizá tus contactos',
      badge: 'Módulo Contactos',
      description: 'Registrá propietarios, compradores e inversores. Vinculá propiedades asignadas y preferencias de búsqueda.',
      bullets: [
        'Segmentación por rol: Propietario, Comprador, Inquilino, Colega',
        'Asignación a asesores de la inmobiliaria por sucursal',
        'Cruce automático inteligente con propiedades disponibles'
      ],
      route: '/contacts',
      routeLabel: 'Contactos'
    },
    {
      title: 'Oportunidades y cierre',
      badge: 'Módulo Oportunidades & Pipeline',
      description: 'Acompañá cada negocio desde el primer contacto hasta la firma de reserva o boleto con el tablero Kanban.',
      bullets: [
        'Etapas claras: Visita coordinada, Oferta, Negociación, Reserva, Ganado',
        'Cálculo ponderado del pipeline comercial en USD',
        'Agenda de visitas integradas y recordatorios de tareas'
      ],
      route: '/opportunities',
      routeLabel: 'Oportunidades'
    }
  ];

  get currentStepIndex(): number {
    return this.crm.welcomeTourStep();
  }

  get currentStep(): TourStep {
    return this.steps[this.currentStepIndex] || this.steps[0];
  }

  goToModule(route?: string): void {
    if (route) {
      this.router.navigate([route]);
      this.crm.closeWelcomeTour();
    }
  }
}
