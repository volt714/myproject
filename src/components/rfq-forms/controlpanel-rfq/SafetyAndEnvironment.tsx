import React from 'react';
import { FormData } from './types';

interface SafetyAndEnvironmentProps {
  formData: FormData;
  handleChange: (field: keyof FormData, value: string) => void;
}

const SafetyAndEnvironment: React.FC<SafetyAndEnvironmentProps> = ({ formData, handleChange }) => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
        Safety & Environment
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Double Hand Safety Start Required? *
          </label>
          <div className="flex gap-4">
            {['yes', 'no'].map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="needsDoubleHandSafety"
                  value={option}
                  checked={formData.needsDoubleHandSafety === option}
                  onChange={(e) => handleChange('needsDoubleHandSafety', e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm text-gray-700 capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operating Environment *
          </label>
          <select
            value={formData.operatingEnvironment}
            onChange={(e) => handleChange('operatingEnvironment', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Environment</option>
            <option value="spacious">Spacious</option>
            <option value="shorted_area">Shorted Area</option>
            <option value="dusty">Dusty</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Luminous Lighting Required in Operating Place? *
          </label>
          <div className="flex gap-4">
            {['yes', 'no'].map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="needsLighting"
                  value={option}
                  checked={formData.needsLighting === option}
                  onChange={(e) => handleChange('needsLighting', e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm text-gray-700 capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {formData.needsLighting === 'yes' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Machine Lamp Width (feet) *
            </label>
            <select
              value={formData.lightingWidth}
              onChange={(e) => handleChange('lightingWidth', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Width</option>
              <option value="1">1 foot</option>
              <option value="2">2 feet</option>
            </select>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Is the power point nearby? (in meters) *
        </label>
        <input
          type="number"
          value={formData.powerPointDistance}
          onChange={(e) => handleChange('powerPointDistance', e.target.value)}
          className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Distance in meters"
        />
      </div>
    </section>
  );
};

export default SafetyAndEnvironment;
