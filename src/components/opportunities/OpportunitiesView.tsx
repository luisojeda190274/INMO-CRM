import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  DollarSign, 
  Building2, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { Opportunity, OpportunityStage } from '../../types/crm';

const STAGES: { id: OpportunityStage; label: string; color: string }[] = [
  { id: 'primer_contacto', label: '1. Primer Contacto', color: 'border-slate-300' },
  { id: 'calificacion', label: '2. Calificación', color: 'border-blue-400' },
  { id: 'visita_coordinada', label: '3. Visita Coordinada', color: 'border-purple-400' },
  { id: 'negociacion_oferta', label: '4. Negociación / Oferta', color: 'border-amber-400' },
  { id: 'reserva_boleto', label: '5. Reserva / Boleto', color: 'border-teal-500' },
  { id: 'cierre_ganado', label: '6. Cierre Ganado', color: 'border-emerald-500' },
];

export const OpportunitiesView: React.FC = () => {
  const { 
    opportunities, 
    updateOpportunityStage, 
    addOpportunity, 
    formatCurrency, 
    setSelectedPropertyId, 
    setActiveModule,
    properties,
    contacts,
    teamMembers
  } = useCrm();

  const [isNewOppOpen, setIsNewOppOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContactId, setNewContactId] = useState(contacts[0]?.id || '');
  const [newPropertyId, setNewPropertyId] = useState(properties[0]?.id || '');
  const [newValue, setNewValue] = useState(300000);
  const [newCurrency, setNewCurrency] = useState<'USD' | 'ARS'>('USD');
  const [newProbability, setNewProbability] = useState(50);
  const [newStage, setNewStage] = useState<OpportunityStage>('primer_contacto');
  const [newCloseDate, setNewCloseDate] = useState('2026-11-30');
  const [newAgent, setNewAgent] = useState('Martín Somoza');
  const [newNotes, setNewNotes] = useState('');

  // Total active pipeline value in USD
  const totalPipelineUsd = opportunities
    .filter(o => o.currency === 'USD' && o.stage !== 'cierre_perdido')
    .reduce((sum, o) => sum + o.expectedValue, 0);

  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const contact = contacts.find(c => c.id === newContactId);
    const property = properties.find(p => p.id === newPropertyId);

    addOpportunity({
      title: newTitle.trim(),
      contactId: newContactId,
      contactName: contact ? contact.fullName : 'Cliente',
      propertyId: newPropertyId,
      propertyCode: property ? property.code : 'NEX-XXXX',
      propertyTitle: property ? property.title : 'Propiedad',
      stage: newStage,
      expectedValue: Number(newValue),
      currency: newCurrency,
      probability: Number(newProbability),
      assignedAgent: newAgent,
      expectedCloseDate: newCloseDate,
      notes: newNotes.trim() || 'Oportunidad ingresada al pipeline.',
    });

    setIsNewOppOpen(false);
    setNewTitle('');
    setNewNotes('');
  };

  const moveStage = (oppId: string, currentStage: OpportunityStage, direction: 'next' | 'prev') => {
    const currentIndex = STAGES.findIndex(s => s.id === currentStage);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < STAGES.length) {
      updateOpportunityStage(oppId, STAGES[newIndex].id);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Pipeline Comercial & Oportunidades
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tablero Kanban de operaciones en curso, etapas de reserva y cierre
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono">
            <span className="text-slate-400">Total en Pipeline: </span>
            <strong className="text-slate-900 tabular-nums">USD {totalPipelineUsd.toLocaleString('es-AR')}</strong>
          </div>

          <button
            onClick={() => setIsNewOppOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva oportunidad</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
        {STAGES.map((col, colIdx) => {
          const colDeals = opportunities.filter(o => o.stage === col.id);
          const colTotalUsd = colDeals
            .filter(o => o.currency === 'USD')
            .reduce((sum, o) => sum + o.expectedValue, 0);

          return (
            <div
              key={col.id}
              className="bg-slate-100/70 rounded-xl p-3 border border-slate-200 flex flex-col min-w-[220px]"
            >
              {/* Column Header */}
              <div className={`pb-2.5 mb-3 border-b-2 ${col.color}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {col.label}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-white rounded text-slate-700 border border-slate-200">
                    {colDeals.length}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1">
                  USD {colTotalUsd.toLocaleString('es-AR')}
                </div>
              </div>

              {/* Cards inside column */}
              <div className="space-y-3 flex-1">
                {colDeals.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-[11px] border border-dashed border-slate-200 rounded-lg">
                    Sin operaciones
                  </div>
                ) : (
                  colDeals.map(deal => (
                    <div
                      key={deal.id}
                      className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between group"
                    >
                      <div>
                        {/* Title & Value */}
                        <div className="flex items-start justify-between gap-1 mb-1.5">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                            {deal.title}
                          </h4>
                        </div>

                        <div className="text-xs font-mono font-bold text-teal-700 mb-2 tabular-nums">
                          {formatCurrency(deal.expectedValue, deal.currency)}
                        </div>

                        {/* Client & Property links */}
                        <div className="space-y-1 text-[11px] text-slate-600">
                          <div className="flex items-center gap-1.5 truncate">
                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{deal.contactName}</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <Building2 className="w-3 h-3 text-teal-600 shrink-0" />
                            <span className="font-mono text-teal-700">{deal.propertyCode}</span>
                          </div>
                        </div>

                        {/* Probability Bar */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100">
                          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                            <span>Probabilidad</span>
                            <span className="font-mono font-bold text-slate-700">{deal.probability}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              style={{ width: `${deal.probability}%` }}
                              className="h-full bg-teal-500 rounded-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card Move Arrows */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <button
                          disabled={colIdx === 0}
                          onClick={() => moveStage(deal.id, deal.stage, 'prev')}
                          className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                          title="Mover a etapa anterior"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {deal.expectedCloseDate.slice(5)}
                        </span>
                        <button
                          disabled={colIdx === STAGES.length - 1}
                          onClick={() => moveStage(deal.id, deal.stage, 'next')}
                          className="p-1 rounded text-slate-400 hover:text-teal-700 hover:bg-teal-50 disabled:opacity-20 cursor-pointer"
                          title="Avanzar etapa"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Opportunity Modal */}
      {isNewOppOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div 
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Crear Nueva Oportunidad de Venta/Alquiler</h3>
              <button onClick={() => setIsNewOppOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOpportunity} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Título de la negociación *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ej. Oferta en firme por Departamento Libertador 2450"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Cliente / Contacto</label>
                  <select
                    value={newContactId}
                    onChange={e => setNewContactId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  >
                    {contacts.map(c => (
                      <option key={c.id} value={c.id}>{c.fullName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Inmueble Vinculado</label>
                  <select
                    value={newPropertyId}
                    onChange={e => setNewPropertyId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white font-mono"
                  >
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.code} - {p.title.slice(0, 24)}...</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Monto Estimado</label>
                  <input
                    type="number"
                    value={newValue}
                    onChange={e => setNewValue(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Moneda</label>
                  <select
                    value={newCurrency}
                    onChange={e => setNewCurrency(e.target.value as 'USD' | 'ARS')}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white font-mono"
                  >
                    <option value="USD">USD</option>
                    <option value="ARS">ARS</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Probabilidad (%)</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={newProbability}
                    onChange={e => setNewProbability(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Etapa inicial</label>
                  <select
                    value={newStage}
                    onChange={e => setNewStage(e.target.value as OpportunityStage)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  >
                    {STAGES.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Fecha estimada cierre</label>
                  <input
                    type="date"
                    value={newCloseDate}
                    onChange={e => setNewCloseDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Notas de la negociación</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Detalles de la oferta, señas o condiciones comerciales..."
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewOppOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Ingresar oportunidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
