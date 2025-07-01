import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PLCStep, InstructionType, LogicalOperator, IOPoint, PLCElement, TimerUnit } from '../../types/plc-types';

// --- Helper Functions for deep state manipulation ---

const mapStepsRecursively = (
  steps: PLCStep[],
  callback: (step: PLCStep) => PLCStep
): PLCStep[] => {
  return steps.map((step) => {
    const newStep = { ...step };
    if (newStep.groupSteps) {
      newStep.groupSteps = mapStepsRecursively(newStep.groupSteps, callback);
    }
    return callback(newStep);
  });
};

const updateStepRecursively = (
  steps: PLCStep[],
  id: string,
  updateFn: (step: PLCStep) => PLCStep
): PLCStep[] => {
  return steps.map((step) => {
    if (step.id === id) {
      return updateFn(step);
    }
    if (step.groupSteps) {
      return {
        ...step,
        groupSteps: updateStepRecursively(step.groupSteps, id, updateFn),
      };
    }
    return step;
  });
};

// --- Context Type Definitions ---

interface StepHandlers {
  toggleElementValue: (stepId: string, elementIndex: number, value: boolean) => void;
  updateStepOperator: (id: string, index: number, operator: LogicalOperator) => void;
  updateElementIOPoint: (stepId: string, elementIndex: number, ioPoint: IOPoint) => void;
  toggleLabelDropdown: (stepId: string, dropdownKey: string) => void;
  updateElementUnit: (stepId: string, elementIndex: number, unit: TimerUnit) => void;
  updateLoopStart: (id: string, count: number) => void;
  updateElementCount: (id: string, count: number) => void;
}

interface PLCContextType {
  steps: PLCStep[];
  ioList: IOPoint[];
  config: {
    instructions: string[];
    logicalOperators: string[];
    timerUnits: string[];
  };
  handlers: {
    addStep: (type: InstructionType | string, parentId?: string) => void;
    removeStep: (id: string) => void;
    addGroup: () => void;
    addStepToGroup: (groupId: string) => void;
    updateGroupName: (id: string, name: string) => void;
    toggleStepDropdown: (id: string) => void;
    updateStepType: (id: string, newType: InstructionType) => void;
    updateStepValue: (id: string, value: any, elementId?: string) => void;
    setSteps: (steps: PLCStep[]) => void;
  };
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

// --- Provider Component ---

interface PLCProviderProps {
  children: ReactNode;
  initialSteps?: PLCStep[];
  ioList?: IOPoint[];
  onProgramChange?: (steps: PLCStep[]) => void;
}

export const PLCProvider: React.FC<PLCProviderProps> = ({
  children,
  initialSteps = [],
  ioList = [],
  onProgramChange,
}) => {
  const [steps, setSteps] = useState<PLCStep[]>(initialSteps);

  useEffect(() => {
    setSteps(initialSteps);
  }, [initialSteps]);

  const handleProgramChange = useCallback((newSteps: PLCStep[]) => {
    if (onProgramChange) {
      onProgramChange(newSteps);
    }
  }, [onProgramChange]);

  // --- Handlers ---

  const addStep = (type: InstructionType | string, parentId?: string) => {
    const newElement: PLCElement = {
        id: uuidv4(),
        type: 'CONTACT',
        label: 'New Element',
        value: false,
    };

    const newStep: PLCStep = {
      id: uuidv4(),
      stepNumber: 0, // Will be renumbered
      type: type as InstructionType,
      enabled: true,
      elements: type === 'GROUP' ? [] : [newElement],
      ...(type === 'DELAY' && { value: 1000, unit: 'ms' }),
      ...(type === 'LOOP START' && { loopStart: 0 }),
    };

    let newSteps;
    if (parentId) {
      newSteps = updateStepRecursively(steps, parentId, (group) => ({
        ...group,
        groupSteps: [...(group.groupSteps || []), newStep],
      }));
    } else {
      newSteps = [...steps, newStep];
    }

    // Renumber all steps
    let counter = 1;
    const renumberedSteps = mapStepsRecursively(newSteps, (step) => ({
      ...step,
      stepNumber: counter++,
    }));

    setSteps(renumberedSteps);
    handleProgramChange(renumberedSteps);
  };

  const removeStep = (id: string) => {
    const removeRecursively = (stepsToRemoveFrom: PLCStep[]): PLCStep[] => {
      return stepsToRemoveFrom.filter(step => {
        if (step.id === id) return false;
        if (step.groupSteps) {
          step.groupSteps = removeRecursively(step.groupSteps);
        }
        return true;
      });
    };
    const newSteps = removeRecursively([...steps]);
    setSteps(newSteps);
    handleProgramChange(newSteps);
  };

  const addGroup = () => addStep('GROUP');
  const addStepToGroup = (groupId: string) => addStep('OUTPUT', groupId);

  const updateStepProperty = (id: string, props: Partial<PLCStep>) => {
    const newSteps = updateStepRecursively(steps, id, (step) => ({ ...step, ...props }));
    setSteps(newSteps);
    handleProgramChange(newSteps);
  };

  const updateGroupName = (id: string, name: string) => updateStepProperty(id, { groupName: name });
  const updateStepType = (id: string, newType: InstructionType) => updateStepProperty(id, { type: newType, showDropdown: false });
  const toggleStepDropdown = (id: string) => {
    const newSteps = mapStepsRecursively(steps, (step) => ({
      ...step,
      showDropdown: step.id === id ? !step.showDropdown : false,
    }));
    setSteps(newSteps);
  };

  const updateStepValue = (stepId: string, value: any, elementId?: string) => {
      const newSteps = updateStepRecursively(steps, stepId, (step) => {
          const newElements = step.elements.map(el => {
              if (!elementId || el.id === elementId) {
                  return {...el, value: value};
              }
              return el;
          });
          return {...step, elements: newElements};
      });
      setSteps(newSteps);
      handleProgramChange(newSteps);
  };
  
  const toggleElementValue = (stepId: string, elementIndex: number, value: boolean) => {
    const newSteps = updateStepRecursively(steps, stepId, (step) => {
      const newElements = [...step.elements];
      if (newElements[elementIndex]) {
        newElements[elementIndex] = { ...newElements[elementIndex], value };
      }
      return { ...step, elements: newElements };
    });
    setSteps(newSteps);
    handleProgramChange(newSteps);
  };

  const updateStepOperator = (id: string, index: number, operator: LogicalOperator) => {
    const newSteps = updateStepRecursively(steps, id, (step) => {
      const newOperators = [...(step.operators || [])];
      newOperators[index] = operator;
      return { ...step, operators: newOperators };
    });
    setSteps(newSteps);
    handleProgramChange(newSteps);
  };

  const updateElementIOPoint = (stepId: string, elementIndex: number, ioPoint: IOPoint) => {
    const newSteps = updateStepRecursively(steps, stepId, (step) => {
      const newElements = [...step.elements];
      if (newElements[elementIndex]) {
        newElements[elementIndex] = {
          ...newElements[elementIndex],
          label: ioPoint.name,
          ioPointId: ioPoint.id,
        };
      }
      return { ...step, elements: newElements };
    });
    setSteps(newSteps);
    handleProgramChange(newSteps);
  };

  const toggleLabelDropdown = (stepId: string, dropdownKey: string) => {
    const newSteps = updateStepRecursively(steps, stepId, (step) => ({
      ...step,
      [dropdownKey]: !step[dropdownKey],
    }));
    setSteps(newSteps);
  };

  const updateElementUnit = (stepId: string, elementIndex: number, unit: TimerUnit) => {
    const newSteps = updateStepRecursively(steps, stepId, (step) => {
      const newElements = [...step.elements];
      if (newElements[elementIndex]) {
        newElements[elementIndex] = {
          ...newElements[elementIndex],
          unit: unit,
        };
      }
      return { ...step, elements: newElements };
    });
    setSteps(newSteps);
    handleProgramChange(newSteps);
  };

  const updateLoopStart = (id: string, count: number) => {
    updateStepProperty(id, { loopStart: count });
  };

  const updateElementCount = (id: string, count: number) => {
    const newSteps = updateStepRecursively(steps, id, (step) => {
      const currentCount = step.elements.length;
      let newElements = [...step.elements];

      if (count > currentCount) {
        for (let i = 0; i < count - currentCount; i++) {
          newElements.push({ 
            id: uuidv4(), 
            label: `I/O ${currentCount + i + 1}`, 
            value: false,
            type: step.type === 'INPUT' ? 'INPUT' : 'OUTPUT',
          });
        }
      } else if (count < currentCount) {
        newElements = newElements.slice(0, count);
      }

      return { ...step, elements: newElements };
    });

    setSteps(newSteps);
    handleProgramChange(newSteps);
  };

  const contextValue: PLCContextType = {
    steps,
    ioList,
    config: {
      instructions: ['INPUT', 'OUTPUT', 'TIMER', 'GROUP', 'DELAY', 'LOOP START', 'LOOP END'],
      logicalOperators: ['AND', 'OR'],
      timerUnits: ['ms', 's'],
    },
    handlers: {
      addStep,
      removeStep,
      addGroup,
      addStepToGroup,
      updateGroupName,
      toggleStepDropdown,
      updateStepType,
      updateStepValue,
      setSteps,
    },
    stepHandlers: {
      toggleElementValue,
      updateStepOperator,
      updateElementIOPoint,
      toggleLabelDropdown,
      updateElementUnit,
      updateLoopStart,
      updateElementCount,
    },
  };

  return (
    <PLCContext.Provider value={contextValue}>
      {children}
    </PLCContext.Provider>
  );
};
