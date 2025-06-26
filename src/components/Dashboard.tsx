import React from 'react';
import { FileText, Clock, Users, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { User, RFQ, Quote, Vendor, Order } from '@/types';

interface DashboardProps {
  currentUser: User;
  rfqs: RFQ[];
  quotes: Quote[];
  vendors: Vendor[];
  orders: Order[];
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, rfqs, quotes, vendors, orders }) => {
  // Calculate metrics
  const activeRfqs = rfqs.filter(rfq => rfq.status === 'open').length;
  const pendingQuotes = quotes.filter(quote => quote.status === 'pending').length;
  const totalVendors = vendors.filter(vendor => vendor.status === 'Active').length;
  const totalOrderValue = orders.reduce((sum, order) => sum + order.amount, 0);

  // Status badge styling helper
  const getStatusBadge = (status: string, type: 'rfq' | 'quote' | 'order' = 'rfq') => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide";
    
    if (type === 'rfq') {
      switch (status) {
        case 'open':
          return `${baseClasses} bg-emerald-100 text-emerald-700 border border-emerald-200`;
        case 'closed':
          return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
        default:
          return `${baseClasses} bg-amber-100 text-amber-700 border border-amber-200`;
      }
    }
    
    if (type === 'quote') {
      switch (status) {
        case 'pending':
          return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`;
        case 'approved':
          return `${baseClasses} bg-green-100 text-green-700 border border-green-200`;
        case 'rejected':
          return `${baseClasses} bg-red-100 text-red-700 border border-red-200`;
        default:
          return `${baseClasses} bg-yellow-100 text-yellow-700 border border-yellow-200`;
      }
    }

    return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const statCards = [
    {
      title: 'Active RFQs',
      value: activeRfqs,
      icon: FileText,
      color: 'blue',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-700',
      change: '+12%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Pending Quotes',
      value: pendingQuotes,
      icon: Clock,
      color: 'amber',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
      iconColor: 'text-amber-600',
      valueColor: 'text-amber-700',
      change: '+5%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Active Vendors',
      value: totalVendors,
      icon: Users,
      color: 'emerald',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      iconColor: 'text-emerald-600',
      valueColor: 'text-emerald-700',
      change: '+8%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Order Value',
      value: formatCurrency(totalOrderValue),
      icon: Package,
      color: 'purple',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      iconColor: 'text-purple-600',
      valueColor: 'text-purple-700',
      change: '+15%',
      changeColor: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Dashboard
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Welcome back, <span className="font-medium text-gray-800">{currentUser.name}</span>
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <div className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Performance Up</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className={`${stat.bgColor} p-6 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 group`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className={`text-2xl font-bold ${stat.valueColor} mb-2`}>
                      {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
                    </p>
                    <div className="flex items-center">
                      <span className={`text-xs font-semibold ${stat.changeColor}`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-white/60 group-hover:bg-white/80 transition-colors duration-300`}>
                    <IconComponent className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Recent RFQs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent RFQs</h3>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  View All
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200/50">
              {rfqs.slice(0, 4).map((rfq: RFQ) => (
                <div key={rfq.id} className="p-6 hover:bg-gray-50/50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {rfq.title}
                        </h4>
                        <span className={getStatusBadge(rfq.status, 'rfq')}>
                          {rfq.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Deadline: {formatDate(rfq.deadline)}
                        </span>
                        <p className="font-medium text-gray-900">Budget: {rfq.budget?.toLocaleString() ?? 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Quotes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Quotes</h3>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  View All
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200/50">
              {quotes.slice(0, 4).map((quote: Quote) => (
                <div key={quote.id} className="p-6 hover:bg-gray-50/50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {quote.vendorName}
                        </h4>
                        <span className={getStatusBadge(quote.status, 'quote')}>
                          {quote.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(quote.amount)}
                        </span>
                        <span>Submitted: {formatDate(quote.submittedDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alert Section */}
        <div className="mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  System Update
                </h4>
                <p className="text-sm text-blue-700">
                  New vendor management features are now available. Check out the enhanced vendor rating system and automated quote comparison tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;