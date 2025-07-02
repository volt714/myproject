import { PLCStep, IOPoint } from '../types/plc';

const formatIOList = (ioList: IOPoint[], type: 'INPUT' | 'OUTPUT'): string => {
  const filteredList = ioList.filter(io => io.type === type);
  if (filteredList.length === 0) return '';

  const header = `(* ${type === 'INPUT' ? 'Inputs' : 'Outputs'} *)`;
  const variables = filteredList.map(io => `  ${io.label} AT ${io.address} : BOOL; (* ${io.description} *)`).join('\n');
  
  return `${header}\n${variables}\n`;
};

export const formatStepsForCodesys = (steps: PLCStep[], ioList: IOPoint[], plcModel: string): string => {
  let output = `PROGRAM PLC_PRG\n`;
  output += `VAR_GLOBAL\n`;
  output += formatIOList(ioList, 'INPUT');
  output += formatIOList(ioList, 'OUTPUT');
  output += `END_VAR\n\n`;

  output += `VAR\n  currentStep: INT := 1;\nEND_VAR\n\n`;

  const stepLogic = steps.map(step => {
    let stepStr = `  ${step.stepNumber}: `;
    if (step.type === 'OUTPUT') {
      const assignments = step.elements.map(el => `${el.label} := ${el.value};`).join(' ');
      stepStr += assignments;
    } else if (step.type === 'DELAY') {
      stepStr += `TON_0.IN := TRUE; TON_0.PT := T#${step.elements[0].value}${step.elements[0].unit?.toUpperCase() || 'MS'}; IF TON_0.Q THEN currentStep := currentStep + 1; END_IF;`;
    }
    // Add other step types here later
    return stepStr;
  }).join('\n');

  output += `CASE currentStep OF\n${stepLogic}\nELSE\n  currentStep := 1;\nEND_CASE;`;

  return output;
};

export const formatNotesAsText = (steps: PLCStep[]): string => {
  return steps.map(step => {
      if (step.type === 'GROUP') {
          const groupSteps = step.groupSteps?.map(gs => `    - Step ${gs.stepNumber}: ${gs.type} - ${JSON.stringify(gs.elements)}`).join('\n') || '';
          return `Step ${step.stepNumber}: ${step.groupName}\n${groupSteps}`;
      }
      return `Step ${step.stepNumber}: ${step.type} - ${JSON.stringify(step.elements)}`;
  }).join('\n');
};

export const formatIOAsText = (ioList: IOPoint[]): string => {
  let output = 'Inputs:\n';
  const inputs = ioList.filter(io => io.type === 'INPUT');
  if (inputs.length > 0) {
    output += inputs.map(io => `  - ${io.label} (${io.address}): ${io.description || ''}`).join('\n');
  } else {
    output += '  (No inputs defined)';
  }

  output += '\n\nOutputs:\n';
  const outputs = ioList.filter(io => io.type === 'OUTPUT');
  if (outputs.length > 0) {
    output += outputs.map(io => `  - ${io.label} (${io.address}): ${io.description || ''}`).join('\n');
  } else {
    output += '  (No outputs defined)';
  }

  return output;
}; 