import React, { useState, useCallback } from 'react';
import { Save, FileText } from 'lucide-react';
import { FormData, PLCProjectFormProps, ValveDetails, AdditionalSensorDetails } from './controlpanel-rfq/types/types';
import ProjectOverview from './controlpanel-rfq/components/ProjectOverview';
import IntegrationRequirements from './controlpanel-rfq/components/IntegrationRequirements';
import OperationRequirements from './controlpanel-rfq/components/OperationRequirements';
import CylinderConfiguration from './controlpanel-rfq/components/CylinderConfiguration';
import ActuatorConfiguration from './controlpanel-rfq/components/ActuatorConfiguration';
import Dimensions from './controlpanel-rfq/components/Dimensions';
import SafetyAndEnvironment from './controlpanel-rfq/components/SafetyAndEnvironment';
// Import the enhanced PLC configuration
import EnhancedPLCConfiguration from './controlpanel-rfq/components/EnhancedPLCConfiguration';
import HMIRequiredField from './controlpanel-rfq/components/HMIRequiredField';
import HMIConfiguration from './controlpanel-rfq/components/HMIConfiguration';

const ControlPanelRfqForm: React.FC<PLCProjectFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState<FormData>({
    projectTitle: '',
    projectDescription: '',
    plcBrand: '',
    integrationType: '',
    hasClampingOperation: '',
    needsPrecisionMovement: '',
    actuatorType: '',
    cylinderCount: '',
    valveCount: '',
    valveDetails: [],
    needsReedSwitch: '',
    reedSwitchType: '',
    customReedSwitchName: '',
    reedSwitchPositions: '',
    needsAdditionalSensors: '',
    additionalSensorCount: '',
    additionalSensorDetails: [],
    machineLength: '',
    machineWidth: '',
    machineHeight: '',
    controlPanelLength: '',
    controlPanelWidth: '',
    controlPanelHeight: '',
    controlPanelColor: '',
    needsDoubleHandSafety: '',
    operatingEnvironment: '',
    needsLighting: '',
    lightingWidth: '',
    powerPointDistance: '',
    safetyCurtainNeeded: '',
    safetyCurtainWidth: '',
    safetyCurtainHeight: '',
    protectionType: '',
    towerLampNeeded: '',
    plcModel: '',
    digitalInputs: '0',
    digitalOutputs: '0',
    analogIOs: '0',
    ioList: [],
    plcProgram: {
      id: '',
      name: 'New Program',
      steps: [],
      totalSteps: 0,
      ioList: [],
      created: new Date(),
      modified: new Date()
    },
    hmiRequired: '',
    hmiType: '',
    hmiScreenSize: '',
    hmiScreenLayout: [],
    communicationProtocol: '',
    databaseType: ''
  });

  const handleChange = useCallback((field: keyof FormData, value: string | number | string[] | ValveDetails[] | AdditionalSensorDetails[]) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const showCylinderSection = formData.hasClampingOperation === 'yes' && 
    (formData.actuatorType === 'cylinders' || formData.actuatorType === 'both');

  const showActuatorSection = formData.needsPrecisionMovement === 'yes' && 
    (formData.actuatorType === 'actuators' || formData.actuatorType === 'both');

  const generateSummary = () => {
    const summary = Object.entries(formData)
      .filter(([key, value]) => value !== '')
      .map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`)
      .join('\n');
    
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.projectTitle || 'PLC_Project'}_Specifications.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FileText className="h-8 w-8" />
          PLC Project Information Gathering
        </h1>
        <p className="mt-2 text-gray-600">Complete project specification form</p>
      </div>
      
      <ProjectOverview formData={formData} handleChange={handleChange} />
      <IntegrationRequirements formData={formData} handleChange={handleChange} />
      <OperationRequirements formData={formData} handleChange={handleChange} />
      {showCylinderSection && <CylinderConfiguration formData={formData} handleChange={handleChange} />}
      {showActuatorSection && <ActuatorConfiguration formData={formData} handleChange={handleChange} />}
      <Dimensions formData={formData} handleChange={handleChange} />
      <SafetyAndEnvironment formData={formData} handleChange={handleChange} />
      
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
          PLC & HMI Configuration
        </h2>
        <EnhancedPLCConfiguration formData={formData} handleChange={handleChange} />
        <HMIRequiredField formData={formData} handleChange={handleChange} />
        {formData.hmiRequired === 'yes' && (
          <HMIConfiguration formData={formData} handleChange={handleChange} />
        )}
      </section>

      {/* Actions */}
      <div className="flex justify-end items-center gap-4 pt-8 border-t border-gray-200">
        {onBack && (
          <button 
            type="button"
            onClick={onBack}
            className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={generateSummary}
          className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
        >
          <Save className="h-5 w-5" />
          Save and Generate Summary
        </button>
      </div>
    </div>
  );
};

export default ControlPanelRfqForm;