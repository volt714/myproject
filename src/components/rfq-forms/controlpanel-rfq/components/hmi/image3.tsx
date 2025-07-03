import React, { useState } from 'react';

export default function OperatorSelectionInterface() {
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [operatorCount, setOperatorCount] = useState('######');

  const operators = [
    { id: 'CB_0', code: 'LW-682', name: 'RAJESH KUMAR SINGH', adCode: 'AD_0 (RW-748)' },
    { id: 'CB_1', code: 'LW-682', name: 'PRIYA SHARMA PATEL', adCode: 'AD_1 (RW-749)' },
    { id: 'CB_2', code: 'LW-682', name: 'MOHAMMED AHMED KHAN', adCode: 'AD_2 (RW-750)' },
    { id: 'CB_3', code: 'LW-682', name: 'DEEPIKA LAKSHMI RAO', adCode: 'AD_3 (RW-746)' },
    { id: 'CB_4', code: 'LW-682', name: 'ARJUN VISHNU NAIR', adCode: 'AD_4 (RW-760)' }
  ];

    const handleOperatorSelect = (operatorId: string) => {
    setSelectedOperator(operatorId);
  };

  const handleUpdateClose = () => {
    // Handle update and close logic
    console.log('Update & Close clicked');
  };

  const handleReset = () => {
    setSelectedOperator(null);
    setOperatorCount('######');
  };

  return (
    <div className="bg-black min-h-screen p-4 text-white">
      {/* Header */}
      <div className="text-red-500 text-sm mb-4">
        TB_0
      </div>

      {/* Main Content */}
      <div className="border-2 border-white">
        {/* Table Header */}
        <div className="flex border-b border-white">
          <div className="w-1/3 p-3 border-r border-white">
            <h2 className="text-2xl font-bold text-white">Selection</h2>
          </div>
          <div className="w-2/3 p-3">
            <h2 className="text-2xl font-bold text-white">Operator Name</h2>
          </div>
        </div>

        {/* Operator Rows */}
        {operators.map((operator, index) => (
          <div key={operator.id} className="flex border-b border-white">
            <div className="w-1/3 p-3 border-r border-white">
              <button
                onClick={() => handleOperatorSelect(operator.id)}
                className={`w-full p-2 rounded text-black font-semibold transition-colors ${
                  selectedOperator === operator.id 
                    ? 'bg-yellow-300 border-2 border-yellow-400' 
                    : 'bg-white hover:bg-gray-200'
                }`}
              >
                <div className="text-red-600 text-xs">
                  {operator.id} ({operator.code})
                </div>
                <div className="text-lg">
                  Operator {index + 1}
                </div>
              </button>
            </div>
            <div className="w-2/3 p-3">
              <div className="bg-gray-200 p-2 rounded text-black">
                <div className="text-red-600 text-xs">
                  {operator.adCode}
                </div>
                <div className="text-lg font-semibold">
                  {operator.name}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-4">
          <div className="text-white">
            <div className="text-sm">Minimum</div>
            <div className="text-sm">Operator</div>
            <div className="text-sm">Count</div>
          </div>
          <div className="bg-white text-black px-3 py-2 rounded">
            <div className="text-red-600 text-xs">ND_0 (Operator Count: RW-390)</div>
            <div className="text-lg font-mono">{operatorCount}</div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleUpdateClose}
            className="bg-white text-black px-6 py-3 rounded font-semibold hover:bg-gray-200 transition-colors"
          >
            <div className="text-red-600 text-xs">CB_5 (LW-682)</div>
            <div className="text-lg">Update & Close</div>
          </button>
          <button
            onClick={handleReset}
            className="bg-white text-black px-6 py-3 rounded font-semibold hover:bg-gray-200 transition-colors"
          >
            <div className="text-red-600 text-xs">CB_6</div>
            <div className="text-lg">Reset</div>
          </button>
        </div>
      </div>
    </div>
  );
}