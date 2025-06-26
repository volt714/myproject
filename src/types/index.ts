export type UserRole = 'admin' | 'vendor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  size: number; // in bytes
}

export type RFQStatus = 'open' | 'closed' | 'in_progress' | 'awarded';

export interface RFQ {
  id: string;
  rfqId: string;
  title: string;
  description: string;
  category: string;
  status: RFQStatus;
  createdDate: string;
  deadline: string;
  budget?: number;
  items: { name: string; quantity: number }[];
  vendorIds: string[];
  documents?: Document[];
}

export type QuoteStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

export interface Quote {
  id: string;
  rfqId: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  status: QuoteStatus;
  submittedDate: string;
  validUntil: string;
  deliveryTime: string;
  items: { description: string; price: number }[];
  notes?: string;
  documents?: Document[];
}

export type VendorStatus = 'Active' | 'Inactive';

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  specialties: string[];
  rating: number;
  status: VendorStatus;
  totalOrders: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';
export type OrderPriority = 'Low' | 'Medium' | 'High';

export interface OrderItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  rfqId: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  orderDate: string;
  expectedDeliveryDate: string;
  status: OrderStatus;
  priority: OrderPriority;
  items: OrderItem[];
}

export type ModalType = 'createRfq' | 'viewRfq' | 'editRfq' | 'createVendor' | 'viewVendor' | 'editVendor' | null;

// This is a simplified version for list views, not the main RFQ type
export interface RfqItem {
  id: string;
  title: string;
  status: 'Active' | 'Under Review' | 'Closed';
  createdDate: string;
  submissionDeadline: string;
  description: string;
}
