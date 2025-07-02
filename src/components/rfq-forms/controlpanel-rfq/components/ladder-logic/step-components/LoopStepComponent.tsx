import React from 'react';
import { ChevronDown } from 'lucide-react';
import { PLCStep, InstructionType } from '@/components/rfq-forms/controlpanel-rfq/types/plc-types';
import { usePLCContext } from '@/components/rfq-forms/controlpanel-rfq/components/ladder-logic/PLCProvider';

interface LoopStepProps {
  step: PLCStep;
}

const LoopStepComponent: React.FC<LoopStepProps> = ({
  step,
}) => {
  const { config, handlers, stepHandlers } = usePLCContext();
  const { instructions } = config;
  const { toggleStepDropdown, updateStepType } = handlers;
  const { updateLoopStart } = stepHandlers;
  const countValue = (step.elements[0]?.value as number) || 0;

  const handleLoopStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) {
      value = 0;
    }
    updateLoopStart(step.id, value);
  };

  return (
    <div className="flex items-center space-x-4 w-full">
      <div className="relative">
        <button
          onClick={() => toggleStepDropdown(step.id)}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium flex items-center space-x-1 hover:bg-blue-200"
        >
          <span>{step.type}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
        {step.showDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[120px]">
            {instructions.filter(i => i.startsWith('LOOP')).map((instruction) => (
              <button
                key={instruction}
                onClick={() => updateStepType(step.id, instruction as InstructionType)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
              >
                {instruction}
              </button>
            ))}
          </div>
        )}
      </div>

      {step.type === 'LOOP_START' && (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Cycle Count</span>
          <input
            type="number"
            min={0}
            value={step.loopStart || 0}
            onChange={handleLoopStartChange}
            className="px-3 py-1 bg-cyan-200 border-gray-300 rounded text-sm font-medium w-24"
          />
        </div>
      )}
    </div>
  );
};

export default LoopStepComponent;
