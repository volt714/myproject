import React, { FC } from 'react';

interface MechanicalAssemblyRfqFormProps {
  onBack: () => void;
}

const MechanicalAssemblyRfqForm: FC<MechanicalAssemblyRfqFormProps> = ({ onBack }) => {
  return (
    <div className="p-4">
      <button onClick={onBack} className="text-blue-600 hover:underline mb-4">
        &larr; Back to RFQ List
      </button>
      <h1 className="text-2xl font-bold text-gray-900">Create Mechanical Assembly RFQ</h1>
      <p className="text-gray-600 mt-2">This is the form for gathering information for a Mechanical Assembly RFQ.</p>
      {/* Form fields will go here */}
    </div>
  );
};

export default MechanicalAssemblyRfqForm;
