import React, { useState } from 'react';
import { 
  Share2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Zap, 
  Layers, 
  Building2,
  Sliders,
  Check
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export const PublicationsView: React.FC = () => {
  const { 
    portals, 
    triggerPortalSync, 
    properties, 
    togglePortalSync, 
    setSelectedPropertyId,
    setActiveModule,
    formatCurrency 
  } = useCrm();

  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleManualSync = (portalId: string, portalName: string) => {
    setSyncingId(portalId);
    setTimeout(() => {
      triggerPortalSync(portalId);
      setSyncingId(null);
      setSuccessToast(`Portal ${portalName} sincronizado correctamente con la base de datos.`);
      setTimeout(() => setSuccessToast(null), 3000);
    }, 1200);
  };

  const handleSyncAll = () => {
    setSyncingId('all');
    setTimeout(() => {
      portals.forEach(p => triggerPortalSync(p.id));
      setSyncingId(null);
      setSuccessToast('Todos los portales inmobiliarios sincronizados con éxito.');
      setTimeout(() => setSuccessToast(null), 3000);
    }, 1800);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Centro de Multiposting & Portales
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sincronización bidireccional automática con Zonaprop, Argenprop, MercadoLibre y la Web oficial
          </p>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={syncingId !== null}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncingId === 'all' ? 'animate-spin text-teal-400' : ''}`} />
          <span>Sincronizar todos los portales</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {successToast && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-700 font-bold hover:underline">
            Entendido
          </button>
        </div>
      )}

      {/* Portals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {portals.map(p => {
          const isSyncing = syncingId === p.id || syncingId === 'all';
          const activeInPortal = properties.filter(prop => prop.portals[p.id as keyof typeof prop.portals]).length;

          return (
            <div
              key={p.id}
              className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-900" style={{ color: p.logoColor }}>
                    {p.name}
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                    Conectado
                  </span>
                </div>

                {/* Published & Quota */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500">Publicadas:</span>
                    <strong className="text-base font-bold font-mono text-slate-900">
                      {activeInPortal} / {p.quotaLimit === 999 ? 'Ilimitado' : p.quotaLimit}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Destacados:</span>
                    <span className="font-mono font-semibold text-amber-600">
                      {p.featuredRemaining} disp.
                    </span>
                  </div>

                  <div className="pt-2 text-[10px] text-slate-400">
                    {p.lastSync}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleManualSync(p.id, p.name)}
                  disabled={isSyncing}
                  className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-teal-600' : ''}`} />
                  <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar ahora'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Property-by-Portal Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Matriz de Publicación por Inmueble
            </h3>
            <p className="text-xs text-slate-500">
              Activá o desactivá la difusión de cada aviso en los portales correspondientes
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {properties.length} propiedades en cartera
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
                <th className="p-3.5">Código</th>
                <th className="p-3.5">Inmueble</th>
                <th className="p-3.5 text-center">Zonaprop</th>
                <th className="p-3.5 text-center">Argenprop</th>
                <th className="p-3.5 text-center">MercadoLibre</th>
                <th className="p-3.5 text-center">Properati</th>
                <th className="p-3.5 text-center">Web Oficial</th>
                <th className="p-3.5 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {properties.map(prop => (
                <tr key={prop.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-teal-700 whitespace-nowrap">
                    {prop.code}
                  </td>
                  <td className="p-3.5">
                    <button
                      onClick={() => {
                        setSelectedPropertyId(prop.id);
                        setActiveModule('properties');
                      }}
                      className="font-bold text-slate-900 hover:text-teal-700 text-left line-clamp-1 cursor-pointer"
                    >
                      {prop.title}
                    </button>
                    <span className="text-[11px] text-slate-400">{prop.address} · {formatCurrency(prop.price, prop.currency)}</span>
                  </td>

                  {/* Portal Toggles */}
                  {(['zonaprop', 'argenprop', 'mercadolibre', 'properati', 'ownWebsite'] as const).map(pKey => {
                    const isPublished = prop.portals[pKey];
                    return (
                      <td key={pKey} className="p-3.5 text-center">
                        <button
                          onClick={() => togglePortalSync(prop.id, pKey)}
                          className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition-colors cursor-pointer ${
                            isPublished
                              ? 'bg-teal-600 text-white'
                              : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                          }`}
                          title={`Toggle ${pKey}`}
                        >
                          {isPublished ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="text-[10px]">•</span>}
                        </button>
                      </td>
                    );
                  })}

                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => {
                        setSelectedPropertyId(prop.id);
                        setActiveModule('properties');
                      }}
                      className="text-teal-700 hover:underline font-semibold"
                    >
                      Ver ficha
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
