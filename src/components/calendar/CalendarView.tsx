import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  MapPin, 
  User, 
  Phone, 
  CheckCircle2, 
  X, 
  Star, 
  CalendarDays, 
  ListFilter,
  MessageSquare
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { Visit } from '../../types/crm';

export const CalendarView: React.FC = () => {
  const { 
    visits, 
    addVisit, 
    updateVisitStatus, 
    properties, 
    contacts, 
    teamMembers,
    setSelectedPropertyId,
    setActiveModule,
    tasks,
    toggleTaskCompleted
  } = useCrm();

  const [activeTab, setActiveTab] = useState<'visits' | 'tasks'>('visits');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [feedbackVisit, setFeedbackVisit] = useState<Visit | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);

  // New visit state
  const [newPropId, setNewPropId] = useState(properties[0]?.id || '');
  const [newContactId, setNewContactId] = useState(contacts[0]?.id || '');
  const [newAgent, setNewAgent] = useState('Martín Somoza');
  const [newDate, setNewDate] = useState('2026-10-26');
  const [newTime, setNewTime] = useState('16:00');
  const [newNotes, setNewNotes] = useState('');

  const handleCreateVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find(p => p.id === newPropId);
    const cont = contacts.find(c => c.id === newContactId);

    addVisit({
      propertyId: newPropId,
      propertyCode: prop ? prop.code : 'NEX-XXXX',
      propertyTitle: prop ? prop.title : 'Propiedad',
      propertyAddress: prop ? prop.address : 'Dirección',
      contactId: newContactId,
      contactName: cont ? cont.fullName : 'Cliente',
      contactPhone: cont ? cont.phone : '',
      agentName: newAgent,
      date: newDate,
      time: newTime,
      status: 'Programada',
      notes: newNotes.trim() || 'Coordinada desde la agenda de Nexo.',
    });

    setIsScheduleOpen(false);
    setNewNotes('');
  };

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackVisit) return;
    updateVisitStatus(feedbackVisit.id, 'Realizada', feedbackText);
    setFeedbackVisit(null);
    setFeedbackText('');
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Agenda Comercial & Visitas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinación de visitas a inmuebles, feedback posterior y tareas del equipo
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Tab Toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('visits')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'visits' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Visitas ({visits.length})
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'tasks' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Tareas pendientes ({tasks.filter(t => !t.completed).length})
            </button>
          </div>

          <button
            onClick={() => setIsScheduleOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agendar visita</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'visits' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visits.map(v => (
              <div 
                key={v.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-900 font-mono">
                      <Clock className="w-3.5 h-3.5 text-purple-600" />
                      <span>{v.date} · {v.time} hs</span>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      v.status === 'Programada' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                      v.status === 'Realizada' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {v.status}
                    </span>
                  </div>

                  {/* Property & Client Info */}
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="font-mono text-[11px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200 mr-1.5">
                        {v.propertyCode}
                      </span>
                      <strong className="text-slate-900">{v.propertyTitle}</strong>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{v.propertyAddress}</span>
                    </div>

                    <div className="pt-2 text-[11px] text-slate-600 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="font-semibold text-slate-800">{v.contactName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{v.contactPhone}</span>
                      </div>
                      <div className="text-slate-400">
                        Asesor: {v.agentName}
                      </div>
                    </div>

                    {v.feedback && (
                      <div className="mt-2.5 p-2 bg-emerald-50/60 rounded border border-emerald-200 text-[11px] text-emerald-900">
                        <strong>Feedback:</strong> {v.feedback}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {v.status === 'Programada' ? (
                    <>
                      <button
                        onClick={() => {
                          setFeedbackVisit(v);
                          setFeedbackText('');
                        }}
                        className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold rounded text-xs transition-colors cursor-pointer"
                      >
                        Cargar feedback
                      </button>
                      <button
                        onClick={() => updateVisitStatus(v.id, 'Cancelada')}
                        className="text-slate-400 hover:text-rose-600 text-[11px]"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Visita completada
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {tasks.map(t => (
            <div key={t.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTaskCompleted(t.id)}
                  className="cursor-pointer text-slate-400 hover:text-teal-600"
                >
                  <CheckCircle2 className={`w-5 h-5 ${t.completed ? 'text-teal-600 fill-teal-100' : 'text-slate-300'}`} />
                </button>
                <div>
                  <p className={`text-xs font-semibold ${t.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {t.title}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>Vencimiento: {t.dueDate}</span>
                    <span>·</span>
                    <span>Asignado: {t.assignedTo}</span>
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                t.priority === 'Alta' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {t.priority}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Visit Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div 
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Agendar Visita Comercial</h3>
              <button onClick={() => setIsScheduleOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVisit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Inmueble a visitar</label>
                <select
                  value={newPropId}
                  onChange={e => setNewPropId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white font-mono"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.code} - {p.title.slice(0, 30)}...</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Cliente / Visitante</label>
                <select
                  value={newContactId}
                  onChange={e => setNewContactId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
                >
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>{c.fullName} ({c.phone})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Hora</label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Asesor responsable de mostrar</label>
                <select
                  value={newAgent}
                  onChange={e => setNewAgent(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
                >
                  {teamMembers.map(tm => (
                    <option key={tm.id} value={tm.name}>{tm.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Instrucciones o notas</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Ej. Avisar al encargado de seguridad para ingreso al edificio..."
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Confirmar agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div 
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Cargar Devolución de Visita</h3>
              <button onClick={() => setFeedbackVisit(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFeedback} className="p-6 space-y-4 text-xs">
              <p className="text-slate-600">
                Registrá la impresión de <strong>{feedbackVisit.contactName}</strong> tras visitar la propiedad <strong>{feedbackVisit.propertyCode}</strong>.
              </p>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Impresión del cliente</label>
                <textarea
                  rows={3}
                  required
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="Ej. Le encantó la distribución y la luz. Consultará con su arquitecto para formalizar una oferta el lunes..."
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setFeedbackVisit(null)}
                  className="px-4 py-2 font-semibold text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Guardar feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
