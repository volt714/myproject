import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PLCStep, InstructionType, LogicalOperator, IOPoint, PLCElement, TimerUnit, StructuralInstructionType } from '../../../types/plc-types';

// --- Helper Functions for deep state manipulation ---

const mapStepsRecursively = (
  steps: PLCStep[],
  callback: (step: PLCStep) => PLCStep
): PLCStep[] => {
  return steps.map((step) => {
    const newStep = { ...step };
    if (newStep.children) {
      newStep.children = mapStepsRecursively(newStep.children, callback);
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
    if (step.children) {
      return {
        ...step,
        children: updateStepRecursively(step.children, id, updateFn),
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
    instructionTypes: InstructionType[];
    logicalOperators: string[];
    timerUnits: string[];
  };
  handlers: {
    addStep: (type: InstructionType | StructuralInstructionType, parentId?: string) => void;
    removeStep: (id: string) => void;
    addGroup: () => void;
    addStepToGroup: (groupId: string) => void;
    updateGroupName: (id: string, name: string) => void;
    toggleStepDropdown: (id: string) => void;
    updateStepType: (id: string, newType: InstructionType) => void;
    updateStepValue: (
      id: string,
      value: boolean | number | string,
      elementId?: string
    ) => void;
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

  const addStep = useCallback((type: InstructionType | StructuralInstructionType, parentId?: string) => {
    const newElement: PLCElement = {
      id: uuidv4(),
      type: 'CONTACT',
      label: 'New Element',
      value: false,
    };

    const newStep: PLCStep = {
      id: uuidv4(),
      type: type,
      elements: type === 'GROUP' ? [] : [newElement],
      children: type === 'GROUP' ? [] : undefined,
    };

    let newSteps;
    if (parentId) {
      newSteps = updateStepRecursively(steps, parentId, (group) => ({
        ...group,
        children: [...(group.children || []), newStep],
      }));
    } else {
      newSteps = [...steps, newStep];
    }

    setSteps(newSteps);
    handleProgramChange(newSteps);
  }, [steps, handleProgramChange]);

  const removeStep = useCallback((id: string) => {
    const removeRecursively = (stepsToRemoveFrom: PLCStep[]): PLCStep[] => {
      return stepsToRemoveFrom.reduce((acc, step) => {
        if (step.id === id) {
          return acc;
        }
        if (step.children) {
          const newChildren = removeRecursively(step.children);
          acc.push({ ...step, children: newChildren });
        } else {
          acc.push(step);
        }
        return acc;
      }, [] as PLCStep[]);
    };
    const newSteps = removeRecursively(steps);
    setSteps(newSteps);
    handleProgramChange(newSteps);
  }, [steps, handleProgramChange]);

  const addGroup = useCallback(() => {
    addStep('GROUP');
  }, [addStep]);

  const addStepToGroup = useCallback((groupId: string) => {
    addStep(InstructionType.OTE, groupId);
  }, [addStep]);

  const updateStepProperty = useCallback((id: string, props: Partial<PLCStep>) => {
    const newSteps = updateStepRecursively(steps, id, (step) => ({ ...step, ...props }));
    setSteps(newSteps);
    handleProgramChange(newSteps);
  }, [steps, handleProgramChange]);

  const updateGroupName = useCallback((id: string, name: string) => {
    updateStepProperty(id, { name: name });
  }, [updateStepProperty]);

  const updateStepType = useCallback((id: string, newType: InstructionType) => {
    updateStepProperty(id, { type: newType, showDropdown: false });
  }, [updateStepProperty]);

  const toggleStepDropdown = useCallback((id: string) => {
    const newSteps = mapStepsRecursively(steps, (step) => ({
      ...step,
      showDropdown: step.id === id ? !step.showDropdown : false,
    }));
    setSteps(newSteps);
  }, [steps]);

  const updateStepValue = useCallback((stepId: string, value: boolean | number | string, elementId?: string) => {
      const newSteps = updateStepRecursively(steps, stepId, (step) => {
          const newElements = step.elements.map((el: PLCElement) => {
              if (!elementId || el.id === elementId) {
                  return {...el, value: value};
              }
              return el;
          });
          return {...step, elements: newElements};
      });
      setSteps(newSteps);
      handleProgramChange(newSteps);
  }, [steps, handleProgramChange]);
  
  const toggleElementValue = useCallback((stepId: string, elementIndex: number, value: boolean) => {
    const newSteps = updateStepRecursively(steps, stepId, (step) => {
      const newElements = [...step.elements];
      if (newElements[elementIndex]) {
        newElements[elementIndex] = { ...newElements[elementIndex], value };
      }
      return { ...step, elements: newElements };
    });
    setSteps(newSteps);
    handleProgramChange(newSteps);
  }, [steps, handleProgramChange]);

  const updateStepOperator = useCallback((id: string, index: number, operator: LogicalOperator) => {
    const newSteps = updateStepRecursively(steps, id, (step) => {
      const newOperators = [...(step.operators || [])];
      newOperators[index] = operator;
      return { ...step, operators: newOperators };
    });
    setSteps(newSteps);
    handleProgramChange(newSteps);
  }, [steps, handleProgramChange]);

  const updateElementIOPoint = useCallback((stepId: string, elementIndex: number, ioPoint: IOPoint) => {
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
  }, [steps, handleProgramChange]);

  const toggleLabelDropdown = useCallback((stepId: string, dropdownKey: string) => {
    const newSteps = updateStepRecursively(steps, stepId, (step) => ({
      ...step,
      [dropdownKey]: !step[dropdownKey],
    }));
    setSteps(newSteps);
  }, [steps]);

  const updateElementUnit = useCallback((stepId: string, elementIndex: number, unit: TimerUnit) => {
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
  }, [steps, handleProgramChange]);

  const updateLoopStart = useCallback((id: string, count: number) => {
    updateStepProperty(id, { loopStart: count });
  }, [updateStepProperty]);

  const updateElementCount = useCallback((id: string, count: number) => {
    const newSteps = updateStepRecursively(steps, id, (step) => {
      const currentCount = step.elements.length;
      let newElements = [...step.elements];

      if (count > currentCount) {
        for (let i = 0; i < count - currentCount; i++) {
          newElements.push({ 
            id: uuidv4(), 
            label: `I/O ${currentCount + i + 1}`, 
            value: false,
            type: step.type === InstructionType.XIC || step.type === InstructionType.XIO ? 'INPUT' : 'OUTPUT',
          });
        }
      } else if (count < currentCount) {
        newElements = newElements.slice(0, count);
      }

      return { ...step, elements: newElements };
    });

    setSteps(newSteps);
    handleProgramChange(newSteps);
  }, [steps, handleProgramChange]);

  const contextValue: PLCContextType = {
    steps,
    ioList,
    config: {
      instructions: Object.values(InstructionType).filter(
        (v) => typeof v === 'string'
      ),
      instructionTypes: Object.values(InstructionType).filter(
        (v) => typeof v === 'string'
      ) as InstructionType[],
      logicalOperators: Object.values(LogicalOperator).filter(
        (v) => typeof v === 'string'
      ),
      timerUnits: Object.values(TimerUnit).filter((v) => typeof v === 'string'),
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
      updateStepOperator,
      updateElementIOPoint,
      toggleLabelDropdown,
      updateElementUnit,
      updateLoopStart,
      updateElementCount,
      toggleElementValue,
    },
  };

  return (
    <PLCContext.Provider value={contextValue}>
      {children}
    </PLCContext.Provider>
  );
};
