import { Injectable, signal, computed } from '@angular/core';
import { 
  Property, 
  Contact, 
  LeadInquiry, 
  Opportunity, 
  OpportunityStage, 
  Visit, 
  ClientSearchCriteria, 
  PortalStatus, 
  TaskItem, 
  TeamMember, 
  AgencyBranch, 
  LeadStatus,
  NavModule 
} from '../../models/crm.models';
import { 
  INITIAL_PROPERTIES, 
  INITIAL_CONTACTS, 
  INITIAL_LEADS, 
  INITIAL_OPPORTUNITIES, 
  INITIAL_VISITS, 
  INITIAL_SEARCHES, 
  INITIAL_PORTALS, 
  INITIAL_TASKS, 
  INITIAL_TEAM, 
  INITIAL_BRANCHES 
} from '../../data/crm-mock-data';

const STORAGE_KEY_PROPERTIES = 'nexo_properties';
const STORAGE_KEY_TASKS = 'nexo_tasks';

function loadStoredProperties(): Property[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROPERTIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading properties from storage', e);
    }
  }
  return INITIAL_PROPERTIES;
}

function loadStoredTasks(): TaskItem[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading tasks from storage', e);
    }
  }
  return INITIAL_TASKS;
}

@Injectable({
  providedIn: 'root'
})
export class CrmService {
  // Navigation State
  readonly activeModule = signal<NavModule>('dashboard');
  readonly isSidebarCollapsed = signal<boolean>(false);

  // Core Data Signals with persistence
  readonly properties = signal<Property[]>(loadStoredProperties());
  readonly contacts = signal<Contact[]>(INITIAL_CONTACTS);
  readonly leads = signal<LeadInquiry[]>(INITIAL_LEADS);
  readonly opportunities = signal<Opportunity[]>(INITIAL_OPPORTUNITIES);
  readonly visits = signal<Visit[]>(INITIAL_VISITS);
  readonly searches = signal<ClientSearchCriteria[]>(INITIAL_SEARCHES);
  readonly portals = signal<PortalStatus[]>(INITIAL_PORTALS);
  readonly tasks = signal<TaskItem[]>(loadStoredTasks());
  readonly team = signal<TeamMember[]>(INITIAL_TEAM);
  readonly branches = signal<AgencyBranch[]>(INITIAL_BRANCHES);
  readonly selectedBranchId = signal<string>(INITIAL_BRANCHES[0]?.id || 'branch-1');

  // UI State
  readonly isWelcomeTourOpen = signal<boolean>(false);
  readonly welcomeTourStep = signal<number>(0);
  readonly isNewPropertyModalOpen = signal<boolean>(false);
  readonly selectedPropertyId = signal<string | null>(null);

  // Computed Indicators
  readonly newLeadsCount = computed(() => 
    this.leads().filter(l => l.status === 'Nueva').length
  );

  readonly pendingTasksCount = computed(() => 
    this.tasks().filter(t => !t.completed).length
  );

  readonly activePropertiesCount = computed(() => 
    this.properties().filter(p => p.status === 'Disponible' || p.status === 'Reservada').length
  );

  readonly totalPortfolioValueUSD = computed(() => {
    return this.properties()
      .filter(p => p.status === 'Disponible')
      .reduce((sum, p) => sum + (p.currency === 'USD' ? p.price : p.price / 1280), 0);
  });

  readonly currentBranch = computed(() => {
    const branch = this.branches().find(b => b.id === this.selectedBranchId());
    return branch || this.branches()[0];
  });

  // Navigation Methods
  setActiveModule(module: NavModule): void {
    this.activeModule.set(module);
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(prev => !prev);
  }

  setSelectedBranchId(id: string): void {
    this.selectedBranchId.set(id);
  }

  private persistProperties(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(this.properties()));
      } catch (e) {
        console.warn('Error saving properties to localStorage', e);
      }
    }
  }

  private persistTasks(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(this.tasks()));
      } catch (e) {
        console.warn('Error saving tasks to localStorage', e);
      }
    }
  }

  // Property Actions
  addProperty(property: Omit<Property, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'inquiriesCount'>): void {
    const newId = `prop-${Date.now()}`;
    const newCode = `NEX-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newProp: Property = {
      ...property,
      id: newId,
      code: newCode,
      createdAt: now,
      updatedAt: now,
      viewsCount: 0,
      inquiriesCount: 0
    };

    this.properties.update(items => [newProp, ...items]);
    this.persistProperties();
  }

  updateProperty(id: string, updates: Partial<Property>): void {
    this.properties.update(items =>
      items.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)
    );
    this.persistProperties();
  }

  deleteProperty(id: string): void {
    this.properties.update(items => items.filter(p => p.id !== id));
    this.persistProperties();
  }

  duplicateProperty(id: string): void {
    const orig = this.properties().find(p => p.id === id);
    if (!orig) return;
    const newId = `prop-${Date.now()}`;
    const newCode = `NEX-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const cloned: Property = {
      ...orig,
      id: newId,
      code: newCode,
      title: `${orig.title} (Copia)`,
      createdAt: now,
      updatedAt: now,
      viewsCount: 0,
      inquiriesCount: 0,
      status: 'Disponible'
    };
    this.properties.update(items => [cloned, ...items]);
    this.persistProperties();
  }

  addPropertyNote(propertyId: string, text: string, author: string = 'Martín Somoza'): void {
    const newNote = {
      id: `note-${Date.now()}`,
      date: new Date().toLocaleDateString('es-AR'),
      author,
      text
    };
    this.properties.update(items =>
      items.map(p => {
        if (p.id !== propertyId) return p;
        return {
          ...p,
          notesList: [newNote, ...(p.notesList || [])]
        };
      })
    );
    this.persistProperties();
  }

  togglePortalSync(propertyId: string, portal: keyof Property['portals']): void {
    this.properties.update(items =>
      items.map(p => {
        if (p.id !== propertyId) return p;
        return {
          ...p,
          portals: {
            ...p.portals,
            [portal]: !p.portals[portal]
          },
          updatedAt: new Date().toISOString()
        };
      })
    );
    this.persistProperties();
  }

  // Lead Actions
  updateLeadStatus(id: string, status: LeadStatus): void {
    this.leads.update(items =>
      items.map(l => l.id === id ? { ...l, status } : l)
    );
  }

  // Opportunity Actions
  updateOpportunityStage(id: string, stage: OpportunityStage): void {
    this.opportunities.update(items =>
      items.map(o => o.id === id ? { ...o, stage, lastActivity: 'Hoy' } : o)
    );
  }

  // Task Actions
  toggleTaskCompleted(id: string): void {
    this.tasks.update(items =>
      items.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
    this.persistTasks();
  }

  addTask(task: { title: string; dueDate: string; assignedTo: string; priority: 'Alta' | 'Media' | 'Baja' }): void {
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: task.title,
      dueDate: task.dueDate,
      completed: false,
      assignedTo: task.assignedTo,
      priority: task.priority
    };
    this.tasks.update(items => [newTask, ...items]);
    this.persistTasks();
  }

  // Welcome Onboarding
  openWelcomeTour(step: number = 0): void {
    this.welcomeTourStep.set(step);
    this.isWelcomeTourOpen.set(true);
  }

  closeWelcomeTour(): void {
    this.isWelcomeTourOpen.set(false);
  }

  setWelcomeTourStep(step: number): void {
    this.welcomeTourStep.set(step);
  }

  completeWelcomeTour(): void {
    this.isWelcomeTourOpen.set(false);
  }
}
