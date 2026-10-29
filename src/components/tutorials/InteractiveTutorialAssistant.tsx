import React from 'react';
import { 
  GraduationCap, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Minimize2, 
  Maximize2, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Lightbulb,
  Building2,
  Share2,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export const InteractiveTutorialAssistant: React.FC = () => {
  const {
    activeTutorial,
    currentTutorialStepIndex,
    isTutorialActive,
    isTutorialMinimized,
    nextTutorialStep,
    prevTutorialStep,
    goToTutorialStep,
    endTutorial,
    toggleMinimizeTutorial,
    setActiveModule,
    setIsNewPropertyModalOpen,
    setSelectedPropertyId,
    lastCreatedPropertyId
  } = useCrm();

  if (!isTutorialActive || !activeTutorial) return null;

  const currentStep = activeTutorial.steps[currentTutorialStepIndex];
  if (!currentStep) return null;

  const progressPercentage = Math.round(
    ((currentTutorialStepIndex + 1) / activeTutorial.steps.length) * 100
  );

  const handleAction = () => {
    if (!currentStep.action) return;

    if (currentStep.action.targetModule) {
      setActiveModule(currentStep.action.targetModule);
    }

    if (currentStep.action.type === 'open_modal') {
      setIsNewPropertyModalOpen(true);
    } else if (currentStep.action.type === 'open_property') {
      setSelectedPropertyId(lastCreatedPropertyId || 'prop-1');
    }

    if (currentStep.action.actionFn) {
      currentStep.action.actionFn();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-lg w-full sm:w-[480px] shadow-2xl rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 text-white font-sans transition-all duration-200">
      {/* Top Bar */}
      <div className="px-4 py-3 bg-slate-950 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-md bg-teal-500 text-slate-950 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="truncate">
            <span className="text-xs font-bold text-white truncate block">
              {activeTutorial.title}
            </span>
            <span className="text-[10px] text-teal-400 font-mono">
              Paso {currentStep.stepNumber} de {currentStep.totalSteps} ({progressPercentage}%)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleMinimizeTutorial}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title={isTutorialMinimized ? 'Expandir asistente' : 'Minimizar asistente'}
          >
            {isTutorialMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={endTutorial}
            className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
            title="Finalizar tutorial"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-slate-800 h-1">
        <div
          style={{ width: `${progressPercentage}%` }}
          className="h-full bg-teal-400 transition-all duration-300"
        />
      </div>

      {/* Body content (hidden when minimized) */}
      {!isTutorialMinimized && (
        <div className="p-4 space-y-3.5 max-h-[70vh] overflow-y-auto">
          {/* Step Title & Subtitle */}
          <div>
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
              {currentStep.subtitle}
            </span>
            <h3 className="text-sm font-bold text-white mt-0.5">
              {currentStep.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Fields Explanation List if present (e.g. Step 3) */}
          {currentStep.fieldsExplanation && (
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                Campos del formulario y validación:
              </span>
              <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-700/60">
                {currentStep.fieldsExplanation.map(f => (
                  <div key={f.name} className="pt-1.5 first:pt-0">
                    <div className="flex items-center justify-between">
                      <strong className="text-white text-xs">{f.name}</strong>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        f.required ? 'bg-teal-950 text-teal-300 border border-teal-700/50' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {f.required ? 'Obligatorio' : 'Opcional'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Snippet if present (e.g. Step 4 Mapping) */}
          {currentStep.codeSnippet && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[10px] text-teal-400 font-mono">
                <span className="font-semibold truncate">{currentStep.codeSnippet.title}</span>
                <span className="uppercase text-slate-500 font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {currentStep.codeSnippet.language}
                </span>
              </div>
              <pre className="overflow-x-auto text-slate-300 max-h-44 whitespace-pre font-mono text-[10px] leading-relaxed p-1">
                {currentStep.codeSnippet.code}
              </pre>
            </div>
          )}

          {/* Checklist items if present (e.g. Step 9 Pre-programming checklist) */}
          {currentStep.checklistItems && currentStep.checklistItems.length > 0 && (
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block">
                Puntos a investigar antes de programar:
              </span>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {currentStep.checklistItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300 leading-snug">
                    <span className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips Box */}
          {currentStep.tips && currentStep.tips.length > 0 && (
            <div className="p-3 bg-teal-950/40 rounded-xl border border-teal-500/30 text-xs text-teal-200 space-y-1">
              <div className="flex items-center gap-1.5 text-teal-400 font-bold text-[11px]">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Consejos útiles:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                {currentStep.tips.map((tip, idx) => (
                  <li key={idx} className="leading-snug">{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Interactive Direct Action Button */}
          {currentStep.action && (
            <button
              onClick={handleAction}
              className="w-full py-2 px-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>{currentStep.action.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Steps Indicator Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {activeTutorial.steps.map((st, idx) => (
              <button
                key={st.id}
                onClick={() => goToTutorialStep(idx)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  currentTutorialStepIndex === idx
                    ? 'w-6 bg-teal-400'
                    : idx < currentTutorialStepIndex
                    ? 'bg-teal-700'
                    : 'bg-slate-700'
                }`}
                title={`Ir a paso ${idx + 1}`}
              />
            ))}
          </div>

          {/* Footer Controls */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              disabled={currentTutorialStepIndex === 0}
              onClick={prevTutorialStep}
              className="px-3 py-1.5 text-slate-400 hover:text-white rounded flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <span className="text-[11px] text-slate-400 font-mono">
              {currentTutorialStepIndex + 1} / {activeTutorial.steps.length}
            </span>

            {currentTutorialStepIndex < activeTutorial.steps.length - 1 ? (
              <button
                onClick={nextTutorialStep}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold rounded flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Siguiente paso</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={endTutorial}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded flex items-center gap-1 cursor-pointer"
              >
                <span>¡Finalizar tutorial!</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
