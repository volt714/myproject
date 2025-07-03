import React from 'react';

export default function IndustrialDashboard() {
  return (
    <div className="bg-blue-400 min-h-screen p-4 font-mono text-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <span className="text-black font-bold">02/07/2025</span>
          <span className="text-black font-bold">03:05:36 pm</span>
          <div className="bg-red-200 px-2 py-1 rounded">
            <span className="text-red-800">Shift: #0</span>
          </div>
          <div className="bg-yellow-200 px-2 py-1 rounded">
            <span className="text-yellow-800">AD_9(Machine By-402)</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-black font-bold">FANATICS</span>
          <span className="text-black">Line No: ##</span>
          <span className="text-black">Pneumatic</span>
        </div>
      </div>

      {/* Error Message */}
      <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4">
        <span className="font-bold">AAAAAAAAAAAAAAAAAAA</span>
        <span className="ml-4 text-red-800">Database Error: ##</span>
      </div>

      <div className="flex gap-4">
        {/* Left Panel - Job Information */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center">
            <label className="w-40 text-black font-semibold">Job Card Number</label>
            <input 
              type="text" 
              value="AAAAAAAAAAAAAAAAAAAAAAAAA" 
              readOnly
              className="flex-1 bg-gray-200 border border-gray-400 px-2 py-1 text-black"
            />
          </div>

          <div className="flex items-center">
            <label className="w-40 text-black font-semibold">Model Number</label>
            <input 
              type="text" 
              value="AAAAAAAAAAAAAAAAAAAAAA" 
              readOnly
              className="flex-1 bg-gray-200 border border-gray-400 px-2 py-1 text-black"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="w-40 text-black font-semibold">Job Qty</label>
            <input 
              type="text" 
              value="######" 
              readOnly
              className="w-24 bg-gray-200 border border-gray-400 px-2 py-1 text-black"
            />
            <span className="bg-blue-300 px-2 py-1 rounded text-blue-800">BL_1 (LD-39)</span>
          </div>

          <div className="flex items-center">
            <label className="w-40 text-black font-semibold">Job Time</label>
            <input 
              type="text" 
              value="######" 
              readOnly
              className="w-24 bg-gray-200 border border-gray-400 px-2 py-1 text-black"
            />
          </div>

          <div className="flex items-center">
            <label className="w-40 text-black font-semibold">Approved Qty</label>
            <input 
              type="text" 
              value="######" 
              readOnly
              className="w-24 bg-green-400 border border-gray-400 px-2 py-1 text-black"
            />
          </div>

          <div className="flex items-center">
            <label className="w-40 text-black font-semibold">Rework Qty</label>
            <input 
              type="text" 
              value="######" 
              readOnly
              className="w-24 bg-red-500 border border-gray-400 px-2 py-1 text-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="w-40 text-black font-semibold">Remain Qty/Time</label>
            <input 
              type="text" 
              value="######" 
              readOnly
              className="w-24 bg-gray-200 border border-gray-400 px-2 py-1 text-black"
            />
            <span className="bg-orange-300 px-2 py-1 rounded text-orange-800">3020+W+(14)</span>
          </div>

          <div className="flex items-center">
            <label className="w-40 text-black font-semibold">Operator Name</label>
            <input 
              type="text" 
              value="AAAAAAAAAAAAAAAAAAAAAAAAA" 
              readOnly
              className="flex-1 bg-gray-200 border border-gray-400 px-2 py-1 text-black"
            />
          </div>
        </div>

        {/* Right Panel - Status Indicators */}
        <div className="w-64 space-y-4">
          <div className="bg-yellow-200 px-3 py-2 rounded">
            <span className="text-yellow-800">SR Qty(Batch:10)</span>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mx-auto">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-500 font-bold">✓</span>
              </div>
            </div>
            <span className="text-center text-xs">CB_1 (LE-50)</span>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mx-auto">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-red-500 font-bold">✗</span>
              </div>
            </div>
            <span className="text-center text-xs">CB_0 (LE-50)</span>
          </div>

          <div className="bg-red-600 text-white px-4 py-3 rounded font-bold text-center">
            DB STOPPED
          </div>

          <div className="bg-red-600 text-white px-4 py-3 rounded font-bold text-center">
            USB DISCONNECTED
          </div>

          <div className="flex space-x-1 text-xs">
            <span>Ctr_3 (LW)</span>
            <span>Ctr_3 (LW)</span>
            <span>E</span>
            <span>Ctr_4 (LW)</span>
            <span>Ctr_5 (LW)</span>
            <span>A</span>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="mt-4 bg-cyan-400 p-2 rounded">
        <span className="text-black">HH:MM:SS     Jobcard: %(WATCH1)% |</span>
      </div>

      {/* Bottom Panel */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <div className="flex space-x-2">
            <button className="bg-red-500 text-white px-4 py-2 rounded">
              CB_8 (RW_BL-105) Manual
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded">
              CB_7 (RW_BL-101) Machine
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-cyan-300 px-3 py-2 rounded">
            <span className="text-cyan-800">CB_9 (10)</span>
          </div>
          <div className="bg-cyan-300 px-3 py-2 rounded">
            <span className="text-cyan-800">CYC_ST AAAAAAAA</span>
          </div>
          <div className="bg-cyan-300 px-3 py-2 rounded">
            <span className="text-cyan-800">CYC_END AAAAAAAA</span>
          </div>
          <div className="text-yellow-400 font-bold">K O</div>
        </div>
      </div>
    </div>
  );
}