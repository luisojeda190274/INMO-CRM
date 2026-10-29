import React, { useState } from 'react';
import { 
  Building2, 
  Share2, 
  BookmarkCheck, 
  MessageSquareText, 
  Layers, 
  Calendar, 
  CheckSquare, 
  TrendingUp, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export const DashboardView: React.FC = () => {
  const { 
    properties, 
    leads, 
    opportunities, 
    visits, 
    tasks, 
    toggleTaskCompleted,
    setActiveModule,
    setSelectedPropertyId,
    setIsNewPropertyModalOpen,
    formatCurrency,
    addTask,
    openWelcomeTour
  } = useCrm();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  // Computed metrics
  const totalProperties = properties.length;
  const publishedProperties = properties.filter(p => Object.values(p.portals).some(Boolean)).length;
  const reservedProperties = properties.filter(p => p.status === 'Reservada').length;
  const totalLeads = leads.length;
  const activeOpportunities = opportunities.filter(o => o.stage !== 'cierre_ganado' && o.stage !== 'cierre_perdido');
  const scheduledVisits = visits.filter(v => v.status === 'Programada');
  const pendingTasks = tasks.filter(t => !t.completed);

  // Distribution by Operation
  const ventasCount = properties.filter(p => p.operation === 'Venta').length;
  const alquileresCount = properties.filter(p => p.operation === 'Alquiler').length;
  const temporariosCount = properties.filter(p => p.operation === 'Alquiler Temporal').length;

  // Monthly inquiries data (realistic curve)
  const monthlyInquiries = [
    { month: 'May', count: 18 },
    { month: 'Jun', count: 24 },
    { month: 'Jul', count: 31 },
    { month: 'Ago', count: 29 },
    { month: 'Sep', count: 42 },
    { month: 'Oct', count: 56 },
  ];
  const maxInquiries = Math.max(...monthlyInquiries.map(m => m.count));

  // Handle adding quick task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle.trim(),
      dueDate: new Date().toISOString().split('T')[0],
      assignedTo: 'Martín Somoza',
      priority: 'Media',
    });
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome & Quick actions bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Panel de Control Comercial
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Actividad de la sucursal y estado de cartera en tiempo real
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openWelcomeTour(0)}
            className="flex items-center gap-1.5 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            title="Abrir recorrido guiado de bienvenida"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">Ayuda para comenzar</span>
          </button>
          <button
            onClick={() => setIsNewPropertyModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publicar inmueble</span>
          </button>
          <button
            onClick={() => setActiveModule('opportunities')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Ver Pipeline</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (7 Key Indicators) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Total Properties */}
        <div 
          onClick={() => setActiveModule('properties')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-teal-500/50 hover:shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-teal-600 mb-2">
            <Building2 className="w-4 h-4" />
            <span className="text-[10px] text-slate-400 font-medium">Inventario</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalProperties}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1 truncate">
            Total inmuebles
          </div>
        </div>

        {/* Published */}
        <div 
          onClick={() => setActiveModule('publications')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-teal-500/50 hover:shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-emerald-600 mb-2">
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] text-emerald-600 font-medium">Portales</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {publishedProperties}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1 truncate">
            Publicadas
          </div>
        </div>

        {/* Reserved */}
        <div 
          onClick={() => setActiveModule('properties')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-teal-500/50 hover:shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-amber-600 mb-2">
            <BookmarkCheck className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] text-amber-600 font-medium">Boleto</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {reservedProperties}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1 truncate">
            Reservadas
          </div>
        </div>

        {/* Inquiries */}
        <div 
          onClick={() => setActiveModule('leads')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-teal-500/50 hover:shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-cyan-600 mb-2">
            <MessageSquareText className="w-4 h-4 text-cyan-600" />
            <span className="text-[10px] text-cyan-600 font-medium">Leads</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalLeads}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1 truncate">
            Consultas recibidas
          </div>
        </div>

        {/* Active Opportunities */}
        <div 
          onClick={() => setActiveModule('opportunities')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-teal-500/50 hover:shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-indigo-600 mb-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span className="text-[10px] text-indigo-600 font-medium">Pipeline</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {activeOpportunities.length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1 truncate">
            Oportunidades
          </div>
        </div>

        {/* Scheduled Visits */}
        <div 
          onClick={() => setActiveModule('calendar')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-teal-500/50 hover:shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-purple-600 mb-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span className="text-[10px] text-purple-600 font-medium">Agenda</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {scheduledVisits.length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1 truncate">
            Visitas agendadas
          </div>
        </div>

        {/* Pending Tasks */}
        <div 
          onClick={() => setActiveModule('calendar')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-teal-500/50 hover:shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-rose-600 mb-2">
            <CheckSquare className="w-4 h-4 text-rose-600" />
            <span className="text-[10px] text-rose-600 font-medium">To-Do</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {pendingTasks.length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1 truncate">
            Tareas pendientes
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid (3 Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Monthly Inquiries Evolution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900">Evolución de Consultas</h3>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 font-mono">
                <TrendingUp className="w-3.5 h-3.5" /> +33% mes
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">Leads recibidos en los últimos 6 meses</p>

            {/* Custom SVG Bar Chart */}
            <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100">
              {monthlyInquiries.map((item, idx) => {
                const heightPercent = Math.round((item.count / maxInquiries) * 100);
                const isCurrent = idx === monthlyInquiries.length - 1;

                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-mono font-medium text-slate-500 group-hover:text-teal-600 tabular-nums">
                      {item.count}
                    </span>
                    <div className="w-full bg-slate-100 rounded-t h-32 flex items-end">
                      <div 
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t transition-all duration-300 ${
                          isCurrent 
                            ? 'bg-teal-600 group-hover:bg-teal-700' 
                            : 'bg-slate-300 group-hover:bg-slate-400'
                        }`}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-slate-600">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Promedio mensual: <strong className="text-slate-800 font-mono">33.3</strong></span>
            <button 
              onClick={() => setActiveModule('reports')}
              className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              Ver reporte detallado <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Chart 2: Property Distribution by Operation */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900">Distribución por Operación</h3>
              <span className="text-xs text-slate-400 font-mono">{totalProperties} propiedades</span>
            </div>
            <p className="text-xs text-slate-500 mb-6">Composición del inventario activo</p>

            {/* Segmented Bar & Stats */}
            <div className="space-y-4">
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div 
                  style={{ width: `${(ventasCount / totalProperties) * 100}%` }} 
                  className="bg-[#0A192F] h-full" 
                  title={`Venta: ${ventasCount}`}
                />
                <div 
                  style={{ width: `${(alquileresCount / totalProperties) * 100}%` }} 
                  className="bg-teal-500 h-full" 
                  title={`Alquiler: ${alquileresCount}`}
                />
                <div 
                  style={{ width: `${(temporariosCount / totalProperties) * 100}%` }} 
                  className="bg-amber-400 h-full" 
                  title={`Temporario: ${temporariosCount}`}
                />
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0A192F]" />
                    <span className="text-slate-700 font-medium">Venta tradicional</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="font-bold text-slate-900">{ventasCount}</span>
                    <span className="text-slate-400 w-10 text-right">
                      {Math.round((ventasCount / totalProperties) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                    <span className="text-slate-700 font-medium">Alquiler tradicional</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="font-bold text-slate-900">{alquileresCount}</span>
                    <span className="text-slate-400 w-10 text-right">
                      {Math.round((alquileresCount / totalProperties) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-slate-700 font-medium">Alquiler temporario / amoblado</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="font-bold text-slate-900">{temporariosCount}</span>
                    <span className="text-slate-400 w-10 text-right">
                      {Math.round((temporariosCount / totalProperties) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Objetivo captación: <strong className="text-slate-800">70% Venta</strong></span>
            <button 
              onClick={() => setActiveModule('properties')}
              className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              Explorar inventario <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Chart 3: Opportunities Pipeline Funnel */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900">Embudo de Oportunidades</h3>
              <span className="text-xs font-semibold text-teal-600 font-mono">
                {activeOpportunities.length} en curso
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Etapas de negociación comercial</p>

            {/* Funnel Rows */}
            <div className="space-y-2">
              {[
                { stage: 'Contacto & Calificación', count: 4, width: '100%', color: 'bg-slate-300' },
                { stage: 'Visitas Coordinadas', count: 3, width: '75%', color: 'bg-teal-400' },
                { stage: 'Negociación y Ofertas', count: 2, width: '50%', color: 'bg-teal-600' },
                { stage: 'Reserva & Boleto', count: 1, width: '25%', color: 'bg-amber-500' },
              ].map(f => (
                <div key={f.stage} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">{f.stage}</span>
                    <span className="font-mono font-bold text-slate-900">{f.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div style={{ width: f.width }} className={`h-full ${f.color} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Volumen estimado: <strong className="text-slate-800 font-mono">USD 2.2M</strong></span>
            <button 
              onClick={() => setActiveModule('opportunities')}
              className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              Abrir Kanban <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Operational Triple-Section: Consultas Recientes, Próximas Visitas, Tareas Pendientes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Inquiries List */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquareText className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Últimas Consultas
              </h3>
            </div>
            <button 
              onClick={() => setActiveModule('leads')}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium cursor-pointer"
            >
              Ver todas ({leads.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {leads.slice(0, 4).map((l) => (
              <div 
                key={l.id}
                onClick={() => {
                  setSelectedPropertyId(l.propertyId);
                  setActiveModule('leads');
                }}
                className="p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-900 group-hover:text-teal-700">
                    {l.contactName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{l.receivedAt}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-1.5">
                  <span className="text-[11px] font-mono text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                    {l.propertyCode}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">vía {l.portalSource}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 italic">
                  "{l.message}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Scheduled Visits */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Próximas Visitas
              </h3>
            </div>
            <button 
              onClick={() => setActiveModule('calendar')}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium cursor-pointer"
            >
              Agenda completa ({visits.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {visits.slice(0, 3).map((v) => (
              <div 
                key={v.id} 
                onClick={() => setActiveModule('calendar')}
                className="p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 font-mono">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    <span>{v.date} · {v.time} hs</span>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    {v.status}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-900 group-hover:text-purple-700 truncate">
                  {v.contactName}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{v.propertyTitle} ({v.propertyCode})</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Asignado: {v.agentName}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Pending Tasks */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Tareas Pendientes
              </h3>
            </div>
            <button
              onClick={() => setShowAddTask(prev => !prev)}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Añadir</span>
            </button>
          </div>

          {showAddTask && (
            <form onSubmit={handleCreateTask} className="p-3 bg-slate-50 border-b border-slate-200 flex gap-2">
              <input 
                type="text"
                autoFocus
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                placeholder="Nueva tarea del broker..."
                className="flex-1 text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <button 
                type="submit"
                className="px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded hover:bg-teal-700 cursor-pointer"
              >
                Guardar
              </button>
            </form>
          )}

          <div className="divide-y divide-slate-100 flex-1">
            {tasks.map((t) => (
              <div 
                key={t.id} 
                className="p-3 flex items-start gap-3 hover:bg-slate-50/80 transition-colors"
              >
                <button
                  onClick={() => toggleTaskCompleted(t.id)}
                  className="mt-0.5 text-slate-400 hover:text-teal-600 transition-colors cursor-pointer"
                  title={t.completed ? 'Marcar pendiente' : 'Marcar completada'}
                >
                  <CheckCircle2 
                    className={`w-4 h-4 ${
                      t.completed ? 'text-teal-600 fill-teal-100' : 'text-slate-300'
                    }`} 
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium leading-snug ${
                    t.completed ? 'line-through text-slate-400' : 'text-slate-800'
                  }`}>
                    {t.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span>Vence: {t.dueDate}</span>
                    <span>·</span>
                    <span className={`font-semibold ${
                      t.priority === 'Alta' ? 'text-rose-600' : 'text-amber-600'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
