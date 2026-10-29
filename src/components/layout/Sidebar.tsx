import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  MessageSquareText, 
  Layers, 
  Calendar, 
  GitCompare, 
  Share2, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Building,
  GraduationCap
} from 'lucide-react';
import { useCrm, NavModule } from '../../context/CrmContext';

interface NavItem {
  id: NavModule;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
}

export const Sidebar: React.FC = () => {
  const { 
    activeModule, 
    setActiveModule, 
    leads, 
    tasks, 
    isSidebarCollapsed, 
    setIsSidebarCollapsed,
    branches,
    selectedBranchId,
    setSelectedBranchId
  } = useCrm();

  const newLeadsCount = leads.filter(l => l.status === 'Nueva').length;
  const pendingTasksCount = tasks.filter(t => !t.completed).length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Propiedades', icon: Building2 },
    { id: 'contacts', label: 'Contactos', icon: Users },
    { id: 'leads', label: 'Consultas', icon: MessageSquareText, badgeCount: newLeadsCount },
    { id: 'opportunities', label: 'Oportunidades', icon: Layers },
    { id: 'calendar', label: 'Agenda y visitas', icon: Calendar, badgeCount: pendingTasksCount },
    { id: 'matching', label: 'Búsquedas de clientes', icon: GitCompare },
    { id: 'publications', label: 'Publicaciones', icon: Share2 },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
    { id: 'settings', label: 'Usuarios y config.', icon: Settings },
    { id: 'tutorials', label: 'Ayuda y tutoriales', icon: GraduationCap },
  ];

  const currentBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

  return (
    <aside 
      className={`relative flex flex-col shrink-0 bg-[#0A192F] text-slate-300 transition-all duration-200 border-r border-[#1E3A5F] ${
        isSidebarCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#1E3A5F]">
        {!isSidebarCollapsed ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-[#0A192F] font-bold text-lg shadow-sm">
              N
            </div>
            <div className="flex flex-col truncate">
              <span className="text-white font-bold tracking-tight text-sm leading-tight">
                Nexo Inmobiliario
              </span>
              <span className="text-[11px] text-teal-400 font-medium tracking-wide">
                CRM & Broker SaaS
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-[#0A192F] font-bold text-lg shadow-sm">
            N
          </div>
        )}

        <button 
          onClick={() => setIsSidebarCollapsed(prev => !prev)}
          className={`p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#132A4A] transition-colors ${
            isSidebarCollapsed ? 'mx-auto mt-2' : ''
          }`}
          title={isSidebarCollapsed ? 'Expandir menú' : 'Contraer menú'}
          aria-label={isSidebarCollapsed ? 'Expandir menú' : 'Contraer menú'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Multi-tenant Branch Selector (if expanded) */}
      {!isSidebarCollapsed && (
        <div className="px-3 py-3 border-b border-[#142B49] bg-[#0c1e38]/70">
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Inmobiliaria / Sucursal
          </label>
          <div className="relative">
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="w-full text-xs font-medium text-slate-200 bg-[#132A4A] border border-[#1E3A5F] rounded-md py-1.5 px-2.5 pr-7 focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer"
            >
              {branches.map(b => (
                <option key={b.id} value={b.id} className="bg-[#0A192F] text-slate-200">
                  {b.name}
                </option>
              ))}
            </select>
            <Building className="w-3.5 h-3.5 text-teal-400 absolute right-2.5 top-2 pointer-events-none" />
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="w-3 h-3 text-teal-400" />
            <span className="truncate">CUCICBA Mat. 6841 · CMCPSI 5920</span>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors group relative ${
                isActive
                  ? 'bg-teal-500/15 text-teal-300 font-semibold border-l-2 border-teal-400'
                  : 'text-slate-300 hover:text-white hover:bg-[#132A4A]'
              }`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon 
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                }`} 
              />
              
              {!isSidebarCollapsed && (
                <span className="truncate flex-1 text-left">
                  {item.label}
                </span>
              )}

              {/* Badges for counts */}
              {!isSidebarCollapsed && typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 tabular-nums">
                  {item.badgeCount}
                </span>
              )}

              {isSidebarCollapsed && typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Broker Status / Quick user info */}
      <div className="p-3 border-t border-[#1E3A5F] bg-[#081528]">
        {!isSidebarCollapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-teal-600/30 border border-teal-400/40 text-teal-300 flex items-center justify-center text-xs font-bold font-mono">
              MS
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-medium text-white truncate">
                Martín Somoza
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                Broker Líder · Torres Prop.
              </span>
            </div>
          </div>
        ) : (
          <div className="w-7 h-7 mx-auto rounded-full bg-teal-600/30 border border-teal-400/40 text-teal-300 flex items-center justify-center text-xs font-bold font-mono">
            MS
          </div>
        )}
      </div>
    </aside>
  );
};
