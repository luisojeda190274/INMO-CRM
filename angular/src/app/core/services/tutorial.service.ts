import { Injectable, signal, computed } from '@angular/core';
import { Tutorial, TutorialStep } from '../../models/tutorial.models';
import { TUTORIALS_DATA } from '../../data/tutorials-mock-data';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  readonly tutorials = signal<Tutorial[]>(TUTORIALS_DATA as unknown as Tutorial[]);
  readonly activeTutorialId = signal<string | null>(null);
  readonly currentStepIndex = signal<number>(0);
  readonly isAssistantOpen = signal<boolean>(false);

  readonly activeTutorial = computed(() => {
    const id = this.activeTutorialId();
    if (!id) return null;
    return this.tutorials().find(t => t.id === id) || null;
  });

  readonly currentStep = computed<TutorialStep | null>(() => {
    const tutorial = this.activeTutorial();
    if (!tutorial || !tutorial.steps.length) return null;
    const idx = this.currentStepIndex();
    return tutorial.steps[idx] || tutorial.steps[0];
  });

  startTutorial(tutorialId: string): void {
    const tut = this.tutorials().find(t => t.id === tutorialId);
    if (!tut) return;
    this.activeTutorialId.set(tutorialId);
    this.currentStepIndex.set(0);
    this.isAssistantOpen.set(true);
  }

  nextStep(): void {
    const tutorial = this.activeTutorial();
    if (!tutorial) return;
    if (this.currentStepIndex() < tutorial.steps.length - 1) {
      this.currentStepIndex.update(idx => idx + 1);
    } else {
      this.closeAssistant();
    }
  }

  prevStep(): void {
    if (this.currentStepIndex() > 0) {
      this.currentStepIndex.update(idx => idx - 1);
    }
  }

  goToStep(index: number): void {
    const tutorial = this.activeTutorial();
    if (!tutorial) return;
    if (index >= 0 && index < tutorial.steps.length) {
      this.currentStepIndex.set(index);
    }
  }

  closeAssistant(): void {
    this.isAssistantOpen.set(false);
    this.activeTutorialId.set(null);
    this.currentStepIndex.set(0);
  }
}
