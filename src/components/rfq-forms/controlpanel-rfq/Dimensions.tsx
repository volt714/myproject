import React from 'react';
import { FormData } from './types';

interface DimensionsProps {
  formData: FormData;
  handleChange: (field: keyof FormData, value: string) => void;
}

const Dimensions: React.FC<DimensionsProps> = ({ formData, handleChange }) => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
        Physical Specifications
      </h2>
      
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-4">Machine Dimensions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Length (mm)</label>
            <input
              type="number"
              value={formData.machineLength}
              onChange={(e) => handleChange('machineLength', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Length"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Width (mm)</label>
            <input
              type="number"
              value={formData.machineWidth}
              onChange={(e) => handleChange('machineWidth', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Width"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height (mm)</label>
            <input
              type="number"
              value={formData.machineHeight}
              onChange={(e) => handleChange('machineHeight', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Height"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-4">Control Panel Dimensions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Length (mm)</label>
            <input
              type="number"
              value={formData.controlPanelLength}
              onChange={(e) => handleChange('controlPanelLength', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Length"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Width (mm)</label>
            <input
              type="number"
              value={formData.controlPanelWidth}
              onChange={(e) => handleChange('controlPanelWidth', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Width"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height (mm)</label>
            <input
              type="number"
              value={formData.controlPanelHeight}
              onChange={(e) => handleChange('controlPanelHeight', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Height"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Control Panel Color *
        </label>
        <select
          value={formData.controlPanelColor}
          onChange={(e) => handleChange('controlPanelColor', e.target.value)}
          className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Color</option>
          <option value="siemens_grey">Siemens Grey</option>
          <option value="milky_white">Milky White</option>
          <option value="custom">Custom</option>
        </select>
      </div>
    </section>
  );
};

export default Dimensions;
