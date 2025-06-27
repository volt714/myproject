import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FormData, ValveDetails, AdditionalSensorDetails } from './types';

interface CylinderConfigurationProps {
  formData: FormData;
  handleChange: (field: keyof FormData, value: any) => void;
}

/**
 * Professional Cylinder Configuration Component
 * Handles configuration of cylinders, valves, reed switches, and additional sensors
 */
const CylinderConfiguration: React.FC<CylinderConfigurationProps> = ({ 
  formData, 
  handleChange 
}) => {
  const [sameAsFirst, setSameAsFirst] = useState<boolean>(false);

  // Memoized computed values
  const valveCount = useMemo(() => parseInt(formData.valveCount) || 0, [formData.valveCount]);
  const additionalSensorCount = useMemo(() => 
    parseInt(formData.additionalSensorCount) || 0, 
    [formData.additionalSensorCount]
  );

  // Configuration options
  const valveTypeOptions = [
    { value: '', label: 'Select Valve Type' },
    { value: 'sr', label: 'SR (Single Return)' },
    { value: 'ss', label: 'SS (Single Spring)' },
    { value: 'sc', label: 'SC (Single Center)' },
  ];

  const voltageOptions = [
    { value: '', label: 'Select Voltage' },
    { value: '24v', label: '24V' },
    { value: '230v', label: '230V' },
    { value: 'custom', label: 'Custom' },
  ];

  const reedSwitchTypeOptions = [
    { value: '', label: 'Select Type' },
    { value: 'pnp', label: 'PNP' },
    { value: 'npn', label: 'NPN' },
    { value: '3-wire', label: '3-Wire' },
    { value: '2-wire', label: '2-Wire' },
    { value: 'custom', label: 'Custom' },
  ];

  const sensorSignalTypeOptions = [
    { value: '', label: 'Select Signal Type' },
    { value: 'pnp', label: 'PNP' },
    { value: 'npn', label: 'NPN' },
    { value: '3-wire', label: '3-Wire' },
    { value: '2-wire', label: '2-Wire' },
    { value: 'custom', label: 'Custom' },
  ];

  const sensorPhysicalTypeOptions = [
    { value: '', label: 'Select Physical Type' },
    { value: 'photoelectric', label: 'Photoelectric' },
    { value: 'inductive', label: 'Inductive' },
    { value: 'capacitive', label: 'Capacitive' },
    { value: 'custom', label: 'Custom' },
  ];

  // Event handlers
  const handleCylinderCountChange = useCallback((value: string) => {
    let count = parseInt(value) || 0;
    if (count < 0) count = 0;
    const stringValue = count.toString();
    handleChange('cylinderCount', stringValue);
    handleChange('valveCount', stringValue);
    handleChange('reedSwitchPositions', (count * 2).toString());
  }, [handleChange]);

  const handleValveChange = useCallback((
    index: number, 
    field: keyof ValveDetails, 
    value: string
  ) => {
    const newValveDetails = [...formData.valveDetails];
    let finalValue = value;

    if (field === 'solenoidWatts') {
      let num = parseInt(value) || 0;
      if (num < 0) num = 0;
      finalValue = num.toString();
    }
    
    newValveDetails[index] = { ...newValveDetails[index], [field]: finalValue };

    // Apply to all valves if "same as first" is enabled
    if (sameAsFirst && index === 0) {
      for (let i = 1; i < newValveDetails.length; i++) {
        newValveDetails[i] = { ...newValveDetails[i], [field]: finalValue };
      }
    }

    handleChange('valveDetails', newValveDetails);
  }, [formData.valveDetails, sameAsFirst, handleChange]);

  const handleSimpleNumericChange = useCallback((field: keyof FormData, value: string) => {
    let num = parseInt(value) || 0;
    if (num < 0) num = 0;
    handleChange(field, num.toString());
  }, [handleChange]);

  const handleSensorChange = useCallback((
    index: number, 
    field: keyof AdditionalSensorDetails, 
    value: string
  ) => {
    const newSensorDetails = [...formData.additionalSensorDetails];
    newSensorDetails[index] = { ...newSensorDetails[index], [field]: value };
    handleChange('additionalSensorDetails', newSensorDetails);
  }, [formData.additionalSensorDetails, handleChange]);

  const handleSameAsFirstToggle = useCallback((checked: boolean) => {
    setSameAsFirst(checked);
    
    if (checked && formData.valveDetails.length > 0) {
      const firstValve = formData.valveDetails[0];
      const newValveDetails = formData.valveDetails.map((valve, index) => ({
        ...firstValve,
        id: valve.id,
      }));
      handleChange('valveDetails', newValveDetails);
    }
  }, [formData.valveDetails, handleChange]);

  // Effects for managing dynamic arrays
  useEffect(() => {
    if (formData.valveDetails.length !== valveCount) {
      const newValveDetails: ValveDetails[] = Array.from({ length: valveCount }, (_, i) => ({
        id: i + 1,
        valveType: formData.valveDetails[i]?.valveType || '',
        voltage: formData.valveDetails[i]?.voltage || '',
        solenoidWatts: formData.valveDetails[i]?.solenoidWatts || '',
      }));
      handleChange('valveDetails', newValveDetails);
    }
  }, [valveCount, formData.valveDetails, handleChange]);

  useEffect(() => {
    if (formData.additionalSensorDetails.length !== additionalSensorCount) {
      const newSensorDetails: AdditionalSensorDetails[] = Array.from(
        { length: additionalSensorCount },
        (_, i) => ({
          id: i + 1,
          sensorSignalType: formData.additionalSensorDetails[i]?.sensorSignalType || '',
          customSignalTypeName: formData.additionalSensorDetails[i]?.customSignalTypeName || '',
          sensorPhysicalType: formData.additionalSensorDetails[i]?.sensorPhysicalType || '',
          customPhysicalTypeName: formData.additionalSensorDetails[i]?.customPhysicalTypeName || '',
        })
      );
      handleChange('additionalSensorDetails', newSensorDetails);
    }
  }, [additionalSensorCount, formData.additionalSensorDetails, handleChange]);

  // Render helpers
  const renderFormField = (
    label: string,
    children: React.ReactNode,
    required: boolean = false,
    className: string = ''
  ) => (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );

  const renderSelect = (
    value: string,
    onChange: (value: string) => void,
    options: Array<{ value: string; label: string }>,
    disabled: boolean = false,
    placeholder: string = 'Select option'
  ) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`
        w-full px-3 py-2 text-sm border border-gray-300 rounded-md
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
        transition-colors duration-200
      `}
      aria-label={placeholder}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  const renderInput = (
    type: string,
    value: string,
    onChange: (value: string) => void,
    placeholder: string = '',
    disabled: boolean = false
  ) => (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={type === 'number' ? 0 : undefined}
      disabled={disabled}
      placeholder={placeholder}
      className={`
        w-full px-3 py-2 text-sm border border-gray-300 rounded-md
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
        transition-colors duration-200
      `}
      aria-label={placeholder}
    />
  );

  const renderRadioGroup = (
    name: string,
    value: string,
    onChange: (value: string) => void,
    options: string[],
    label: string
  ) => (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-800">
        {label}
        <span className="text-red-500 ml-1">*</span>
      </label>
      <div className="flex gap-6">
        {options.map((option) => (
          <label key={option} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={(e) => onChange(e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="text-sm text-gray-700 capitalize font-medium">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Cylinder Configuration
        </h2>
        <p className="text-gray-600 text-sm">
          Configure your hydraulic cylinder system parameters and sensor requirements
        </p>
        <div className="mt-3 h-1 w-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
      </div>

      {/* Basic Configuration */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {renderFormField(
          'Number of Cylinders',
          renderInput(
            'number',
            formData.cylinderCount,
            handleCylinderCountChange,
            'Enter cylinder count'
          ),
          true
        )}

        {renderFormField(
          'Number of Valves',
          renderInput(
            'number',
            formData.valveCount,
            (value) => handleSimpleNumericChange('valveCount', value),
            'Enter valve count'
          ),
          true
        )}
      </div>

      {/* Apply to All Valves Checkbox */}
      {valveCount > 1 && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={sameAsFirst}
              onChange={(e) => handleSameAsFirstToggle(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-semibold text-blue-800">
              Apply first valve configuration to all valves
            </span>
          </label>
          <p className="text-xs text-blue-600 mt-1 ml-7">
            This will automatically copy valve 1 settings to all other valves
          </p>
        </div>
      )}

      {/* Valve Details */}
      {formData.valveDetails.map((valve, index) => (
        <div key={valve.id} className="mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
              {index + 1}
            </span>
            Valve {index + 1} Configuration
          </h3>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {renderFormField(
              'Valve Type',
              renderSelect(
                valve.valveType,
                (value) => handleValveChange(index, 'valveType', value),
                valveTypeOptions,
                sameAsFirst && index > 0
              ),
              true
            )}

            {renderFormField(
              'Voltage',
              renderSelect(
                valve.voltage,
                (value) => handleValveChange(index, 'voltage', value),
                voltageOptions,
                sameAsFirst && index > 0
              ),
              true
            )}

            {renderFormField(
              'Solenoid Coil Watts',
              renderInput(
                'number',
                valve.solenoidWatts,
                (value) => handleValveChange(index, 'solenoidWatts', value),
                'Enter watts',
                sameAsFirst && index > 0
              ),
              true
            )}
          </div>
        </div>
      ))}

      {/* Reed Switch Configuration */}
      <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          Movement Detection Configuration
        </h3>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            {renderRadioGroup(
              'needsReedSwitch',
              formData.needsReedSwitch,
              (value) => handleChange('needsReedSwitch', value),
              ['yes', 'no'],
              'Reed Switch Required for Movement Detection?'
            )}
          </div>

          {formData.needsReedSwitch === 'yes' && (
            <div className="grid gap-6">
              {renderFormField(
                'Reed Switch Type',
                <>
                  {renderSelect(
                    formData.reedSwitchType,
                    (value) => handleChange('reedSwitchType', value),
                    reedSwitchTypeOptions
                  )}
                  {formData.reedSwitchType === 'custom' && (
                    <div className="mt-3">
                      {renderInput(
                        'text',
                        formData.customReedSwitchName,
                        (value) => handleChange('customReedSwitchName', value),
                        'Enter custom reed switch name'
                      )}
                    </div>
                  )}
                </>,
                true
              )}

              {renderFormField(
                'Number of Positions to Capture',
                renderInput(
                  'number',
                  formData.reedSwitchPositions,
                  (value) => handleSimpleNumericChange('reedSwitchPositions', value),
                  'Enter position count'
                ),
                true
              )}
            </div>
          )}
        </div>
      </div>

      {/* Additional Sensors */}
      <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          Additional Sensor Configuration
        </h3>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-6">
          <div>
            {renderRadioGroup(
              'needsAdditionalSensors',
              formData.needsAdditionalSensors,
              (value) => handleChange('needsAdditionalSensors', value),
              ['yes', 'no'],
              'Additional Movement Detection Sensors Needed?'
            )}
          </div>

          {formData.needsAdditionalSensors === 'yes' && (
            <div>
              {renderFormField(
                'Number of Additional Sensors',
                renderInput(
                  'number',
                  formData.additionalSensorCount,
                  (value) => handleSimpleNumericChange('additionalSensorCount', value),
                  'Enter sensor count'
                ),
                true
              )}
            </div>
          )}
        </div>

        {/* Additional Sensor Details */}
        {formData.needsAdditionalSensors === 'yes' && 
         formData.additionalSensorDetails.map((sensor, index) => (
          <div key={sensor.id} className="mt-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
                {index + 1}
              </span>
              Additional Sensor {index + 1}
            </h4>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {renderFormField(
                'Signal Type',
                <>
                  {renderSelect(
                    sensor.sensorSignalType,
                    (value) => handleSensorChange(index, 'sensorSignalType', value),
                    sensorSignalTypeOptions
                  )}
                  {sensor.sensorSignalType === 'custom' && (
                    <div className="mt-3">
                      {renderInput(
                        'text',
                        sensor.customSignalTypeName,
                        (value) => handleSensorChange(index, 'customSignalTypeName', value),
                        'Enter custom signal type'
                      )}
                    </div>
                  )}
                </>,
                true
              )}

              {renderFormField(
                'Physical Type',
                <>
                  {renderSelect(
                    sensor.sensorPhysicalType,
                    (value) => handleSensorChange(index, 'sensorPhysicalType', value),
                    sensorPhysicalTypeOptions
                  )}
                  {sensor.sensorPhysicalType === 'custom' && (
                    <div className="mt-3">
                      {renderInput(
                        'text',
                        sensor.customPhysicalTypeName,
                        (value) => handleSensorChange(index, 'customPhysicalTypeName', value),
                        'Enter custom physical type'
                      )}
                    </div>
                  )}
                </>,
                true
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CylinderConfiguration;