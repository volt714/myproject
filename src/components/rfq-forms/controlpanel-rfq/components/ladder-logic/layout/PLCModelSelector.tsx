import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export type PLCModel = 'Default' | 'Codesys' | 'Omron' | 'Raspberry Pi';

interface PLCModelSelectorProps {
  selectedModel: PLCModel;
  onModelChange: (model: PLCModel) => void;
}

const PLCModelSelector: React.FC<PLCModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (model: PLCModel) => {
    onModelChange(model);
    setIsOpen(false);
  };

  const models: PLCModel[] = ['Default', 'Codesys', 'Omron', 'Raspberry Pi'];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span>PLC: {selectedModel}</span>
        <ChevronDown className="w-5 h-5 ml-2 -mr-1 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {models.map((model) => (
              <button
                key={model}
                onClick={() => handleSelect(model)}
                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
              >
                {model}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PLCModelSelector; 