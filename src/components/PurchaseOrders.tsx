import React from 'react';
import { Plus, Eye, Calendar, Truck, Building2, Package, FileText, Download } from 'lucide-react';
import { Order, OrderPriority } from '@/types';

interface PurchaseOrdersProps {
  orders: Order[];
}

const PurchaseOrders: React.FC<PurchaseOrdersProps> = ({ orders }) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'in_transit':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: OrderPriority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Purchase Orders
                </h1>
                <p className="text-gray-600 mt-1">Manage and track your procurement orders</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 shadow-sm">
                <Download className="h-4 w-4" />
                Export
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <Plus className="h-4 w-4" />
                Create Purchase Order
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'confirmed').length}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <Truck className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map(order => (
            <div key={order.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">PO #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-500">RFQ #{order.rfqId}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)} capitalize`}>
                      {order.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </span>
                  </div>
                </div>

                {/* Vendor */}
                <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                  <Building2 className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">{order.vendorName}</span>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      Order Date
                    </div>
                    <p className="font-semibold text-gray-900">{formatDate(order.orderDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Truck className="h-3 w-3" />
                      Delivery Date
                    </div>
                    <p className="font-semibold text-gray-900">{formatDate(order.expectedDeliveryDate)}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Order Items ({order.items.length})
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.description}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 ml-3">
                          ${item.unitPrice.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      ${order.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 group-hover:scale-110">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 group-hover:scale-110">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if needed) */}
        {orders.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Purchase Orders</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first purchase order</p>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 mx-auto">
              <Plus className="h-4 w-4" />
              Create Purchase Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrders;