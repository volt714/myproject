import React from 'react';
import { FormData } from './types';

interface PLCConfigurationProps {
  formData: FormData;
  handleChange: (field: keyof FormData, value: string) => void;
}

const PLCConfiguration: React.FC<PLCConfigurationProps> = ({ formData, handleChange }) => {
  const plcBrands = [
    'Siemens',
    'Allen-Bradley',
    'Schneider Electric',
    'Mitsubishi',
    'Omron',
    'Delta',
    'Other'
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800">PLC Configuration</h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PLC Brand <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.plcBrand}
            onChange={(e) => handleChange('plcBrand', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select PLC Brand</option>
            {plcBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PLC Model
          </label>
          <input
            type="text"
            value={formData.plcModel}
            onChange={(e) => handleChange('plcModel', e.target.value)}
            placeholder="e.g., S7-1200, CompactLogix, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          I/O Configuration
        </label>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Digital Inputs</label>
            <input
              type="number"
              min="0"
              value={formData.digitalInputs}
              onChange={(e) => handleChange('digitalInputs', e.target.value)}
              placeholder="e.g., 16"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Digital Outputs</label>
            <input
              type="number"
              min="0"
              value={formData.digitalOutputs}
              onChange={(e) => handleChange('digitalOutputs', e.target.value)}
              placeholder="e.g., 12"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Analog I/Os</label>
            <input
              type="number"
              min="0"
              value={formData.analogIOs}
              onChange={(e) => handleChange('analogIOs', e.target.value)}
              placeholder="e.g., 4"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PLCConfiguration;
