import React, { useState, useEffect } from 'react';
import { FormData } from '../types/types';
import HMIImageGallery from './HMIImageGallery';

interface HMIConfigurationProps {
  formData: FormData;
  handleChange: (field: keyof FormData, value: string) => void;
}

const HMIConfiguration: React.FC<HMIConfigurationProps> = ({ formData, handleChange }) => {
  const hmiTypes = [
    'Basic Panel',
    'Advanced Panel',
    'Touchscreen',
    'Mobile HMI',
    'Other'
  ];

  const screenSizes = [
    '7"',
    '10"',
    '12"',
    '15"',
    '19"',
    '21"',
    'Other'
  ];

  const communicationProtocols = [
    'Ethernet/IP',
    'Profibus',
    'Profinet',
    'Modbus TCP/IP',
    'Modbus RTU',
    'DeviceNet',
    'CC-Link',
    'Other'
  ];

  // Initialize selectedImages from formData
  const [selectedImages, setSelectedImages] = useState<string[]>(() => 
    Array.isArray(formData.hmiScreenLayout) ? formData.hmiScreenLayout : []
  );

  // Update form data when selectedImages changes
  useEffect(() => {
    if (JSON.stringify(formData.hmiScreenLayout) !== JSON.stringify(selectedImages)) {
      // Use type assertion to handle the array type for hmiScreenLayout
      (handleChange as (field: keyof FormData, value: any) => void)('hmiScreenLayout', selectedImages);
    }
    // We're intentionally excluding handleChange from dependencies to prevent infinite loops
    // The handleChange is already memoized in the parent component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImages]);

  return (
    <div className="space-y-8 mt-8">
      <h2 className="text-xl font-semibold text-gray-800">HMI Configuration</h2>
      
      {formData.hmiRequired === 'yes' && (
        <div className="grid lg:grid-cols-3 gap-8 mt-6 animate-in slide-in-from-left duration-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HMI Type
            </label>
            <select
              value={formData.hmiType}
              onChange={(e) => handleChange('hmiType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select HMI Type</option>
              {hmiTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Screen Size
            </label>
            <select
              value={formData.hmiScreenSize}
              onChange={(e) => handleChange('hmiScreenSize', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Screen Size</option>
              {screenSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Communication Protocol
            </label>
            <select
              value={formData.communicationProtocol}
              onChange={(e) => handleChange('communicationProtocol', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Protocol</option>
              {communicationProtocols.map((protocol) => (
                <option key={protocol} value={protocol}>
                  {protocol}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {formData.hmiRequired === 'yes' && (
        <div className="mt-8">
          <HMIImageGallery 
            selectedImages={selectedImages}
            onSelectImages={setSelectedImages}
          />
        </div>
      )}
    </div>
  );
};

export default HMIConfiguration;
