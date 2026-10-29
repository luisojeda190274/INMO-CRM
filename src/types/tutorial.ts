import { NavModule } from '../context/CrmContext';

export interface TutorialStepAction {
  label: string;
  type: 'navigate' | 'open_modal' | 'fill_sample' | 'save' | 'open_property' | 'custom';
  targetModule?: NavModule;
  actionFn?: () => void;
}

export interface TutorialStep {
  id: string;
  stepNumber: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  description: string;
  targetModule: NavModule;
  spotlightElementId?: string; // CSS ID or selector hint
  action?: TutorialStepAction;
  tips?: string[];
  fieldsExplanation?: {
    name: string;
    description: string;
    required: boolean;
  }[];
  codeSnippet?: {
    language: string;
    code: string;
    title: string;
  };
  diagramType?: 'architecture' | 'mapping' | 'lifecycle' | 'multitenant' | 'checklist' | 'errors';
  checklistItems?: string[];
}

export interface Tutorial {
  id: string;
  title: string;
  category: 'Inventario' | 'Portales' | 'Clientes' | 'Ventas' | 'Configuración';
  shortDescription: string;
  fullDescription: string;
  durationMinutes: number;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  icon: string;
  isReady: boolean;
  steps: TutorialStep[];
}
