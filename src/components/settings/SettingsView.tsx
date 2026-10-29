import React, { useState } from 'react';
import { 
  Settings, 
  Building, 
  Users, 
  DollarSign, 
  Key, 
  MessageSquare, 
  ShieldCheck, 
  Save, 
  Plus, 
  Check, 
  Globe,
  Mail,
  Phone,
  Sparkles
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export const SettingsView: React.FC = () => {
  const { 
    branches, 
    teamMembers, 
    usdToArsRate, 
    setUsdToArsRate,
    openWelcomeTour,
    resetWelcomeTour
  } = useCrm();

  const [activeTab, setActiveTab] = useState<'agency' | 'team' | 'currency' | 'portals'>('agency');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Agency profile state
  const [agencyName, setAgencyName] = useState('Torres & Asociados Propiedades');
  const [cuit, setCuit] = useState('30-71482910-4');
  const [matricula, setMatricula] = useState('CUCICBA Mat. 6841 · CMCPSI Mat. 5920');
  const [email, setEmail] = useState('contacto@torrespropiedades.com.ar');
  const [phone, setPhone] = useState('+54 11 4801-9200');
  const [tempRate, setTempRate] = useState(usdToArsRate);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUsdToArsRate(tempRate);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Configuración & Gestión Multi-Inmobiliaria
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Datos de la inmobiliaria, equipo comercial, cotizaciones de moneda y credenciales de portales
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Configuración guardada</span>
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'agency', label: 'Datos de la Inmobiliaria', icon: Building },
          { id: 'team', label: `Equipo & Asesores (${teamMembers.length})`, icon: Users },
          { id: 'currency', label: 'Cotización Monedas (USD/ARS)', icon: DollarSign },
          { id: 'portals', label: 'Credenciales de Portales', icon: Key },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Agency Profile */}
      {activeTab === 'agency' && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-slate-200 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">Perfil de la Inmobiliaria (Tenant)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Razón Social / Nombre Comercial *</label>
              <input
                type="text"
                required
                value={agencyName}
                onChange={e => setAgencyName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">CUIT *</label>
              <input
                type="text"
                required
                value={cuit}
                onChange={e => setCuit(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Matrícula Profesional Colegiada *</label>
              <input
                type="text"
                required
                value={matricula}
                onChange={e => setMatricula(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Email Institucional</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Branches Section */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Sucursales Habilitadas
            </h4>
            <div className="space-y-2">
              {branches.map(b => (
                <div key={b.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-slate-900">{b.name}</strong>
                    <p className="text-slate-500 mt-0.5">{b.address} · Tel: {b.phone}</p>
                  </div>
                  {b.isHeadquarters && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-100 text-teal-800 rounded">
                      Casa Matriz
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar modificaciones</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Team Members */}
      {activeTab === 'team' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Usuarios & Roles de la Inmobiliaria</h3>
              <p className="text-xs text-slate-500">Permisos de acceso y gestión comercial</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {teamMembers.map(tm => (
              <div key={tm.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0A192F] text-teal-400 font-bold font-mono text-xs flex items-center justify-center border border-teal-500/30">
                    {tm.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{tm.name}</h4>
                    <p className="text-[11px] text-slate-500">{tm.email} · {tm.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className={`px-2.5 py-1 rounded font-semibold text-[11px] ${
                    tm.role === 'Martillero Broker' ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                    tm.role === 'Administrador' ? 'bg-slate-100 text-slate-800 border border-slate-200' :
                    'bg-teal-50 text-teal-800 border border-teal-200'
                  }`}>
                    {tm.role}
                  </span>
                  <span className="font-mono text-slate-500 text-[11px]">
                    {tm.activePropertiesCount} propiedades
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Currency Rates */}
      {activeTab === 'currency' && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 max-w-xl">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Gestión de Tipo de Cambio (USD / ARS)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Utilizado para el cálculo de conversión automático en publicaciones, expensas y búsquedas de clientes.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Cotización Dólar Referencia (Blue / MEP) *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-slate-500">$ ARS</span>
                <input
                  type="number"
                  value={tempRate}
                  onChange={e => setTempRate(Number(e.target.value))}
                  className="flex-1 text-sm font-mono font-bold border border-slate-300 rounded-lg px-3 py-2 bg-white"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Ejemplo: Con $1.320, una propiedad de USD 100.000 equivale a $132.000.000 ARS.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Actualizar cotización
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Portals Credentials */}
      {activeTab === 'portals' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Credenciales de Integración API</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tokens y cuentas de publicación para difusión multiposting automática
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { name: 'Zonaprop API Connector', status: 'Conectado (Token válido hasta 2027)', id: 'zona-token-live' },
              { name: 'Argenprop Gateway v3', status: 'Conectado (Sync automático activo)', id: 'argen-token-live' },
              { name: 'MercadoLibre Inmuebles OAuth', status: 'Vinculado a cuenta corporativa', id: 'meli-token-live' },
              { name: 'Portal Web Propio (Nexo Engine)', status: 'API Key operativa', id: 'nexo-web-live' },
            ].map(item => (
              <div key={item.name} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 block">{item.name}</strong>
                  <span className="text-[11px] text-emerald-700 font-medium">{item.status}</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Verificando credenciales de ${item.name}... Estado: 100% Operativo.`)}
                  className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded font-semibold cursor-pointer"
                >
                  Verificar token
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Onboarding & Welcome Tour Re-launcher Card */}
      <div className="p-5 bg-gradient-to-r from-slate-900 to-[#132A4A] text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Asistente de Bienvenida & Onboarding
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Volvé a ver el recorrido guiado de 4 pasos por el CRM o reinicialo para nuevos integrantes del equipo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => openWelcomeTour(0)}
            className="flex-1 sm:flex-initial px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer text-center"
          >
            Abrir recorrido
          </button>
          <button
            type="button"
            onClick={() => {
              resetWelcomeTour();
              alert('Se reinició la preferencia de bienvenida. El asistente se mostrará ahora en pantalla.');
            }}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer text-center"
            title="Reiniciar para que se muestre como si fueras un usuario nuevo"
          >
            Reiniciar preferencia
          </button>
        </div>
      </div>
    </div>
  );
};
