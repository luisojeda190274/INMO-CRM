import React from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Share2, 
  Users, 
  Layers, 
  MessageSquareText, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Check, 
  AlertCircle, 
  ShieldAlert, 
  ExternalLink, 
  Compass, 
  Plus, 
  Home, 
  Building,
  KeyRound,
  FileCheck2,
  ChevronRight
} from 'lucide-react';
import { useCrm, NavModule } from '../../context/CrmContext';

interface WelcomeTourModalProps {
  isOpen: boolean;
  step: number; // 0 = Welcome initial, 1-4 = Guided tour steps
  onClose: () => void;
  onSetStep: (step: number) => void;
  onComplete: () => void;
}

export const WelcomeTourModal: React.FC<WelcomeTourModalProps> = ({
  isOpen,
  step,
  onClose,
  onSetStep,
  onComplete,
}) => {
  const { 
    setActiveModule, 
    setIsNewPropertyModalOpen, 
    formatCurrency 
  } = useCrm();

  if (!isOpen) return null;

  const navigateTo = (module: NavModule, callback?: () => void) => {
    setActiveModule(module);
    if (callback) callback();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* =========================================================================
            STAGE 0: MODAL DE BIENVENIDA INICIAL (FIRST WELCOME SCREEN)
        ========================================================================= */}
        {step === 0 && (
          <div className="flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-sm shadow-sm">
                  N
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400 block">
                    Nexo Inmobiliario · CRM SaaS
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    Asistente de primer ingreso
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Cerrar modal de bienvenida"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
              {/* Sector Real Estate Illustration */}
              <div className="w-full flex justify-center">
                <div className="relative w-full max-w-md h-40 sm:h-44 bg-gradient-to-b from-[#0c203b] via-[#0A192F] to-[#081528] rounded-2xl border border-teal-500/30 overflow-hidden flex items-center justify-center shadow-inner">
                  {/* Grid Lines Pattern */}
                  <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#14b8a6_1px,transparent_1px),linear-gradient(to_bottom,#14b8a6_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />

                  {/* Skyline / Real Estate Architectural Graphic */}
                  <svg className="w-full h-full relative z-10" viewBox="0 0 420 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Background Buildings */}
                    <rect x="40" y="55" width="45" height="95" rx="3" fill="#132A4A" opacity="0.6" />
                    <rect x="95" y="40" width="55" height="110" rx="3" fill="#18365E" opacity="0.7" />
                    <rect x="270" y="35" width="50" height="115" rx="3" fill="#132A4A" opacity="0.6" />
                    <rect x="330" y="60" width="45" height="90" rx="3" fill="#18365E" opacity="0.7" />

                    {/* Window Lights Background */}
                    <circle cx="62" cy="75" r="2.5" fill="#5eead4" opacity="0.7" />
                    <circle cx="62" cy="95" r="2.5" fill="#5eead4" opacity="0.7" />
                    <circle cx="122" cy="65" r="3" fill="#5eead4" opacity="0.8" />
                    <circle cx="122" cy="85" r="3" fill="#5eead4" opacity="0.8" />
                    <circle cx="122" cy="105" r="3" fill="#5eead4" opacity="0.8" />
                    <circle cx="295" cy="55" r="3" fill="#5eead4" opacity="0.8" />
                    <circle cx="295" cy="80" r="3" fill="#5eead4" opacity="0.8" />

                    {/* Main Central Modern Building */}
                    <rect x="160" y="25" width="100" height="125" rx="4" fill="#0A192F" stroke="#14b8a6" strokeWidth="1.5" />
                    
                    {/* Balconies / Architectural details */}
                    <line x1="170" y1="50" x2="250" y2="50" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="170" y1="75" x2="250" y2="75" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="170" y1="100" x2="250" y2="100" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="3 3" />
                    
                    {/* Glowing Windows on Central Tower */}
                    <rect x="175" y="35" width="14" height="10" rx="1.5" fill="#14b8a6" fillOpacity="0.8" />
                    <rect x="195" y="35" width="14" height="10" rx="1.5" fill="#0ea5e9" fillOpacity="0.8" />
                    <rect x="230" y="35" width="14" height="10" rx="1.5" fill="#14b8a6" fillOpacity="0.8" />

                    <rect x="175" y="60" width="14" height="10" rx="1.5" fill="#0ea5e9" fillOpacity="0.7" />
                    <rect x="210" y="60" width="14" height="10" rx="1.5" fill="#5eead4" />
                    <rect x="230" y="60" width="14" height="10" rx="1.5" fill="#14b8a6" fillOpacity="0.7" />

                    <rect x="175" y="85" width="14" height="10" rx="1.5" fill="#5eead4" fillOpacity="0.9" />
                    <rect x="200" y="85" width="14" height="10" rx="1.5" fill="#0ea5e9" fillOpacity="0.8" />
                    <rect x="230" y="85" width="14" height="10" rx="1.5" fill="#14b8a6" fillOpacity="0.8" />

                    {/* Entrance / Ground Floor */}
                    <rect x="198" y="125" width="24" height="25" rx="2" fill="#14b8a6" fillOpacity="0.3" stroke="#14b8a6" strokeWidth="1.2" />

                    {/* Floating Real Estate Metric Badges */}
                    <g transform="translate(18, 20)">
                      <rect width="115" height="34" rx="8" fill="#0A192F" stroke="#14b8a6" strokeWidth="1" />
                      <circle cx="16" cy="17" r="7" fill="#14b8a6" fillOpacity="0.2" />
                      <circle cx="16" cy="17" r="3.5" fill="#14b8a6" />
                      <text x="30" y="15" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Inventario Activo</text>
                      <text x="30" y="26" fill="#5eead4" fontSize="8" fontFamily="monospace">42 Inmuebles</text>
                    </g>

                    <g transform="translate(290, 80)">
                      <rect width="112" height="34" rx="8" fill="#0A192F" stroke="#38bdf8" strokeWidth="1" />
                      <circle cx="16" cy="17" r="7" fill="#38bdf8" fillOpacity="0.2" />
                      <circle cx="16" cy="17" r="3.5" fill="#38bdf8" />
                      <text x="30" y="15" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Portales Conectados</text>
                      <text x="30" y="26" fill="#38bdf8" fontSize="8" fontFamily="monospace">Zonaprop · Argenprop</text>
                    </g>
                  </svg>
                </div>
              </div>

              {/* Main Welcome Copy (Exact Brief Copy) */}
              <div className="text-center space-y-2.5 max-w-lg mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Plataforma de Gestión Inmobiliaria</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  ¡Bienvenido a Nexo Inmobiliario!
                </h2>

                <p className="text-sm text-slate-600 leading-relaxed">
                  «Gestioná tus propiedades, clientes, consultas y publicaciones desde un solo lugar. Te acompañamos para que puedas empezar en unos pocos pasos».
                </p>
              </div>

              {/* 4 Feature Pillars Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-teal-100/80 text-teal-700 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 block">1. Propiedades</span>
                  <span className="text-[10px] text-slate-500">Carga con fotos</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-cyan-100/80 text-cyan-700 flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 block">2. Publicaciones</span>
                  <span className="text-[10px] text-slate-500">Portales y matriz</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-indigo-100/80 text-indigo-700 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 block">3. Contactos</span>
                  <span className="text-[10px] text-slate-500">Clientes 360°</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-amber-100/80 text-amber-700 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 block">4. Seguimiento</span>
                  <span className="text-[10px] text-slate-500">Leads y visitas</span>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer text-center"
              >
                Lo veo después
              </button>

              <button
                onClick={() => onSetStep(1)}
                className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Empezar recorrido</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 1-4: RECORRIDO GUIADO EN 4 PASOS
        ========================================================================= */}
        {step >= 1 && step <= 4 && (
          <div className="flex flex-col">
            {/* Modal Top Header with Progress */}
            <div className="px-6 py-4 bg-slate-900 text-white shrink-0 border-b border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400 block">
                      Recorrido de bienvenida · Paso {step} de 4
                    </span>
                    <h2 className="text-sm font-bold text-white">
                      {step === 1 && 'Paso 1 — Cargá tus propiedades'}
                      {step === 2 && 'Paso 2 — Configurá tus publicaciones'}
                      {step === 3 && 'Paso 3 — Organizá tus contactos'}
                      {step === 4 && 'Paso 4 — Gestioná consultas y seguimientos'}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Cerrar recorrido"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar & Step Indicators */}
              <div className="space-y-1.5">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-400 to-teal-500 transition-all duration-300"
                    style={{ width: `${(step / 4) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-4 gap-1 text-[10px] font-semibold text-center pt-0.5">
                  {[
                    { s: 1, label: '1. Propiedades' },
                    { s: 2, label: '2. Publicaciones' },
                    { s: 3, label: '3. Contactos' },
                    { s: 4, label: '4. Gestión' },
                  ].map(item => (
                    <button
                      key={item.s}
                      onClick={() => onSetStep(item.s)}
                      className={`truncate py-0.5 rounded transition-colors cursor-pointer ${
                        step === item.s 
                          ? 'text-teal-300 font-bold bg-teal-950/60 border border-teal-500/30' 
                          : step > item.s 
                          ? 'text-slate-400 hover:text-slate-200' 
                          : 'text-slate-500 hover:text-slate-400'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Step Content Body */}
            <div className="p-6 sm:p-7 space-y-5 overflow-y-auto max-h-[60vh]">
              {/* ------------------------------------------------------------------
                  PASO 1: CARGÁ TUS PROPIEDADES
              ------------------------------------------------------------------ */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Cómo registrar un inmueble en cartera
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Nexo Inmobiliario te permite gestionar todo el ciclo de vida de una propiedad, desde la captación inicial hasta la venta o alquiler.
                      </p>
                    </div>
                  </div>

                  {/* Step Breakdown Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-mono flex items-center justify-center">1</span>
                        <span>Datos principales y valores</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Definí el título comercial, dirección exacta, barrio, tipo de propiedad (Departamento, Casa, PH, etc.), moneda (USD o ARS) y valores de expensas.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-mono flex items-center justify-center">2</span>
                        <span>Fotografías del inmueble</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Subí fotos directamente desde tu computadora o celular. Podés elegir la imagen principal de portada que se mostrará en los portales.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-mono flex items-center justify-center">3</span>
                        <span>Asociación del propietario</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Vinculá el inmueble a un contacto registrado como Propietario para mantener todo el historial de visitas, ofertas y devoluciones unificado.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-mono flex items-center justify-center">4</span>
                        <span>Código correlativo automático</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Al guardar, el sistema le asigna automáticamente un código único correlativo (por ejemplo: <strong className="text-teal-700 font-mono">NEX-1042</strong>) para búsqueda rápida.
                      </p>
                    </div>
                  </div>

                  {/* Real Navigation CTA */}
                  <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="space-y-0.5 text-center sm:text-left">
                      <span className="text-xs font-bold text-teal-900 block">
                        Probá navegar a la sección de propiedades:
                      </span>
                      <span className="text-[11px] text-teal-700">
                        Podés explorar el inventario actual o abrir el formulario de alta.
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          navigateTo('properties');
                          onClose();
                        }}
                        className="flex-1 sm:flex-initial px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Ir a Propiedades</span>
                      </button>

                      <button
                        onClick={() => {
                          navigateTo('properties', () => setIsNewPropertyModalOpen(true));
                          onClose();
                        }}
                        className="flex-1 sm:flex-initial px-3.5 py-2 bg-white hover:bg-teal-100/60 text-teal-800 border border-teal-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Abrir formulario</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------------
                  PASO 2: CONFIGURÁ TUS PUBLICACIONES
              ------------------------------------------------------------------ */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center shrink-0">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Matriz de portales y preparación de publicaciones
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Controlá la presencia de tus inmuebles en los principales portales inmobiliarios desde una pantalla centralizada.
                      </p>
                    </div>
                  </div>

                  {/* Explicit Portal Requirements Disclaimer (Strictly follows brief) */}
                  <div className="p-3.5 bg-amber-50 border border-amber-300/80 rounded-xl space-y-1.5 text-xs text-amber-950">
                    <div className="flex items-center gap-2 font-bold text-amber-900">
                      <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Cómo se preparan las integraciones con portales</span>
                    </div>
                    <p className="text-[11px] text-amber-900/90 leading-relaxed">
                      Cada conexión con portales inmobiliarios (como Zonaprop, Argenprop, Mercado Libre o Properati) puede requerir <strong>credenciales técnicas</strong> (API Key, Client ID o tokens OAuth2), permisos de red y una <strong>autorización o contrato comercial vigente</strong> con cupos otorgados por cada proveedor.
                    </p>
                    <p className="text-[11px] text-amber-900/90 leading-relaxed font-medium">
                      *Nexo Inmobiliario opera de forma transparente: no simula conexiones reales en vivo ni afirma que estén activas sin una previa homologación técnica y comercial con cada portal.
                    </p>
                  </div>

                  {/* How it works */}
                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block">
                      Funcionalidades del módulo de Publicaciones:
                    </span>
                    <ul className="space-y-2 text-slate-600">
                      <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900">Matriz de publicación por inmueble:</strong> podés activar o pausar con un solo clic el aviso de cada propiedad en los portales seleccionados.
                        </div>
                      </li>
                      <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900">Mapeo y sincronización continua:</strong> ante cualquier cambio de precio, expensas o reserva en el CRM, el aviso se actualiza automáticamente.
                        </div>
                      </li>
                      <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900">Portal propio web:</strong> además de portales externos, el CRM alimenta la página web de la inmobiliaria para compartir enlaces directos por WhatsApp.
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Navigation CTA */}
                  <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-700">
                      Conocé la matriz de publicación en vivo:
                    </span>
                    <button
                      onClick={() => {
                        navigateTo('publications');
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Ir a Publicaciones</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------------
                  PASO 3: ORGANIZÁ TUS CONTACTOS
              ------------------------------------------------------------------ */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Directorio unificado de clientes y propietarios
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Gestioná compradores, propietarios, inquilinos e inversores con su historial unificado y sin contactos duplicados.
                      </p>
                    </div>
                  </div>

                  {/* Contact Categories */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block mb-1">
                        Propietarios
                      </span>
                      <p className="text-[10px] text-slate-500">
                        Dueños de inmuebles en cartera y tasaciones.
                      </p>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 inline-block mb-1">
                        Compradores
                      </span>
                      <p className="text-[10px] text-slate-500">
                        Interesados con presupuesto asignado.
                      </p>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 inline-block mb-1">
                        Inversores
                      </span>
                      <p className="text-[10px] text-slate-500">
                        Fondos para proyectos y rentabilidad en pozo.
                      </p>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 inline-block mb-1">
                        Inquilinos
                      </span>
                      <p className="text-[10px] text-slate-500">
                        Alquileres residenciales y comerciales.
                      </p>
                    </div>
                  </div>

                  {/* Key Benefits */}
                  <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Relación con propiedades:</strong> asociá a los propietarios con sus respectivos inmuebles y a los compradores con las propiedades que visitaron.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Motor de cruce (*matchmaking*):</strong> registrá las preferencias del cliente (ambientes, zona, presupuesto) para que el sistema busque coincidencias automáticas.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Contacto directo:</strong> botón directo para abrir chats de WhatsApp o llamadas con el cliente desde la ficha.
                      </span>
                    </div>
                  </div>

                  {/* Real Navigation CTA */}
                  <div className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-xl flex items-center justify-between gap-3">
                    <span className="text-xs text-indigo-950 font-medium">
                      Explorá la lista de contactos y clientes:
                    </span>
                    <button
                      onClick={() => {
                        navigateTo('contacts');
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Ir a Contactos</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------------
                  PASO 4: GESTIONÁ CONSULTAS Y SEGUIMIENTOS
              ------------------------------------------------------------------ */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Consultas, pipeline de oportunidades y agenda
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Acompañá cada operación comercial desde la primera consulta del portal hasta la firma del boleto.
                      </p>
                    </div>
                  </div>

                  {/* 3 Pillars of Follow-up */}
                  <div className="space-y-2.5 text-xs">
                    {/* Leads Pillar */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <MessageSquareText className="w-4 h-4 text-teal-600" />
                          <strong className="text-slate-900 text-xs">1. Consultas de portales (Leads)</strong>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Bandeja unificada con mensajes de Zonaprop, Argenprop y Web. Asignación a asesores y respuesta ágil.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          navigateTo('leads');
                          onClose();
                        }}
                        className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <span>Ver Consultas</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Opportunities Kanban Pillar */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-indigo-600" />
                          <strong className="text-slate-900 text-xs">2. Pipeline de Oportunidades</strong>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Tablero Kanban por etapas: Primer contacto, Visita coordinada, Propuesta, Reserva tomada y Cierre.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          navigateTo('opportunities');
                          onClose();
                        }}
                        className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <span>Ver Oportunidades</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Visits & Calendar Pillar */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-600" />
                          <strong className="text-slate-900 text-xs">3. Agenda y Visitas a Inmuebles</strong>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Programación de visitas, recordatorios para el cliente y registro del feedback posterior.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          navigateTo('calendar');
                          onClose();
                        }}
                        className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <span>Ver Agenda</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Completion Banner */}
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div className="text-xs text-emerald-950">
                      <span className="font-bold block">¡Completaste el recorrido de bienvenida!</span>
                      <span>Ya conocés los 4 pilares fundamentales de Nexo Inmobiliario. Podés consultar los tutoriales interactivos en cualquier momento.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Navigation Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              {/* Skip Tour Button */}
              <button
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer transition-colors"
              >
                Saltar recorrido
              </button>

              {/* Step Navigation Buttons */}
              <div className="flex items-center gap-2">
                {step > 1 && (
                  <button
                    onClick={() => onSetStep(step - 1)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Anterior</span>
                  </button>
                )}

                {step < 4 ? (
                  <button
                    onClick={() => onSetStep(step + 1)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Siguiente</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={onComplete}
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Finalizar</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
