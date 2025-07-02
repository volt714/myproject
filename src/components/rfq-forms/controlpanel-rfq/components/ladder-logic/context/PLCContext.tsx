import React, { createContext, useContext } from 'react';
import { PLCStep, InstructionType, LogicalOperator } from '../types/plc';

interface GroupStepConfig {
  instructions: string[];
  labelOptions: string[];
  logicalOperators: string[];
}

interface GroupStepHandlers {
  toggleStepDropdown: (id: string) => void;
  updateStepType: (id: string, newType: InstructionType) => void;
  addStep: (id: string) => void;
  removeStep: (id: string) => void;
  updateGroupName: (id: string, name: string) => void;
  addStepToGroup: (groupId: string) => void;
  removeStepFromGroup: (groupId: string, stepId: string) => void;
}

interface StepHandlers {
  toggleLabelDropdown: (id: string, field: string) => void;
  updateStepLabel: (id: string, field: string, newLabel: string) => void;
  updateStepValue: (id: string, value: number) => void;
  updateTimeUnit: (id: string, unit: 'ms' | 'sec' | 'min') => void;
  updateElementCount: (id: string, count: number) => void;
  toggleElementValue: (stepId: string, elementId: string) => void;
  updateStepOperator: (id: string, index: number, operator: LogicalOperator) => void;
  updateLoopStart: (id: string, startStep: number) => void;
  updateLoopEnd: (id: string, endStep: number) => void;
}

interface PLCContextType {
  config: GroupStepConfig;
  handlers: GroupStepHandlers;
  stepHandlers: StepHandlers;
}

const PLCContext = createContext<PLCContextType | undefined>(undefined);

export const usePLCContext = () => {
  const context = useContext(PLCContext);
  if (!context) {
    throw new Error('usePLCContext must be used within a PLCProvider');
  }
  return context;
};

export default PLCContext; 