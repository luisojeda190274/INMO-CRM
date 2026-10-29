import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MessageCircle, 
  Tag, 
  UserCheck, 
  Building2, 
  X, 
  ChevronRight,
  Send,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { Contact, ContactCategory } from '../../types/crm';

export const ContactsView: React.FC = () => {
  const { 
    contacts, 
    addContact, 
    updateContact, 
    deleteContact, 
    teamMembers,
    formatCurrency,
    setSelectedPropertyId,
    setActiveModule,
    searches,
    visits
  } = useCrm();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isNewContactOpen, setIsNewContactOpen] = useState(false);

  // New contact form state
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+54 9 11 ');
  const [newCategory, setNewCategory] = useState<ContactCategory>('Comprador');
  const [newOrigin, setNewOrigin] = useState('Zonaprop');
  const [newBudget, setNewBudget] = useState(300000);
  const [newCurrency, setNewCurrency] = useState<'USD' | 'ARS'>('USD');
  const [newAgent, setNewAgent] = useState('Martín Somoza');
  const [newNotes, setNewNotes] = useState('');

  // Filter contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      const matchSearch = 
        !searchTerm.trim() ||
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCat = selectedCategory === 'all' || c.category === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [contacts, searchTerm, selectedCategory]);

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newPhone.trim()) return;

    addContact({
      fullName: newFullName.trim(),
      email: newEmail.trim() || 'cliente@ejemplo.com',
      phone: newPhone.trim(),
      category: newCategory,
      origin: newOrigin,
      budgetCurrency: newCurrency,
      budgetMax: Number(newBudget),
      assignedAgent: newAgent,
      tags: [newCategory, newOrigin],
      notes: newNotes.trim() || 'Contacto ingresado recientemente en CRM.',
    });

    setIsNewContactOpen(false);
    setNewFullName('');
    setNewEmail('');
    setNewPhone('+54 9 11 ');
    setNewNotes('');
  };

  // Contacts stats
  const countCompradores = contacts.filter(c => c.category === 'Comprador').length;
  const countPropietarios = contacts.filter(c => c.category === 'Propietario').length;
  const countInquilinos = contacts.filter(c => c.category === 'Inquilino').length;
  const countInversores = contacts.filter(c => c.category === 'Inversor').length;

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Directorio de Contactos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compradores, propietarios, inquilinos e inversores con historial unificado
          </p>
        </div>

        <button
          onClick={() => setIsNewContactOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo contacto</span>
        </button>
      </div>

      {/* Categories Bar & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, teléfono o etiquetas..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: `Todos (${contacts.length})` },
              { id: 'Comprador', label: `Compradores (${countCompradores})` },
              { id: 'Propietario', label: `Propietarios (${countPropietarios})` },
              { id: 'Inquilino', label: `Inquilinos (${countInquilinos})` },
              { id: 'Inversor', label: `Inversores (${countInversores})` },
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
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map(c => {
          const cleanPhone = c.phone.replace(/[^0-9]/g, '');

          return (
            <div
              key={c.id}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-2xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                      {c.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <h3 
                        onClick={() => setSelectedContact(c)}
                        className="text-xs font-bold text-slate-900 hover:text-teal-700 cursor-pointer"
                      >
                        {c.fullName}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        Origen: {c.origin}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    c.category === 'Comprador' ? 'bg-teal-50 text-teal-800 border border-teal-200' :
                    c.category === 'Propietario' ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                    c.category === 'Inversor' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                    'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {c.category}
                  </span>
                </div>

                {/* Contact info lines */}
                <div className="space-y-1.5 mt-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  {c.budgetMax ? (
                    <div className="flex items-center gap-2 text-slate-800 font-mono">
                      <DollarSign className="w-3.5 h-3.5 text-teal-600" />
                      <span>Presupuesto: {formatCurrency(c.budgetMax, c.budgetCurrency || 'USD')}</span>
                    </div>
                  ) : null}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {c.tags.map(t => (
                    <span key={t} className="text-[10px] bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Bottom: Quick Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Asesor: {c.assignedAgent.split(' ')[0]}
                </span>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://wa.me/${cleanPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                    title="Chatear por WhatsApp"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setSelectedContact(c)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-xs cursor-pointer"
                  >
                    Ver perfil
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Profile Drawer / Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div 
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-500 text-slate-900 font-bold flex items-center justify-center text-xs">
                  {selectedContact.fullName[0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold">{selectedContact.fullName}</h3>
                  <span className="text-xs text-teal-400">{selectedContact.category} · {selectedContact.origin}</span>
                </div>
              </div>
              <button onClick={() => setSelectedContact(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Contact Data */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Teléfono</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedContact.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Correo Electrónico</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedContact.email}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Asesor Asignado</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedContact.assignedAgent}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Último Contacto</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedContact.lastContact}</p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1.5">Notas y Observaciones</h4>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedContact.notes}
                </div>
              </div>

              {/* Active Searches linked */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">Búsquedas Activas en el Sistema</h4>
                {searches.filter(s => s.contactId === selectedContact.id).length > 0 ? (
                  <div className="space-y-2">
                    {searches.filter(s => s.contactId === selectedContact.id).map(s => (
                      <div key={s.id} className="p-3 bg-teal-50/50 rounded-lg border border-teal-200">
                        <span className="font-bold text-teal-900">{s.operation} · {s.propertyTypes.join(', ')}</span>
                        <p className="text-slate-600 mt-0.5">Zonas: {s.zones.join(', ')} · Hasta {formatCurrency(s.maxBudget, s.budgetCurrency)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">No tiene búsquedas automáticas registradas.</p>
                )}
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <a
                href={`https://wa.me/${selectedContact.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Escribir por WhatsApp</span>
              </a>
              <button
                onClick={() => setSelectedContact(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Contact Modal */}
      {isNewContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div 
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Registrar Nuevo Contacto</h3>
              <button onClick={() => setIsNewContactOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Nombre y Apellido *</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={e => setNewFullName(e.target.value)}
                  placeholder="Ej. Santiago Del Carril"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="email@cliente.com"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as ContactCategory)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="Comprador">Comprador</option>
                    <option value="Propietario">Propietario</option>
                    <option value="Inquilino">Inquilino</option>
                    <option value="Inversor">Inversor</option>
                    <option value="Colega">Colega / Inmobiliaria</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Origen del lead</label>
                  <select
                    value={newOrigin}
                    onChange={e => setNewOrigin(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="Zonaprop">Zonaprop</option>
                    <option value="Argenprop">Argenprop</option>
                    <option value="MercadoLibre">MercadoLibre</option>
                    <option value="Web">Web propia</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Referido">Referido</option>
                    <option value="Cartel">Cartel en vía pública</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Notas iniciales</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Detalles de lo que busca o de su propiedad..."
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewContactOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Guardar contacto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
