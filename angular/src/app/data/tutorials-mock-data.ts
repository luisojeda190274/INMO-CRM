import { Tutorial } from '../models/tutorial.models';

export const TUTORIALS_DATA: Tutorial[] = [
  {
    id: 'conectar-portales',
    title: 'Cómo conectar portales inmobiliarios al CRM',
    category: 'Portales',
    shortDescription: 'Guía técnica y conceptual para conectar portales (Zonaprop, Argenprop, Mercado Libre): APIs, Feeds XML/JSON, credenciales y ciclo de sincronización.',
    fullDescription: 'Explicación técnica detallada de cómo funciona la integración entre el CRM y los portales inmobiliarios líderes de Argentina.',
    durationMinutes: 10,
    difficulty: 'Avanzado',
    icon: '🌐',
    isReady: true,
    steps: [
      {
        id: 'cp-step-1',
        stepNumber: 1,
        totalSteps: 7,
        title: '¿Qué significa conectar un portal?',
        subtitle: 'Diferencia entre inventario interno y difusión multicanal',
        description: 'Tener una propiedad cargada en el CRM significa que existe localmente en la base de datos de la inmobiliaria. Conectarla a un portal implica transformarla a la especificación de dicho portal y mantener sincronizados precios, estados y fotos en tiempo real.',
        targetModule: 'publications',
        tips: [
          'La base de datos del CRM es siempre la fuente de la verdad (single source of truth).',
          'Los portales son canales de distribución que reflejan lo que el CRM les envía.'
        ]
      },
      {
        id: 'cp-step-2',
        stepNumber: 2,
        totalSteps: 7,
        title: 'Mecanismos de conexión',
        subtitle: 'APIs REST vs. Feeds XML/JSON programados',
        description: 'Existen dos vías principales: 1) APIs REST en tiempo real con Webhooks (notificación inmediata bidireccional), y 2) Feeds XML/JSON donde el portal descarga periódicamente (cada 2 a 6 horas) el catálogo completo.',
        targetModule: 'publications',
        codeSnippet: {
          title: 'Payload JSON estándar para publicación en API',
          language: 'json',
          code: '{\n  "property_id": "NEX-1042",\n  "operation": "SALE",\n  "price": {\n    "amount": 360000,\n    "currency": "USD"\n  },\n  "location": {\n    "address": "Av. Libertador 2450",\n    "city": "CABA",\n    "lat": -34.5802,\n    "lng": -58.4011\n  }\n}'
        }
      },
      {
        id: 'cp-step-3',
        stepNumber: 3,
        totalSteps: 7,
        title: 'Requisitos y credenciales de los proveedores',
        subtitle: 'API Keys, ID de Inmobiliaria y autorizaciones comerciales',
        description: 'Para conectar una inmobiliaria, cada portal solicita un identificador de cuenta (Company ID / Seller ID), credenciales de acceso (API Key, Client Secret o Token OAuth) y un contrato comercial activo con cupos contratados.',
        targetModule: 'publications'
      },
      {
        id: 'cp-step-4',
        stepNumber: 4,
        totalSteps: 7,
        title: 'Transformación de datos y envío de fotografías',
        subtitle: 'Mapeo de atributos y CDN de imágenes',
        description: 'Cada portal utiliza tipologías distintas (ej: "4 ambientes" se mapea a "rooms=4, bedrooms=3"). Las fotos deben enviarse como URLs públicas HTTPS con resolución mínima de 1280x720 y orden de portada.',
        targetModule: 'publications'
      },
      {
        id: 'cp-step-5',
        stepNumber: 5,
        totalSteps: 7,
        title: 'Ciclo de vida y eventos de sincronización',
        subtitle: 'Alta, modificación, reserva y baja',
        description: 'Cuando un inmueble cambia de precio o pasa a "Reservada" en Nexo Inmobiliario, un despachador de eventos en cola (queue worker) envía automáticamente la actualización a todos los portales activos.',
        targetModule: 'publications'
      },
      {
        id: 'cp-step-6',
        stepNumber: 6,
        totalSteps: 7,
        title: 'Recepción bidireccional de consultas (Leads)',
        subtitle: 'Webhooks hacia el CRM con datos del interesado',
        description: 'Cuando un interesado completa el formulario en Zonaprop o Mercado Libre, el portal dispara un Webhook POST a la API del CRM. El CRM crea de inmediato la consulta y notifica al asesor asignado.',
        targetModule: 'leads'
      },
      {
        id: 'cp-step-7',
        stepNumber: 7,
        totalSteps: 7,
        title: 'Monitoreo de discrepancias y errores frecuentes',
        subtitle: 'Validaciones de cupo, errores 400 y reintentos',
        description: 'Monitoreá el estado de la matriz de publicaciones para detectar avisos rechazados por falta de cupo de destacados, errores en coordenadas geográficas o fallas temporales de red.',
        targetModule: 'publications'
      }
    ]
  },
  {
    id: 'cargar-propiedad',
    title: 'Cómo cargar una propiedad paso a paso',
    category: 'Inventario',
    shortDescription: 'Registrá un inmueble en cartera desde cero: datos técnicos, precios, fotografías, asignación de asesor y guardado.',
    fullDescription: 'Guía paso a paso interactiva para dar de alta inmuebles en Nexo Inmobiliario.',
    durationMinutes: 6,
    difficulty: 'Básico',
    icon: '🏢',
    isReady: true,
    steps: [
      {
        id: 'cp-step-1',
        stepNumber: 1,
        totalSteps: 4,
        title: 'Ingresar a Propiedades',
        subtitle: 'Acceso al inventario central de inmuebles',
        description: 'En el menú lateral hacé clic en Propiedades para ver el inventario completo de la inmobiliaria.',
        targetModule: 'properties'
      },
      {
        id: 'cp-step-2',
        stepNumber: 2,
        totalSteps: 4,
        title: 'Abrir el formulario «Nueva propiedad»',
        subtitle: 'Iniciar la carga',
        description: 'Hacé clic en el botón superior derecho «Cargar propiedad» para abrir el formulario.',
        targetModule: 'properties'
      },
      {
        id: 'cp-step-3',
        stepNumber: 3,
        totalSteps: 4,
        title: 'Completar datos principales y ubicación',
        subtitle: 'Identificación, valores y características técnicas',
        description: 'Completá dirección, barrio, ambientes, m² cubiertos, precio en USD o ARS y expensas.',
        targetModule: 'properties'
      },
      {
        id: 'cp-step-4',
        stepNumber: 4,
        totalSteps: 4,
        title: 'Guardar y difundir',
        subtitle: 'Generación del código NEX y publicación',
        description: 'Al guardar, se genera el código unívoco de la propiedad y se habilita la difusión en portales.',
        targetModule: 'properties'
      }
    ]
  },
  {
    id: 'sincronizar-publicaciones',
    title: 'Cómo sincronizar publicaciones y portales',
    category: 'Portales',
    shortDescription: 'Monitoreá la matriz de difusión multicanal hacia Zonaprop, Argenprop y Mercado Libre.',
    fullDescription: 'Administración de cupos, destacados y sincronización en tiempo real.',
    durationMinutes: 5,
    difficulty: 'Intermedio',
    icon: '🔄',
    isReady: true,
    steps: [
      {
        id: 'sp-step-1',
        stepNumber: 1,
        totalSteps: 3,
        title: 'Matriz de difusión',
        subtitle: 'Control cruzado de inmuebles y portales',
        description: 'Revisá la tabla donde cada fila es una propiedad y cada columna un portal inmobiliario.',
        targetModule: 'publications'
      },
      {
        id: 'sp-step-2',
        stepNumber: 2,
        totalSteps: 3,
        title: 'Activación con un clic',
        subtitle: 'Toggle instantáneo de sincronización',
        description: 'Activá o desactivá la casilla del portal para sumar o quitar el inmueble de la difusión.',
        targetModule: 'publications'
      },
      {
        id: 'sp-step-3',
        stepNumber: 3,
        totalSteps: 3,
        title: 'Control de cupos y destacados',
        subtitle: 'Evitar sobrepasar los cupos contratados',
        description: 'Supervisá en las tarjetas superiores la cantidad de avisos simples y destacados restantes.',
        targetModule: 'publications'
      }
    ]
  }
];
