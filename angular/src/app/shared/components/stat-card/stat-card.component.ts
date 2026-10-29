import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">{{ title }}</span>
        <div class="w-9 h-9 rounded-lg flex items-center justify-center" [class]="iconBgClass">
          <span class="text-base font-bold" [class]="iconColorClass">{{ iconText }}</span>
        </div>
      </div>
      <div class="flex items-baseline justify-between">
        <div class="text-2xl font-bold text-slate-900 tracking-tight">{{ value }}</div>
        @if (subtext) {
          <div class="text-xs text-slate-500 font-medium">{{ subtext }}</div>
        }
      </div>
      @if (badge) {
        <div class="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-600">
          <span class="inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold" [class]="badgeClass">{{ badge }}</span>
          <span>{{ badgeLabel }}</span>
        </div>
      }
    </div>
  `
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() subtext = '';
  @Input() iconText = '★';
  @Input() iconBgClass = 'bg-teal-50';
  @Input() iconColorClass = 'text-teal-600';
  @Input() badge = '';
  @Input() badgeLabel = '';
  @Input() badgeClass = 'bg-emerald-100 text-emerald-800';
}
