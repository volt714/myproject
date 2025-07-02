import React from 'react';
import { ChevronDown } from 'lucide-react';
import { PLCStep, InstructionType, LogicalOperator } from '../types/plc';
import { usePLCContext } from '../context/PLCContext';

interface InstructionStepProps {
  step: PLCStep;
}

export const InstructionStepComponent: React.FC<InstructionStepProps> = ({
  step,
}) => {
  const { config, handlers, stepHandlers } = usePLCContext();
  const { 
    instructions, 
    labelOptions, 
    logicalOperators 
  } = config;
  const {
    toggleStepDropdown,
    updateStepType,
  } = handlers;
  const {
    toggleLabelDropdown,
    updateStepLabel,
    updateElementCount,
    toggleElementValue,
    updateStepOperator,
  } = stepHandlers;

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    if (!isNaN(count) && count >= 0) {
      updateElementCount(step.id, count);
    }
  };

  return (
    <>
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
        value={step.elements.length}
        onChange={handleCountChange}
        className="w-16 mx-2 px-2 py-1 border border-gray-300 rounded text-center"
        min="0"
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 ml-2">
        {step.elements.map((element, index) => (
          <React.Fragment key={element.id}>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  onClick={() => toggleLabelDropdown(step.id, `showLabelDropdown-${index}`)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium flex items-center space-x-1 hover:bg-gray-300"
                >
                  <span>{element.label}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {step[`showLabelDropdown-${index}`] && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[120px]">
                    {labelOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => updateStepLabel(step.id, `elements[${index}][label]`, option)}
                        className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div
                onClick={() => toggleElementValue(step.id, element.id)}
                className={`w-5 h-5 rounded cursor-pointer ${
                  element.value ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </div>

            {step.type === 'INPUT' && step.operators && index < step.elements.length - 1 && (
              <div className="relative">
                <button
                  onClick={() => toggleLabelDropdown(step.id, `showOperatorDropdown-${index}`)}
                  className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm font-medium flex items-center space-x-1 hover:bg-orange-200"
                >
                  <span>{step.operators[index]}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {step[`showOperatorDropdown-${index}`] && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[120px]">
                    {logicalOperators.map((operator) => (
                      <button
                        key={operator}
                        onClick={() => updateStepOperator(step.id, index, operator as LogicalOperator)}
                        className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        {operator}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default InstructionStepComponent;
