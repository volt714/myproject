import React from 'react';
import { FormData } from './types';

interface IntegrationRequirementsProps {
  formData: FormData;
  handleChange: (field: keyof FormData, value: string) => void;
}

const IntegrationRequirements: React.FC<IntegrationRequirementsProps> = ({ formData, handleChange }) => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
        Integration Requirements
      </h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Integration Type *
        </label>
        <div className="grid md:grid-cols-3 gap-4">
          {['Database Integration', 'Normal Project', 'Further Integration Needed'].map((option) => (
            <label key={option} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="integrationType"
                value={option.toLowerCase().replace(/\s+/g, '_')}
                checked={formData.integrationType === option.toLowerCase().replace(/\s+/g, '_')}
                onChange={(e) => handleChange('integrationType', e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {formData.integrationType === 'database_integration' && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Database Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.databaseType}
            onChange={(e) => handleChange('databaseType', e.target.value)}
            className="w-auto min-w-[180px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={formData.integrationType === 'database_integration'}
          >
            <option value="">Select Database Type</option>
            <option value="mysql">MySQL</option>
            <option value="cloud_db">Cloud Database</option>
          </select>
        </div>
      )}
    </section>
  );
};

export default IntegrationRequirements;
