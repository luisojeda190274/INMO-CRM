import React, { useState, useMemo } from 'react';
import { 
  MessageSquareText, 
  Search, 
  Send, 
  CheckCircle, 
  Clock, 
  Building2, 
  Phone, 
  Mail, 
  Filter, 
  Sparkles, 
  UserCheck,
  Calendar,
  X
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { LeadStatus } from '../../types/crm';

export const LeadsView: React.FC = () => {
  const { 
    leads, 
    updateLeadStatus, 
    setSelectedPropertyId, 
    setActiveModule,
    teamMembers
  } = useCrm();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPortal, setSelectedPortal] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeReplyLead, setActiveReplyLead] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Filtering
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchSearch = 
        !searchTerm.trim() ||
        l.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.propertyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPortal = selectedPortal === 'all' || l.portalSource === selectedPortal;
      const matchStatus = selectedStatus === 'all' || l.status === selectedStatus;

      return matchSearch && matchPortal && matchStatus;
    });
  }, [leads, searchTerm, selectedPortal, selectedStatus]);

  const handleOpenReplyModal = (lead: any) => {
    setActiveReplyLead(lead);
    setReplyMessage(
      `Hola ${lead.contactName.split(' ')[0]}! Te escribo de Nexo Inmobiliario respecto a tu consulta por la propiedad ${lead.propertyCode} (${lead.propertyTitle}). Sigue disponible. ¿Te gustaría coordinar una visita para conocerla?`
    );
  };

  const handleSendWhatsApp = () => {
    if (!activeReplyLead) return;
    const cleanPhone = activeReplyLead.contactPhone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(replyMessage);
    updateLeadStatus(activeReplyLead.id, 'Respondida');
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
    setActiveReplyLead(null);
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Consultas Entrantes de Portales
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Inbox centralizado de consultas desde Zonaprop, Argenprop, MercadoLibre y Web propia
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
            Total recibidas: <strong>{leads.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, propiedad, teléfono o texto..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedPortal}
              onChange={e => setSelectedPortal(e.target.value)}
              className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
            >
              <option value="all">Todos los portales de origen</option>
              <option value="Zonaprop">Zonaprop</option>
              <option value="Argenprop">Argenprop</option>
              <option value="MercadoLibre">MercadoLibre</option>
              <option value="Web">Web propia</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
            >
              <option value="all">Todos los estados</option>
              <option value="Nueva">Nuevas (Sin responder)</option>
              <option value="En gestión">En gestión</option>
              <option value="Visita agendada">Visita agendada</option>
              <option value="Respondida">Respondidas</option>
              <option value="Descartada">Descartadas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-3">
        {filteredLeads.map(lead => {
          return (
            <div 
              key={lead.id}
              className={`p-4 bg-white rounded-xl border transition-all ${
                lead.status === 'Nueva' 
                  ? 'border-teal-500/50 shadow-2xs bg-teal-50/15' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left: Lead details & property link */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {lead.contactName}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      lead.portalSource === 'Zonaprop' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      lead.portalSource === 'Argenprop' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      lead.portalSource === 'MercadoLibre' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      lead.portalSource === 'WhatsApp' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {lead.portalSource}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {lead.receivedAt}
                    </span>
                  </div>

                  {/* Linked property */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                      {lead.propertyCode}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedPropertyId(lead.propertyId);
                        setActiveModule('properties');
                      }}
                      className="font-semibold text-slate-800 hover:text-teal-700 truncate text-left cursor-pointer"
                    >
                      {lead.propertyTitle}
                    </button>
                  </div>

                  {/* Message body */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed italic">
                    "{lead.message}"
                  </div>

                  {/* Contact info */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {lead.contactPhone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {lead.contactEmail}
                    </span>
                    <span className="text-slate-400">
                      Asesor: <strong>{lead.assignedAgent}</strong>
                    </span>
                  </div>
                </div>

                {/* Right: Status selector & Action Buttons */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <select
                    value={lead.status}
                    onChange={e => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer ${
                      lead.status === 'Nueva' ? 'bg-teal-50 text-teal-800 border-teal-300' :
                      lead.status === 'En gestión' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                      lead.status === 'Visita agendada' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                      lead.status === 'Respondida' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                      'bg-slate-100 text-slate-600 border-slate-300'
                    }`}
                  >
                    <option value="Nueva">Nueva</option>
                    <option value="En gestión">En gestión</option>
                    <option value="Visita agendada">Visita agendada</option>
                    <option value="Respondida">Respondida</option>
                    <option value="Descartada">Descartada</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenReplyModal(lead)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Responder WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply Modal */}
      {activeReplyLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div 
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Respuesta Rápida por WhatsApp</h3>
                <span className="text-xs text-teal-400">Cliente: {activeReplyLead.contactName}</span>
              </div>
              <button onClick={() => setActiveReplyLead(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Plantilla de mensaje
                </label>
                <textarea
                  rows={5}
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>Destino:</span>
                <strong className="text-slate-800 font-mono">{activeReplyLead.contactPhone}</strong>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveReplyLead(null)}
                className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800 text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendWhatsApp}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Abrir WhatsApp Web</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
