import React from 'react';
import { CrmProvider, useCrm } from './context/CrmContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';

// 10 Full Functional CRM Modules
import { DashboardView } from './components/dashboard/DashboardView';
import { PropertiesView } from './components/properties/PropertiesView';
import { ContactsView } from './components/contacts/ContactsView';
import { LeadsView } from './components/leads/LeadsView';
import { OpportunitiesView } from './components/opportunities/OpportunitiesView';
import { CalendarView } from './components/calendar/CalendarView';
import { MatchingView } from './components/matching/MatchingView';
import { PublicationsView } from './components/publications/PublicationsView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

// Interactive Tutorials & Help Center
import { TutorialsHubView } from './components/tutorials/TutorialsHubView';
import { InteractiveTutorialAssistant } from './components/tutorials/InteractiveTutorialAssistant';
import { WelcomeTourModal } from './components/welcome/WelcomeTourModal';

const MainContent: React.FC = () => {
  const { 
    activeModule,
    isWelcomeTourOpen,
    welcomeTourStep,
    closeWelcomeTour,
    setWelcomeTourStep,
    completeWelcomeTour
  } = useCrm();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans selection:bg-teal-500 selection:text-white">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <Header />

        {/* Dynamic Navigable Work Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {activeModule === 'dashboard' && <DashboardView />}
          {activeModule === 'properties' && <PropertiesView />}
          {activeModule === 'contacts' && <ContactsView />}
          {activeModule === 'leads' && <LeadsView />}
          {activeModule === 'opportunities' && <OpportunitiesView />}
          {activeModule === 'calendar' && <CalendarView />}
          {activeModule === 'matching' && <MatchingView />}
          {activeModule === 'publications' && <PublicationsView />}
          {activeModule === 'reports' && <ReportsView />}
          {activeModule === 'settings' && <SettingsView />}
          {activeModule === 'tutorials' && <TutorialsHubView />}
        </main>
      </div>

      {/* Global Command Palette (Cmd + K) */}
      <GlobalSearchModal />

      {/* Docked Step-by-Step Interactive Tutorial Assistant */}
      <InteractiveTutorialAssistant />

      {/* Welcome Assistant & Onboarding Modals */}
      <WelcomeTourModal
        isOpen={isWelcomeTourOpen}
        step={welcomeTourStep}
        onClose={closeWelcomeTour}
        onSetStep={setWelcomeTourStep}
        onComplete={completeWelcomeTour}
      />
    </div>
  );
};

export default function App() {
  return (
    <CrmProvider>
      <MainContent />
    </CrmProvider>
  );
}
