import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses">
      <span class="w-1.5 h-1.5 rounded-full mr-1.5 inline-block" [class]="dotClass"></span>
      {{ text }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input() text = '';
  @Input() type: 'property' | 'lead' | 'deal' | 'priority' | 'portal' = 'property';

  get badgeClasses(): string {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (this.text.toLowerCase()) {
      case 'disponible':
      case 'nueva':
      case 'activo':
      case 'conectado':
        return `${base} bg-emerald-50 text-emerald-700 border border-emerald-200`;
      case 'reservada':
      case 'en gestión':
      case 'media':
        return `${base} bg-amber-50 text-amber-700 border border-amber-200`;
      case 'vendida':
      case 'alquilada':
      case 'cierre_ganado':
        return `${base} bg-teal-50 text-teal-700 border border-teal-200`;
      case 'alta':
      case 'urgente':
      case 'descartada':
      case 'cierre_perdido':
        return `${base} bg-rose-50 text-rose-700 border border-rose-200`;
      default:
        return `${base} bg-slate-100 text-slate-700 border border-slate-200`;
    }
  }

  get dotClass(): string {
    switch (this.text.toLowerCase()) {
      case 'disponible':
      case 'nueva':
      case 'activo':
      case 'conectado':
        return 'bg-emerald-500';
      case 'reservada':
      case 'en gestión':
      case 'media':
        return 'bg-amber-500';
      case 'vendida':
      case 'alquilada':
      case 'cierre_ganado':
        return 'bg-teal-500';
      case 'alta':
      case 'urgente':
      case 'descartada':
      case 'cierre_perdido':
        return 'bg-rose-500';
      default:
        return 'bg-slate-400';
    }
  }
}
