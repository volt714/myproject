import React, { useState, useCallback, useMemo, FC } from 'react';
import { Search, Plus, AlertCircle, Eye, Edit } from 'lucide-react';
import ControlPanelRfqForm from '../rfq-forms/ControlPanelRfqForm';
import MechanicalAssemblyRfqForm from '../rfq-forms/MechanicalAssemblyRfqForm';
import FixturesRfqForm from '../rfq-forms/FixturesRfqForm';
import { RFQ, RFQStatus, ModalType } from '@/types';

export type FilterStatus = 'all' | RFQStatus;

interface RFQManagementProps {
  rfqs: RFQ[];
  onOpenModal: (type: ModalType, item?: RFQ) => void;
  isLoading?: boolean;
  error?: string | null;
}

const STATUS_STYLES: Record<RFQStatus, string> = {
  'open': 'bg-green-100 text-green-800 border-green-200',
  'closed': 'bg-gray-100 text-gray-800 border-gray-200',
  'in_progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'awarded': 'bg-blue-100 text-blue-800 border-blue-200',
};

const RFQManagement: FC<RFQManagementProps> = ({
  rfqs = [],
  onOpenModal,
  isLoading = false,
  error = null,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'list' | 'control-panel' | 'mechanical-assembly' | 'fixtures'>('list');
  
  // RFQ types that can be created
  const rfqTypes = [
    { id: 'control-panel', label: 'Control Panel' },
    { id: 'mechanical-assembly', label: 'Mechanical Assembly' },
    { id: 'fixtures', label: 'Fixtures' },
    // Add more types here as needed
  ] as const;
  
  const handleRfqTypeSelect = useCallback((typeId: 'control-panel' | 'mechanical-assembly' | 'fixtures') => {
    setIsDropdownOpen(false);
    setCurrentView(typeId);
  }, []);

  const filteredRfqs = useMemo(() => {
    if (!Array.isArray(rfqs)) return [];

    return rfqs.filter((rfq: RFQ) => {
      const matchesSearch = 
        rfq.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rfq.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rfq.id?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filterStatus === 'all' || 
        rfq.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  }, [rfqs, searchTerm, filterStatus]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value as FilterStatus);
  }, []);

  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString; // Fallback to original string if parsing fails
    }
  }, []);

  if (currentView === 'control-panel') {
    return <ControlPanelRfqForm onBack={() => setCurrentView('list')} />;
  }

  if (currentView === 'mechanical-assembly') {
    return <MechanicalAssemblyRfqForm onBack={() => setCurrentView('list')} />;
  }

  if (currentView === 'fixtures') {
    return <FixturesRfqForm onBack={() => setCurrentView('list')} />;
  }

  if (error) {
    return (
      <div className="space-y-6 p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-800">Error Loading RFQs</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RFQ Management</h1>
          <p className="text-sm text-gray-600">
            Manage your Request for Quotation records
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2 font-medium"
            aria-label="Create new RFQ"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <Plus className="h-4 w-4" />
            Create RFQ
          </button>
          
          {isDropdownOpen && (
            <>
              {/* Click outside handler */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsDropdownOpen(false)}
              />
              
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {rfqTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleRfqTypeSelect(type.id)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search-rfqs" className="sr-only">
                Search RFQs
              </label>
              <div className="relative">
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" 
                  aria-hidden="true"
                />
                <input
                  id="search-rfqs"
                  type="text"
                  placeholder="Search by title, category, or ID..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  aria-describedby="search-help"
                />
              </div>
              <p id="search-help" className="sr-only">
                Search RFQs by title, category, or ID
              </p>
            </div>
            
            <div className="sm:w-48">
              <label htmlFor="status-filter" className="sr-only">
                Filter by status
              </label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="in_progress">In Progress</option>
                <option value="awarded">Awarded</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Showing {filteredRfqs.length} of {rfqs.length} RFQs
              {searchTerm && (
                <span className="ml-1">
                  matching &quot;{searchTerm}&quot;
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading RFQs...</p>
            </div>
          ) : filteredRfqs.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No RFQs found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first RFQ.'}
              </p>
            </div>
          ) : (
            <table className="w-full" role="table">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RFQ ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRfqs.map((rfq) => (
                  <tr 
                    key={rfq.id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {rfq.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={rfq.title}>
                        {rfq.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {rfq.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(rfq.budget ?? 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {formatDate(rfq.deadline)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          STATUS_STYLES[rfq.status] || STATUS_STYLES['open']
                        }`}
                      >
                        {rfq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenModal('viewRfq', rfq)}
                          className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded transition-colors p-1"
                          aria-label={`View RFQ ${rfq.id}`}
                          title="View RFQ"
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => onOpenModal('editRfq', rfq)}
                          className="text-yellow-600 hover:text-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded transition-colors p-1"
                          aria-label={`Edit RFQ ${rfq.id}`}
                          title="Edit RFQ"
                        >
                          <Edit className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default RFQManagement;