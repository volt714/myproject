import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { Settings, Plus, Trash2, Database, ArrowLeft } from 'lucide-react';
import { IOPoint } from '../types/plc';

interface PLCIOConfigurationProps {
  onBack: () => void;
  projectName: string;
  companyName: string;
}

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const PLCIOConfiguration: React.FC<PLCIOConfigurationProps> = ({ onBack, projectName, companyName }) => {
  const { data: ioList = [], mutate, error } = useSWR<IOPoint[]>(`/api/io?project_name=${projectName}&company_name=${companyName}`, fetcher);

  const [newPoint, setNewPoint] = useState<Omit<IOPoint, 'id' | 'dataType'>>({
    address: '',
    type: 'INPUT',
    label: '',
    description: '',
  });
  
  const [showValidation, setShowValidation] = useState(false);

  const inputCount = ioList.filter(point => point.type === 'INPUT').length;
  const outputCount = ioList.filter(point => point.type === 'OUTPUT').length;

  const handlePointUpdate = async (pointId: string, updatedData: Partial<IOPoint>) => {
    const optimisticData = ioList.map(p => p.id === pointId ? { ...p, ...updatedData } : p);
    await mutate(axios.put(`/api/io/${pointId}`, updatedData).then(() => optimisticData), {
      optimisticData,
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    });
  };

  const deletePoint = async (id: string | undefined) => {
    if (id === undefined) return;

    const optimisticData = ioList.filter(p => p.id !== id);
    await mutate(axios.delete(`/api/io/${id}`).then(() => optimisticData), {
      optimisticData,
      rollbackOnError: true,
      populateCache: true,
      revalidate: true, // Revalidate after delete
    });
  };

  const addNewPoint = async () => {
    if (!newPoint.address.trim() || !newPoint.label.trim()) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    
    const pointToAdd = { ...newPoint, project_name: projectName, company_name: companyName };

    await mutate(async (currentData = []) => {
      const { data: addedPoint } = await axios.post('/api/io', pointToAdd);
      return [...currentData, addedPoint];
    }, {
      optimisticData: [...ioList, { ...newPoint, id: 'temp-id', dataType: 'BOOL' }],
      rollbackOnError: true,
      populateCache: true,
      revalidate: true,
    });
    
    setNewPoint({
      address: '',
      type: 'INPUT',
      label: '',
      description: '',
    });
  };

  const validateForm = React.useCallback(() => {
    const isValid = newPoint.address.trim() && newPoint.label.trim();
    setShowValidation(!isValid && (newPoint.address.trim().length > 0 || newPoint.label.trim().length > 0));
  }, [newPoint.address, newPoint.label]);

  useEffect(() => {
    validateForm();
  }, [validateForm, newPoint.address, newPoint.label]);

  if (error) return <div>Failed to load I/O list.</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Go Back"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Settings className="w-6 h-6 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">I/O Configuration</h1>
              </div>
              <p className="text-gray-600">
                Configure I/O points for <span className="font-semibold">{projectName}</span> at <span className="font-semibold">{companyName}</span>
              </p>
            </div>
            
            {/* Statistics Cards */}
            <div className="flex gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-blue-600">{inputCount}</div>
                <div className="text-sm text-blue-600 font-medium">Inputs</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-green-600">{outputCount}</div>
                <div className="text-sm text-green-600 font-medium">Outputs</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-gray-600">{ioList.length}</div>
                <div className="text-sm text-gray-600 font-medium">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Configuration Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="grid grid-cols-11 gap-4 font-semibold text-gray-700 text-sm uppercase tracking-wide">
              <div className="col-span-2">Address</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-3">Label</div>
              <div className="col-span-3">Description</div>
              <div className="col-span-1 text-center">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {ioList.length === 0 ? (
              <div className="p-12 text-center">
                <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No I/O points configured</p>
                <p className="text-gray-400 mt-2">Add your first I/O point using the form below</p>
              </div>
            ) : (
              ioList.map((point) => (
                <div key={point.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-11 gap-4 items-center">
                    <div className="col-span-2">
                      <input
                        type="text"
                        defaultValue={point.address}
                        onBlur={(e) => handlePointUpdate(point.id!, { address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono text-sm"
                        placeholder="X0, Y0"
                      />
                    </div>
                    <div className="col-span-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${point.type === 'INPUT' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {point.type}
                        </span>
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        defaultValue={point.label}
                        onBlur={(e) => handlePointUpdate(point.id!, { label: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Label"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        defaultValue={point.description}
                        onBlur={(e) => handlePointUpdate(point.id!, { description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Description"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        onClick={() => deletePoint(point.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete I/O Point"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add New Point Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-8 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Plus className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Add New I/O Point</h2>
          </div>
          
          <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={newPoint.address}
                onChange={(e) => setNewPoint({ ...newPoint, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono text-sm"
                placeholder="X0, Y0"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={newPoint.type}
                onChange={(e) => setNewPoint({ ...newPoint, type: e.target.value as 'INPUT' | 'OUTPUT' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="INPUT">Input</option>
                <option value="OUTPUT">Output</option>
              </select>
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
              <input
                type="text"
                value={newPoint.label}
                onChange={(e) => setNewPoint({ ...newPoint, label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Label"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={newPoint.description}
                onChange={(e) => setNewPoint({ ...newPoint, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Optional description"
              />
            </div>
            <div className="col-span-1">
              <button
                onClick={addNewPoint}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                title="Add I/O Point"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {showValidation && (
            <div className="mt-3 text-sm text-gray-500">
              <span className="text-red-500">*</span> Address and Label are required fields
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PLCIOConfiguration; 