import React, { useState } from 'react';
import { FormData } from '../types/types';

interface DimensionsProps {
  formData: FormData;
  handleChange: (field: keyof FormData, value: string) => void;
  errors?: Partial<Record<keyof FormData, string>>;
  disabled?: boolean;
}

interface DimensionFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  required?: boolean;
}

interface DimensionGroupProps {
  title: string;
  fields: Array<{
    key: keyof FormData;
    label: string;
    placeholder?: string;
  }>;
  formData: FormData;
  handleChange: (field: keyof FormData, value: string) => void;
  errors?: Partial<Record<keyof FormData, string>>;
  disabled?: boolean;
}

const DimensionField: React.FC<DimensionFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  min = 0,
  max = 99999,
  required = false,
}) => {
  const fieldId = `dimension-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="space-y-2">
      <label 
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      <input
        id={fieldId}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-4 py-3 border rounded-lg transition-colors duration-200
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${error 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300'
          }
        `}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
      />
      {error && (
        <p 
          id={`${fieldId}-error`}
          className="text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

const DimensionVisualizer: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center space-y-2 bg-gray-50 p-4 rounded-lg border">
    <p className="text-xs font-medium text-gray-600 mb-2">{title} Visualization</p>
    <div className="relative">
      {/* 3D Box representation */}
      <svg width="140" height="100" viewBox="0 0 140 100" className="drop-shadow-sm">
        {/* Back face */}
        <path
          d="M25 20 L85 20 L105 10 L45 10 Z"
          fill="#e5e7eb"
          stroke="#6b7280"
          strokeWidth="1"
        />
        <path
          d="M85 20 L105 10 L105 40 L85 50 Z"
          fill="#d1d5db"
          stroke="#6b7280"
          strokeWidth="1"
        />
        {/* Front face */}
        <rect
          x="25"
          y="20"
          width="60"
          height="30"
          fill="#f3f4f6"
          stroke="#6b7280"
          strokeWidth="1.5"
        />
        
        {/* W×L×H label at bottom */}
        <text x="70" y="85" textAnchor="middle" className="fill-gray-600 text-xs font-medium">
          W × L × H
        </text>
        
        {/* Width arrow (horizontal across front face) */}
        <line x1="25" y1="65" x2="85" y2="65" stroke="#10b981" strokeWidth="1.5" />
        <polygon points="23,65 28,63 28,67" fill="#10b981" />
        <polygon points="87,65 82,63 82,67" fill="#10b981" />
        <text x="55" y="62" textAnchor="middle" className="fill-green-600 text-xs font-bold">W</text>
        
        {/* Length arrow (diagonal depth) */}
        <line x1="85" y1="50" x2="105" y2="40" stroke="#3b82f6" strokeWidth="1.5" />
        <polygon points="106,39 103,42 101,40" fill="#3b82f6" />
        <polygon points="84,51 87,48 89,50" fill="#3b82f6" />
        <text x="98" y="48" textAnchor="middle" className="fill-blue-600 text-xs font-bold">L</text>
        
        {/* Height arrow (vertical on left side) */}
        <line x1="18" y1="20" x2="18" y2="50" stroke="#f59e0b" strokeWidth="1.5" />
        <polygon points="18,18 16,23 20,23" fill="#f59e0b" />
        <polygon points="18,52 16,47 20,47" fill="#f59e0b" />
        <text x="12" y="37" textAnchor="middle" className="fill-amber-600 text-xs font-bold">H</text>
      </svg>
    </div>
    <div className="text-xs text-gray-500 text-center">
      <div className="flex items-center justify-center space-x-4">
        <span className="flex items-center">
          <div className="w-3 h-0.5 bg-green-500 mr-1"></div>
          Width
        </span>
        <span className="flex items-center">
          <div className="w-3 h-0.5 bg-blue-500 mr-1"></div>
          Length
        </span>
        <span className="flex items-center">
          <div className="w-3 h-0.5 bg-amber-500 mr-1"></div>
          Height
        </span>
      </div>
    </div>
  </div>
);

const DimensionGroup: React.FC<DimensionGroupProps> = ({
  title,
  fields,
  formData,
  handleChange,
  errors,
  disabled,
}) => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium text-gray-700 mb-4">
      {title}
    </h3>
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Visual representation */}
      <div className="lg:col-span-1">
        <DimensionVisualizer title={title} />
      </div>
      
      {/* Input fields */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
        {fields.map(({ key, label, placeholder }) => (
          <DimensionField
            key={key}
            label={label}
            value={formData[key] as string}
            onChange={(value) => handleChange(key, value)}
            placeholder={placeholder}
            error={errors?.[key]}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  </div>
);

// Color configuration with hex values
const COLOR_OPTIONS = [
  { value: '', label: 'Select Color', color: null },
  { value: 'siemens_grey', label: 'Siemens Grey', color: '#1f2937' }, // Siemens brand grey
  { value: 'milky_white', label: 'Milky White', color: '#f8fafc' },
  { value: 'custom', label: 'Custom', color: null },
] as const;

const MACHINE_DIMENSION_FIELDS = [
  { key: 'machineLength' as keyof FormData, label: 'Length (mm)', placeholder: 'Enter length' },
  { key: 'machineWidth' as keyof FormData, label: 'Width (mm)', placeholder: 'Enter width' },
  { key: 'machineHeight' as keyof FormData, label: 'Height (mm)', placeholder: 'Enter height' },
];

const CONTROL_PANEL_DIMENSION_FIELDS = [
  { key: 'controlPanelLength' as keyof FormData, label: 'Length (mm)', placeholder: 'Enter length' },
  { key: 'controlPanelWidth' as keyof FormData, label: 'Width (mm)', placeholder: 'Enter width' },
  { key: 'controlPanelHeight' as keyof FormData, label: 'Height (mm)', placeholder: 'Enter height' },
];

// Custom Color Dropdown Component
const ColorDropdown: React.FC<{
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}> = ({ value, onChange, error, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const colorFieldId = 'control-panel-color';
  
  const selectedOption = COLOR_OPTIONS.find(option => option.value === value) || COLOR_OPTIONS[0];

  return (
    <div className="relative w-48" aria-invalid={!!error}>
      <button
        id={colorFieldId}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full px-3 py-2.5 bg-white border-2 rounded-xl transition-all duration-300 text-left
          focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none
          disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
          shadow-sm hover:shadow-md
          ${error 
            ? 'border-red-300 focus:ring-red-100 focus:border-red-400' 
            : 'border-gray-200 hover:border-gray-300'
          }
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
        disabled={disabled}
        aria-describedby={error ? `${colorFieldId}-error` : undefined}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {selectedOption.color ? (
              <div className="relative">
                <div 
                  className="w-5 h-5 rounded-full shadow-sm ring-1 ring-white ring-offset-1 flex-shrink-0"
                  style={{ backgroundColor: selectedOption.color }}
                />
                {selectedOption.value === 'milky_white' && (
                  <div className="absolute inset-0 w-5 h-5 rounded-full border border-gray-200" />
                )}
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
                <svg className="w-2.5 h-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v3M7 4H5a1 1 0 00-1 1v16a1 1 0 001 1h14a1 1 0 001-1V5a1 1 0 00-1-1h-2" />
                </svg>
              </div>
            )}
            <span className={`text-sm font-medium truncate ${selectedOption.value ? 'text-gray-900' : 'text-gray-500'}`}>
              {selectedOption.label}
            </span>
          </div>
          <div className={`transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
          <div className="py-2">
            {COLOR_OPTIONS.map((option, index) => (
              <button
                key={option.value}
                type="button"
                className={`
                  w-full px-3 py-2.5 text-left transition-all duration-200 flex items-center space-x-2
                  hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 
                  focus:bg-gradient-to-r focus:from-blue-50 focus:to-indigo-50 focus:outline-none
                  ${value === option.value 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-r-4 border-blue-400' 
                    : ''
                  }
                  ${index > 0 ? 'border-t border-gray-100' : ''}
                `}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={value === option.value}
              >
                {option.color ? (
                  <div className="relative">
                    <div 
                      className="w-5 h-5 rounded-full shadow-sm ring-1 ring-white ring-offset-1 flex-shrink-0 transition-transform duration-200 hover:scale-110"
                      style={{ backgroundColor: option.color }}
                    />
                    {option.value === 'milky_white' && (
                      <div className="absolute inset-0 w-5 h-5 rounded-full border border-gray-200" />
                    )}
                    {value === option.value && (
                      <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-medium truncate ${value === option.value ? 'text-blue-900' : 'text-gray-900'}`}>
                    {option.label}
                  </div>
                  {option.value && option.value !== 'custom' && (
                    <p className={`text-xs mt-0.5 truncate ${value === option.value ? 'text-blue-600' : 'text-gray-500'}`}>
                      {option.value === 'siemens_grey' ? 'Professional finish' : 'Modern appearance'}
                    </p>
                  )}
                  {option.value === 'custom' && (
                    <p className={`text-xs mt-0.5 truncate ${value === option.value ? 'text-blue-600' : 'text-gray-500'}`}>
                      Specify preferred color
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Dimensions component for capturing physical specifications
 * including machine dimensions, control panel dimensions, and color selection
 */
const Dimensions: React.FC<DimensionsProps> = ({ 
  formData, 
  handleChange, 
  errors,
  disabled = false 
}) => {
  const colorError = errors?.controlPanelColor;

  return (
    <section className="space-y-8" role="region" aria-labelledby="dimensions-heading">
      <header>
        <h2 
          id="dimensions-heading"
          className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-3"
        >
          Physical Specifications
        </h2>
      </header>
      
      <DimensionGroup
        title="Machine Dimensions"
        fields={MACHINE_DIMENSION_FIELDS}
        formData={formData}
        handleChange={handleChange}
        errors={errors}
        disabled={disabled}
      />

      <DimensionGroup
        title="Control Panel Dimensions"
        fields={CONTROL_PANEL_DIMENSION_FIELDS}
        formData={formData}
        handleChange={handleChange}
        errors={errors}
        disabled={disabled}
      />

      <div className="space-y-2">
        <label 
          htmlFor="control-panel-color"
          className="block text-sm font-medium text-gray-700"
        >
          Control Panel Color
          <span className="text-red-500 ml-1" aria-label="required">*</span>
        </label>
        
        <ColorDropdown
          value={formData.controlPanelColor}
          onChange={(value) => handleChange('controlPanelColor', value)}
          error={colorError}
          disabled={disabled}
        />
        
        {colorError && (
          <p 
            id="control-panel-color-error"
            className="text-sm text-red-600"
            role="alert"
          >
            {colorError}
          </p>
        )}
      </div>
    </section>
  );
};

export default Dimensions;