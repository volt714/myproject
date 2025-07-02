// src/types/plc.ts

import { instructions } from "../constants/plc";

export type InstructionType = typeof instructions[number];

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
  
export interface PLCElement {
  id: string;
  label: string;
  value: string | boolean | number;
  unit?: 'ms' | 'sec' | 'min';
  showDropdown?: boolean;
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
  
export interface IOPoint {
  id?: string;
  address: string;
  type: 'INPUT' | 'OUTPUT';
  label: string;
  description?: string;
  dataType: 'BOOL' | 'INT' | 'REAL' | 'WORD';
  value?: any;
}
  
export interface PLCConnection {
  id: string;
  from: {
    elementId: string;
    point: 'left' | 'right';
  };
  to: {
    elementId: string;
    point: 'left' | 'right';
  };
}
  
export interface PLCRung {
  id: string;
  elements: PLCElement[];
  connections: PLCConnection[];
  enabled: boolean;
  comment?: string;
}
  
export interface SimulationState {
  isRunning: boolean;
  currentStep: number;
  ioStates: Record<string, any>;
  executionTime: number;
  cycleTime: number;
}
  
export type LogicalOperator = 'AND' | 'OR' | 'XOR' | 'NOT';
export type LogicOperator = 'AND' | 'OR' | 'NOT';
  
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