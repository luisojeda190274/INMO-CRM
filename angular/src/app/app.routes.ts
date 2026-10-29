import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { PropertiesComponent } from './features/properties/properties.component';
import { ContactsComponent } from './features/contacts/contacts.component';
import { LeadsComponent } from './features/leads/leads.component';
import { OpportunitiesComponent } from './features/opportunities/opportunities.component';
import { CalendarComponent } from './features/calendar/calendar.component';
import { MatchingComponent } from './features/matching/matching.component';
import { PublicationsComponent } from './features/publications/publications.component';
import { ReportsComponent } from './features/reports/reports.component';
import { SettingsComponent } from './features/settings/settings.component';
import { TutorialsComponent } from './features/tutorials/tutorials.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard — Nexo Inmobiliario' },
  { path: 'properties', component: PropertiesComponent, title: 'Propiedades — Nexo Inmobiliario' },
  { path: 'contacts', component: ContactsComponent, title: 'Contactos — Nexo Inmobiliario' },
  { path: 'leads', component: LeadsComponent, title: 'Consultas — Nexo Inmobiliario' },
  { path: 'opportunities', component: OpportunitiesComponent, title: 'Oportunidades — Nexo Inmobiliario' },
  { path: 'calendar', component: CalendarComponent, title: 'Agenda y visitas — Nexo Inmobiliario' },
  { path: 'matching', component: MatchingComponent, title: 'Búsquedas de clientes — Nexo Inmobiliario' },
  { path: 'publications', component: PublicationsComponent, title: 'Publicaciones y portales — Nexo Inmobiliario' },
  { path: 'reports', component: ReportsComponent, title: 'Reportes — Nexo Inmobiliario' },
  { path: 'settings', component: SettingsComponent, title: 'Configuración — Nexo Inmobiliario' },
  { path: 'tutorials', component: TutorialsComponent, title: 'Ayuda y tutoriales — Nexo Inmobiliario' },
  { path: '**', redirectTo: 'dashboard' }
];
