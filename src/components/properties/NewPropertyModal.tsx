import React, { useState, useRef } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  DollarSign, 
  Image as ImageIcon, 
  Upload, 
  UserCheck, 
  Check, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  ArrowRight,
  FileText,
  Sparkles
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { PropertyType, OperationType, PropertyStatus } from '../../types/crm';
import imgApartment from '../../assets/images/prop_modern_apartment_1792675050749.jpg';
import imgHouse from '../../assets/images/prop_suburban_house_1792675050795.jpg';
import imgPenthouse from '../../assets/images/prop_penthouse_terrace_1792675051692.jpg';
import imgPH from '../../assets/images/prop_ph_remodelado_1792675051761.jpg';
import imgOffice from '../../assets/images/prop_modern_office_1792675051673.jpg';

export const NewPropertyModal: React.FC = () => {
  const { 
    isNewPropertyModalOpen, 
    setIsNewPropertyModalOpen, 
    addProperty, 
    teamMembers, 
    contacts, 
    formatCurrency,
    setSelectedPropertyId,
    lastCreatedPropertyId
  } = useCrm();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Tabs: 'form' | 'photos' | 'review' | 'success'
  const [activeTab, setActiveTab] = useState<'form' | 'photos' | 'review' | 'success'>('form');
  const [createdId, setCreatedId] = useState<string | null>(null);

  // Property fields
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('Palermo');
  const [city, setCity] = useState('CABA');
  const [propertyType, setPropertyType] = useState<PropertyType>('Departamento');
  const [operation, setOperation] = useState<OperationType>('Venta');
  const [price, setPrice] = useState(240000);
  const [currency, setCurrency] = useState<'USD' | 'ARS'>('USD');
  const [expenses, setExpenses] = useState(115000);
  const [totalSurface, setTotalSurface] = useState(85);
  const [coveredSurface, setCoveredSurface] = useState(78);
  const [rooms, setRooms] = useState(3);
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [garages, setGarages] = useState(1);
  const [assignedAgent, setAssignedAgent] = useState('Martín Somoza');
  const [description, setDescription] = useState('Hermoso departamento con excelente iluminación natural, pisos de madera y balcón aterrazado.');
  
  // Owner Association
  const [ownerContactId, setOwnerContactId] = useState<string>(contacts.find(c => c.category === 'Propietario')?.id || '');

  // Photos State
  const [galleryImages, setGalleryImages] = useState<string[]>([imgApartment]);
  const [selectedMainImage, setSelectedMainImage] = useState<string>(imgApartment);

  if (!isNewPropertyModalOpen) return null;

  // Handle local file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const result = loadEvent.target?.result as string;
        if (result) {
          setGalleryImages(prev => [result, ...prev]);
          if (galleryImages.length === 0) {
            setSelectedMainImage(result);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSelectPreset = (presetImg: string) => {
    if (!galleryImages.includes(presetImg)) {
      setGalleryImages(prev => [presetImg, ...prev]);
    }
    setSelectedMainImage(presetImg);
  };

  const handleRemovePhoto = (imgToRemove: string) => {
    setGalleryImages(prev => {
      const filtered = prev.filter(img => img !== imgToRemove);
      if (selectedMainImage === imgToRemove && filtered.length > 0) {
        setSelectedMainImage(filtered[0]);
      }
      return filtered;
    });
  };

  // Quick fill sample data helper
  const handleFillSampleData = () => {
    setTitle('Semipiso 3 amb con balcón terraza y cochera fija');
    setAddress('Av. Coronel Díaz 2140, Piso 7');
    setNeighborhood('Palermo');
    setCity('CABA');
    setPropertyType('Departamento');
    setOperation('Venta');
    setPrice(285000);
    setCurrency('USD');
    setExpenses(135000);
    setTotalSurface(94);
    setCoveredSurface(84);
    setRooms(3);
    setBedrooms(2);
    setBathrooms(2);
    setGarages(1);
    setDescription('Impecable semipiso con palier privado, cocina independiente con comedor diario y balcón terraza con vista abierta.');
    setGalleryImages([imgApartment, imgPenthouse]);
    setSelectedMainImage(imgApartment);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !address.trim()) {
      setActiveTab('form');
      return;
    }

    const selectedOwner = contacts.find(c => c.id === ownerContactId);

    const newPropId = `prop-${Date.now()}`;
    addProperty({
      title: title.trim(),
      address: address.trim(),
      neighborhood,
      city,
      propertyType,
      operation,
      price: Number(price),
      currency,
      expenses: Number(expenses),
      totalSurface: Number(totalSurface),
      coveredSurface: Number(coveredSurface),
      rooms: Number(rooms),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      garages: Number(garages),
      status: 'Disponible' as PropertyStatus,
      mainImage: selectedMainImage || imgApartment,
      galleryImages: galleryImages.length > 0 ? galleryImages : [imgApartment],
      description: description.trim(),
      assignedAgent,
      ownerContactId: selectedOwner ? selectedOwner.id : undefined,
      ownerName: selectedOwner ? selectedOwner.fullName : undefined,
      featured: false,
      portals: {
        zonaprop: true,
        argenprop: true,
        mercadolibre: false,
        properati: true,
        ownWebsite: true,
      },
      features: ['Balcón', 'Seguridad 24hs', 'Luminoso'],
    });

    setCreatedId(newPropId);
    setActiveTab('success');
  };

  const handleOpenCreatedProperty = () => {
    if (lastCreatedPropertyId || createdId) {
      setSelectedPropertyId(lastCreatedPropertyId || createdId);
    }
    setIsNewPropertyModalOpen(false);
  };

  const selectedOwnerContact = contacts.find(c => c.id === ownerContactId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-400" />
            <h2 className="text-base font-bold">Alta de Nueva Propiedad</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFillSampleData}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-teal-300 px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1 cursor-pointer"
              title="Cargar datos de ejemplo para prueba rápida"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Cargar ejemplo</span>
            </button>
            <button
              onClick={() => setIsNewPropertyModalOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Stepper Tabs */}
        {activeTab !== 'success' && (
          <div className="px-6 bg-slate-100 border-b border-slate-200 flex items-center gap-2 shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 cursor-pointer ${
                activeTab === 'form' ? 'border-teal-600 text-teal-700 bg-white shadow-2xs' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Datos principales & Propietario
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 cursor-pointer ${
                activeTab === 'photos' ? 'border-teal-600 text-teal-700 bg-white shadow-2xs' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Fotografías ({galleryImages.length})
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 cursor-pointer ${
                activeTab === 'review' ? 'border-teal-600 text-teal-700 bg-white shadow-2xs' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Revisar ficha previa
            </button>
          </div>
        )}

        {/* Tab 1: Form Fields */}
        {activeTab === 'form' && (
          <form onSubmit={(e) => { e.preventDefault(); setActiveTab('photos'); }} className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Title & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Título del aviso *
                  </label>
                  <span className="text-[10px] text-teal-700 font-semibold font-mono">Obligatorio</span>
                </div>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ej. Semipiso 3 ambientes con balcón terraza y cochera fija"
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Dirección exacta *
                  </label>
                  <span className="text-[10px] text-teal-700 font-semibold font-mono">Obligatorio</span>
                </div>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Ej. Av. Coronel Díaz 2140, Piso 7"
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Barrio / Localidad *
                  </label>
                  <span className="text-[10px] text-teal-700 font-semibold font-mono">Obligatorio</span>
                </div>
                <input
                  type="text"
                  required
                  value={neighborhood}
                  onChange={e => setNeighborhood(e.target.value)}
                  placeholder="Ej. Palermo, Recoleta, Tigre..."
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Operation, Type, Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Operación *
                </label>
                <select
                  value={operation}
                  onChange={e => setOperation(e.target.value as OperationType)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="Venta">Venta</option>
                  <option value="Alquiler">Alquiler</option>
                  <option value="Alquiler Temporal">Alquiler Temporal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tipo de inmueble *
                </label>
                <select
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value as PropertyType)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="Departamento">Departamento</option>
                  <option value="Casa">Casa</option>
                  <option value="PH">PH</option>
                  <option value="Oficina">Oficina</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Local Comercial">Local Comercial</option>
                  <option value="Cochera">Cochera</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Moneda *
                </label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value as 'USD' | 'ARS')}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white font-mono"
                >
                  <option value="USD">USD (Dólares)</option>
                  <option value="ARS">ARS (Pesos)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Precio de lista *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 font-mono"
                />
              </div>
            </div>

            {/* Surface & Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  M² Totales *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={totalSurface}
                  onChange={e => setTotalSurface(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  M² Cubiertos *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={coveredSurface}
                  onChange={e => setCoveredSurface(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Ambientes *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={rooms}
                  onChange={e => setRooms(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Dormitorios
                </label>
                <input
                  type="number"
                  min="0"
                  value={bedrooms}
                  onChange={e => setBedrooms(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Baños
                </label>
                <input
                  type="number"
                  min="1"
                  value={bathrooms}
                  onChange={e => setBathrooms(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Cocheras
                </label>
                <input
                  type="number"
                  min="0"
                  value={garages}
                  onChange={e => setGarages(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>
            </div>

            {/* Owner Association & Agent Assignment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>Asociar Propietario (Contacto)</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Sin duplicados</span>
                </div>
                <select
                  value={ownerContactId}
                  onChange={e => setOwnerContactId(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="">-- Sin propietario asignado --</option>
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.category}) · {c.phone}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Vincula la ficha con un cliente registrado en el módulo de Contactos.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Asesor inmobiliario responsable *
                </label>
                <select
                  value={assignedAgent}
                  onChange={e => setAssignedAgent(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white"
                >
                  {teamMembers.map(tm => (
                    <option key={tm.id} value={tm.name}>{tm.name} ({tm.role})</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Recibirá las notificaciones de consultas y visitas agendadas.
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Descripción comercial
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-3 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsNewPropertyModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Continuar a Fotografías</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Photos & Upload */}
        {activeTab === 'photos' && (
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Gestión de Fotografías del Inmueble</h3>
                <p className="text-xs text-slate-500">
                  Subí fotos desde tu equipo o seleccioná de la galería arquitectónica. La foto marcada con estrella será la portada principal.
                </p>
              </div>

              {/* Upload input button */}
              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-2xs cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Subir fotos desde el equipo</span>
                </button>
              </div>
            </div>

            {/* Presets Row */}
            <div>
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                O elegir entre presets fotográficos de alta calidad:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { name: 'Departamento Moderno', img: imgApartment },
                  { name: 'Casa con Piscina', img: imgHouse },
                  { name: 'Penthouse Terraza', img: imgPenthouse },
                  { name: 'PH Patio Andaluz', img: imgPH },
                  { name: 'Oficina Corporativa', img: imgOffice },
                ].map(preset => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset.img)}
                    className="relative h-18 rounded-lg overflow-hidden border border-slate-200 group text-left cursor-pointer hover:border-teal-500"
                  >
                    <img src={preset.img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <span className="absolute inset-0 bg-black/40 p-1 flex items-end text-[10px] text-white font-medium">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Photos in gallery */}
            <div>
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                Fotografías asociadas a la ficha ({galleryImages.length}):
              </span>

              {galleryImages.length === 0 ? (
                <div className="p-8 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-400">
                  Aún no has agregado fotos. Subí una desde tu equipo o seleccioná un preset superior.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {galleryImages.map((img, idx) => {
                    const isMain = selectedMainImage === img;
                    return (
                      <div
                        key={idx}
                        className={`relative rounded-xl overflow-hidden border-2 bg-slate-100 group ${
                          isMain ? 'border-teal-600 ring-2 ring-teal-500/30' : 'border-slate-200'
                        }`}
                      >
                        <div className="h-28 w-full overflow-hidden">
                          <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>

                        {/* Badges and buttons */}
                        <div className="p-2 bg-white flex items-center justify-between text-[11px]">
                          <button
                            type="button"
                            onClick={() => setSelectedMainImage(img)}
                            className={`font-semibold cursor-pointer ${
                              isMain ? 'text-teal-700' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {isMain ? '★ Portada Principal' : 'Hacer portada'}
                          </button>

                          {galleryImages.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(img)}
                              className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                              title="Eliminar foto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                ← Volver a datos principales
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('review')}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Revisar ficha previa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Review Preview */}
        {activeTab === 'review' && (
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Revisar Ficha Previa del Inmueble</h3>
              <p className="text-xs text-slate-500">
                Verificá todos los datos cargados antes de publicar en el inventario oficial.
              </p>
            </div>

            {/* Preview Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-full sm:w-44 h-28 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                  <img src={selectedMainImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                    {operation} · {propertyType}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{title || 'Sin título'}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{address}, {neighborhood}, {city}</p>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-2">
                    {formatCurrency(price, currency)}
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Superficie</span>
                  <p className="font-bold text-slate-800 font-mono">{totalSurface} m² Tot / {coveredSurface} m² Cub</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Distribución</span>
                  <p className="font-bold text-slate-800 font-mono">{rooms} amb · {bedrooms} dorm · {bathrooms} baños</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Propietario Asignado</span>
                  <p className="font-bold text-slate-800 truncate">{selectedOwnerContact ? selectedOwnerContact.fullName : 'No especificado'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Asesor Comercial</span>
                  <p className="font-bold text-slate-800 truncate">{assignedAgent}</p>
                </div>
              </div>

              {/* Description preview */}
              <div className="pt-2 text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200 italic">
                "{description}"
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('photos')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                ← Volver a fotografías
              </button>
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar y Guardar Propiedad</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Success Confirmation */}
        {activeTab === 'success' && (
          <div className="p-8 text-center space-y-4 flex-1 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                ¡Propiedad guardada exitosamente en el inventario!
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                El inmueble ha sido dado de alta en la base de datos de Nexo Inmobiliario y está listo para ser publicado en portales o gestionado con interesados.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleOpenCreatedProperty}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-2xs cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Ver ficha detallada de la propiedad</span>
              </button>
              <button
                onClick={() => setIsNewPropertyModalOpen(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Cerrar y volver al inventario
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
