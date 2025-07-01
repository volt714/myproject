// src/types/plc.ts

export const instructions = [
  'CONTACT',
  'COIL',
  'TIMER',
  'COUNTER',
  'MOVE',
  'MATH',
  'COMPARE',
  'JUMP',
  'CALL',
  'RETURN'
] as const;

export type InstructionType = typeof instructions[number];

export interface PLCElement {
  id: string;
  label: string;
  value: string | boolean | number;
  unit?: 'ms' | 's' | 'min' | string;
  showDropdown?: boolean;
}

export interface PLCStep {
  id: string;
  stepNumber: number;
  type: InstructionType;
  enabled: boolean;
  elements: PLCElement[];
  operators?: LogicalOperator[];
  showDropdown?: boolean;
  loopStart?: number;
  loopEnd?: number;
  groupSteps?: PLCStep[];
  groupName?: string;
  [key: string]: any;
}

export interface IOPoint {
  id?: string;
  address: string;
  type: 'INPUT' | 'OUTPUT';
  label: string;
  description?: string;
  dataType: 'BOOL' | 'INT' | 'REAL' | 'WORD' | string;
  value?: any;
}

export interface PLCProgram {
  id: string;
  name: string;
  description?: string;
  steps: PLCStep[];
  totalSteps: number;
  ioList: IOPoint[];
  created: Date;
  modified: Date;
}

export type LogicalOperator = 'AND' | 'OR' | 'XOR' | 'NOT';
export type LogicOperator = 'AND' | 'OR' | 'NOT';

export const logicalOperators: LogicalOperator[] = ['AND', 'OR', 'XOR', 'NOT'];

export interface DelayInstruction {
  type: 'DELAY';
  duration: number;
  unit: 'ms' | 's' | 'min';
}

export interface ContactInstruction {
  type: 'CONTACT';
  contactType: 'NO' | 'NC';
  address: string;
  label?: string;
}

export interface CoilInstruction {
  type: 'COIL';
  coilType: 'NORMAL' | 'SET' | 'RESET';
  address: string;
  label?: string;
}

export interface PLCEditorState {
  program: PLCProgram;
  selectedStep: string | null;
  isRunning: boolean;
  currentStep: number;
  ioList: IOPoint[];
  variables: Record<string, any>;
}
