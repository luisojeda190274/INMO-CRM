import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">{{ title }}</h2>
          @if (count !== undefined) {
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {{ count }}
            </span>
          }
        </div>
        @if (subtitle) {
          <p class="text-sm text-slate-500 mt-1">{{ subtitle }}</p>
        }
      </div>

      <div class="flex items-center gap-3">
        @if (actionLabel) {
          <button
            type="button"
            (click)="actionClicked.emit()"
            class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <span>+</span>
            <span>{{ actionLabel }}</span>
          </button>
        }
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() count?: number;
  @Input() actionLabel = '';
  @Output() actionClicked = new EventEmitter<void>();
}
