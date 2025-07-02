import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Trash2, ChevronRight, ChevronUp } from 'lucide-react';
import { PLCStep, InstructionType } from '../types/plc';
import StepComponent from './StepComponent';
import { usePLCContext } from '../context/PLCContext';

interface GroupStepProps {
  step: PLCStep;
  isReadOnly?: boolean;
}

const GroupStepComponent: React.FC<GroupStepProps> = ({
  step,
  isReadOnly = false
}) => {
  const { config, handlers } = usePLCContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isGroupNameFocused, setIsGroupNameFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const groupNameRef = useRef<HTMLInputElement>(null);

  const stepCount = step.groupSteps?.length || 0;
  const hasSteps = stepCount > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (step.showDropdown) {
          handlers.toggleStepDropdown(step.id);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [step.showDropdown, handlers, step.id]);

  // Handle keyboard navigation in dropdown
  const handleDropdownKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handlers.toggleStepDropdown(step.id);
    }
  };

  const handleGroupNameKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      groupNameRef.current?.blur();
    }
  };

  const confirmRemoveGroup = () => {
    if (hasSteps) {
      const confirmed = window.confirm(
        `Are you sure you want to remove this group and all ${stepCount} steps inside it?`
      );
      if (!confirmed) return;
    }
    handlers.removeStep(step.id);
  };

  return (
    <div className="border-l-4 border-blue-500 bg-blue-50/30 rounded-r-lg mb-4">
      {/* Group Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-transparent">
        <div className="flex items-center space-x-3">
          {/* Collapse/Expand Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-blue-100 rounded transition-colors"
            aria-label={isCollapsed ? 'Expand group' : 'Collapse group'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-blue-600" />
            ) : (
              <ChevronUp className="w-4 h-4 text-blue-600" />
            )}
          </button>

          {/* Step Type Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => handlers.toggleStepDropdown(step.id)}
              onKeyDown={handleDropdownKeyDown}
              disabled={isReadOnly}
              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm font-medium flex items-center space-x-1 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-haspopup="listbox"
              aria-expanded={step.showDropdown}
            >
              <span>{step.type}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {step.showDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-[140px]">
                {config.instructions.map((instruction: string, index: number) => (
                  <button
                    key={instruction}
                    onClick={() => {
                      handlers.updateStepType(step.id, instruction as InstructionType);
                      handlers.toggleStepDropdown(step.id);
                    }}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none first:rounded-t-md last:rounded-b-md"
                    role="option"
                    aria-selected={instruction === step.type}
                    tabIndex={index}
                  >
                    {instruction}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Group Name Input */}
          <div className="relative">
            <input
              ref={groupNameRef}
              type="text"
              value={step.groupName || ''}
              onChange={(e) => handlers.updateGroupName(step.id, e.target.value)}
              onFocus={() => setIsGroupNameFocused(true)}
              onBlur={() => setIsGroupNameFocused(false)}
              onKeyDown={handleGroupNameKeyDown}
              disabled={isReadOnly}
              className={`px-3 py-1.5 border rounded-md text-sm transition-all duration-200 ${
                isGroupNameFocused 
                  ? 'border-blue-400 ring-2 ring-blue-100' 
                  : 'border-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
              placeholder="Group Name"
              aria-label="Group name"
            />
          </div>

          {/* Step Count Badge */}
          <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            {stepCount} step{stepCount !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlers.addStepToGroup(step.id)}
            disabled={isReadOnly}
            className="px-3 py-1.5 bg-green-500 text-white rounded-md text-sm font-medium flex items-center space-x-1 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Add step to group"
          >
            <Plus className="w-4 h-4" />
            <span>Add Step</span>
          </button>
          
          {!isReadOnly && (
            <button
              onClick={confirmRemoveGroup}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
              aria-label="Remove group"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Group Steps */}
      {!isCollapsed && (
        <div className="pl-6 pr-4 pb-4">
          {hasSteps ? (
            <div className="space-y-2">
              {step.groupSteps?.map((groupStep, index) => (
                <div key={groupStep.id} className="relative">
                  {/* Step Index Indicator */}
                  <div className="absolute -left-6 top-3 w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  
                  <StepComponent
                    key={groupStep.id}
                    step={groupStep}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="mb-2">No steps in this group</div>
              <button
                onClick={() => handlers.addStepToGroup(step.id)}
                disabled={isReadOnly}
                className="text-blue-500 hover:text-blue-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add your first step
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupStepComponent;