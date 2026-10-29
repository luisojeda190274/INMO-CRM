import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Maximize2, 
  BedDouble, 
  Bath, 
  Car, 
  Share2, 
  Check, 
  Clock, 
  Printer, 
  MessageSquare, 
  UserCheck, 
  ExternalLink,
  DollarSign,
  Compass,
  FileText,
  Send,
  Calendar
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { Property } from '../../types/crm';

export const PropertyDetailModal: React.FC = () => {
  const { 
    selectedPropertyId, 
    setSelectedPropertyId, 
    properties, 
    formatCurrency,
    togglePortalSync,
    leads,
    searches,
    contacts,
    updateProperty
  } = useCrm();

  const [activeTab, setActiveTab] = useState<'general' | 'media' | 'portals' | 'leads' | 'history'>('general');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [propertyNotes, setPropertyNotes] = useState<string[]>([
    'Tasación inicial realizada por Martín Somoza el 10/09/2026.',
    'Planos de mensura aprobados y títulos perfectos verificados por escribanía.',
  ]);

  const property = properties.find(p => p.id === selectedPropertyId);

  if (!property) return null;

  // Inquiries for this property
  const propertyLeads = leads.filter(l => l.propertyId === property.id || l.propertyCode === property.code);

  // Client searches that match this property!
  const matchingSearches = searches.filter(s => {
    const typeMatch = s.propertyTypes.includes(property.propertyType);
    const opMatch = s.operation === property.operation;
    const priceMatch = s.budgetCurrency === property.currency && s.maxBudget >= property.price;
    return typeMatch && opMatch && priceMatch;
  });

  const handleCopyLink = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setPropertyNotes(prev => [newNote.trim(), ...prev]);
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 truncate">
            <span className="font-mono text-xs font-bold text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded border border-teal-500/30">
              {property.code}
            </span>
            <div className="truncate">
              <h2 className="text-sm md:text-base font-bold truncate">
                {property.title}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>{property.address}, {property.neighborhood}, {property.city}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Copiar enlace público de la propiedad"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isCopied ? 'Copiado' : 'Compartir'}</span>
            </button>
            <button
              onClick={() => setSelectedPropertyId(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Cerrar ficha"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Tabs Bar */}
        <div className="px-6 bg-slate-100/70 border-b border-slate-200 flex items-center gap-1 overflow-x-auto shrink-0">
          {[
            { id: 'general', label: 'Datos generales' },
            { id: 'media', label: `Multimedia y fotos (${property.galleryImages.length})` },
            { id: 'portals', label: 'Publicaciones y portales' },
            { id: 'leads', label: `Consultas e interesados (${propertyLeads.length + matchingSearches.length})` },
            { id: 'history', label: 'Historial y notas' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-700 bg-white shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body / Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: DATOS GENERALES */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Top Summary Banner */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Precio de lista</span>
                  <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                    {formatCurrency(property.price, property.currency)}
                  </div>
                  {property.expenses > 0 && (
                    <span className="text-[11px] text-slate-500 font-mono">
                      Expensas: $ {property.expenses.toLocaleString('es-AR')}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Operación & Tipo</span>
                  <div className="text-sm font-bold text-slate-800">
                    {property.operation} · {property.propertyType}
                  </div>
                  <span className="text-[11px] text-teal-600 font-medium">
                    Estado: {property.status}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Superficie</span>
                  <div className="text-sm font-bold text-slate-800 font-mono tabular-nums">
                    {property.totalSurface} m² Totales
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {property.coveredSurface} m² Cubiertos
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Asesor & Propietario</span>
                  <div className="text-sm font-bold text-slate-800">
                    {property.assignedAgent}
                  </div>
                  {property.ownerName ? (
                    <span className="text-[11px] text-teal-700 font-medium block truncate">
                      Prop: {property.ownerName}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-mono">
                      Actualizado: {property.updatedAt}
                    </span>
                  )}
                </div>
              </div>

              {/* Main Specifications Grid */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Características principales
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block mb-1">Ambientes</span>
                    <span className="text-base font-bold text-slate-800 font-mono">{property.rooms}</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block mb-1">Dormitorios</span>
                    <span className="text-base font-bold text-slate-800 font-mono">{property.bedrooms}</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block mb-1">Baños</span>
                    <span className="text-base font-bold text-slate-800 font-mono">{property.bathrooms}</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block mb-1">Cocheras</span>
                    <span className="text-base font-bold text-slate-800 font-mono">{property.garages}</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block mb-1">Disposición</span>
                    <span className="text-xs font-bold text-slate-800">{property.disposition || 'Frente'}</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block mb-1">Orientación</span>
                    <span className="text-xs font-bold text-slate-800">{property.orientation || 'Norte'}</span>
                  </div>
                </div>
              </div>

              {/* Amenities & Tags */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Equipamiento y comodidades
                </h3>
                <div className="flex flex-wrap gap-2">
                  {property.features.map(f => (
                    <span 
                      key={f} 
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded border border-slate-200"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Memoria descriptiva
                </h3>
                <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </div>
              </div>

              {/* Location & Map Preview */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Ubicación geográfica
                </h3>
                <div className="h-44 bg-slate-100 rounded-xl border border-slate-200 relative overflow-hidden flex items-center justify-center">
                  {/* Subtle map pattern */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0f2942_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="relative z-10 flex flex-col items-center text-center p-4 bg-white/90 backdrop-blur-xs rounded-xl border border-slate-200 shadow-sm max-w-sm">
                    <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-1.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">{property.address}</span>
                    <span className="text-[11px] text-slate-500">{property.neighborhood}, {property.city}</span>
                    <span className="text-[10px] text-teal-700 font-mono mt-1">Lat: -34.5829 · Long: -58.4042</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MULTIMEDIA Y FOTOS */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* Photo Showcase */}
              <div>
                <div className="relative h-80 sm:h-96 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-200">
                  <img 
                    src={property.galleryImages[selectedPhotoIndex] || property.mainImage} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white px-3 py-1 rounded text-xs font-mono">
                    Foto {selectedPhotoIndex + 1} de {property.galleryImages.length}
                  </div>
                </div>

                {/* Thumbnails row */}
                <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
                  {property.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer ${
                        selectedPhotoIndex === idx ? 'border-teal-600 ring-2 ring-teal-400/40' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Virtual Tours & Documents Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Tour 360° y Video
                  </h4>
                  <p className="text-xs text-slate-600 mb-3">
                    Video de recorrido grabado en 4K disponible para portales y clientes.
                  </p>
                  <a
                    href="#video"
                    onClick={e => { e.preventDefault(); alert('Abriendo reproductor de video tour...'); }}
                    className="inline-flex items-center gap-1.5 text-xs text-teal-700 font-semibold hover:underline"
                  >
                    <span>Ver Video Tour Virtual</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Ficha Imprimible / PDF
                  </h4>
                  <p className="text-xs text-slate-600 mb-3">
                    Descargar dossier comercial con membrete de la inmobiliaria para entregar al cliente.
                  </p>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Generar Ficha PDF</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PUBLICACIONES EN PORTALES */}
          {activeTab === 'portals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Sincronización con Portales</h3>
                  <p className="text-xs text-slate-500">Activa o desactiva la publicación instantánea en la red de portales inmobiliarios.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  { key: 'zonaprop' as const, name: 'Zonaprop', tag: 'Aviso Destacado', color: 'text-rose-600' },
                  { key: 'argenprop' as const, name: 'Argenprop', tag: 'Aviso Simple', color: 'text-blue-600' },
                  { key: 'mercadolibre' as const, name: 'Mercado Libre Inmuebles', tag: 'Oro Premium', color: 'text-amber-600' },
                  { key: 'properati' as const, name: 'Properati', tag: 'Estándar', color: 'text-emerald-600' },
                  { key: 'ownWebsite' as const, name: 'Web Propia de la Inmobiliaria', tag: 'Página Web Oficial', color: 'text-teal-600' },
                ]).map(portal => {
                  const isSync = property.portals[portal.key];
                  return (
                    <div 
                      key={portal.key} 
                      className={`p-4 rounded-xl border transition-all ${
                        isSync ? 'bg-white border-teal-500/40 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold ${portal.color}`}>
                          {portal.name}
                        </span>
                        <button
                          onClick={() => togglePortalSync(property.id, portal.key)}
                          className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                            isSync
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {isSync ? 'Sincronizado' : 'Inactivo'}
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Modalidad: {portal.tag}</span>
                        <span>{isSync ? 'En línea' : 'Pausado'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: CONSULTAS E INTERESADOS CON MATCHING */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              {/* Direct Inquiries */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Consultas directas recibidas ({propertyLeads.length})
                </h3>
                {propertyLeads.length === 0 ? (
                  <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                    No hay consultas directas aún para este inmueble.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                    {propertyLeads.map(l => (
                      <div key={l.id} className="p-3.5 bg-white hover:bg-slate-50 flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-900">{l.contactName}</span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                              {l.portalSource}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{l.receivedAt}</span>
                          </div>
                          <p className="text-xs text-slate-600 italic">"{l.message}"</p>
                          <div className="text-[11px] text-slate-500 mt-1">
                            Tel: {l.contactPhone} · Email: {l.contactEmail}
                          </div>
                        </div>
                        <a
                          href={`https://wa.me/${l.contactPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded flex items-center gap-1 shrink-0"
                        >
                          <Send className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Automatic Matching Clients from Database */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Clientes de la base con búsqueda coincidente ({matchingSearches.length})
                  </h3>
                  <span className="text-[11px] text-teal-700 font-medium">
                    Algoritmo de cruce automático Nexo
                  </span>
                </div>

                {matchingSearches.length === 0 ? (
                  <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                    No se encontraron clientes registrados con requisitos coincidentes con este rango de precio y tipología.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {matchingSearches.map(m => (
                      <div key={m.id} className="p-3.5 bg-teal-50/40 rounded-xl border border-teal-200/80 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-900">{m.contactName}</span>
                            <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded">
                              95% Coincidencia
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            Presupuesto hasta: <strong className="font-mono">{formatCurrency(m.maxBudget, m.budgetCurrency)}</strong>
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Zonas: {m.zones.join(', ')} · Min {m.minRooms} ambientes
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-teal-100 flex items-center justify-between text-xs">
                          <span className="text-slate-500 text-[11px]">Tel: {m.contactPhone}</span>
                          <button
                            onClick={() => alert(`Enviando ficha técnica de ${property.code} a ${m.contactName} por WhatsApp...`)}
                            className="text-teal-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>Ofrecer propiedad</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: HISTORIAL Y NOTAS */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Agregar nota interna para el equipo o tasación..."
                  className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Guardar nota
                </button>
              </form>

              <div className="space-y-2">
                {propertyNotes.map((note, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Código de referencia: <strong className="font-mono text-slate-800">{property.code}</strong></span>
          <button
            onClick={() => setSelectedPropertyId(null)}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
