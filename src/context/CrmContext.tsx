import React, { createContext, useContext, useState, useEffect } from 'react';
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
  LeadStatus
} from '../types/crm';
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
} from '../data/mockData';
import { Tutorial } from '../types/tutorial';
import { TUTORIALS_DATA } from '../data/tutorialsData';

export type NavModule = 
  | 'dashboard'
  | 'properties'
  | 'contacts'
  | 'leads'
  | 'opportunities'
  | 'calendar'
  | 'matching'
  | 'publications'
  | 'reports'
  | 'settings'
  | 'tutorials';

export interface NotificationAlert {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'lead' | 'visit' | 'deal' | 'match';
  targetModule?: NavModule;
  targetId?: string;
}

interface CrmContextType {
  activeModule: NavModule;
  setActiveModule: (module: NavModule) => void;
  
  // Currency & Multi-tenant
  currencyMode: 'USD' | 'ARS';
  setCurrencyMode: (c: 'USD' | 'ARS') => void;
  usdToArsRate: number;
  setUsdToArsRate: (rate: number) => void;
  formatCurrency: (amount: number, currency: 'USD' | 'ARS') => string;
  selectedBranchId: string;
  setSelectedBranchId: (id: string) => void;
  branches: AgencyBranch[];
  teamMembers: TeamMember[];

  // Entities
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'inquiriesCount'>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  duplicateProperty: (id: string) => void;
  archiveProperty: (id: string) => void;
  deleteProperty: (id: string) => void;
  togglePortalSync: (propertyId: string, portal: keyof Property['portals']) => void;

  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'lastContact' | 'activeSearchesCount'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;

  leads: LeadInquiry[];
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  addLead: (lead: Omit<LeadInquiry, 'id' | 'code' | 'receivedAt'>) => void;

  opportunities: Opportunity[];
  updateOpportunityStage: (id: string, newStage: OpportunityStage) => void;
  addOpportunity: (opp: Omit<Opportunity, 'id' | 'lastActivity'>) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;

  visits: Visit[];
  addVisit: (visit: Omit<Visit, 'id'>) => void;
  updateVisitStatus: (id: string, status: Visit['status'], feedback?: string) => void;

  searches: ClientSearchCriteria[];
  addSearch: (search: Omit<ClientSearchCriteria, 'id' | 'createdAt'>) => void;
  toggleSearchActive: (id: string) => void;

  tasks: TaskItem[];
  toggleTaskCompleted: (id: string) => void;
  addTask: (task: Omit<TaskItem, 'id' | 'completed'>) => void;

  portals: PortalStatus[];
  triggerPortalSync: (portalId: string) => void;

  // Modals & detail triggers
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  isNewPropertyModalOpen: boolean;
  setIsNewPropertyModalOpen: (open: boolean) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  selectedContactForDrawer: Contact | null;
  setSelectedContactForDrawer: (contact: Contact | null) => void;

  // Notifications
  notifications: NotificationAlert[];
  unreadNotificationsCount: number;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;

  // Sidebar toggle
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (v: boolean | ((prev: boolean) => boolean)) => void;

  // Interactive Tutorials
  tutorials: Tutorial[];
  activeTutorial: Tutorial | null;
  currentTutorialStepIndex: number;
  isTutorialActive: boolean;
  isTutorialMinimized: boolean;
  startTutorial: (tutorialId: string) => void;
  nextTutorialStep: () => void;
  prevTutorialStep: () => void;
  goToTutorialStep: (stepIndex: number) => void;
  endTutorial: () => void;
  toggleMinimizeTutorial: () => void;
  lastCreatedPropertyId: string | null;
  setLastCreatedPropertyId: (id: string | null) => void;

  // Welcome Assistant & Onboarding
  isWelcomeTourOpen: boolean;
  welcomeTourStep: number;
  openWelcomeTour: (initialStep?: number) => void;
  closeWelcomeTour: () => void;
  setWelcomeTourStep: (step: number) => void;
  completeWelcomeTour: () => void;
  resetWelcomeTour: () => void;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<NavModule>('dashboard');
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'ARS'>('USD');
  const [usdToArsRate, setUsdToArsRate] = useState<number>(1320); // Dólar Blue / MEP vigente
  const [selectedBranchId, setSelectedBranchId] = useState<string>('branch-1');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Entities stored in local state initialized from mock data or local storage
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('nexo_properties');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_PROPERTIES;
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('nexo_contacts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_CONTACTS;
  });

  const [leads, setLeads] = useState<LeadInquiry[]>(() => {
    const saved = localStorage.getItem('nexo_leads');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_LEADS;
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem('nexo_opportunities');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_OPPORTUNITIES;
  });

  const [visits, setVisits] = useState<Visit[]>(() => {
    const saved = localStorage.getItem('nexo_visits');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_VISITS;
  });

  const [searches, setSearches] = useState<ClientSearchCriteria[]>(() => {
    const saved = localStorage.getItem('nexo_searches');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_SEARCHES;
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('nexo_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_TASKS;
  });

  const [portals, setPortals] = useState<PortalStatus[]>(INITIAL_PORTALS);
  const [teamMembers] = useState<TeamMember[]>(INITIAL_TEAM);
  const [branches] = useState<AgencyBranch[]>(INITIAL_BRANCHES);

  // Modal and drawer controls
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isNewPropertyModalOpen, setIsNewPropertyModalOpen] = useState<boolean>(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState<boolean>(false);
  const [selectedContactForDrawer, setSelectedContactForDrawer] = useState<Contact | null>(null);

  // Tutorials state
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);
  const [currentTutorialStepIndex, setCurrentTutorialStepIndex] = useState<number>(0);
  const [isTutorialMinimized, setIsTutorialMinimized] = useState<boolean>(false);
  const [lastCreatedPropertyId, setLastCreatedPropertyId] = useState<string | null>(null);

  // Welcome Assistant & Onboarding
  const [isWelcomeTourOpen, setIsWelcomeTourOpen] = useState<boolean>(() => {
    const status = localStorage.getItem('nexo_welcome_tour_status');
    // If not set yet, it is a new user -> show welcome modal automatically
    return !status;
  });
  const [welcomeTourStep, setWelcomeTourStep] = useState<number>(0);

  const openWelcomeTour = (initialStep: number = 0) => {
    setWelcomeTourStep(initialStep);
    setIsWelcomeTourOpen(true);
  };

  const closeWelcomeTour = () => {
    setIsWelcomeTourOpen(false);
    localStorage.setItem('nexo_welcome_tour_status', 'dismissed');
  };

  const completeWelcomeTour = () => {
    setIsWelcomeTourOpen(false);
    localStorage.setItem('nexo_welcome_tour_status', 'completed');
  };

  const resetWelcomeTour = () => {
    localStorage.removeItem('nexo_welcome_tour_status');
    setWelcomeTourStep(0);
    setIsWelcomeTourOpen(true);
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationAlert[]>([
    {
      id: 'notif-1',
      title: 'Nueva consulta en Zonaprop',
      description: 'Lucía Santillán consultó por Semipiso Libertador 2450 (NEX-1042)',
      time: 'Hace 15 min',
      read: false,
      type: 'lead',
      targetModule: 'leads',
      targetId: 'lead-1',
    },
    {
      id: 'notif-2',
      title: 'Visita confirmada para el sábado',
      description: 'Ignacio Zuberbühler visitará la casa en Las Glorias a las 15:30 hs',
      time: 'Hace 1 hora',
      read: false,
      type: 'visit',
      targetModule: 'calendar',
    },
    {
      id: 'notif-3',
      title: 'Nuevo cruce de búsqueda exitoso',
      description: 'El departamento NEX-1042 coincide al 95% con la búsqueda de Gonzalo Fernández',
      time: 'Hace 3 horas',
      read: true,
      type: 'match',
      targetModule: 'matching',
    },
  ]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('nexo_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('nexo_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('nexo_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('nexo_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('nexo_visits', JSON.stringify(visits));
  }, [visits]);

  useEffect(() => {
    localStorage.setItem('nexo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Keyboard shortcut Cmd+K or Ctrl+K for Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const formatCurrency = (amount: number, currency: 'USD' | 'ARS'): string => {
    if (currency === 'USD') {
      return `USD ${amount.toLocaleString('es-AR')}`;
    }
    return `$ ${amount.toLocaleString('es-AR')}`;
  };

  // Property handlers
  const addProperty = (newProp: Omit<Property, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'inquiriesCount'>) => {
    const nextNum = 1080 + properties.length + 1;
    const newId = `prop-${Date.now()}`;
    const property: Property = {
      ...newProp,
      id: newId,
      code: `NEX-${nextNum}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      inquiriesCount: 0,
    };
    setProperties(prev => [property, ...prev]);
    setLastCreatedPropertyId(newId);
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updates,
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
      return p;
    }));
  };

  const duplicateProperty = (id: string) => {
    const target = properties.find(p => p.id === id);
    if (!target) return;
    const nextNum = 1090 + Math.floor(Math.random() * 50);
    const duplicated: Property = {
      ...target,
      id: `prop-${Date.now()}`,
      code: `NEX-${nextNum}`,
      title: `${target.title} (Copia)`,
      status: 'Disponible',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      viewsCount: 0,
      inquiriesCount: 0,
    };
    setProperties(prev => [duplicated, ...prev]);
  };

  const archiveProperty = (id: string) => {
    updateProperty(id, { status: 'Suspendida' });
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const togglePortalSync = (propertyId: string, portal: keyof Property['portals']) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        return {
          ...p,
          portals: {
            ...p.portals,
            [portal]: !p.portals[portal],
          },
        };
      }
      return p;
    }));
  };

  // Contacts handlers
  const addContact = (newContact: Omit<Contact, 'id' | 'lastContact' | 'activeSearchesCount'>) => {
    const contact: Contact = {
      ...newContact,
      id: `cont-${Date.now()}`,
      lastContact: new Date().toISOString().split('T')[0],
      activeSearchesCount: 0,
    };
    setContacts(prev => [contact, ...prev]);
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  // Leads handlers
  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const addLead = (lead: Omit<LeadInquiry, 'id' | 'code' | 'receivedAt'>) => {
    const newLead: LeadInquiry = {
      ...lead,
      id: `lead-${Date.now()}`,
      code: `INQ-${9400 + leads.length + 1}`,
      receivedAt: 'Recién',
    };
    setLeads(prev => [newLead, ...prev]);
  };

  // Opportunities handlers
  const updateOpportunityStage = (id: string, newStage: OpportunityStage) => {
    setOpportunities(prev => prev.map(o => {
      if (o.id === id) {
        return {
          ...o,
          stage: newStage,
          lastActivity: `Etapa actualizada a ${newStage.replace('_', ' ')}`,
        };
      }
      return o;
    }));
  };

  const addOpportunity = (opp: Omit<Opportunity, 'id' | 'lastActivity'>) => {
    const newOpp: Opportunity = {
      ...opp,
      id: `opp-${Date.now()}`,
      lastActivity: 'Oportunidad creada en el pipeline',
    };
    setOpportunities(prev => [newOpp, ...prev]);
  };

  const updateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  // Visits handlers
  const addVisit = (visit: Omit<Visit, 'id'>) => {
    const newVisit: Visit = {
      ...visit,
      id: `visit-${Date.now()}`,
    };
    setVisits(prev => [newVisit, ...prev]);
  };

  const updateVisitStatus = (id: string, status: Visit['status'], feedback?: string) => {
    setVisits(prev => prev.map(v => {
      if (v.id === id) {
        return {
          ...v,
          status,
          feedback: feedback || v.feedback,
        };
      }
      return v;
    }));
  };

  // Searches handlers
  const addSearch = (search: Omit<ClientSearchCriteria, 'id' | 'createdAt'>) => {
    const newSearch: ClientSearchCriteria = {
      ...search,
      id: `search-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      matchedPropertiesCount: 0,
    };
    setSearches(prev => [newSearch, ...prev]);
  };

  const toggleSearchActive = (id: string) => {
    setSearches(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  // Tasks handlers
  const toggleTaskCompleted = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (task: Omit<TaskItem, 'id' | 'completed'>) => {
    const newTask: TaskItem = {
      ...task,
      id: `task-${Date.now()}`,
      completed: false,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  // Portal sync simulation
  const triggerPortalSync = (portalId: string) => {
    setPortals(prev => prev.map(p => {
      if (p.id === portalId) {
        return {
          ...p,
          lastSync: 'Recién sincronizado con éxito',
        };
      }
      return p;
    }));
  };

  // Notification handlers
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Tutorial handlers
  const startTutorial = (tutorialId: string) => {
    const tut = TUTORIALS_DATA.find(t => t.id === tutorialId);
    if (!tut || !tut.isReady) return;
    setActiveTutorial(tut);
    setCurrentTutorialStepIndex(0);
    setIsTutorialMinimized(false);
    if (tut.steps[0]?.targetModule) {
      setActiveModule(tut.steps[0].targetModule);
    }
  };

  const nextTutorialStep = () => {
    if (!activeTutorial) return;
    if (currentTutorialStepIndex < activeTutorial.steps.length - 1) {
      const nextIdx = currentTutorialStepIndex + 1;
      setCurrentTutorialStepIndex(nextIdx);
      const nextStep = activeTutorial.steps[nextIdx];
      if (nextStep?.targetModule) {
        setActiveModule(nextStep.targetModule);
      }
      if (activeTutorial.id === 'cargar-propiedad' && nextIdx === 1) {
        setIsNewPropertyModalOpen(true);
      }
    } else {
      endTutorial();
    }
  };

  const prevTutorialStep = () => {
    if (!activeTutorial || currentTutorialStepIndex <= 0) return;
    const prevIdx = currentTutorialStepIndex - 1;
    setCurrentTutorialStepIndex(prevIdx);
    const prevStep = activeTutorial.steps[prevIdx];
    if (prevStep?.targetModule) {
      setActiveModule(prevStep.targetModule);
    }
  };

  const goToTutorialStep = (stepIndex: number) => {
    if (!activeTutorial || stepIndex < 0 || stepIndex >= activeTutorial.steps.length) return;
    setCurrentTutorialStepIndex(stepIndex);
    const step = activeTutorial.steps[stepIndex];
    if (step?.targetModule) {
      setActiveModule(step.targetModule);
    }
    if (activeTutorial.id === 'cargar-propiedad' && (stepIndex >= 1 && stepIndex <= 6)) {
      setIsNewPropertyModalOpen(true);
    }
  };

  const endTutorial = () => {
    setActiveTutorial(null);
    setCurrentTutorialStepIndex(0);
    setIsTutorialMinimized(false);
  };

  const toggleMinimizeTutorial = () => {
    setIsTutorialMinimized(prev => !prev);
  };

  return (
    <CrmContext.Provider value={{
      activeModule,
      setActiveModule,
      currencyMode,
      setCurrencyMode,
      usdToArsRate,
      setUsdToArsRate,
      formatCurrency,
      selectedBranchId,
      setSelectedBranchId,
      branches,
      teamMembers,
      properties,
      addProperty,
      updateProperty,
      duplicateProperty,
      archiveProperty,
      deleteProperty,
      togglePortalSync,
      contacts,
      addContact,
      updateContact,
      deleteContact,
      leads,
      updateLeadStatus,
      addLead,
      opportunities,
      updateOpportunityStage,
      addOpportunity,
      updateOpportunity,
      visits,
      addVisit,
      updateVisitStatus,
      searches,
      addSearch,
      toggleSearchActive,
      tasks,
      toggleTaskCompleted,
      addTask,
      portals,
      triggerPortalSync,
      selectedPropertyId,
      setSelectedPropertyId,
      isNewPropertyModalOpen,
      setIsNewPropertyModalOpen,
      isGlobalSearchOpen,
      setIsGlobalSearchOpen,
      selectedContactForDrawer,
      setSelectedContactForDrawer,
      notifications,
      unreadNotificationsCount,
      markAllNotificationsRead,
      markNotificationRead,
      isSidebarCollapsed,
      setIsSidebarCollapsed,

      // Tutorials
      tutorials: TUTORIALS_DATA,
      activeTutorial,
      currentTutorialStepIndex,
      isTutorialActive: Boolean(activeTutorial),
      isTutorialMinimized,
      startTutorial,
      nextTutorialStep,
      prevTutorialStep,
      goToTutorialStep,
      endTutorial,
      toggleMinimizeTutorial,
      lastCreatedPropertyId,
      setLastCreatedPropertyId,

      // Welcome Assistant
      isWelcomeTourOpen,
      welcomeTourStep,
      openWelcomeTour,
      closeWelcomeTour,
      setWelcomeTourStep,
      completeWelcomeTour,
      resetWelcomeTour,
    }}>
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = (): CrmContextType => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
