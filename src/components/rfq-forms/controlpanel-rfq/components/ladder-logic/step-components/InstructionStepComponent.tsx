import React from 'react';
import { ChevronDown } from 'lucide-react';
import { PLCStep, InstructionType, LogicalOperator } from '@/components/rfq-forms/controlpanel-rfq/types/plc-types';
import { usePLCContext } from '@/components/rfq-forms/controlpanel-rfq/components/ladder-logic/PLCProvider';

interface InstructionStepProps {
  step: PLCStep;
}

const InstructionStepComponent: React.FC<InstructionStepProps> = ({ step }) => {
  const { config, handlers, stepHandlers, ioList } = usePLCContext();
  const { instructions, logicalOperators } = config;
  const { 
    toggleStepDropdown, 
    updateStepType, 
  } = handlers;
  const { 
    updateStepOperator, 
    updateElementIOPoint, 
    toggleLabelDropdown,
    updateElementCount,
    toggleElementValue
  } = stepHandlers;

  const availableIOPoints = ioList.filter(p => p.type === step.type);

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    if (!isNaN(count) && count >= 0) {
      updateElementCount(step.id, count);
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative">
        <button
          onClick={() => toggleStepDropdown(step.id)}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium flex items-center gap-1 hover:bg-blue-200 min-w-[120px] justify-between"
        >
          <span>{step.type}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        {step.showDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 min-w-[120px]">
            {instructions
              .filter(inst => ['INPUT', 'OUTPUT'].includes(inst))
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
        value={step.elements.length}
        onChange={handleCountChange}
        className="w-16 mx-2 px-2 py-1 border border-gray-300 rounded text-center"
        min="0"
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 ml-2 flex-1">
        {step.elements.map((element, index) => (
          <React.Fragment key={element.id}>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  onClick={() => toggleLabelDropdown(step.id, `showLabelDropdown-element-${element.id}`)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium flex items-center space-x-1 hover:bg-gray-300 min-w-[120px] justify-between"
                >
                  <span>{element.label}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {step[`showLabelDropdown-element-${element.id}`] && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-full">
                    {availableIOPoints.map((ioPoint) => (
                      <button
                        key={ioPoint.id}
                        onClick={() => {
                          updateElementIOPoint(step.id, index, ioPoint);
                          toggleLabelDropdown(step.id, `showLabelDropdown-element-${element.id}`);
                        }}
                        className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        {ioPoint.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => toggleElementValue(step.id, index, !element.value)}
                className={`px-3 py-1 rounded text-sm font-medium ${element.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {element.value ? 'ON' : 'OFF'}
              </button>
            </div>

            {step.type === 'INPUT' && index < step.elements.length - 1 && (
              <div className="relative ml-2">
                <select
                  value={step.operators?.[index] || 'AND'}
                  onChange={(e) => updateStepOperator(step.id, index, e.target.value as LogicalOperator)}
                  className="px-2 py-1 border border-gray-300 rounded-md bg-white text-sm"
                >
                  {logicalOperators.map(op => <option key={op} value={op}>{op}</option>)}
                </select>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default InstructionStepComponent;
