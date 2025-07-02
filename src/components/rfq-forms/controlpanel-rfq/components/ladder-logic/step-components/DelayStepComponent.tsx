import React from 'react';
import { ChevronDown } from 'lucide-react';
import { PLCStep, InstructionType } from '../types/plc';
import { usePLCContext } from '../context/PLCContext';

interface DelayStepProps {
  step: PLCStep;
}

type TimeUnit = 'ms' | 'sec' | 'min';

const DelayStepComponent: React.FC<DelayStepProps> = ({
  step,
}) => {
  const { config, handlers, stepHandlers } = usePLCContext();
  const { instructions } = config;
  const { toggleStepDropdown, updateStepType } = handlers;
  const { updateStepValue, updateTimeUnit } = stepHandlers;

  const delayTime = (step.elements[0]?.value as number) || 0;
  const timeUnit = (step.elements[0]?.unit as TimeUnit) || 'ms';
  const [showTimeUnitDropdown, setShowTimeUnitDropdown] = React.useState(false);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      updateStepValue(step.id, value);
    }
  };

  const handleTimeUnitChange = (unit: TimeUnit) => {
    updateTimeUnit(step.id, unit);
    setShowTimeUnitDropdown(false);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => toggleStepDropdown(step.id)}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium flex items-center space-x-1 hover:bg-blue-200"
        >
          <span>{step.type || 'DELAY'}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
        {step.showDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[120px]">
            {instructions.map((instruction) => (
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
      
      <input
        type="number"
        value={delayTime}
        onChange={handleValueChange}
        className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium w-24"
      />
      <div className="relative">
        <button
          onClick={() => setShowTimeUnitDropdown(!showTimeUnitDropdown)}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium flex items-center space-x-1 hover:bg-gray-300 min-w-[60px]"
        >
          <span>{timeUnit}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
        {showTimeUnitDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[60px]">
            {(['ms', 'sec', 'min'] as TimeUnit[]).map((unit) => (
              <button
                key={unit}
                onClick={() => handleTimeUnitChange(unit)}
                className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                  timeUnit === unit ? 'bg-blue-50 text-blue-700' : ''
                }`}
              >
                {unit}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DelayStepComponent;