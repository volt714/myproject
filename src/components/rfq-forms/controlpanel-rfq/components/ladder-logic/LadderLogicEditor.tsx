import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { usePLCState } from './hooks/usePLCState';
import { instructions, logicalOperators } from './constants/plc';
import TopToolbar, { ExportFormat } from './layout/TopToolbar';
import StepComponent from './step-components/StepComponent';
import GroupStepComponent from './step-components/GroupStepComponent';
import IOListConfig from './config/IOListConfig';
import { PLCStep, InstructionType } from './types/plc';
import { PLCModel } from './layout/PLCModelSelector';
import PLCContext from './context/PLCContext';
import ProjectSelector from './layout/ProjectSelector';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const PLCProgrammer: React.FC = () => {
  const [projectName, setProjectName] = useState('Default Project');
  const [companyName, setCompanyName] = useState('Default Company');

  const { data: labelOptions, error: labelsError } = useSWR<string[]>(
    () => `/api/labels?project_name=${projectName}&company_name=${companyName}`,
    fetcher,
    {
      fallbackData: [],
    }
  );

  const {
    steps,
    setSteps,
    addStep: addStepAtEnd,
    addGroup,
    contextValue,
  } = usePLCState(undefined, labelOptions || []);

  const { data: fetchedSteps, error: stepsError } = useSWR<PLCStep[]>(
    () => `/api/logic?project_name=${projectName}&company_name=${companyName}`,
    fetcher
  );

  useEffect(() => {
    if (fetchedSteps) {
      setSteps(fetchedSteps);
    }
  }, [fetchedSteps, setSteps]);

  const [selectedInstruction, setSelectedInstruction] = useState<InstructionType>('OUTPUT');
  const [showIOConfig, setShowIOConfig] = useState(false);
  const [plcModel, setPlcModel] = useState<PLCModel>('Default');

  const handleAddStep = () => {
    addStepAtEnd(selectedInstruction);
  };

  const handleSave = async () => {
    try {
      await axios.post(`/api/logic?project_name=${projectName}&company_name=${companyName}`, { steps });
      alert(`Project '${projectName}' saved successfully!`);
    } catch (error: any) {
      console.error('Error saving project:', error);
      const errorMessage = error.response?.data?.message || `Error: Could not save project '${projectName}'.`;
      alert(errorMessage);
    }
  };

  const formatStepsAsText = (): string => {
    let textContent = `PLC Program Recipe\nGenerated on: ${new Date().toLocaleString()}\n\n`;
    
    const printStep = (step: PLCStep, indent: string = ''): string => {
      let stepText = `${indent}${step.stepNumber}. Type: ${step.type}\n`;
      
      if (step.type === 'GROUP') {
        stepText += `${indent}   Group Name: ${step.groupName || 'N/A'}\n`;
        stepText += `${indent}   Steps:\n`;
        step.groupSteps?.forEach(s => {
          stepText += printStep(s, `${indent}     `);
        });
      } else if (step.type === 'COUNT') {
        stepText += `${indent}   - Count: ${step.repeatCount} Start step:${step.startStep}\n`;
      } else {
        step.elements.forEach((el, index) => {
          const operator = (step.type === 'INPUT' && step.operators && index < step.operators.length) 
            ? ` ${step.operators[index]}` 
            : '';
          const value = `${el.value}${el.unit || ''}`;
          stepText += `${indent}   - ${el.label}: ${value}${operator}\n`;
        });
      }
      return stepText;
    };

    steps.forEach(step => {
      textContent += printStep(step);
      textContent += '---\n';
    });

    return textContent;
  };
  
  const formatStepsForCodesys = (): string => {
    const flattenSteps = (stepsToFlatten: PLCStep[]): PLCStep[] => {
      const flatList: PLCStep[] = [];
      stepsToFlatten.forEach(step => {
        if (step.type === 'GROUP') {
          if (step.groupSteps) {
            flatList.push(...flattenSteps(step.groupSteps));
          }
        } else {
          flatList.push(step);
        }
      });
      return flatList.map((step, index) => ({ ...step, stepNumber: index + 1 }));
    };

    const allSteps = flattenSteps(steps);
    const resolvedLabelOptions = labelOptions || [];
    const totalSteps = allSteps.length;
    const maxSteps = 100;
    const maxElementsPerStep = 5;
    const maxTotalElements = maxSteps * maxElementsPerStep;

    const process = new Array(maxSteps).fill(0);
    const andOr = new Array(maxSteps).fill(false);
    const input_count = new Array(maxSteps).fill(0);
    const output_count = new Array(maxSteps).fill(0);
    const delayTime = new Array(maxSteps).fill(0);
    const count_Selection = new Array(maxSteps).fill(0);
    const count_Value = new Array(maxSteps).fill(0);
    const input_pos = new Array(maxTotalElements).fill(0);
    const input_bit = new Array(maxTotalElements).fill(false);
    const output_pos = new Array(maxTotalElements).fill(0);
    const output_bit = new Array(maxTotalElements).fill(false);

    const typeToProcessCode: Record<string, number> = {
      'INPUT': 1,
      'DELAY': 2,
      'OUTPUT': 4,
      'COUNT': 16,
    };

    allSteps.forEach((step, i) => {
      if (i >= maxSteps) return;

      process[i] = typeToProcessCode[step.type] || 0;
      
      switch(step.type) {
        case 'INPUT':
          input_count[i] = step.elements.length;
          andOr[i] = step.operators?.[0] === 'AND';
          step.elements.forEach((el, j) => {
            if (j >= maxElementsPerStep) return;
            const elementIndex = i * maxElementsPerStep + j;
            input_pos[elementIndex] = resolvedLabelOptions.indexOf(el.label);
            input_bit[elementIndex] = el.value;
          });
          break;
        case 'OUTPUT':
          output_count[i] = step.elements.length;
          step.elements.forEach((el, j) => {
            if (j >= maxElementsPerStep) return;
            const elementIndex = i * maxElementsPerStep + j;
            output_pos[elementIndex] = resolvedLabelOptions.indexOf(el.label);
            output_bit[elementIndex] = el.value;
          });
          break;
        case 'DELAY':
          delayTime[i] = step.elements[0]?.value || 0;
          break;
        case 'COUNT':
          count_Selection[i] = step.repeatCount || 0;
          count_Value[i] = step.startStep || 0;
          break;
      }
    });

    const formatArray = (name: string, type: string, arr: (string|number|boolean)[], comment: string = '') => 
      `  ${name}: ARRAY[0..${arr.length - 1}] OF ${type} := [${arr.join(', ')}]${comment ? `; (* ${comment} *)` : ';'}`;

    let textContent = `(*
  CODESYS Data Export for Model: ${plcModel}
  Generated on: ${new Date().toLocaleString()}
  Total Steps: ${totalSteps}
*)\n\nVAR_GLOBAL\n`;
    
    textContent += `${formatArray('process', 'INT', process, '1:IN, 2:DELAY, 4:OUT, 16:COUNT')}\n`;
    textContent += `${formatArray('AndOr', 'BOOL', andOr, 'For INPUT steps: FALSE=OR, TRUE=AND')}\n\n`;
    
    textContent += `  (* -- Function-specific data -- *)\n`;
    textContent += `${formatArray('input_count', 'INT', input_count, 'Number of inputs per step')}\n`;
    textContent += `${formatArray('output_count', 'INT', output_count, 'Number of outputs per step')}\n`;
    textContent += `${formatArray('delayTime', 'UDINT', delayTime, 'Delay time in ms')}\n`;
    textContent += `${formatArray('count_Selection', 'INT', count_Selection, 'Repeat count for COUNT steps')}\n`;
    textContent += `${formatArray('count_Value', 'INT', count_Value, 'Start step for COUNT steps')}\n\n`;

    textContent += `  (* -- I/O data (max ${maxElementsPerStep} per step) -- *)\n`;
    textContent += `${formatArray('input_pos', 'INT', input_pos, 'Input label index')}\n`;
    textContent += `${formatArray('input_bit', 'BOOL', input_bit, 'Input expected value (FALSE=OFF, TRUE=ON)')}\n`;
    textContent += `${formatArray('output_pos', 'INT', output_pos, 'Output label index')}\n`;
    textContent += `${formatArray('output_bit', 'BOOL', output_bit, 'Output value to set (FALSE=OFF, TRUE=ON)')}\n`;

    textContent += `END_VAR\n`;

    return textContent;
  };

  const handleExport = (format: ExportFormat) => {
    let content = '';
    let fileExt = 'txt';

    if (plcModel === 'Codesys' && format === 'notes') {
      content = formatStepsForCodesys();
    } else if (format === 'notes') {
      content = formatStepsAsText();
    } else if (format === 'excel') {
      alert('Export to Excel is not yet implemented.');
      return;
    } else if (format === 'mysql') {
      alert('Export to MySQL is not yet implemented.');
      return;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plc-recipe-${plcModel.toLowerCase()}-${Date.now()}.${fileExt}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (showIOConfig) {
    return (
      <IOListConfig
        projectName={projectName}
        companyName={companyName}
        onBack={() => setShowIOConfig(false)}
      />
    );
  }

  return (
    <PLCContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-100">
        <TopToolbar 
          stepCount={steps.length} 
          onIOListClick={() => setShowIOConfig(true)} 
          onAddGroup={addGroup}
          onSave={handleSave}
          onLoad={() => alert('Load is now automatic based on project selection.')}
          onExport={handleExport}
          selectedPlcModel={plcModel}
          onPlcModelChange={setPlcModel}
        />

        {stepsError && <div className="p-4 text-red-500">Failed to load steps.</div>}

        <div className="flex-1 bg-white p-6 flex flex-col min-h-[calc(100vh-80px)] mt-16">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Project Selection</h2>
            <ProjectSelector
              projectName={projectName}
              companyName={companyName}
              onProjectChange={setProjectName}
              onCompanyChange={setCompanyName}
            />
          </div>
          <div className="flex-1 overflow-y-auto pr-4">
            {steps.map((step) => (
              step.type === 'GROUP' ? (
                <GroupStepComponent
                  key={step.id}
                  step={step}
                />
              ) : (
                <StepComponent
                  key={step.id}
                  step={step}
                />
              )
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <select
                value={selectedInstruction}
                onChange={(e) => setSelectedInstruction(e.target.value as InstructionType)}
                className="px-3 py-2 border rounded text-sm"
              >
                {contextValue.config.instructions.map((instruction) => (
                  <option key={instruction} value={instruction}>
                    {instruction}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddStep}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Step</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </PLCContext.Provider>
  );
};

export default PLCProgrammer;