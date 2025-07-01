import React, { useCallback, useState, useEffect } from 'react';
import { Plus, FolderPlus, Save, Loader2, ChevronDown } from 'lucide-react';
import { PLCStep } from '../../types/plc-types';
import { usePLCContext } from './PLCProvider';
import StepComponent from './StepComponent';
import GroupStepComponent from './GroupStepComponent';
import ErrorBoundary from './ErrorBoundary';

interface LadderLogicEditorProps {
  className?: string;
  onSave?: (steps: PLCStep[]) => void;
}

const LadderLogicEditor: React.FC<LadderLogicEditorProps> = ({
  className = '',
  onSave,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { steps, handlers } = usePLCContext();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddStep = useCallback(() => {
    handlers.addStep('OUTPUT');
  }, [handlers]);

  const handleAddGroup = useCallback(() => {
    handlers.addGroup();
  }, [handlers]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading ladder logic editor...</span>
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-800 font-medium">Error in Ladder Logic Editor</h3>
          <p className="text-red-700 text-sm mt-1">
            The ladder logic editor encountered an error. Please try refreshing the page.
          </p>
        </div>
      }
    >
      <div className={`p-4 sm:p-6 bg-gray-50 min-h-screen ${className}`}>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">PLC:</span>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm">Default <ChevronDown className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">No. of Steps:</span>
              <span className="px-3 py-1.5 bg-blue-100 text-blue-800 font-semibold rounded-md text-sm">{steps.length}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Save Recipe</button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Load Recipe</button>
            <button className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 flex items-center gap-2">Export / Transfer <ChevronDown className="w-4 h-4" /></button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700">Update IO List</button>
            <button onClick={handleAddGroup} className="px-4 py-2 text-sm font-semibold text-white bg-pink-600 rounded-md hover:bg-pink-700">Add Group</button>
          </div>
        </div>

        {/* Project Selection */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Project Selection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <button className="w-full flex items-center justify-between text-left gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md">Default Project <ChevronDown className="w-4 h-4" /></button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <button className="w-full flex items-center justify-between text-left gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md">Default Company <ChevronDown className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Ladder Logic Steps */}
        <div className="space-y-2">
          {steps.map((step) => {
            if (step.type === 'GROUP') {
              return <GroupStepComponent key={step.id} step={step} />;
            }
            return <StepComponent key={step.id} step={step} />;
          })}
        </div>
        
        {/* Add Step Button at the bottom */}
        <div className="mt-4">
            <button
              onClick={handleAddStep}
              className="flex items-center px-3 py-1.5 text-sm bg-white border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Step
            </button>
        </div>

      </div>
    </ErrorBoundary>
  );
};

export default LadderLogicEditor;
