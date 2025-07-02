export type IOType = 'INPUT' | 'OUTPUT';
export type IODataType = 'BOOL' | 'INT' | 'REAL' | 'STRING';

export enum InstructionType {
  LOOP_START = 'LOOP_START',
  LOOP_END = 'LOOP_END',
  DELAY = 'DELAY',
  XIC = 'XIC',
  XIO = 'XIO',
  OTE = 'OTE',
  OTL = 'OTL',
  OTU = 'OTU',
  TON = 'TON',
  TOF = 'TOF',
  RTO = 'RTO',
  CTU = 'CTU',
  CTD = 'CTD',
  RES = 'RES',
}

export enum LogicalOperator {
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
}

export enum TimerUnit {
  SEC = 'sec',
  MIN = 'min',
  HR = 'hr',
}

export interface IOPoint {
  id: string;
  name: string;
  type: IOType;
  dataType: IODataType;
  description?: string;
  label?: string;
  address?: string;
  value?: boolean | number | string;
}

export interface PLCElement {
  id: string;
  label: string;
  value: boolean | number | string; // Supports boolean for I/O, number for timers, etc.
  ioPointId?: string;
  type?: string;
  unit?: TimerUnit;
}

export type StructuralInstructionType = 'GROUP';

export interface PLCStep {
  id: string;
  type: InstructionType | StructuralInstructionType;
  elements: PLCElement[];
  operators?: LogicalOperator[];
  children?: PLCStep[];
  showDropdown?: boolean;
  groupName?: string;
  stepNumber?: number;
  enabled?: boolean;
  loopStart?: number;
  // Index signature for dynamic UI state properties like 'showLabelDropdown-element-...'
  [key: string]: unknown;
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
