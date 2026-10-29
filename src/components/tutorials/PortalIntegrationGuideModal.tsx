import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Database, 
  ArrowRight, 
  Globe, 
  Key, 
  FileCode, 
  ShieldCheck, 
  RefreshCw, 
  Clock, 
  Info,
  Server,
  Building,
  CheckSquare,
  Square,
  HelpCircle
} from 'lucide-react';

interface PortalIntegrationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAssistant?: () => void;
}

export const PortalIntegrationGuideModal: React.FC<PortalIntegrationGuideModalProps> = ({
  isOpen,
  onClose,
  onStartAssistant,
}) => {
  const [activeSection, setActiveSection] = useState<number>(1);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({
    0: true,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  if (!isOpen) return null;

  const toggleChecklist = (idx: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const sections = [
    { id: 1, title: '1. ¿Qué significa conectar un portal?' },
    { id: 2, title: '2. Mecanismos técnicos de conexión' },
    { id: 3, title: '3. Requisitos técnicos y comerciales' },
    { id: 4, title: '4. Envío y mapeo de datos (NEX-1042)' },
    { id: 5, title: '5. Ciclo de vida de la sincronización' },
    { id: 6, title: '6. Gestión de errores y logs' },
    { id: 7, title: '7. Arquitectura Multi-Empresa' },
    { id: 8, title: '8. Ejemplo práctico de extremo a extremo' },
    { id: 9, title: '9. Checklist antes de programar' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-500/30">
                  Guía Conceptual & Técnica
                </span>
                <span className="text-xs text-slate-400">Nexo Inmobiliario</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white mt-0.5">
                Cómo conectar portales inmobiliarios al CRM
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onStartAssistant && (
              <button
                onClick={() => {
                  onClose();
                  onStartAssistant();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                <span>Ver en Asistente Paso a Paso</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Cerrar guía"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Split: Left Navigation / Right Reader */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Table of Contents */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-3 overflow-y-auto shrink-0 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-2">
              Índice de Contenidos:
            </span>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                  activeSection === s.id
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <span className="truncate">{s.title}</span>
              </button>
            ))}

            <div className="p-3 mt-4 bg-teal-50/60 rounded-xl border border-teal-200/80 text-[11px] text-teal-900">
              <div className="flex items-center gap-1.5 font-bold mb-1 text-teal-800">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Propósito pedagógico</span>
              </div>
              <p className="leading-relaxed text-slate-600">
                Esta guía no asume APIs públicas abiertas. Explica cómo pensar la arquitectura antes de escribir código.
              </p>
            </div>
          </div>

          {/* Right Reading Viewport */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
            {/* CHAPTER 1 */}
            {activeSection === 1 && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider font-mono">Capítulo 1</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">¿Qué significa conectar un portal al CRM?</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    La diferencia esencial entre tener datos en tu base local, enviarlos y mantenerlos sincronizados.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold">1</div>
                    <h4 className="font-bold text-slate-900 text-xs">Cargar en el CRM</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      El inmueble se registra en la base de datos interna de Nexo Inmobiliario (PostgreSQL/Firestore). Es tu inventario privado, visible solo para tus asesores y bajo tus propias reglas.
                    </p>
                  </div>

                  <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">2</div>
                    <h4 className="font-bold text-slate-900 text-xs">Publicar en el Portal</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Transformar los datos al formato del portal externo y exportarlos para que aparezca publicado en su buscador web y lo vean miles de compradores e inquilinos potenciales.
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">3</div>
                    <h4 className="font-bold text-slate-900 text-xs">Mantener Sincronizado</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Garantizar que ante cualquier modificación en Nexo (baja de precio, expensas nuevas, fotos añadidas o cambio a "Reservada"), el portal se actualice automáticamente sin trabajo manual duplicado.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs mb-1.5">El valor central para la inmobiliaria</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sin sincronización automática, un asesor debe ingresar a cada portal por separado con usuario y contraseña para volver a escribir títulos, precios y subir fotos. Si hay 5 portales y 50 propiedades, actualizar precios ante fluctuaciones cambiarias se vuelve inviable. El CRM resuelve esto como **fuente única de la verdad** (*single source of truth*).
                  </p>
                </div>
              </div>
            )}

            {/* CHAPTER 2 */}
            {activeSection === 2 && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider font-mono">Capítulo 2</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">¿Cómo se realiza la conexión? Mecanismos técnicos</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Los cuatro caminos que utiliza la industria inmobiliaria para conectar sistemas de software con portales.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-slate-900 text-xs font-bold flex items-center gap-2">
                        <Server className="w-4 h-4 text-teal-600" />
                        1. API REST / GraphQL del Portal
                      </strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Tiempo real</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      Es el estándar más moderno. Tu CRM envía peticiones HTTP directas (<code className="bg-slate-100 px-1 py-0.2 rounded font-mono">POST</code> para crear, <code className="bg-slate-100 px-1 py-0.2 rounded font-mono">PUT</code> para editar, <code className="bg-slate-100 px-1 py-0.2 rounded font-mono">DELETE</code> para pausar/bajar). Las respuestas son inmediatas (milisegundos) y se confirman con un código de publicación.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-slate-900 text-xs font-bold flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-blue-600" />
                        2. Feeds de propiedades (XML o JSON)
                      </strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">Procesamiento por lotes</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      Tu CRM genera un archivo estructurado accesible mediante una URL privada protegida (ej: <code className="bg-slate-100 px-1 py-0.2 rounded font-mono">https://api.crm.com/feeds/inmobiliaria-xyz.xml</code>). Un robot o crawler del portal descarga el archivo cada cierto tiempo (ej: cada 2, 6 o 24 horas) y sincroniza todo el catálogo de una sola vez.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-slate-900 text-xs font-bold flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-purple-600" />
                        3. Integración mediante Proveedor Autorizado (Hubs)
                      </strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700">Intermediario</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      Existen empresas integradoras que ya tienen convenios y homologación con decenas de portales. Tu CRM se conecta a este hub mediante una sola API y el hub se encarga de redistribuir a cada portal.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-slate-900 text-xs font-bold flex items-center gap-2">
                        <Database className="w-4 h-4 text-slate-600" />
                        4. Carga por archivos (CSV / Excel asistido)
                      </strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">Manual / Asistido</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      Exportación de un archivo de planilla normalizado desde el CRM que luego se sube a un panel web del portal. Se utiliza como plan de contingencia o en portales locales que no disponen de infraestructura de API.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Aviso importante para el desarrollador:</strong>
                    En el mercado inmobiliario argentino y latinoamericano, portales como Zonaprop, Argenprop o Mercado Libre no ofrecen APIs públicas universales abiertas a cualquier persona. Cada portal exige verificar si tu software está homologado como partner comercial o si requiere un formato específico de feed acordado privadamente.
                  </div>
                </div>
              </div>
            )}

            {/* CHAPTER 3 */}
            {activeSection === 3 && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider font-mono">Capítulo 3</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">¿Qué necesitamos del portal para conectarnos?</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Requisitos técnicos versus requisitos comerciales de la cuenta inmobiliaria.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                      <FileCode className="w-4 h-4 text-teal-600" />
                      1. Requisitos Técnicos (Para el CRM)
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-600">
                      <li>• <strong>Documentación oficial:</strong> Colección Swagger / OpenAPI, endpoints y especificación del formato esperado.</li>
                      <li>• <strong>Credenciales de autenticación:</strong> API Key, Client ID / Secret o autorización OAuth2 para firmar las peticiones.</li>
                      <li>• <strong>Diccionario de códigos:</strong> Tablas de equivalencia para tipos de inmueble (ej: 1 = Casa, 2 = Depto), localidades y monedas.</li>
                      <li>• <strong>Entorno Sandbox:</strong> Servidor de pruebas para publicar inmuebles ficticios sin cobrar créditos reales.</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                      2. Requisitos Comerciales (De la inmobiliaria)
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-600">
                      <li>• <strong>Contrato o suscripción activa:</strong> La inmobiliaria debe ser cliente registrado del portal con cuota al día.</li>
                      <li>• <strong>Identificador de cuenta (`account_id`):</strong> Número de cliente o código de sucursal de la agencia en el portal.</li>
                      <li>• <strong>Cupo de avisos contratados:</strong> Cantidad máxima de propiedades simples y destacadas permitidas simultáneamente.</li>
                      <li>• <strong>Autorización de integrador:</strong> La inmobiliaria debe indicar al portal que autoriza a Nexo Inmobiliario como su CRM emisor.</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
                  <strong className="text-slate-900 block font-bold">Diferencia entre Requisitos Generales y Específicos:</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Los <em>generales</em> aplican a cualquier portal (servidores HTTPS con certificados SSL válidos, codificación UTF-8, fotografías públicas descargables). Los <em>específicos</em> varían con cada proveedor: algunos exigen IP fija del servidor emisor, otros limitan la frecuencia a máximo 60 peticiones por minuto (*rate limits*), y otros prohíben marcas de agua con teléfonos en las fotos.
                  </p>
                </div>
              </div>
            )}

            {/* CHAPTER 4 */}
            {activeSection === 4 && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider font-mono">Capítulo 4</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">¿Cómo se envía una propiedad? Mapeo de datos</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Ejemplo real con el semipiso en Libertador 2450 (NEX-1042) cargado en Nexo Inmobiliario.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
                    <span>Traducción / Normalización de Payload (JSON)</span>
                    <span className="text-[10px] text-teal-400">NEX-1042 → Portal Schema</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-teal-400 text-[11px] block font-bold font-sans">1. En Nexo Inmobiliario (Interno):</span>
                      <pre className="text-[11px] text-slate-300 bg-slate-950 p-3 rounded-lg overflow-x-auto leading-relaxed">
{`{
  "code": "NEX-1042",
  "operation": "Venta",
  "propertyType": "Departamento",
  "price": 360000,
  "currency": "USD",
  "rooms": 4,
  "bedrooms": 3,
  "coveredSurface": 138,
  "totalSurface": 154,
  "photos": [
    "https://cdn.nexo.com/p1.jpg"
  ]
}`}
                      </pre>
                    </div>

                    <div className="space-y-1">
                      <span className="text-amber-400 text-[11px] block font-bold font-sans">2. Transformado para el Portal Externo:</span>
                      <pre className="text-[11px] text-slate-300 bg-slate-950 p-3 rounded-lg overflow-x-auto leading-relaxed">
{`{
  "external_code": "NEX-1042",
  "operation_type": 1, // 1 = Venta
  "property_type_id": "APTO",
  "price": {
    "val": 360000,
    "currency_code": "USD"
  },
  "rooms_count": 4,
  "suites_count": 3,
  "area_indoor_m2": 138,
  "area_total_m2": 154,
  "pictures": [{
    "url": "https://cdn.nexo.com/p1.jpg",
    "primary": true
  }]
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <strong className="text-slate-900 block font-bold">¿Cómo viajan las fotografías?</strong>
                    <p className="text-slate-600 leading-relaxed">
                      Nunca se envían los archivos pesados en el cuerpo de la petición. El CRM hospeda las fotos en un CDN y envía enlaces públicos directos. El servidor del portal las descarga asíncronamente y genera sus propias miniaturas optimizadas.
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <strong className="text-slate-900 block font-bold">El Identificador Externo (`external_id`):</strong>
                    <p className="text-slate-600 leading-relaxed">
                      Al recibir el aviso, el portal responde con un identificador único (ej: <code className="font-mono bg-slate-200 px-1 py-0.2 rounded">ZP-84920</code>). Nexo debe guardar este ID para saber a qué publicación exacta aplicar futuras actualizaciones de precio o bajas.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CHAPTER 5 */}
            {activeSection === 5 && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider font-mono">Capítulo 5</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">¿Cómo funciona la sincronización? Ciclo de vida completo</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Las 5 etapas de vida de una publicación en portales vinculada a los estados de Nexo Inmobiliario.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      badge: 'POST / CREATE',
                      color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
                      title: '1. Publicación Inicial',
                      desc: 'El asesor da de alta el aviso en Nexo y activa el switch. Se envía todo el payload por primera vez. El portal valida el cupo disponible y aprueba la publicación.'
                    },
                    {
                      badge: 'PUT / UPDATE',
                      color: 'bg-blue-50 text-blue-800 border-blue-300',
                      title: '2. Actualización Comercial',
                      desc: 'Si cambia el precio, las expensas o se agrega una foto, Nexo detecta la diferencia y emite un PUT al external_id. El portal refleja el nuevo precio sin recrear el aviso ni perder las visitas acumuladas.'
                    },
                    {
                      badge: 'PATCH / PAUSE',
                      color: 'bg-amber-50 text-amber-800 border-amber-300',
                      title: '3. Pausa Preventiva (Propiedad Reservada)',
                      desc: 'Cuando un interesado deja una seña y la propiedad pasa a "Reservada", Nexo pausa el aviso en el portal. Deja de mostrarse al público para no generar llamadas estériles, pero conserva su ficha intacta.'
                    },
                    {
                      badge: 'DELETE / UNPUBLISH',
                      color: 'bg-rose-50 text-rose-800 border-rose-300',
                      title: '4. Cierre y Liberación de Cupo (Vendida o Alquilada)',
                      desc: 'Al firmar la escritura o contrato de alquiler, Nexo solicita la baja del aviso al portal. El portal retira la publicación y el cupo contratado queda libre para publicar un nuevo ingreso.'
                    },
                    {
                      badge: 'GET / WEBHOOK',
                      color: 'bg-purple-50 text-purple-800 border-purple-300',
                      title: '5. Monitoreo de Estado y Consultas Entrantes',
                      desc: 'El CRM consulta periódicamente el estado de la publicación (aprobada, rechazada por moderación o pausada) y recibe por Webhook las consultas de los interesados para depositarlas en el Inbox de Leads.'
                    },
                  ].map((stage, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <strong className="text-slate-900 text-xs font-bold block">{stage.title}</strong>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{stage.desc}</p>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded border shrink-0 ${stage.color}`}>
                        {stage.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CHAPTER 6 */}
            {activeSection === 6 && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider font-mono">Capítulo 6</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">¿Cómo se gestionan los errores de sincronización?</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Causas habituales de rechazo y cómo el CRM debe informar al usuario con registros de auditoría.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200 space-y-1">
                    <strong className="text-rose-900 text-xs font-bold block">1. Campos obligatorios faltantes</strong>
                    <p className="text-xs text-slate-600">
                      Ej: El portal exige expensas numéricas o código postal exacto de CABA. Si el campo está vacío, devuelve error <code className="font-mono text-rose-700">422 Unprocessable</code>.
                    </p>
                  </div>

                  <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200 space-y-1">
                    <strong className="text-rose-900 text-xs font-bold block">2. Fotos no conformes o caídas</strong>
                    <p className="text-xs text-slate-600">
                      Resolución menor a 800x600 px, URLs con error 404 o marcas de agua con números de teléfono no autorizadas por la política del portal.
                    </p>
                  </div>

                  <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200 space-y-1">
                    <strong className="text-rose-900 text-xs font-bold block">3. Límite de cupo contratado alcanzado</strong>
                    <p className="text-xs text-slate-600">
                      La inmobiliaria contrató 30 avisos e intenta publicar el número 31. El portal responde con código de cupo agotado.
                    </p>
                  </div>

                  <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200 space-y-1">
                    <strong className="text-rose-900 text-xs font-bold block">4. Fallos de red o servidor</strong>
                    <p className="text-xs text-slate-600">
                      Timeouts o errores <code className="font-mono text-rose-700">500 Internal Server Error</code> momentáneos del portal durante mantenimiento.
                    </p>
                  </div>
                </div>

                {/* Log Mockup */}
                <div className="p-4 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pb-2 border-b border-slate-800">
                    <span>Simulación del Registro de Sincronización en el CRM</span>
                    <span className="text-rose-400">Log de Errores</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="p-2 bg-slate-950 rounded border border-rose-900/40 text-rose-300">
                      [2026-10-22 09:14:02] ERROR [Zonaprop API] Property NEX-1061: Code 422 - "Missing field: postal_code is required for neighborhood Palermo Soho".
                    </div>
                    <div className="p-2 bg-slate-950 rounded border border-emerald-900/40 text-emerald-300">
                      [2026-10-22 09:15:20] SUCCESS [Argenprop API] Property NEX-1042: Code 200 - "Updated price to USD 345000 successfully".
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <strong className="block font-bold mb-1">Regla de oro de UX:</strong>
                  Nunca falles en silencio. El CRM debe mostrar una insignia roja o advertencia en la ficha de la propiedad con un mensaje claro en español: <em>«No se pudo publicar en Zonaprop: falta ingresar el código postal en los datos generales»</em>.
                </div>
              </div>
            )}

            {/* CHAPTER 7 */}
            {activeSection === 7 && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider font-mono">Capítulo 7</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">¿Cómo se conecta cada inmobiliaria? Arquitectura Multi-Tenant</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Cómo un CRM multiempresa como Nexo aísla credenciales, cupos y publicaciones por cliente.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Aislamiento estricto por Inmobiliaria</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Nexo Inmobiliario está diseñado para comercializarse a decenas o cientos de inmobiliarias. Cada una opera de forma totalmente independiente:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <strong className="text-slate-900 text-xs font-bold block mb-1">Inmobiliaria A (Ej: Torres Propiedades)</strong>
                      <p className="text-[11px] text-slate-500 font-mono">
                        agency_id: "inm-001"<br />
                        zonaprop_client_id: "ZP-CLI-9410"<br />
                        api_key: [encriptada en base]<br />
                        cupo_disponible: 30 avisos
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <strong className="text-slate-900 text-xs font-bold block mb-1">Inmobiliaria B (Ej: Belgrano Bienes Raíces)</strong>
                      <p className="text-[11px] text-slate-500 font-mono">
                        agency_id: "inm-002"<br />
                        zonaprop_client_id: "ZP-CLI-8120"<br />
                        api_key: [encriptada en base]<br />
                        cupo_disponible: 60 avisos
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
                  <strong className="text-slate-900 block font-bold">Invariantes de seguridad multi-empresa:</strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>Una inmobiliaria nunca puede ver ni consumir el cupo de otra agencia.</li>
                    <li>Las claves de acceso y tokens OAuth2 nunca se comparten; se almacenan asociadas al ID de la inmobiliaria.</li>
                    <li>Cuando un asesor presiona «Sincronizar», el backend de Nexo despacha la petición utilizando exclusivamente las credenciales de su agencia correspondiente.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* CHAPTER 8 */}
            {activeSection === 8 && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider font-mono">Capítulo 8</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">Ejemplo práctico de extremo a extremo</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    El recorrido cronológico de la propiedad NEX-1042 desde que entra a la cartera hasta que se vende.
                  </p>
                </div>

                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                  {[
                    {
                      step: 'Día 1: Carga y Publicación',
                      desc: 'Martín Somoza carga el semipiso en Libertador 2450 (NEX-1042) por USD 360.000 con 8 fotos y activa el switch de Zonaprop. Nexo envía un POST HTTPS. El portal responde 201 Created con external_id: "ZP-84920". El estado pasa a verde "Sincronizado".'
                    },
                    {
                      step: 'Día 14: Entrada de Leads',
                      desc: 'Una compradora (Lucía Santillán) consulta desde el portal. Mediante webhook o polling, la consulta ingresa al módulo de Consultas de Nexo con el tag "Zonaprop". El asesor responde en 5 minutos por WhatsApp.'
                    },
                    {
                      step: 'Día 21: Rebaja de Precio',
                      desc: 'La propietaria acepta reducir el valor a USD 345.000. El asesor edita el precio en Nexo. El CRM emite automáticamente un PUT al external_id ZP-84920. En menos de 2 minutos, el portal refleja el nuevo valor sin perder las visitas acumuladas.'
                    },
                    {
                      step: 'Día 30: Reserva del Inmueble',
                      desc: 'Se toma una reserva en la escribanía. El asesor cambia el estado de la propiedad a "Reservada". Nexo emite una orden de pausa preventiva al portal. El aviso desaparece del buscador público para no generar consultas falsas.'
                    },
                    {
                      step: 'Día 45: Escrituración y Cierre',
                      desc: 'Se firma la escritura traslativa de dominio. La propiedad pasa a "Vendida". Nexo emite un DELETE al portal. El aviso se archiva definitivamente y el cupo contratado queda disponible para el próximo ingreso.'
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="relative pl-8 space-y-0.5">
                      <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-teal-500 border-2 border-white ring-2 ring-teal-200" />
                      <strong className="text-xs font-bold text-slate-900 block">{item.step}</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CHAPTER 9 */}
            {activeSection === 9 && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider font-mono">Capítulo 9</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">Lista de comprobación antes de programar</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Checklist de los 6 puntos críticos que todo desarrollador debe confirmar con cada portal antes de escribir código.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      title: '1. Documentación técnica oficial y actualizada',
                      desc: '¿El portal dispone de documentación técnica vigente (OpenAPI/Swagger, esquemas XSD de feeds o manuales de integración)?'
                    },
                    {
                      title: '2. Método de integración admitido',
                      desc: '¿Permite conexión directa mediante API REST, exige un feed XML/JSON descargable o requiere trabajar a través de un partner/hub autorizado?'
                    },
                    {
                      title: '3. Homologación y autorización comercial',
                      desc: '¿La inmobiliaria cuenta con un plan comercial activo y ha firmado la autorización para vincular software externo?'
                    },
                    {
                      title: '4. Diccionario de datos y campos obligatorios',
                      desc: '¿Conocés exactamente los campos mínimos obligatorios, valores permitidos en enumeraciones (operaciones, tipos) y codificación de zonas geográficas?'
                    },
                    {
                      title: '5. Restricciones de multimedia y límites de tasa',
                      desc: '¿Cuáles son los requisitos de resolución mínima de fotos, tamaños máximos, protocolos admitidos y cuántas peticiones por minuto se permiten?'
                    },
                    {
                      title: '6. Entorno de pruebas (Sandbox)',
                      desc: '¿El portal provee credenciales de prueba o ambiente sandbox para verificar publicaciones sin consumir cupos reales en producción?'
                    },
                  ].map((item, idx) => {
                    const isChecked = checkedItems[idx] || false;
                    return (
                      <div 
                        key={idx}
                        onClick={() => toggleChecklist(idx)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked ? 'bg-teal-50/50 border-teal-300' : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                        }`}
                      >
                        <button className="mt-0.5 text-teal-600 shrink-0">
                          {isChecked ? <CheckSquare className="w-4 h-4 fill-teal-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                        </button>
                        <div className="flex-1">
                          <strong className={`text-xs font-bold block ${isChecked ? 'text-teal-900' : 'text-slate-800'}`}>
                            {item.title}
                          </strong>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-xl text-xs space-y-1.5">
                  <strong className="text-teal-400 block font-bold">Conclusión para Nexo Inmobiliario:</strong>
                  <p className="text-slate-300 leading-relaxed">
                    Mantener la Matriz de Publicación visual que ya diseñamos en el CRM es la base ideal: los interruptores permiten al usuario definir la intención comercial, mientras que en una fase posterior el backend se encargará de despachar los datos según las condiciones acordadas con cada portal.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Footer Navigation */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Capítulo {activeSection} de {sections.length}</span>
            <span className="text-slate-300">·</span>
            <span className="font-semibold text-slate-800 truncate max-w-xs sm:max-w-md">
              {sections[activeSection - 1].title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={activeSection === 1}
              onClick={() => setActiveSection(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none rounded cursor-pointer font-medium"
            >
              Anterior
            </button>
            {activeSection < sections.length ? (
              <button
                onClick={() => setActiveSection(prev => Math.min(prev + 1, sections.length))}
                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg cursor-pointer transition-colors"
              >
                Siguiente capítulo
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer"
              >
                Cerrar guía
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
