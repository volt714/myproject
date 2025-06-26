import React, { useState } from 'react';
import { Search, Plus, Eye, Edit, Star, Mail, Phone } from 'lucide-react';
import { Vendor, ModalType } from '@/types';

interface VendorManagementProps {
  vendors: Vendor[];
  onOpenModal: (type: ModalType, item?: Vendor) => void;
}

const VendorManagement: React.FC<VendorManagementProps> = ({ vendors, onOpenModal }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredVendors = vendors.filter((vendor: Vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.specialties.some(specialty => 
                           specialty.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesFilter = filterCategory === 'all' || vendor.specialties.includes(filterCategory);
    return matchesSearch && matchesFilter;
  });

  const categories = [...new Set(vendors.flatMap(vendor => vendor.specialties))];

  

  const getStatusColor = (status: Vendor['status']) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Vendor Management</h2>
          <p className="text-gray-600 mt-1">Manage your vendor relationships and partnerships</p>
        </div>
        <button
          onClick={() => onOpenModal('createVendor')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <Plus className="h-5 w-5" />
          Add New Vendor
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Search and Filter Bar */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="sm:w-64">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">All Categories</option>
                {categories.map((category: string) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Results Counter */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredVendors.length} of {vendors.length} vendors
          </div>
        </div>

        {/* Vendor Grid */}
        <div className="p-6">
          {filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or add a new vendor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVendors.map((vendor: Vendor) => (
                <div key={vendor.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                  {/* Vendor Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{vendor.name}</h3>
                                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                        {vendor.specialties[0]}
                      </span>
                    </div>
                    {renderStarRating(vendor.rating)}
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{vendor.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{vendor.phone}</span>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-2">
                      {vendor.specialties.map((specialty: string, index: number) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(vendor.status)}`}>
                      {vendor.status}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => onOpenModal('viewVendor', vendor)} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-b-lg hover:bg-gray-800 transition-colors">
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      <button onClick={() => onOpenModal('editVendor', vendor)} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-b-lg hover:bg-gray-800 transition-colors">
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorManagement;