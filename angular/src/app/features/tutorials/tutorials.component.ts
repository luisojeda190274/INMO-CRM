import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialService } from '../../core/services/tutorial.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { Tutorial } from '../../models/tutorial.models';

@Component({
  selector: 'app-tutorials',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      
      <app-page-header
        title="Centro de Ayuda y Tutoriales Interactivos"
        subtitle="Guías paso a paso, arquitectura de portales, flujos de trabajo y buenas prácticas para dominar Nexo Inmobiliario."
        [count]="tutorialService.tutorials().length"
      ></app-page-header>

      <!-- Tutorials Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (tut of tutorialService.tutorials(); track tut.id) {
          <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div class="space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                  {{ tut.category }}
                </span>
                <span class="text-xs text-slate-400">⏱️ {{ tut.durationMinutes }} min</span>
              </div>

              <div class="flex items-start gap-2.5">
                <span class="text-2xl">{{ tut.icon || '📘' }}</span>
                <div>
                  <h3 class="text-sm font-bold text-slate-900 leading-snug">{{ tut.title }}</h3>
                  <span class="text-[10px] text-slate-500 font-medium">Nivel: {{ tut.difficulty }} · {{ tut.steps.length }} pasos</span>
                </div>
              </div>

              <p class="text-xs text-slate-600 line-clamp-3">
                {{ tut.shortDescription }}
              </p>
            </div>

            <div class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                (click)="tutorialService.startTutorial(tut.id)"
                class="w-full text-center py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Iniciar tutorial guiado →
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Docked Step-by-Step Interactive Tutorial Assistant Drawer -->
      @if (tutorialService.isAssistantOpen() && tutorialService.activeTutorial()) {
        <div class="fixed bottom-6 right-6 z-50 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-teal-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          
          <!-- Assistant Header -->
          <div class="px-5 py-3.5 bg-[#0A192F] text-white flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-teal-400">🎓</span>
              <div>
                <h4 class="text-xs font-bold truncate max-w-xs">{{ tutorialService.activeTutorial()?.title }}</h4>
                <p class="text-[10px] text-slate-300">
                  Paso {{ (tutorialService.currentStepIndex() + 1) }} de {{ tutorialService.activeTutorial()?.steps?.length }}
                </p>
              </div>
            </div>

            <button
              type="button"
              (click)="tutorialService.closeAssistant()"
              class="text-slate-400 hover:text-white text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Assistant Body -->
          <div class="p-5 max-h-96 overflow-y-auto space-y-3">
            @if (tutorialService.currentStep(); as step) {
              <div>
                <span class="text-[10px] font-bold text-teal-600 uppercase tracking-wider block mb-1">
                  {{ step.subtitle }}
                </span>
                <h5 class="text-sm font-bold text-slate-900 mb-2">{{ step.title }}</h5>
                <p class="text-xs text-slate-600 leading-relaxed">{{ step.description }}</p>
              </div>

              @if (step.tips && step.tips.length > 0) {
                <div class="p-3 bg-teal-50/60 rounded-lg border border-teal-100 text-xs text-teal-900 space-y-1">
                  <span class="font-bold block text-[11px]">💡 Recomendación clave:</span>
                  @for (tip of step.tips; track tip) {
                    <p class="text-[11px]">• {{ tip }}</p>
                  }
                </div>
              }

              @if (step.codeSnippet) {
                <div class="bg-slate-900 text-slate-200 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                  <div class="text-[10px] text-slate-400 pb-1 mb-1 border-b border-slate-800">
                    {{ step.codeSnippet.title }}
                  </div>
                  <pre class="text-[11px]">{{ step.codeSnippet.code }}</pre>
                </div>
              }
            }
          </div>

          <!-- Assistant Footer -->
          <div class="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              (click)="tutorialService.prevStep()"
              [disabled]="tutorialService.currentStepIndex() === 0"
              class="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg disabled:opacity-40 cursor-pointer"
            >
              Anterior
            </button>

            <button
              type="button"
              (click)="tutorialService.nextStep()"
              class="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs cursor-pointer"
            >
              {{ tutorialService.currentStepIndex() === (tutorialService.activeTutorial()?.steps?.length || 1) - 1 ? 'Finalizar' : 'Siguiente paso →' }}
            </button>
          </div>

        </div>
      }

    </div>
  `
})
export class TutorialsComponent {
  tutorialService = inject(TutorialService);
}
