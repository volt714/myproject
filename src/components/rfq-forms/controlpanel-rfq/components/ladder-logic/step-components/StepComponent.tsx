import React from 'react';
import { PLCStep, InstructionType } from '../../../types/plc-types';
import DelayStepComponent from './DelayStepComponent';
import InstructionStepComponent from './InstructionStepComponent';
import LoopStepComponent from './LoopStepComponent';
import StepControls from './StepControls';
import { usePLCContext } from '../context/PLCProvider';

interface StepComponentProps {
  step: PLCStep;
}

const StepComponent: React.FC<StepComponentProps> = ({ step }) => {
  const { handlers } = usePLCContext();
  const { addStep, removeStep } = handlers;

  const renderStepContent = () => {
    switch (step.type) {
      case InstructionType.DELAY:
        return <DelayStepComponent step={step} />;
      case InstructionType.LOOP_START:
      case InstructionType.LOOP_END:
        return <LoopStepComponent step={step} />;
      default:
        return <InstructionStepComponent step={step} />;
    }
  };

  // This function adapts the context's 'addStep' to the signature expected by 'StepControls'.
  // It ignores the 'id' from StepControls and adds a default instruction type.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddStep = (_id: string) => {
    addStep(InstructionType.XIC); // Add a default XIC instruction.
  };

  return (
    <div className="flex items-center mb-4 min-h-[60px] relative group">
      <div className="w-8 text-center font-semibold text-gray-500">{step.stepNumber}.</div>
      <StepControls stepId={step.id} addStep={handleAddStep} removeStep={removeStep} />
      <div className="flex items-center space-x-2 flex-1">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default StepComponent;
