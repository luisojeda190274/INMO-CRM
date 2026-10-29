export type PropertyType = 
  | 'Departamento'
  | 'Casa'
  | 'PH'
  | 'Terreno'
  | 'Oficina'
  | 'Local Comercial'
  | 'Cochera';

export type OperationType = 'Venta' | 'Alquiler' | 'Alquiler Temporal';

export type PropertyStatus = 'Disponible' | 'Reservada' | 'Vendida' | 'Alquilada' | 'Suspendida';

export interface Property {
  id: string;
  code: string;
  title: string;
  address: string;
  neighborhood: string;
  city: string;
  propertyType: PropertyType;
  operation: OperationType;
  price: number;
  currency: 'USD' | 'ARS';
  expenses: number;
  coveredSurface: number;
  totalSurface: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  garages: number;
  yearBuilt?: number;
  disposition?: 'Frente' | 'Contrafrente' | 'Lateral' | 'Interno';
  orientation?: 'Norte' | 'Sur' | 'Este' | 'Oeste' | 'Noreste' | 'Noroeste';
  status: PropertyStatus;
  mainImage: string;
  galleryImages: string[];
  description: string;
  updatedAt: string;
  createdAt: string;
  assignedAgent: string;
  featured: boolean;
  portals: {
    zonaprop: boolean;
    argenprop: boolean;
    mercadolibre: boolean;
    properati: boolean;
    ownWebsite: boolean;
  };
  features: string[];
  notesList?: Array<{
    id: string;
    date: string;
    author: string;
    text: string;
  }>;
  viewsCount: number;
  inquiriesCount: number;
  ownerContactId?: string;
  ownerName?: string;
}

export type ContactCategory = 'Comprador' | 'Propietario' | 'Inquilino' | 'Inversor' | 'Colega';

export interface Contact {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  category: ContactCategory;
  origin: string;
  budgetCurrency?: 'USD' | 'ARS';
  budgetMax?: number;
  assignedAgent: string;
  tags: string[];
  notes: string;
  lastContact: string;
  activeSearchesCount: number;
  linkedPropertyId?: string;
}

export type LeadStatus = 'Nueva' | 'En gestión' | 'Visita agendada' | 'Respondida' | 'Descartada';

export interface LeadInquiry {
  id: string;
  code: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  propertyId: string;
  propertyCode: string;
  propertyTitle: string;
  portalSource: 'Zonaprop' | 'Argenprop' | 'MercadoLibre' | 'Web' | 'WhatsApp' | 'Instagram';
  message: string;
  status: LeadStatus;
  receivedAt: string;
  assignedAgent: string;
  notes?: string;
}

export type OpportunityStage = 
  | 'primer_contacto'
  | 'calificacion'
  | 'visita_coordinada'
  | 'negociacion_oferta'
  | 'reserva_boleto'
  | 'cierre_ganado'
  | 'cierre_perdido';

export interface Opportunity {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  propertyId: string;
  propertyCode: string;
  propertyTitle: string;
  stage: OpportunityStage;
  expectedValue: number;
  currency: 'USD' | 'ARS';
  probability: number;
  assignedAgent: string;
  expectedCloseDate: string;
  lastActivity: string;
  notes: string;
}

export interface Visit {
  id: string;
  propertyId: string;
  propertyCode: string;
  propertyTitle: string;
  propertyAddress: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  agentName: string;
  date: string;
  time: string;
  status: 'Programada' | 'Realizada' | 'Cancelada' | 'Reprogramada';
  notes: string;
  feedback?: string;
  clientRating?: number;
}

export interface ClientSearchCriteria {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  propertyTypes: PropertyType[];
  operation: OperationType;
  zones: string[];
  maxBudget: number;
  budgetCurrency: 'USD' | 'ARS';
  minRooms: number;
  minBathrooms?: number;
  needsGarage: boolean;
  active: boolean;
  createdAt: string;
  matchedPropertiesCount?: number;
}

export interface PortalStatus {
  id: 'zonaprop' | 'argenprop' | 'mercadolibre' | 'properati' | 'ownWebsite';
  name: string;
  connected: boolean;
  publishedCount: number;
  quotaLimit: number;
  featuredRemaining: number;
  lastSync: string;
  logoColor: string;
}

export interface AgencyBranch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  isHeadquarters: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Administrador' | 'Martillero Broker' | 'Asesor Inmobiliario' | 'Asistente Comercial';
  branchId: string;
  activePropertiesCount: number;
  activeDealsCount: number;
  avatarUrl?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  dueDate: string;
  dueTime?: string;
  assignedTo: string;
  relatedTo?: string;
  completed: boolean;
  priority: 'Baja' | 'Media' | 'Alta';
}

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
