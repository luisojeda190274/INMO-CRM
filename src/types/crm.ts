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
  code: string; // e.g. "NEX-1042"
  title: string;
  address: string;
  neighborhood: string;
  city: string;
  propertyType: PropertyType;
  operation: OperationType;
  price: number;
  currency: 'USD' | 'ARS';
  expenses: number; // Expensas en ARS
  coveredSurface: number; // m2 cubiertos
  totalSurface: number; // m2 totales
  rooms: number; // ambientes
  bedrooms: number; // dormitorios
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
  features: string[]; // e.g. ["Balcón", "Piscina", "Parrilla", "Seguridad 24hs", "Gimnasio", "SUM"]
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
  origin: string; // e.g. "Zonaprop", "Referido", "Cartel", "Web"
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
  probability: number; // percentage
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
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'Programada' | 'Realizada' | 'Cancelada' | 'Reprogramada';
  notes: string;
  feedback?: string;
  clientRating?: number; // 1 to 5
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
  relatedTo?: string; // Property or Contact
  completed: boolean;
  priority: 'Baja' | 'Media' | 'Alta';
}
