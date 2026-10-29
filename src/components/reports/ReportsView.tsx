import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  PieChart, 
  Users, 
  DollarSign, 
  Clock, 
  Award,
  ChevronRight
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export const ReportsView: React.FC = () => {
  const { teamMembers, properties, leads, opportunities } = useCrm();

  const [dateRange, setDateRange] = useState('trimestre');

  // Realistic BI analytics data
  const portalPerformance = [
    { portal: 'Zonaprop', leads: 48, visits: 18, deals: 3, convRate: '6.2%', roi: '4.8x' },
    { portal: 'Argenprop', leads: 32, visits: 12, deals: 2, convRate: '6.2%', roi: '4.1x' },
    { portal: 'MercadoLibre', leads: 28, visits: 8, deals: 1, convRate: '3.5%', roi: '3.2x' },
    { portal: 'Web Propia', leads: 22, visits: 9, deals: 2, convRate: '9.0%', roi: '12.4x' },
    { portal: 'Instagram / Redes', leads: 19, visits: 6, deals: 1, convRate: '5.2%', roi: '5.1x' },
  ];

  const agentLeaderboard = [
    { name: 'Martín Somoza', role: 'Martillero Broker', closedDeals: 7, volumeUsd: 1840000, activeLeads: 24 },
    { name: 'Valentina Rossi', role: 'Asesora Inmobiliaria', closedDeals: 5, volumeUsd: 920000, activeLeads: 18 },
    { name: 'Esteban Carrizo', role: 'Asesor Inmobiliario', closedDeals: 4, volumeUsd: 870000, activeLeads: 15 },
    { name: 'Camila Benítez', role: 'Asistente Comercial', closedDeals: 1, volumeUsd: 180000, activeLeads: 9 },
  ];

  const handleExportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8,Portal,Leads,Visitas,Cierres,Conversion,ROI\n" +
      portalPerformance.map(p => `"${p.portal}",${p.leads},${p.visits},${p.deals},"${p.convRate}","${p.roi}"`).join("\n");
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `reporte_comercial_nexo_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Reportes & Rendimiento Comercial
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Análisis de conversión de portales, velocidad de venta y productividad por agente
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg font-medium cursor-pointer"
          >
            <option value="mes">Últimos 30 días</option>
            <option value="trimestre">Trimestre en curso (Q4)</option>
            <option value="anio">Año 2026 completo</option>
          </select>

          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Tasa Global de Conversión</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">6.04%</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +1.2% sobre mes anterior
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Días promedio en cartera</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">42 días</div>
          <p className="text-[11px] text-slate-500 mt-1">Mercado CABA prom: 68 días</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Volumen Transaccionado</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">USD 3.81M</div>
          <p className="text-[11px] text-teal-600 font-medium mt-1">17 operaciones concluidas</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Comisión Promedio Percibida</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">3.8%</div>
          <p className="text-[11px] text-slate-500 mt-1">Honorarios netos de inmobiliaria</p>
        </div>
      </div>

      {/* Portal Conversion Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Rendimiento & ROI por Canal de Captación
            </h3>
            <p className="text-xs text-slate-500">
              Conversión de consultas en visitas efectivas y operaciones cerradas
            </p>
          </div>
          <span className="text-xs text-teal-600 font-medium">Actualizado hoy</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
                <th className="p-3.5">Portal / Origen</th>
                <th className="p-3.5 text-center">Consultas</th>
                <th className="p-3.5 text-center">Visitas Generadas</th>
                <th className="p-3.5 text-center">Operaciones Cerradas</th>
                <th className="p-3.5 text-center">Tasa Conversión</th>
                <th className="p-3.5 text-right">Retorno de Inversión (ROI)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {portalPerformance.map(p => (
                <tr key={p.portal} className="hover:bg-slate-50">
                  <td className="p-3.5 font-sans font-bold text-slate-900">{p.portal}</td>
                  <td className="p-3.5 text-center font-bold text-slate-800">{p.leads}</td>
                  <td className="p-3.5 text-center text-slate-600">{p.visits}</td>
                  <td className="p-3.5 text-center text-teal-700 font-bold">{p.deals}</td>
                  <td className="p-3.5 text-center font-bold text-emerald-700">{p.convRate}</td>
                  <td className="p-3.5 text-right font-bold text-slate-900">{p.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent Commercial Leaderboard */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Ranking de Asesores Inmobiliarios
            </h3>
            <p className="text-xs text-slate-500">
              Productividad individual en captación, visitas y volumen escriturado
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
                <th className="p-3.5">Asesor Comercial</th>
                <th className="p-3.5">Rol en el Equipo</th>
                <th className="p-3.5 text-center">Cierres Concretados</th>
                <th className="p-3.5 text-center">Leads en Cartera</th>
                <th className="p-3.5 text-right">Volumen Escriturado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agentLeaderboard.map((a, idx) => (
                <tr key={a.name} className="hover:bg-slate-50">
                  <td className="p-3.5 flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-100 font-mono text-[11px] font-bold text-slate-700 flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <strong className="text-slate-900">{a.name}</strong>
                  </td>
                  <td className="p-3.5 text-slate-600">{a.role}</td>
                  <td className="p-3.5 text-center font-mono font-bold text-teal-700">{a.closedDeals}</td>
                  <td className="p-3.5 text-center font-mono text-slate-600">{a.activeLeads}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                    USD {a.volumeUsd.toLocaleString('es-AR')}
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
