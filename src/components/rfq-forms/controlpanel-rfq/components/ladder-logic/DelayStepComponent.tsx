import React from 'react';
import { ChevronDown } from 'lucide-react';
import { PLCStep, InstructionType, TimerUnit } from '../../types/plc-types';
import { usePLCContext } from './PLCProvider';

interface DelayStepProps {
  step: PLCStep;
}

const DelayStepComponent: React.FC<DelayStepProps> = ({ step }) => {
  const { config, handlers, stepHandlers } = usePLCContext();
  const { instructions, timerUnits } = config;
  const { toggleStepDropdown, updateStepType, updateStepValue } = handlers;
  const { updateElementUnit } = stepHandlers;

  const delayTime = (step.elements[0]?.value as number) || 0;
  const timeUnit = (step.elements[0]?.unit as TimerUnit) || 'ms';
  const [showTimeUnitDropdown, setShowTimeUnitDropdown] = React.useState(false);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      updateStepValue(step.id, value, step.elements[0]?.id);
    }
  };

  const handleTimeUnitChange = (unit: TimerUnit) => {
    updateElementUnit(step.id, 0, unit);
    setShowTimeUnitDropdown(false);
  };

  return (
    <div className="flex items-center space-x-2 flex-1">
      <div className="relative">
        <button
          onClick={() => toggleStepDropdown(step.id)}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium flex items-center space-x-1 hover:bg-blue-200"
        >
          <span>{step.type || 'DELAY'}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
        {step.showDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 min-w-[120px]">
            {instructions
              .filter(inst => inst === 'DELAY')
              .map((instruction) => (
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
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 min-w-[60px]">
            {timerUnits.map((unit) => (
              <button
                key={unit}
                onClick={() => handleTimeUnitChange(unit as TimerUnit)}
                className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${timeUnit === unit ? 'bg-blue-50 text-blue-700' : ''}`}>
                {unit}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DelayStepComponent;
