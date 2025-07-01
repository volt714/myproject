export type IOType = 'INPUT' | 'OUTPUT';
export type IODataType = 'BOOL' | 'INT' | 'REAL' | 'STRING';
export type LogicalOperator = 'AND' | 'OR' | 'NOT' | 'XOR';
export type TimerUnit = 'ms' | 's';

export interface IOPoint {
  id: string;
  name: string;
  type: IOType;
  dataType: IODataType;
  description?: string;
  label?: string;
  address?: string;
  value?: any;
}

export interface PLCElement {
  id: string;
  label: string;
  value: any; // Supports boolean for I/O, number for timers, etc.
  ioPointId?: string;
  type?: string;
  unit?: TimerUnit;
}

export type InstructionType =
  | 'INPUT'
  | 'OUTPUT'
  | 'TIMER'

  | 'DELAY'
  | 'GROUP'
  | 'LOOP_START'
  | 'LOOP_END';

export interface PLCStep {
  id: string;
  type: InstructionType;
  elements: PLCElement[];
  operators?: LogicalOperator[];
  children?: PLCStep[];
  showDropdown?: boolean;


  groupSteps?: PLCStep[];
  groupName?: string;
  stepNumber?: number;
  enabled?: boolean;
  loopStart?: number;
  [key: string]: any; // For dynamic UI state
}

export interface PLCProgram {
  id: string;
  name: string;
  description?: string;
  steps: PLCStep[];
  totalSteps: number;
  ioList: IOPoint[];
  created: Date | string;
  modified: Date | string;
}

export interface PLCFormData {
  plcBrand: string;
  plcModel: string;
  digitalInputs: string;
  digitalOutputs: string;
  analogIOs: string;
  ioList: IOPoint[];
  plcProgram: PLCProgram;
}

export const initialPLCData: PLCFormData = {
  plcBrand: '',
  plcModel: '',
  digitalInputs: '',
  digitalOutputs: '',
  analogIOs: '',
  ioList: [],
  plcProgram: {
    id: '',
    name: 'New Program',
    steps: [],
    totalSteps: 0,
    ioList: [],
    created: new Date(),
    modified: new Date()
  }
};

// Export local types
