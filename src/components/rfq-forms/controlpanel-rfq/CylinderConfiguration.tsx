import React, { useState, useEffect } from 'react';
import { FormData, ValveDetails } from './types';

interface CylinderConfigurationProps {
  formData: FormData;
  handleChange: (field: keyof FormData, value: any) => void;
}

import { AdditionalSensorDetails } from './types';

const CylinderConfiguration: React.FC<CylinderConfigurationProps> = ({ formData, handleChange }) => {
  const handleCylinderCountChange = (value: string) => {
    handleChange('cylinderCount', value);
    handleChange('valveCount', value);
    const count = parseInt(value) || 0;
    handleChange('reedSwitchPositions', (count * 2).toString());
  };

  const [sameAsFirst, setSameAsFirst] = useState(false);

  const valveCount = parseInt(formData.valveCount) || 0;
  const additionalSensorCount = parseInt(formData.additionalSensorCount) || 0;

  useEffect(() => {
    const newValveDetails: ValveDetails[] = Array.from({ length: valveCount }, (_, i) => ({
      id: i + 1,
      valveType: formData.valveDetails[i]?.valveType || '',
      voltage: formData.valveDetails[i]?.voltage || '',
      solenoidWatts: formData.valveDetails[i]?.solenoidWatts || '',
    }));
    handleChange('valveDetails', newValveDetails);
  }, [valveCount]);

  useEffect(() => {
    const newSensorDetails: AdditionalSensorDetails[] = Array.from({ length: additionalSensorCount }, (_, i) => ({
      id: i + 1,
      sensorSignalType: formData.additionalSensorDetails[i]?.sensorSignalType || '',
      customSignalTypeName: formData.additionalSensorDetails[i]?.customSignalTypeName || '',
      sensorPhysicalType: formData.additionalSensorDetails[i]?.sensorPhysicalType || '',
      customPhysicalTypeName: formData.additionalSensorDetails[i]?.customPhysicalTypeName || '',
    }));
    handleChange('additionalSensorDetails', newSensorDetails);
  }, [additionalSensorCount]);

  const handleValveChange = (index: number, field: keyof ValveDetails, value: string) => {
    const newValveDetails = [...formData.valveDetails];
    newValveDetails[index] = { ...newValveDetails[index], [field]: value };

    if (sameAsFirst && index === 0) {
      for (let i = 1; i < newValveDetails.length; i++) {
        newValveDetails[i] = { ...newValveDetails[i], [field]: value };
      }
    }
    handleChange('valveDetails', newValveDetails);
  };

  const handleSensorChange = (index: number, field: keyof AdditionalSensorDetails, value: string) => {
    const newSensorDetails = [...formData.additionalSensorDetails];
    newSensorDetails[index] = { ...newSensorDetails[index], [field]: value };
    handleChange('additionalSensorDetails', newSensorDetails);
  };

  const handleSameAsFirstChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSameAsFirst(e.target.checked);
    if (e.target.checked) {
      const firstValve = formData.valveDetails[0];
      const newValveDetails = formData.valveDetails.map(valve => ({ ...firstValve, id: valve.id }));
      handleChange('valveDetails', newValveDetails);
    }
  };

  return (
    <section className="space-y-6 bg-blue-50 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
        Cylinder Configuration
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Cylinders *</label>
          <input
            type="number"
            value={formData.cylinderCount}
            onChange={(e) => handleCylinderCountChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter cylinder count"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Valves *</label>
          <input
            type="number"
            value={formData.valveCount}
            onChange={(e) => handleChange('valveCount', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter valve count"
          />
        </div>
      </div>

      {valveCount > 1 && (
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="sameAsFirst"
            checked={sameAsFirst}
            onChange={handleSameAsFirstChange}
            className="h-4 w-4 text-blue-600"
          />
          <label htmlFor="sameAsFirst" className="text-sm font-medium text-gray-700">Apply to all valves</label>
        </div>
      )}

      {formData.valveDetails.map((valve, index) => (
        <div key={valve.id} className="grid md:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
          <h3 className="md:col-span-3 text-lg font-semibold text-gray-700">Valve {index + 1}</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valve Type *</label>
            <select
              value={valve.valveType}
              onChange={(e) => handleValveChange(index, 'valveType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={sameAsFirst && index > 0}
            >
              <option value="">Select Valve Type</option>
              <option value="sr">SR (Single Return)</option>
              <option value="ss">SS (Single Spring)</option>
              <option value="sc">SC (Single Center)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Voltage *</label>
            <select
              value={valve.voltage}
              onChange={(e) => handleValveChange(index, 'voltage', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={sameAsFirst && index > 0}
            >
              <option value="">Select Voltage</option>
              <option value="24v">24V</option>
              <option value="230v">230V</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Solenoid Coil Watts *</label>
            <input
              type="number"
              value={valve.solenoidWatts}
              onChange={(e) => handleValveChange(index, 'solenoidWatts', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter watts"
              disabled={sameAsFirst && index > 0}
            />
          </div>
        </div>
      ))}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Reed Switch Required for Movement Detection? *
          </label>
          <div className="flex gap-4">
            {['yes', 'no'].map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="needsReedSwitch"
                  value={option}
                  checked={formData.needsReedSwitch === option}
                  onChange={(e) => handleChange('needsReedSwitch', e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm text-gray-700 capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {formData.needsReedSwitch === 'yes' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reed Switch Type *</label>
              <select
                value={formData.reedSwitchType}
                onChange={(e) => handleChange('reedSwitchType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="pnp">PNP</option>
                <option value="npn">NPN</option>
                <option value="3-wire">3-Wire</option>
                <option value="2-wire">2-Wire</option>
                <option value="custom">Custom</option>
              </select>
              {formData.reedSwitchType === 'custom' && (
                <input
                  type="text"
                  value={formData.customReedSwitchName}
                  onChange={(e) => handleChange('customReedSwitchName', e.target.value)}
                  className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter custom reed switch name"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Positions to Capture *
              </label>
              <input
                type="number"
                value={formData.reedSwitchPositions}
                onChange={(e) => handleChange('reedSwitchPositions', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter position count"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Additional Movement Detection Sensors Needed? *
          </label>
          <div className="flex gap-4">
            {['yes', 'no'].map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="needsAdditionalSensors"
                  value={option}
                  checked={formData.needsAdditionalSensors === option}
                  onChange={(e) => handleChange('needsAdditionalSensors', e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm text-gray-700 capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {formData.needsAdditionalSensors === 'yes' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Additional Sensors *
              </label>
              <input
                type="number"
                value={formData.additionalSensorCount}
                onChange={(e) => handleChange('additionalSensorCount', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter sensor count"
              />
            </div>

            {formData.additionalSensorDetails.map((sensor, index) => (
              <div key={sensor.id} className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-base font-semibold text-gray-700">Sensor {index + 1}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Signal Type *</label>
                    <select
                      value={sensor.sensorSignalType}
                      onChange={(e) => handleSensorChange(index, 'sensorSignalType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Signal Type</option>
                      <option value="pnp">PNP</option>
                      <option value="npn">NPN</option>
                      <option value="3-wire">3-Wire</option>
                      <option value="2-wire">2-Wire</option>
                      <option value="custom">Custom</option>
                    </select>
                    {sensor.sensorSignalType === 'custom' && (
                      <input
                        type="text"
                        value={sensor.customSignalTypeName}
                        onChange={(e) => handleSensorChange(index, 'customSignalTypeName', e.target.value)}
                        className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter custom signal type"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Physical Type *</label>
                    <select
                      value={sensor.sensorPhysicalType}
                      onChange={(e) => handleSensorChange(index, 'sensorPhysicalType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Physical Type</option>
                      <option value="photoelectric">Photoelectric</option>
                      <option value="inductive">Inductive</option>
                      <option value="capacitive">Capacitive</option>
                      <option value="custom">Custom</option>
                    </select>
                    {sensor.sensorPhysicalType === 'custom' && (
                      <input
                        type="text"
                        value={sensor.customPhysicalTypeName}
                        onChange={(e) => handleSensorChange(index, 'customPhysicalTypeName', e.target.value)}
                        className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter custom physical type"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CylinderConfiguration;
