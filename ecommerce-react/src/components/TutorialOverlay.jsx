import React from 'react';
import Spotlight from './Spotlight';  // Import subcomponent
import InstructionBox from './InstructionBox';  // Import subcomponent

export default function TutorialOverlay({ steps, currentStep, onNext, onSkip, isLastStep , onPrev}) {
  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-70  ">
      
      <Spotlight targetSelector={step.targetSelector} />
      <InstructionBox
  text={step.text}
  onNext={onNext}
  onPrev={onPrev}
  onSkip={onSkip}
  isLastStep={isLastStep}
  isFirstStep={currentStep === 0}
/>
    </div>
  );
}