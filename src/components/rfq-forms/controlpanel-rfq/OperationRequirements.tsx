import React from 'react';
import { FormData } from './types';

interface OperationRequirementsProps {
  formData: FormData;
  handleChange: (field: keyof FormData, value: string) => void;
}

const OperationRequirements: React.FC<OperationRequirementsProps> = ({ formData, handleChange }) => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
        Operation Requirements
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Clamping Operation Required? *
          </label>
          <div className="flex gap-4">
            {['yes', 'no'].map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="hasClampingOperation"
                  value={option}
                  checked={formData.hasClampingOperation === option}
                  onChange={(e) => handleChange('hasClampingOperation', e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm text-gray-700 capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Precision Movement Required? *
          </label>
          <div className="flex gap-4">
            {['yes', 'no'].map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="needsPrecisionMovement"
                  value={option}
                  checked={formData.needsPrecisionMovement === option}
                  onChange={(e) => handleChange('needsPrecisionMovement', e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm text-gray-700 capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {(formData.hasClampingOperation === 'yes' || formData.needsPrecisionMovement === 'yes') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Actuator Type *
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {['cylinders', 'actuators', 'both'].map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="actuatorType"
                  value={option}
                  checked={formData.actuatorType === option}
                  onChange={(e) => handleChange('actuatorType', e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm text-gray-700 capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default OperationRequirements;
