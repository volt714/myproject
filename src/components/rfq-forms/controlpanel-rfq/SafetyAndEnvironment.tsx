import React from 'react';
import { FormData } from './types';

interface SafetyAndEnvironmentProps {
  formData: FormData;
  handleChange: (field: keyof FormData, value: string) => void;
}

const SafetyAndEnvironment: React.FC<SafetyAndEnvironmentProps> = ({ 
  formData, 
  handleChange 
}) => {
  const environmentOptions = [
    { value: '', label: 'Select Environment' },
    { value: 'spacious', label: 'Spacious' },
    { value: 'confined_area', label: 'Confined Area' },
    { value: 'dusty', label: 'Dusty Environment' }
  ];

  const lightingWidthOptions = [
    { value: '', label: 'Select Width' },
    { value: '1', label: '1 foot' },
    { value: '2', label: '2 feet' }
  ];

  const protectionTypeOptions = [
    { value: '', label: 'Select Protection Type' },
    { value: 'finger', label: 'Finger protection' },
    { value: 'hand', label: 'Hand protection' }
  ];

  const RadioGroup: React.FC<{
    name: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
    label: string;
    required?: boolean;
  }> = ({ name, value, onChange, options, label, required = false }) => (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex gap-6">
        {options.map((option) => (
          <label 
            key={option} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={(e) => onChange(e.target.value)}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900 capitalize transition-colors">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const SelectField: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    required?: boolean;
    placeholder?: string;
  }> = ({ label, value, onChange, options, required = false, placeholder }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   hover:border-gray-400 transition-colors
                   bg-white text-gray-900"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const NumberInput: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    min?: number;
    max?: number;
  }> = ({ label, value, onChange, placeholder, required = false, min, max }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full md:w-80 px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   hover:border-gray-400 transition-colors
                   placeholder-gray-400"
      />
    </div>
  );

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
      <header className="pb-6 border-b border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
          Safety & Environment
        </h2>
        <p className="text-gray-600 mt-2">
          Configure safety requirements and environmental conditions for your equipment
        </p>
      </header>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <RadioGroup
          name="needsDoubleHandSafety"
          value={formData.needsDoubleHandSafety}
          onChange={(value) => handleChange('needsDoubleHandSafety', value)}
          options={['yes', 'no']}
          label="Double Hand Safety Start Required?"
          required
        />

        <SelectField
          label="Operating Environment"
          value={formData.operatingEnvironment}
          onChange={(value) => handleChange('operatingEnvironment', value)}
          options={environmentOptions}
          required
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <RadioGroup
          name="needsLighting"
          value={formData.needsLighting}
          onChange={(value) => handleChange('needsLighting', value)}
          options={['yes', 'no']}
          label="Luminous Lighting Required in Operating Area?"
          required
        />

        {formData.needsLighting === 'yes' && (
          <div className="animate-in slide-in-from-left duration-200">
            <SelectField
              label="Machine Lamp Width"
              value={formData.lightingWidth}
              onChange={(value) => handleChange('lightingWidth', value)}
              options={lightingWidthOptions}
              required
            />
          </div>
        )}
      </div>

      <div className="pt-4">
        <NumberInput
          label="Power Point Distance"
          value={formData.powerPointDistance}
          onChange={(value) => handleChange('powerPointDistance', value)}
          placeholder="Enter distance in meters"
          required
          min={0}
          max={1000}
        />
        <p className="text-xs text-gray-500 mt-1">
          Specify the distance from equipment to the nearest power point
        </p>
      </div>

      <div className="border-t border-gray-200 pt-8 space-y-8">
        <RadioGroup
          name="safetyCurtainNeeded"
          value={formData.safetyCurtainNeeded}
          onChange={(value) => handleChange('safetyCurtainNeeded', value)}
          options={['yes', 'no']}
          label="Safety Curtain Required?"
          required
        />

        {formData.safetyCurtainNeeded === 'yes' && (
          <div className="grid lg:grid-cols-2 gap-8 animate-in slide-in-from-left duration-200">

            <NumberInput
              label="Safety Curtain Width (mm)"
              value={formData.safetyCurtainWidth}
              onChange={(value) => handleChange('safetyCurtainWidth', value)}
              placeholder="Enter width"
              required
            />
            <NumberInput
              label="Safety Curtain Height (mm)"
              value={formData.safetyCurtainHeight}
              onChange={(value) => handleChange('safetyCurtainHeight', value)}
              placeholder="Enter height"
              required
            />
          </div>
        )}
      </div>

      {formData.safetyCurtainNeeded === 'yes' && (
        <div className="border-t border-gray-200 pt-8 space-y-8">
          <SelectField
            label="Protection Type"
            value={formData.protectionType}
            onChange={(value) => handleChange('protectionType', value)}
            options={protectionTypeOptions}
            required
          />
        </div>
      )}

      <div className="border-t border-gray-200 pt-8 space-y-8">
        <RadioGroup
          name="towerLampNeeded"
          value={formData.towerLampNeeded}
          onChange={(value) => handleChange('towerLampNeeded', value)}
          options={['yes', 'no']}
          label="Tower Lamp Required?"
          required
        />
      </div>
    </section>
  );
};

export default SafetyAndEnvironment;