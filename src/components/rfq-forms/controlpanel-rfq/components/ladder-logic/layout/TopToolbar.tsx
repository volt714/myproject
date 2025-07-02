import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import PLCModelSelector, { PLCModel } from './PLCModelSelector';

export type ExportFormat = 'notes' | 'excel' | 'mysql';

interface TopToolbarProps {
  stepCount: number;
  onIOListClick: () => void;
  onAddGroup: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExport: (format: ExportFormat) => void;
  selectedPlcModel: PLCModel;
  onPlcModelChange: (model: PLCModel) => void;
}

const TopToolbar: React.FC<TopToolbarProps> = ({
  stepCount,
  onIOListClick,
  onAddGroup,
  onSave,
  onLoad,
  onExport,
  selectedPlcModel,
  onPlcModelChange,
}) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportClick = (format: ExportFormat) => {
    onExport(format);
    setIsExportMenuOpen(false);
  };

  return (
    <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b p-4 flex items-center justify-between shadow-lg z-50">
      <div className="flex items-center space-x-4">
        <PLCModelSelector selectedModel={selectedPlcModel} onModelChange={onPlcModelChange} />
        <div className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium">
          No. of Steps: {stepCount}
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button 
          onClick={onSave}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium"
        >
          Save Recipe
        </button>
        <button 
          onClick={onLoad}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
        >
          Load Recipe
        </button>
        
        <div className="relative" ref={exportMenuRef}>
          <button
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium flex items-center"
          >
            Export / Transfer <ChevronDown className="w-4 h-4 ml-1" />
          </button>
          {isExportMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
              <button
                onClick={() => handleExportClick('notes')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Export to Notes
              </button>
              <button
                onClick={() => handleExportClick('excel')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Export to Excel
              </button>
              <button
                onClick={() => handleExportClick('mysql')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Export to MySQL DB
              </button>
            </div>
          )}
        </div>

        <button 
          onClick={onIOListClick}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium"
        >
          Update IO List
        </button>
        <button 
          onClick={onAddGroup}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded text-sm font-medium"
        >
          Add Group
        </button>
      </div>
    </div>
  );
};

export default TopToolbar;