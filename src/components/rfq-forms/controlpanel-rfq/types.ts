export interface ValveDetails {
  id: number;
  valveType: string;
  voltage: string;
  solenoidWatts: string;
}

export interface AdditionalSensorDetails {
  id: number;
  sensorSignalType: string;
  customSignalTypeName: string;
  sensorPhysicalType: string;
  customPhysicalTypeName: string;
}

export interface FormData {
  projectTitle: string;
  projectDescription: string;
  plcBrand: string;
  integrationType: string;
  hasClampingOperation: string;
  needsPrecisionMovement: string;
  actuatorType: string;
  cylinderCount: string;
  valveCount: string;
  valveDetails: ValveDetails[];
  needsReedSwitch: string;
  reedSwitchType: string;
  customReedSwitchName: string;
  reedSwitchPositions: string;
  needsAdditionalSensors: string;
  additionalSensorCount: string;
  additionalSensorDetails: AdditionalSensorDetails[];
  machineLength: string;
  machineWidth: string;
  machineHeight: string;
  controlPanelLength: string;
  controlPanelWidth: string;
  controlPanelHeight: string;
  controlPanelColor: string;
  needsDoubleHandSafety: string;
  operatingEnvironment: string;
  needsLighting: string;
  lightingWidth: string;
  powerPointDistance: string;
  safetyCurtainNeeded: string;
  safetyCurtainLength: string;
  safetyCurtainWidth: string;
  safetyCurtainHeight: string;
  protectionType: string;
  towerLampNeeded: string;
}

export interface PLCProjectFormProps {
  onBack?: () => void;
}
