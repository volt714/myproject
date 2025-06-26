import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { X, FileText } from 'lucide-react';
import { ModalType, User, RFQ, Quote, Vendor, Order, Document } from '@/types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: ModalType;
  item: User | RFQ | Quote | Vendor | Order | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, modalType, item }) => {
  const [formData, setFormData] = useState<Partial<RFQ>>({});

  useEffect(() => {
    if (item && (modalType === 'editRfq' || modalType === 'viewRfq')) {
      setFormData(item as RFQ);
    } else {
      setFormData({});
    }
  }, [item, modalType]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    onClose();
  };

  const renderContent = () => {
    switch (modalType) {
      case 'createRfq':
      case 'editRfq':
        return (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">{modalType === 'createRfq' ? 'Create New RFQ' : 'Edit RFQ'}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            {/* Add more form fields for RFQ here */}
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
            </div>
          </form>
        );
      case 'viewRfq':
        const rfq = item as RFQ;
        if (!rfq) return null;
        return (
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">RFQ Details</h3>
            <div><strong>Title:</strong> {rfq.title}</div>
            <div><strong>Status:</strong> {rfq.status}</div>
            <div><strong>Description:</strong> {rfq.description}</div>
            <div><strong>Budget:</strong> ${rfq.budget?.toLocaleString()}</div>
            <div><strong>Deadline:</strong> {new Date(rfq.deadline).toLocaleDateString()}</div>
            {rfq.documents && rfq.documents.length > 0 && (
              <div>
                <strong>Documents:</strong>
                <div className="space-y-2 mt-2">
                  {rfq.documents.map((doc: Document) => (
                    <div key={doc.id} className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{doc.name}</a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end pt-4">
              <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Close</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
        {renderContent()}
      </div>
    </div>
  );
};

export default Modal;