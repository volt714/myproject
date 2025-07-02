import React from 'react';
import { FormData } from '../../types/types';

interface HMIRequiredFieldProps {
  formData: FormData;
  handleChange: (field: keyof FormData, value: string) => void;
}

const HMIRequiredField: React.FC<HMIRequiredFieldProps> = ({ formData, handleChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        HMI Required? <span className="text-red-500">*</span>
      </label>
      <div className="flex space-x-4 mt-1">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="hmiRequired"
            value="yes"
            checked={formData.hmiRequired === 'yes'}
            onChange={(e) => handleChange('hmiRequired', e.target.value)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            required
          />
          <span className="ml-2 text-gray-700">Yes</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="hmiRequired"
            value="no"
            checked={formData.hmiRequired === 'no'}
            onChange={(e) => handleChange('hmiRequired', e.target.value)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="ml-2 text-gray-700">No</span>
        </label>
      </div>
    </div>
  );
};

export default HMIRequiredField;
