import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  Plus, 
  CheckCheck,
  ExternalLink,
  ChevronDown,
  Info,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useCrm, NavModule } from '../../context/CrmContext';

const MODULE_TITLES: Record<NavModule, string> = {
  dashboard: 'Dashboard general',
  properties: 'Inventario de propiedades',
  contacts: 'Directorio de contactos',
  leads: 'Consultas de portales',
  opportunities: 'Pipeline de oportunidades',
  calendar: 'Agenda y visitas',
  matching: 'Cruce inteligente de clientes',
  publications: 'Publicaciones y portales',
  reports: 'Reportes y estadísticas',
  settings: 'Usuarios y configuración',
  tutorials: 'Ayuda y tutoriales interactivos',
};

export const Header: React.FC = () => {
  const { 
    activeModule, 
    setActiveModule,
    currencyMode, 
    setCurrencyMode, 
    usdToArsRate,
    setIsNewPropertyModalOpen,
    setIsGlobalSearchOpen,
    notifications,
    unreadNotificationsCount,
    markAllNotificationsRead,
    markNotificationRead,
    setSelectedPropertyId,
    startTutorial,
    openWelcomeTour,
  } = useCrm();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setIsHelpOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between gap-6 shrink-0 z-20">
      {/* Zone 1: Breadcrumbs & Current View */}
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="text-xs font-semibold text-teal-600 hidden sm:inline">
          Nexo Inmobiliario
        </span>
        <span className="text-slate-300 hidden sm:inline">/</span>
        <h1 className="text-base font-bold text-slate-900 truncate">
          {MODULE_TITLES[activeModule]}
        </h1>
      </div>

      {/* Zone 2: Global Search Bar trigger & Currency Selector */}
      <div className="flex items-center gap-3 flex-1 max-w-md justify-center">
        {/* Search trigger */}
        <button
          onClick={() => setIsGlobalSearchOpen(true)}
          className="flex-1 flex items-center justify-between gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
            <span className="truncate">Buscar propiedades, clientes, códigos...</span>
          </div>
          <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Currency Switcher (USD / ARS) */}
        <div className="hidden lg:flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium">
          <button
            onClick={() => setCurrencyMode('USD')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              currencyMode === 'USD'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Mostrar valores de referencia en USD"
          >
            USD
          </button>
          <button
            onClick={() => setCurrencyMode('ARS')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              currencyMode === 'ARS'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title={`Mostrar valores en Pesos Argentinos (TC Ref: $${usdToArsRate})`}
          >
            ARS
          </button>
        </div>
      </div>

      {/* Zone 3: Actions, Notifications, Help & Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Quick New Property Button */}
        <button
          onClick={() => setIsNewPropertyModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nueva propiedad</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(prev => !prev)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors cursor-pointer"
            aria-label="Ver notificaciones"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Notificaciones</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 bg-teal-50 text-teal-700 border border-teal-200 rounded">
                      {unreadNotificationsCount} nuevas
                    </span>
                  )}
                </div>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Marcar leídas
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.targetModule) {
                        setActiveModule(n.targetModule);
                      }
                      if (n.type === 'lead') {
                        setSelectedPropertyId('prop-1');
                      }
                      setIsNotifOpen(false);
                    }}
                    className={`p-3 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                      !n.read ? 'bg-teal-50/40' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-semibold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400 tabular-nums">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{n.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help Popover */}
        <div className="relative" ref={helpRef}>
          <button
            onClick={() => setIsHelpOpen(prev => !prev)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Ayuda y soporte"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {isHelpOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-teal-600" />
                <h2 className="text-xs font-bold text-slate-900">Centro de Ayuda & Tutoriales</h2>
              </div>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Aprende a dominar las funciones de Nexo Inmobiliario con tutoriales guiados en vivo sobre las pantallas reales.
              </p>

              <div className="space-y-1.5 text-xs">
                {/* Onboarding Welcome Tour Entry */}
                <button
                  onClick={() => {
                    openWelcomeTour(0);
                    setIsHelpOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 text-teal-900 font-bold hover:bg-teal-100 flex items-center justify-between cursor-pointer transition-all shadow-2xs mb-1"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-slate-900">Ayuda para comenzar</span>
                      <span className="text-[10px] text-teal-700 font-normal">Recorrido guiado de 4 pasos por el CRM</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-teal-600 shrink-0" />
                </button>

                <button
                  onClick={() => {
                    setActiveModule('tutorials');
                    setIsHelpOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 flex items-center justify-between cursor-pointer"
                >
                  <span>Abrir Centro de Tutoriales</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block px-1">
                    Iniciar tutoriales rápidos:
                  </span>
                  <button
                    onClick={() => {
                      startTutorial('cargar-propiedad');
                      setIsHelpOpen(false);
                    }}
                    className="w-full text-left p-1.5 rounded hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-between cursor-pointer"
                  >
                    <span>1. Cómo cargar una propiedad</span>
                    <span className="text-[10px] text-teal-600 font-mono">8 pasos</span>
                  </button>
                  <button
                    onClick={() => {
                      startTutorial('sincronizar-publicaciones');
                      setIsHelpOpen(false);
                    }}
                    className="w-full text-left p-1.5 rounded hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-between cursor-pointer"
                  >
                    <span>2. Cómo sincronizar publicaciones</span>
                    <span className="text-[10px] text-teal-600 font-mono">5 pasos</span>
                  </button>
                </div>

                <div className="p-2 text-slate-500 text-[11px] bg-slate-50 rounded mt-2">
                  Atención técnica: soporte@nexoinmobiliario.com
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <div 
          onClick={() => setActiveModule('settings')}
          className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-[#0A192F] text-teal-300 flex items-center justify-center font-mono text-xs font-bold border border-teal-500/30">
            MS
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-tight group-hover:text-teal-600 transition-colors">
              Martín Somoza
            </span>
            <span className="text-[10px] text-slate-500">
              Torres & Asoc.
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
        </div>
      </div>
    </header>
  );
};
