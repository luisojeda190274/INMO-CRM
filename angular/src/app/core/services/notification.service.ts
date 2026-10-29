import { Injectable, signal, computed } from '@angular/core';
import { NotificationAlert } from '../../models/crm.models';

const INITIAL_NOTIFICATIONS: NotificationAlert[] = [
  {
    id: 'notif-1',
    title: 'Nueva consulta en Zonaprop',
    description: 'Martín Gómez consultó por el Departamento en Palermo Hollywood (NEX-1042)',
    time: 'Hace 15 min',
    read: false,
    type: 'lead',
    targetModule: 'leads',
    targetId: 'lead-1',
  },
  {
    id: 'notif-2',
    title: 'Visita coordinada hoy',
    description: 'A las 16:30 hs con Valeria Rossi en Casa Belgrano R (NEX-1043)',
    time: 'Hace 45 min',
    read: false,
    type: 'visit',
    targetModule: 'calendar',
    targetId: 'vis-1',
  },
  {
    id: 'notif-3',
    title: 'Coincidencia de búsqueda',
    description: '3 nuevas propiedades coinciden con los criterios de Diego Benítez',
    time: 'Hace 2 horas',
    read: true,
    type: 'match',
    targetModule: 'matching',
    targetId: 'search-1',
  },
  {
    id: 'notif-4',
    title: 'Avance de oportunidad',
    description: 'La oferta por PH Villa Crespo avanzó a etapa Negociación / Oferta',
    time: 'Ayer',
    read: true,
    type: 'deal',
    targetModule: 'opportunities',
    targetId: 'opp-1',
  },
];

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  readonly notifications = signal<NotificationAlert[]>(INITIAL_NOTIFICATIONS);

  readonly unreadCount = computed(() =>
    this.notifications().filter(n => !n.read).length
  );

  markAsRead(id: string): void {
    this.notifications.update(items =>
      items.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  markAllAsRead(): void {
    this.notifications.update(items =>
      items.map(n => ({ ...n, read: true }))
    );
  }

  addNotification(alert: Omit<NotificationAlert, 'id' | 'time' | 'read'>): void {
    const newNotif: NotificationAlert = {
      ...alert,
      id: `notif-${Date.now()}`,
      time: 'Recién',
      read: false
    };
    this.notifications.update(items => [newNotif, ...items]);
  }
}
