import React, { useState } from 'react';
import { 
  GitCompare, 
  Search, 
  Plus, 
  Sparkles, 
  Building2, 
  Send, 
  User, 
  DollarSign, 
  MapPin, 
  CheckCircle,
  X
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { ClientSearchCriteria, PropertyType, OperationType } from '../../types/crm';

export const MatchingView: React.FC = () => {
  const { 
    searches, 
    properties, 
    contacts, 
    addSearch, 
    formatCurrency, 
    setSelectedPropertyId, 
    setActiveModule 
  } = useCrm();

  const [selectedSearchId, setSelectedSearchId] = useState<string>(searches[0]?.id || '');
  const [isNewSearchOpen, setIsNewSearchOpen] = useState(false);

  // New search form state
  const [newContactId, setNewContactId] = useState(contacts[0]?.id || '');
  const [newOperation, setNewOperation] = useState<OperationType>('Venta');
  const [newType, setNewType] = useState<PropertyType>('Departamento');
  const [newZones, setNewZones] = useState('Palermo, Recoleta');
  const [newMaxBudget, setNewMaxBudget] = useState(350000);
  const [newCurrency, setNewCurrency] = useState<'USD' | 'ARS'>('USD');
  const [newMinRooms, setNewMinRooms] = useState(3);
  const [newNeedsGarage, setNewNeedsGarage] = useState(true);

  const selectedSearch = searches.find(s => s.id === selectedSearchId) || searches[0];

  // Cross-matching algorithm calculation for selected search
  const matchedProperties = properties.filter(prop => {
    if (!selectedSearch) return false;
    const matchOp = prop.operation === selectedSearch.operation;
    const matchType = selectedSearch.propertyTypes.includes(prop.propertyType);
    const matchPrice = prop.currency === selectedSearch.budgetCurrency && prop.price <= selectedSearch.maxBudget * 1.05; // 5% negotiation margin
    const matchRooms = prop.rooms >= selectedSearch.minRooms;
    
    return matchOp && matchType && matchPrice;
  }).map(prop => {
    // Calculate a matching score percentage
    let score = 70;
    if (prop.price <= (selectedSearch?.maxBudget || 0)) score += 15;
    if (selectedSearch?.zones.some(z => prop.neighborhood.toLowerCase().includes(z.toLowerCase()))) score += 15;
    return {
      property: prop,
      score: Math.min(score, 98),
    };
  }).sort((a, b) => b.score - a.score);

  const handleCreateSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const contact = contacts.find(c => c.id === newContactId);
    if (!contact) return;

    addSearch({
      contactId: contact.id,
      contactName: contact.fullName,
      contactPhone: contact.phone,
      propertyTypes: [newType],
      operation: newOperation,
      zones: newZones.split(',').map(z => z.trim()),
      maxBudget: Number(newMaxBudget),
      budgetCurrency: newCurrency,
      minRooms: Number(newMinRooms),
      needsGarage: newNeedsGarage,
      active: true,
    });

    setIsNewSearchOpen(false);
  };

  const handleShareMatch = (propCode: string, propTitle: string, clientName: string, clientPhone: string) => {
    const cleanPhone = clientPhone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hola ${clientName.split(' ')[0]}! Te comparto esta excelente opción recién ingresada a nuestra cartera que coincide con tu búsqueda: ${propTitle} (${propCode}). ¿Querés que coordinemos una visita?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Cruce de Búsquedas & Matchmaking
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Motor de cruce automático: empareja requisitos de clientes compradores con el inventario disponible
          </p>
        </div>

        <button
          onClick={() => setIsNewSearchOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar búsqueda de cliente</span>
        </button>
      </div>

      {/* Main Grid: Left Search Criteria List, Right Matched Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Registered Client Searches (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Búsquedas activas ({searches.length})
            </span>
          </div>

          <div className="space-y-2">
            {searches.map(s => {
              const isSelected = s.id === selectedSearch?.id;

              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSearchId(s.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-500 shadow-2xs ring-1 ring-teal-500/30'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">
                      {s.contactName}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-100 px-1.5 py-0.2 rounded">
                      {s.operation}
                    </span>
                  </div>

                  <div className="text-xs font-mono font-bold text-slate-800">
                    Hasta {formatCurrency(s.maxBudget, s.budgetCurrency)}
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1">
                    {s.propertyTypes.join(', ')} · Min {s.minRooms} amb · {s.zones.join(', ')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Matched Properties Showcase (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedSearch ? (
            <>
              {/* Active Search Summary Card */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Coincidencias para {selectedSearch.contactName}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Criterio: {selectedSearch.propertyTypes.join('/')} en {selectedSearch.operation} · Presupuesto máx: <strong className="font-mono text-slate-800">{formatCurrency(selectedSearch.maxBudget, selectedSearch.budgetCurrency)}</strong>
                  </p>
                </div>

                <div className="px-3 py-1.5 bg-teal-50 text-teal-900 border border-teal-200 rounded-lg text-xs font-bold font-mono">
                  {matchedProperties.length} inmuebles compatibles
                </div>
              </div>

              {/* Matched Properties Cards */}
              <div className="space-y-3">
                {matchedProperties.length === 0 ? (
                  <div className="p-8 bg-white rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                    No se encontraron propiedades en cartera que coincidan con los requisitos de este cliente.
                  </div>
                ) : (
                  matchedProperties.map(({ property, score }) => (
                    <div
                      key={property.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-2xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        {/* Thumbnail */}
                        <div 
                          onClick={() => {
                            setSelectedPropertyId(property.id);
                            setActiveModule('properties');
                          }}
                          className="w-20 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 cursor-pointer"
                        >
                          <img 
                            src={property.mainImage} 
                            alt="" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Property Specs */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                              {property.code}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {score}% Coincidencia
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedPropertyId(property.id);
                              setActiveModule('properties');
                            }}
                            className="text-xs font-bold text-slate-900 hover:text-teal-700 truncate text-left block"
                          >
                            {property.title}
                          </button>

                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{property.neighborhood}</span>
                            <span>·</span>
                            <span className="font-mono font-bold text-slate-800">
                              {formatCurrency(property.price, property.currency)}
                            </span>
                            <span>·</span>
                            <span>{property.rooms} amb ({property.totalSurface} m²)</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action: 1-click WhatsApp proposal */}
                      <button
                        onClick={() => handleShareMatch(property.code, property.title, selectedSearch.contactName, selectedSearch.contactPhone)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Ofrecer por WhatsApp</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Seleccioná una búsqueda de cliente a la izquierda para ver el cruce con el inventario.
            </div>
          )}
        </div>
      </div>

      {/* New Search Modal */}
      {isNewSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div 
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Registrar Búsqueda de Inmueble</h3>
              <button onClick={() => setIsNewSearchOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSearch} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Cliente Solicitante *</label>
                <select
                  value={newContactId}
                  onChange={e => setNewContactId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
                >
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>{c.fullName} ({c.category})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Operación</label>
                  <select
                    value={newOperation}
                    onChange={e => setNewOperation(e.target.value as OperationType)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="Venta">Venta</option>
                    <option value="Alquiler">Alquiler</option>
                    <option value="Alquiler Temporal">Alquiler Temporal</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Tipo de Inmueble</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as PropertyType)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="Departamento">Departamento</option>
                    <option value="Casa">Casa</option>
                    <option value="PH">PH</option>
                    <option value="Oficina">Oficina</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Zonas o Barrios de Interés</label>
                <input
                  type="text"
                  value={newZones}
                  onChange={e => setNewZones(e.target.value)}
                  placeholder="Ej. Palermo, Belgrano, Recoleta"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 uppercase mb-1">Presupuesto Máximo</label>
                  <input
                    type="number"
                    value={newMaxBudget}
                    onChange={e => setNewMaxBudget(Number(e.target.value))}
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
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewSearchOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Guardar y buscar cruces
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
