import React from 'react';
import { Plus, X } from 'lucide-react';

interface StepControlsProps {
  stepId: string;
  addStep: (id: string) => void;
  removeStep: (id: string) => void;
}

const StepControls: React.FC<StepControlsProps> = ({ stepId, addStep, removeStep }) => {
  return (
    <div className="flex items-center space-x-2 mr-4 w-16">
      <button
        onClick={() => addStep(stepId)}
        className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold hover:bg-green-600"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        onClick={() => removeStep(stepId)}
        className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default StepControls;
