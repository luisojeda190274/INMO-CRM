import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Play, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  Building2, 
  Share2, 
  Users, 
  MessageSquareText, 
  Layers, 
  Calendar, 
  GitCompare, 
  Settings, 
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { TUTORIALS_DATA } from '../../data/tutorialsData';
import { Tutorial } from '../../types/tutorial';
import { PortalIntegrationGuideModal } from './PortalIntegrationGuideModal';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Share2,
  Users,
  MessageSquareText,
  Layers,
  Calendar,
  GitCompare,
  Settings,
};

export const TutorialsHubView: React.FC = () => {
  const { startTutorial, activeTutorial, openWelcomeTour } = useCrm();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewTutorial, setPreviewTutorial] = useState<Tutorial | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const filteredTutorials = TUTORIALS_DATA.filter(t => {
    const matchCat = 
      selectedCategory === 'all' || 
      (selectedCategory === 'priority' && t.isReady) ||
      t.category === selectedCategory;

    const matchSearch = 
      !searchTerm.trim() ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());

    return matchCat && matchSearch;
  });

  const readyCount = TUTORIALS_DATA.filter(t => t.isReady).length;
  const roadmapCount = TUTORIALS_DATA.filter(t => !t.isReady).length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-[#0A192F] to-[#132A4A] text-white rounded-2xl shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
            <GraduationCap className="w-4 h-4 text-teal-400" />
            <span>Academia & Onboarding Nexo Inmobiliario</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Tutoriales Interactivos Paso a Paso
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Aprende a utilizar el CRM guiado por nuestro asistente interactivo sobre las pantallas reales del sistema. Sin maquetas estáticas: cada tutorial interactúa con los módulos reales.
          </p>
          <div className="pt-1">
            <button
              onClick={() => openWelcomeTour(0)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl shadow-md cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ayuda para comenzar (Recorrido de bienvenida)</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 shrink-0">
          <div className="text-center px-2">
            <span className="block text-xl font-bold font-mono text-teal-400">{readyCount}</span>
            <span className="text-[10px] text-slate-300 uppercase tracking-wider font-medium">Disponibles</span>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center px-2">
            <span className="block text-xl font-bold font-mono text-slate-300">{roadmapCount}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">En ruta</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar tutorial por nombre o tema..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'priority', label: '★ Prioritarios' },
            { id: 'Inventario', label: 'Inventario' },
            { id: 'Portales', label: 'Portales' },
            { id: 'Ventas', label: 'Ventas' },
            { id: 'Clientes', label: 'Clientes' },
            { id: 'Configuración', label: 'Configuración' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Special Developer Banner for Portal Integration */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 border border-teal-500/40 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-500/30">
                Nuevo para desarrolladores
              </span>
              <span className="text-xs text-slate-400">Arquitectura CRM</span>
            </div>
            <h3 className="text-sm font-bold text-white mt-0.5">
              Cómo conectar portales inmobiliarios al CRM: Guía conceptual y técnica
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              Explicación integral para creadores de software: APIs vs Feeds XML, mapeo de datos con NEX-1042, ciclo de sincronización (alta, baja, pausa), multi-tenancy y checklist previo a programar.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setIsGuideModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Leer guía completa</span>
          </button>
        </div>
      </div>

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTutorials.map(tut => {
          const IconComponent = ICON_MAP[tut.icon] || BookOpen;
          const isCurrentActive = activeTutorial?.id === tut.id;
          const isPortalGuide = tut.id === 'conectar-portales-explicacion';

          return (
            <div
              key={tut.id}
              className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                tut.isReady
                  ? isPortalGuide 
                    ? 'border-teal-500/60 shadow-sm ring-1 ring-teal-500/20 hover:border-teal-600'
                    : 'border-slate-200 hover:border-teal-500/50 hover:shadow-md'
                  : 'border-slate-200/60 bg-slate-50/50 opacity-80'
              }`}
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                      tut.isReady 
                        ? 'bg-teal-50 text-teal-700 border border-teal-200' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {tut.category}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {tut.durationMinutes} min · {tut.difficulty}
                      </span>
                    </div>
                  </div>

                  {tut.isReady ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {isPortalGuide ? 'Guía + Interactivo' : 'Interactivo'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                      Próximamente
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                  {tut.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {tut.shortDescription}
                </p>

                {/* Step highlights preview */}
                {tut.isReady && tut.steps.length > 0 && (
                  <div className="space-y-1.5 mb-4 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-700 text-[10px] uppercase tracking-wider block">
                      Incluye {tut.steps.length} {isPortalGuide ? 'capítulos técnicos' : 'pasos interactivos'}:
                    </span>
                    <ul className="space-y-1 list-disc list-inside text-slate-500">
                      {tut.steps.slice(0, 3).map((s, idx) => (
                        <li key={idx} className="truncate">{s.title}</li>
                      ))}
                      {tut.steps.length > 3 && (
                        <li className="text-slate-400 italic">...y {tut.steps.length - 3} pasos más</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                {tut.isReady ? (
                  isPortalGuide ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => setIsGuideModalOpen(true)}
                        className="w-full py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                        <span>Leer guía completa (9 capítulos)</span>
                      </button>
                      <button
                        onClick={() => startTutorial(tut.id)}
                        className="w-full py-2 px-3.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs rounded-xl border border-teal-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isCurrentActive ? 'Continuar en pantalla' : 'Ver en asistente interactivo'}</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startTutorial(tut.id)}
                      className="w-full py-2 px-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isCurrentActive ? 'Continuar tutorial' : 'Iniciar tutorial interactivo'}</span>
                    </button>
                  )
                ) : (
                  <button
                    disabled
                    className="w-full py-2 px-3.5 bg-slate-100 text-slate-400 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed"
                  >
                    <span>Contenido en desarrollo</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Help & Support Footer Card */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            ¿Necesitás migrar desde Tokko Broker u otro CRM?
          </h4>
          <p className="text-xs text-slate-500">
            Nexo Inmobiliario permite importar inventario de propiedades y contactos vía archivo CSV o integración directa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Soporte técnico de Nexo Inmobiliario disponible: soporte@nexoinmobiliario.com')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg cursor-pointer"
          >
            Contactar mesa de ayuda
          </button>
        </div>
      </div>

      {/* Portal Integration Guide Modal */}
      <PortalIntegrationGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onStartAssistant={() => startTutorial('conectar-portales-explicacion')}
      />
    </div>
  );
};
