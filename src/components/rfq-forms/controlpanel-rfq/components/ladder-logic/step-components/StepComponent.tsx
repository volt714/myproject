import React from 'react';
import { PLCStep } from '../types/plc';
import DelayStepComponent from './DelayStepComponent';
import InstructionStepComponent from './InstructionStepComponent';
import LoopStepComponent from './CountStepComponent';
import StepControls from './StepControls';
import { usePLCContext } from '../context/PLCContext';

interface StepComponentProps {
  step: PLCStep;
}

const StepComponent: React.FC<StepComponentProps> = ({ step }) => {
  const { handlers } = usePLCContext();
  const { addStep, removeStep } = handlers;

  const renderStepContent = () => {
    switch (step.type) {
      case 'DELAY':
        return <DelayStepComponent step={step} />;
      case 'LOOP START':
      case 'LOOP END':
        return <LoopStepComponent step={step} />;
      default:
        return <InstructionStepComponent step={step} />;
    }
  };

  return (
    <div className="flex items-center mb-4 min-h-[60px] relative">
      <div className="w-8 text-center font-semibold text-gray-500">{step.stepNumber}.</div>
      <StepControls stepId={step.id} addStep={addStep} removeStep={removeStep} />
      <div className="flex items-center space-x-2 flex-1">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default StepComponent;
