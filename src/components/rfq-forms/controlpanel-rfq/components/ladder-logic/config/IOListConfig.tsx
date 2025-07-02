import React, { useState } from 'react';
import { Plus, Trash2, Database } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { IOPoint } from '@/components/rfq-forms/controlpanel-rfq/types/plc-types';

interface IOListConfigProps {
  ioList: IOPoint[];
  onIOListChange: (newList: IOPoint[]) => void;
}

const IOListConfig: React.FC<IOListConfigProps> = ({ ioList, onIOListChange }) => {
  const [newPoint, setNewPoint] = useState({
    name: '',
    address: '',
    type: 'INPUT' as 'INPUT' | 'OUTPUT',
    label: '',
    description: '',
  });
  const [showValidation, setShowValidation] = useState(false);

  const handlePointUpdate = (pointId: string, updatedData: Partial<Omit<IOPoint, 'id'>>) => {
    const newList = ioList.map(p => (p.id === pointId ? { ...p, ...updatedData } : p));
    onIOListChange(newList);
  };

  const deletePoint = (id: string) => {
    const newList = ioList.filter(p => p.id !== id);
    onIOListChange(newList);
  };

  const addNewPoint = () => {
    if (!newPoint.address.trim() || !newPoint.label.trim()) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);

    const pointToAdd: IOPoint = {
      ...newPoint,
      id: uuidv4(),
      dataType: 'BOOL',
      name: newPoint.label,
    };

    onIOListChange([...ioList, pointToAdd]);

    setNewPoint({
      name: '',
      address: '',
      type: 'INPUT',
      label: '',
      description: '',
    });
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="grid grid-cols-11 gap-4 font-semibold text-gray-700 text-sm uppercase tracking-wide">
            <div className="col-span-2">Address</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-3">Label</div>
            <div className="col-span-3">Description</div>
            <div className="col-span-1 text-center">Actions</div>
          </div>
        </div>

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
                      onBlur={(e) => handlePointUpdate(point.id!, { label: e.target.value, name: e.target.value })}
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
                      onClick={() => deletePoint(point.id!)}
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
  );
};

export default IOListConfig;
