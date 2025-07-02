import React, { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { FormData } from '../../types/types';
import { IOPoint, PLCStep, PLCProgram } from '../../types/plc-types';
import { v4 as uuidv4 } from 'uuid';
import LadderLogicEditor from '../ladder-logic/LadderLogicEditor';
import { PLCProvider } from '../ladder-logic/context/PLCProvider';
import IOListConfig from '../ladder-logic/config/IOListConfig';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

interface EnhancedPLCConfigurationProps {
  formData: FormData;
  handleChange: (field: keyof FormData, value: string | IOPoint[] | PLCProgram | null) => void;
}

const EnhancedPLCConfiguration: React.FC<EnhancedPLCConfigurationProps> = ({ 
  formData, 
  handleChange 
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'io' | 'programming'>('basic');
  
  // Fetch IO list using SWR
  const { data: ioList = [] } = useSWR<IOPoint[]>(
    formData.projectName && formData.companyName 
      ? `/api/io?project_name=${formData.projectName}&company_name=${formData.companyName}` 
      : null,
    fetcher
  );

  const [program, setProgram] = useState<PLCProgram>(() => {
    const now = new Date().toISOString();
    return {
      id: formData.plcProgram?.id || uuidv4(),
      name: formData.plcProgram?.name || 'New Program',
      description: formData.plcProgram?.description || '',
      steps: formData.plcProgram?.steps || [],
      totalSteps: formData.plcProgram?.totalSteps || 0,
      ioList: formData.plcProgram?.ioList || [],
      created: formData.plcProgram?.created || now,
      modified: now,
    };
  });

  const ioListString = JSON.stringify(ioList);
  useEffect(() => {
    setProgram((prev) => {
      if (JSON.stringify(prev.ioList) === ioListString) {
        return prev;
      }
      return { ...prev, ioList: JSON.parse(ioListString), modified: new Date().toISOString() };
    });
  }, [ioListString]);


  const plcBrands = [
    'Siemens',
    'Allen-Bradley',
    'Schneider Electric',
    'Mitsubishi',
    'Omron',
    'Delta',
    'Other'
  ];

  const handleProgramChange = useCallback((steps: PLCStep[]) => {
    const now = new Date().toISOString();
    setProgram(currentProgram => {
      const updatedProgram: PLCProgram = {
        ...currentProgram,
        steps,
        totalSteps: steps.length,
        modified: now,
      };
      handleChange('plcProgram', updatedProgram);
      return updatedProgram;
    });
  }, [handleChange]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">PLC Configuration</h2>
      
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => setActiveTab('basic')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'basic'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Basic Configuration
          </button>
          <button
            onClick={() => setActiveTab('io')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'io'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            I/O Configuration
          </button>
          <button
            onClick={() => setActiveTab('programming')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'programming'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Ladder Logic
          </button>
        </nav>
      </div>

      <div className="pt-4">
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
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
                I/O Configuration Summary
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Digital Inputs</div>
                  <div className="text-lg font-semibold">
                    {ioList.filter(io => io.type === 'INPUT' && io.dataType === 'BOOL').length}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Digital Outputs</div>
                  <div className="text-lg font-semibold">
                    {ioList.filter(io => io.type === 'OUTPUT' && io.dataType === 'BOOL').length}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Analog I/Os</div>
                  <div className="text-lg font-semibold">
                    {ioList.filter(io => io.dataType !== 'BOOL').length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'io' && (
          <IOListConfig 
            onBack={() => setActiveTab('basic')}
            projectName={formData.projectName || ''}
            companyName={formData.companyName || ''}
          />
        )}

        {activeTab === 'programming' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <PLCProvider
                initialSteps={program.steps || []}
                ioList={ioList}
                onProgramChange={handleProgramChange}
              >
                <LadderLogicEditor />
              </PLCProvider>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedPLCConfiguration;
