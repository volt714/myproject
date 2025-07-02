import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PLCStep, InstructionType, LogicalOperator, IOPoint } from '../types/plc';
import { instructions, logicalOperators } from '../constants/plc';

// Helper function to recursively map over all steps
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

// Helper function to recursively update a single step
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

const initialSteps: PLCStep[] = [
  {
    id: uuidv4(),
    stepNumber: 1,
    type: 'OUTPUT',
    enabled: true,
    elements: [
      { id: uuidv4(), label: 'L_AC.Fwd', value: true },
    ],
  },
  {
    id: uuidv4(),
    stepNumber: 2,
    type: 'INPUT',
    enabled: true,
    elements: [
      { id: uuidv4(), label: 'L_AC.Fwd', value: true },
      { id: uuidv4(), label: 'Clam_Fwd', value: false },
    ],
    operators: ['AND'],
  },
  {
    id: uuidv4(),
    stepNumber: 3,
    type: 'DELAY',
    enabled: true,
    elements: [
      { id: uuidv4(), label: 'Delay', value: 50, unit: 'ms' },
    ],
  },
  {
    id: uuidv4(),
    stepNumber: 4,
    type: 'COUNT',
    enabled: true,
    elements: [{ id: uuidv4(), label: 'Count', value: 0 }],
    repeatCount: 10,
    startStep: 8,
  },
];

export const usePLCState = (
  initialState: PLCStep[] = initialSteps,
  dynamicLabelOptions: string[]
) => {
  const [steps, setSteps] = useState<PLCStep[]>(initialState);
  const [ioList, setIOList] = useState<IOPoint[]>([]);

  const addStepAtEnd = (type: InstructionType): void => {
    const newStep: PLCStep = {
      id: uuidv4(),
      stepNumber: steps.length + 1,
      type,
      enabled: true,
      elements: [],
    };

    if (type === 'LOOP START') {
      newStep.loopStart = 1;
      newStep.elements.push({ id: uuidv4(), label: 'Cycle Count', value: 0 });
    } else if (type === 'LOOP END') {
      newStep.loopEnd = 1;
      newStep.elements.push({ id: uuidv4(), label: 'Loop End', value: 0 });
    } else if (type === 'DELAY') {
      newStep.elements.push({ id: uuidv4(), label: 'Delay', value: 50, unit: 'ms' });
    } else if (type === 'INPUT' || type === 'OUTPUT') {
      newStep.elements.push({ id: uuidv4(), label: 'New_Label', value: true });
    } else if (type === 'GROUP') {
      newStep.groupName = 'New Group';
      newStep.groupSteps = [];
    }

    setSteps([...steps, newStep]);
  };

  const addStepAfter = (id: string) => {
    const index = steps.findIndex(step => step.id === id);
    if (index === -1) return;

    const newStep: PLCStep = {
      id: uuidv4(),
      stepNumber: 0, // Will be renumbered
      type: 'OUTPUT',
      enabled: true,
      elements: [{ id: uuidv4(), label: 'New_Label', value: true }],
    };
    
    const newSteps = [...steps];
    newSteps.splice(index + 1, 0, newStep);
    
    const renumberedSteps = newSteps.map((step, i) => ({
      ...step,
      stepNumber: i + 1,
    }));

    setSteps(renumberedSteps);
  };

  const addGroup = (): void => {
    addStepAtEnd('GROUP');
  };

  const removeStep = (id: string): void => {
    const newSteps = steps.filter((step) => step.id !== id);
    const renumberedSteps = newSteps.map((step, index) => ({
      ...step,
      stepNumber: index + 1,
    }));
    setSteps(renumberedSteps);
  };

  const toggleStepDropdown = (id: string): void => {
    setSteps((currentSteps) =>
      mapStepsRecursively(currentSteps, (step) => ({
        ...step,
        showDropdown: step.id === id ? !step.showDropdown : false,
      }))
    );
  };

  const toggleLabelDropdown = (id: string, field: string): void => {
    setSteps((currentSteps) =>
      mapStepsRecursively(currentSteps, (step) => {
        const newStep = { ...step };
        const isTargetStep = step.id === id;

        // Close all dropdowns
        Object.keys(newStep).forEach((key) => {
          if (key.startsWith('show')) {
            newStep[key] = false;
          }
        });

        if (isTargetStep) {
          newStep[field] = !step[field];
        }

        return newStep;
      })
    );
  };

  const updateStepType = (id: string, newType: InstructionType): void => {
    setSteps((currentSteps) =>
      updateStepRecursively(currentSteps, id, (step) => ({
        ...step,
        type: newType,
        showDropdown: false,
      }))
    );
  };

  const updateStepLabel = (id: string, field: string, newLabel: string): void => {
    const elementIndex = parseInt(field.substring(field.indexOf('[') + 1, field.indexOf(']')));

    setSteps((currentSteps) =>
      updateStepRecursively(currentSteps, id, (step) => {
        const newElements = [...step.elements];
        if (newElements[elementIndex]) {
          newElements[elementIndex] = { ...newElements[elementIndex], label: newLabel };
        }
        return {
          ...step,
          elements: newElements,
          [`showLabelDropdown-${elementIndex}`]: false,
        };
      })
    );
  };

  const updateStepValue = (id: string, value: number) => {
    setSteps((currentSteps) =>
      updateStepRecursively(currentSteps, id, (step) => {
        const newElements = [...step.elements];
        newElements[0] = { ...newElements[0], value };
        return { ...step, elements: newElements };
      })
    );
  };

  const updateTimeUnit = (id: string, unit: 'ms' | 'sec' | 'min') => {
    setSteps((currentSteps) =>
      updateStepRecursively(currentSteps, id, (step) => {
        if (step.type === 'DELAY') {
          const newElements = [...step.elements];
          newElements[0] = { ...newElements[0], unit };
          return { ...step, elements: newElements };
        }
        return step;
      })
    );
  };

  const updateElementCount = (id: string, count: number) => {
    setSteps((currentSteps) =>
      updateStepRecursively(currentSteps, id, (step) => {
        if (step.type === 'INPUT' || step.type === 'OUTPUT') {
          const currentCount = step.elements.length;
          const newElements = [...step.elements];
          const newOperators = step.operators ? [...step.operators] : [];

          if (count > currentCount) {
            for (let i = 0; i < count - currentCount; i++) {
              newElements.push({ id: uuidv4(), label: 'New_Label', value: true });
              if (newElements.length > 1) {
                newOperators.push('AND');
              }
            }
          } else if (count < currentCount) {
            newElements.splice(count);
            newOperators.splice(count - 1);
          }

          return { ...step, elements: newElements, operators: newOperators };
        }
        return step;
      })
    );
  };

  const toggleElementValue = (stepId: string, elementId: string) => {
    setSteps((currentSteps) =>
      updateStepRecursively(currentSteps, stepId, (step) => ({
        ...step,
        elements: step.elements.map((el) =>
          el.id === elementId ? { ...el, value: !el.value } : el
        ),
      }))
    );
  };

  const updateLoopStart = (stepId: string, startStep: number): void => {
    setSteps((currentSteps) =>
      updateStepRecursively(currentSteps, stepId, (step) => ({
        ...step,
        loopStart: startStep,
      }))
    );
  };

  const updateLoopEnd = (stepId: string, endStep: number): void => {
    setSteps((currentSteps) =>
      updateStepRecursively(currentSteps, stepId, (step) => ({
        ...step,
        loopEnd: endStep,
      }))
    );
  };

  const updateStepOperator = (id: string, index: number, operator: LogicalOperator) => {
    setSteps((currentSteps) =>
      updateStepRecursively(currentSteps, id, (step) => {
        if (step.operators) {
          const newOperators = [...step.operators];
          newOperators[index] = operator;
          return {
            ...step,
            operators: newOperators,
            [`showOperatorDropdown-${index}`]: false,
          };
        }
        return step;
      })
    );
  };

  const updateGroupName = (id: string, name: string): void => {
    setSteps((currentSteps) =>
      updateStepRecursively(currentSteps, id, (step) => ({ ...step, groupName: name }))
    );
  };

  const addStepToGroup = (groupId: string): void => {
    setSteps((currentSteps) =>
      updateStepRecursively(currentSteps, groupId, (groupStep) => {
        if (groupStep.groupSteps) {
          const newStep: PLCStep = {
            id: uuidv4(),
            stepNumber: groupStep.groupSteps.length + 1,
            type: 'OUTPUT',
            enabled: true,
            elements: [{ id: uuidv4(), label: 'New_Label', value: true }],
          };
          return {
            ...groupStep,
            groupSteps: [...groupStep.groupSteps, newStep],
          };
        }
        return groupStep;
      })
    );
  };

  const removeStepFromGroup = (groupId: string, stepId: string): void => {
    setSteps((currentSteps) =>
      updateStepRecursively(currentSteps, groupId, (group) => {
        if (group.groupSteps) {
          const newGroupSteps = group.groupSteps.filter((step) => step.id !== stepId);
          const renumberedGroupSteps = newGroupSteps.map((step, index) => ({
            ...step,
            stepNumber: index + 1,
          }));
          return { ...group, groupSteps: renumberedGroupSteps };
        }
        return group;
      })
    );
  };

  const getSavedRecipeNames = (): string[] => {
    const recipes = localStorage.getItem('plc-recipes');
    return recipes ? Object.keys(JSON.parse(recipes)) : [];
  };

  const saveRecipe = (recipeName: string): boolean => {
    if (!recipeName) return false;
    const recipes = JSON.parse(localStorage.getItem('plc-recipes') || '{}');
    recipes[recipeName] = steps;
    localStorage.setItem('plc-recipes', JSON.stringify(recipes));
    return true;
  };

  const loadRecipe = (recipeName: string): boolean => {
    const savedRecipes = JSON.parse(localStorage.getItem('plc-recipes') || '{}');
    if (savedRecipes[recipeName]) {
      setSteps(savedRecipes[recipeName]);
      return true;
    }
    return false;
  };

  const contextValue = {
    config: {
      instructions: instructions,
      labelOptions: dynamicLabelOptions,
      logicalOperators: logicalOperators,
    },
    handlers: {
      addStep: addStepAfter,
      removeStep,
      toggleStepDropdown,
      updateStepType,
      updateGroupName,
      addStepToGroup,
      removeStepFromGroup,
    },
    stepHandlers: {
      toggleLabelDropdown,
      updateStepLabel,
      updateStepValue,
      updateTimeUnit,
      updateElementCount,
      toggleElementValue,
      updateStepOperator,
      updateLoopStart,
      updateLoopEnd,
    },
  };

  return {
    steps,
    setSteps,
    ioList,
    addStep: addStepAtEnd,
    addGroup,
    removeStep,
    updateStepType,
    updateStepLabel,
    updateStepValue,
    updateElementCount,
    updateStepOperator,
    updateTimeUnit,
    toggleElementValue,
    updateLoopStart,
    updateLoopEnd,
    getSavedRecipeNames,
    saveRecipe,
    loadRecipe,
    addStepToGroup,
    removeStepFromGroup,
    updateGroupName,
    contextValue,
  };
};

export default usePLCState;
