import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  LayoutGrid, 
  Table as TableIcon, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Copy, 
  Archive, 
  Trash2, 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  Download,
  Share2,
  CheckSquare,
  Square
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { Property, OperationType, PropertyType, PropertyStatus } from '../../types/crm';
import { PropertyDetailModal } from './PropertyDetailModal';
import { NewPropertyModal } from './NewPropertyModal';

export const PropertiesView: React.FC = () => {
  const { 
    properties, 
    formatCurrency, 
    setSelectedPropertyId, 
    setIsNewPropertyModalOpen,
    duplicateProperty,
    archiveProperty,
    deleteProperty,
    updateProperty
  } = useCrm();

  // View state
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOperation, setFilterOperation] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterNeighborhood, setFilterNeighborhood] = useState<string>('all');
  
  // Sorting state
  const [sortField, setSortField] = useState<'price' | 'updatedAt' | 'totalSurface' | 'code'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Extract unique neighborhoods for filter
  const neighborhoods = useMemo(() => {
    const set = new Set(properties.map(p => p.neighborhood));
    return Array.from(set);
  }, [properties]);

  // Filtered and sorted properties
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchSearch = 
        !searchTerm.trim() ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.neighborhood.toLowerCase().includes(searchTerm.toLowerCase());

      const matchOp = filterOperation === 'all' || p.operation === filterOperation;
      const matchType = filterType === 'all' || p.propertyType === filterType;
      const matchStatus = filterStatus === 'all' || p.status === filterStatus;
      const matchZone = filterNeighborhood === 'all' || p.neighborhood === filterNeighborhood;

      return matchSearch && matchOp && matchType && matchStatus && matchZone;
    }).sort((a, b) => {
      let result = 0;
      if (sortField === 'price') {
        result = a.price - b.price;
      } else if (sortField === 'totalSurface') {
        result = a.totalSurface - b.totalSurface;
      } else if (sortField === 'code') {
        result = a.code.localeCompare(b.code);
      } else {
        result = a.updatedAt.localeCompare(b.updatedAt);
      }
      return sortOrder === 'asc' ? result : -result;
    });
  }, [properties, searchTerm, filterOperation, filterType, filterStatus, filterNeighborhood, sortField, sortOrder]);

  // Paged items
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage) || 1;
  const pagedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(start, start + itemsPerPage);
  }, [filteredProperties, currentPage]);

  const handleSort = (field: 'price' | 'updatedAt' | 'totalSurface' | 'code') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === pagedProperties.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pagedProperties.map(p => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Bulk actions
  const handleBulkStatusChange = (status: PropertyStatus) => {
    selectedIds.forEach(id => updateProperty(id, { status }));
    setSelectedIds([]);
  };

  const handleBulkExportCsv = () => {
    const rows = filteredProperties.map(p => 
      `"${p.code}","${p.title}","${p.address}","${p.propertyType}","${p.operation}","${p.price} ${p.currency}","${p.totalSurface}m2","${p.status}"`
    );
    const csvContent = "data:text/csv;charset=utf-8,Código,Título,Dirección,Tipo,Operación,Precio,Superficie,Estado\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nexo_propiedades_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Top Header & New Property CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Inventario de Inmuebles
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión completa de cartera, publicación en portales y control de estados
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Table / Card Switcher */}
          <div className="flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Vista en tabla detallada"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Vista en tarjetas fotográficas"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsNewPropertyModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva propiedad</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Text Search */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Buscar por código, calle o barrio..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Operation Filter */}
          <div className="md:col-span-2">
            <select
              value={filterOperation}
              onChange={e => { setFilterOperation(e.target.value); setCurrentPage(1); }}
              className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
            >
              <option value="all">Todas las operaciones</option>
              <option value="Venta">Venta</option>
              <option value="Alquiler">Alquiler</option>
              <option value="Alquiler Temporal">Alquiler Temporal</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="md:col-span-2">
            <select
              value={filterType}
              onChange={e => { setFilterType(e.target.value); setCurrentPage(1); }}
              className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
            >
              <option value="all">Todos los tipos</option>
              <option value="Departamento">Departamento</option>
              <option value="Casa">Casa</option>
              <option value="PH">PH</option>
              <option value="Oficina">Oficina</option>
              <option value="Terreno">Terreno</option>
            </select>
          </div>

          {/* Neighborhood Filter */}
          <div className="md:col-span-2">
            <select
              value={filterNeighborhood}
              onChange={e => { setFilterNeighborhood(e.target.value); setCurrentPage(1); }}
              className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
            >
              <option value="all">Todas las zonas</option>
              {neighborhoods.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
            >
              <option value="all">Todos los estados</option>
              <option value="Disponible">Disponible</option>
              <option value="Reservada">Reservada</option>
              <option value="Vendida">Vendida</option>
              <option value="Suspendida">Suspendida</option>
            </select>
          </div>
        </div>

        {/* Status Count Pills & Quick Clear */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
          <div className="flex items-center gap-3">
            <span>Resultados: <strong className="text-slate-800 font-mono">{filteredProperties.length}</strong></span>
            <span>·</span>
            <span>Disponibles: <strong className="text-emerald-700 font-mono">{properties.filter(p => p.status === 'Disponible').length}</strong></span>
            <span>·</span>
            <span>Reservadas: <strong className="text-amber-700 font-mono">{properties.filter(p => p.status === 'Reservada').length}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBulkExportCsv}
              className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
            {(searchTerm || filterOperation !== 'all' || filterType !== 'all' || filterStatus !== 'all' || filterNeighborhood !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterOperation('all');
                  setFilterType('all');
                  setFilterStatus('all');
                  setFilterNeighborhood('all');
                  setCurrentPage(1);
                }}
                className="text-teal-700 hover:underline font-semibold cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Actions Floating Toolbar (When items selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-500/40">
              {selectedIds.length} seleccionadas
            </span>
            <span className="text-slate-300">Acciones masivas de cartera:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusChange('Disponible')}
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer"
            >
              Marcar Disponibles
            </button>
            <button
              onClick={() => handleBulkStatusChange('Reservada')}
              className="px-2.5 py-1 text-xs bg-amber-950 text-amber-300 border border-amber-600/40 rounded cursor-pointer"
            >
              Marcar Reservadas
            </button>
            <button
              onClick={() => handleBulkStatusChange('Suspendida')}
              className="px-2.5 py-1 text-xs bg-rose-950 text-rose-300 border border-rose-600/40 rounded cursor-pointer"
            >
              Archivar
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2 text-xs text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length > 0 && selectedIds.length === pagedProperties.length}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 cursor-pointer"
                    />
                  </th>
                  <th className="p-3.5 cursor-pointer" onClick={() => handleSort('code')}>
                    <div className="flex items-center gap-1">
                      <span>Código</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="p-3.5">Foto</th>
                  <th className="p-3.5 min-w-[220px]">Título / Dirección</th>
                  <th className="p-3.5">Tipo & Operación</th>
                  <th className="p-3.5">Ubicación</th>
                  <th className="p-3.5 cursor-pointer text-right" onClick={() => handleSort('price')}>
                    <div className="flex items-center justify-end gap-1">
                      <span>Precio</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="p-3.5 text-center">Amb / M²</th>
                  <th className="p-3.5 text-center">Estado</th>
                  <th className="p-3.5 text-center">Portales</th>
                  <th className="p-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagedProperties.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="p-8 text-center text-slate-400 text-xs">
                      No se encontraron propiedades que coincidan con los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  pagedProperties.map(prop => {
                    const isSelected = selectedIds.includes(prop.id);
                    return (
                      <tr 
                        key={prop.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isSelected ? 'bg-teal-50/40' : ''
                        }`}
                      >
                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(prop.id)}
                            className="rounded border-slate-300 cursor-pointer"
                          />
                        </td>

                        <td className="p-3.5 font-mono font-bold text-teal-700 whitespace-nowrap">
                          {prop.code}
                        </td>

                        <td className="p-3.5">
                          <div 
                            onClick={() => setSelectedPropertyId(prop.id)}
                            className="w-14 h-10 rounded-md overflow-hidden bg-slate-100 border border-slate-200 shrink-0 cursor-pointer group"
                          >
                            <img 
                              src={prop.mainImage} 
                              alt={prop.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </td>

                        <td className="p-3.5">
                          <button
                            onClick={() => setSelectedPropertyId(prop.id)}
                            className="font-bold text-slate-900 hover:text-teal-700 text-left line-clamp-1 cursor-pointer"
                          >
                            {prop.title}
                          </button>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            {prop.address}
                          </div>
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <span className="font-medium text-slate-800">{prop.propertyType}</span>
                          <span className="block text-[11px] text-slate-400">{prop.operation}</span>
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <span className="font-medium text-slate-800">{prop.neighborhood}</span>
                          <span className="block text-[11px] text-slate-400">{prop.city}</span>
                        </td>

                        <td className="p-3.5 text-right font-mono font-bold text-slate-900 whitespace-nowrap tabular-nums">
                          {formatCurrency(prop.price, prop.currency)}
                        </td>

                        <td className="p-3.5 text-center font-mono whitespace-nowrap">
                          <span className="font-semibold text-slate-800">{prop.rooms} amb</span>
                          <span className="block text-[11px] text-slate-400">{prop.totalSurface} m²</span>
                        </td>

                        <td className="p-3.5 text-center whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            prop.status === 'Disponible' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : prop.status === 'Reservada'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : prop.status === 'Vendida'
                              ? 'bg-slate-100 text-slate-600 border border-slate-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {prop.status}
                          </span>
                        </td>

                        <td className="p-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <span 
                              className={`w-2 h-2 rounded-full ${prop.portals.zonaprop ? 'bg-rose-500' : 'bg-slate-200'}`} 
                              title={`Zonaprop: ${prop.portals.zonaprop ? 'Activo' : 'No'}`}
                            />
                            <span 
                              className={`w-2 h-2 rounded-full ${prop.portals.argenprop ? 'bg-blue-500' : 'bg-slate-200'}`} 
                              title={`Argenprop: ${prop.portals.argenprop ? 'Activo' : 'No'}`}
                            />
                            <span 
                              className={`w-2 h-2 rounded-full ${prop.portals.mercadolibre ? 'bg-amber-500' : 'bg-slate-200'}`} 
                              title={`MercadoLibre: ${prop.portals.mercadolibre ? 'Activo' : 'No'}`}
                            />
                          </div>
                        </td>

                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedPropertyId(prop.id)}
                              className="p-1 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded cursor-pointer"
                              title="Ver ficha completa"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => duplicateProperty(prop.id)}
                              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
                              title="Duplicar propiedad"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => archiveProperty(prop.id)}
                              className="p-1 text-slate-500 hover:text-rose-700 hover:bg-slate-100 rounded cursor-pointer"
                              title="Archivar / Suspender"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CARD VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pagedProperties.map(prop => (
            <div 
              key={prop.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col group"
            >
              {/* Card Photo Header */}
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden cursor-pointer" onClick={() => setSelectedPropertyId(prop.id)}>
                <img 
                  src={prop.mainImage} 
                  alt={prop.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  {prop.code}
                </div>
                <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                  {prop.operation}
                </div>
                <div className="absolute bottom-2.5 left-2.5 bg-slate-900/90 text-white font-mono text-xs font-bold px-2 py-0.5 rounded tabular-nums">
                  {formatCurrency(prop.price, prop.currency)}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 
                    onClick={() => setSelectedPropertyId(prop.id)}
                    className="text-xs font-bold text-slate-900 hover:text-teal-700 line-clamp-1 cursor-pointer"
                  >
                    {prop.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{prop.address}, {prop.neighborhood}</span>
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Amb</span>
                      <strong className="font-mono text-slate-800">{prop.rooms}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Dorm</span>
                      <strong className="font-mono text-slate-800">{prop.bedrooms}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Sup. Tot</span>
                      <strong className="font-mono text-slate-800">{prop.totalSurface} m²</strong>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                    prop.status === 'Disponible' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                  }`}>
                    {prop.status}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => duplicateProperty(prop.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded"
                      title="Duplicar"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSelectedPropertyId(prop.id)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded transition-colors cursor-pointer"
                    >
                      Ver ficha
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div>
          Mostrando página <strong className="font-mono">{currentPage}</strong> de <strong className="font-mono">{totalPages}</strong> ({filteredProperties.length} inmuebles)
        </div>

        <div className="flex items-center gap-1">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-mono">{currentPage}</span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Property Details Modal */}
      <PropertyDetailModal />

      {/* New Property Modal */}
      <NewPropertyModal />
    </div>
  );
};
