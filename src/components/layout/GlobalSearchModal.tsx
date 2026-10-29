import React, { useState, useMemo } from 'react';
import { Search, X, Building2, User, MessageSquare, ArrowRight } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isGlobalSearchOpen, 
    setIsGlobalSearchOpen, 
    properties, 
    contacts, 
    leads, 
    setSelectedPropertyId,
    setActiveModule,
    formatCurrency
  } = useCrm();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) {
      return {
        properties: properties.slice(0, 3),
        contacts: contacts.slice(0, 2),
        leads: leads.slice(0, 2),
      };
    }

    const term = searchTerm.toLowerCase();

    return {
      properties: properties.filter(p => 
        p.code.toLowerCase().includes(term) ||
        p.title.toLowerCase().includes(term) ||
        p.address.toLowerCase().includes(term) ||
        p.neighborhood.toLowerCase().includes(term)
      ).slice(0, 4),
      contacts: contacts.filter(c => 
        c.fullName.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.toLowerCase().includes(term)
      ).slice(0, 3),
      leads: leads.filter(l => 
        l.contactName.toLowerCase().includes(term) ||
        l.propertyCode.toLowerCase().includes(term) ||
        l.message.toLowerCase().includes(term)
      ).slice(0, 3),
    };
  }, [searchTerm, properties, contacts, leads]);

  if (!isGlobalSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/50 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por código (ej. NEX-1042), dirección, cliente o consulta..."
            className="flex-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 bg-slate-100 rounded border border-slate-200 cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Properties Section */}
          {filteredResults.properties.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Propiedades</span>
              </div>
              <div className="space-y-1">
                {filteredResults.properties.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPropertyId(p.id);
                      setActiveModule('properties');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 shrink-0">
                        {p.code}
                      </span>
                      <div className="truncate text-left">
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-teal-700 truncate">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {p.address} · {p.neighborhood}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span className="text-xs font-semibold text-slate-900 font-mono tabular-nums">
                        {formatCurrency(p.price, p.currency)}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contacts Section */}
          {filteredResults.contacts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>Contactos</span>
              </div>
              <div className="space-y-1">
                {filteredResults.contacts.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setActiveModule('contacts');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-pointer group"
                  >
                    <div className="text-left truncate">
                      <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 truncate">
                        {c.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {c.category} · {c.phone} · {c.email}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leads Section */}
          {filteredResults.leads.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                <span>Consultas recientes</span>
              </div>
              <div className="space-y-1">
                {filteredResults.leads.map(l => (
                  <div
                    key={l.id}
                    onClick={() => {
                      setActiveModule('leads');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-pointer group"
                  >
                    <div className="text-left truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {l.contactName}
                        </span>
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 font-medium">
                          {l.portalSource}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {l.propertyCode}: "{l.message}"
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tip: Presiona <kbd className="px-1 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">Esc</kbd> para cerrar</span>
          <span>Nexo Inmobiliario CRM</span>
        </div>
      </div>
    </div>
  );
};
