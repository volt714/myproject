'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import RFQManagement from '@/components/RFQManagement';
import VendorManagement from '@/components/VendorManagement';
import QuoteComparison from '@/components/QuoteComparison';
import PurchaseOrders from '@/components/PurchaseOrders';
import DocumentManagement from '@/components/DocumentManagement';
import LoginScreen from '@/components/LoginScreen';
import SignUpScreen from '@/components/SignUpScreen';
import Modal from '@/components/Modal';
import { User, RFQ, Quote, Vendor, Order, ModalType } from '@/types';
import { supabase } from '@/utils/supabaseClient';

// Sample Data aligned with new types
const sampleRfqs: RFQ[] = [
  {
    id: '1',
    rfqId: 'RFQ-001',
    title: 'Office Supplies for Q4',
    description: 'Comprehensive list of office supplies including stationery, printer cartridges, and cleaning materials.',
    category: 'Office Supplies',
    status: 'open',
    createdDate: '2023-10-01T10:00:00Z',
    deadline: '2023-10-15T17:00:00Z',
    budget: 5000,
    items: [{ name: 'A4 Paper Ream', quantity: 100 }, { name: 'Black Ballpoint Pens', quantity: 500 }],
    vendorIds: ['1', '2'],
  },
  {
    id: '2',
    rfqId: 'RFQ-002',
    title: 'New Laptops for Dev Team',
    description: '15 high-performance laptops for the development team, meeting specified hardware requirements.',
    category: 'IT Equipment',
    status: 'in_progress',
    createdDate: '2023-10-05T11:30:00Z',
    deadline: '2023-10-20T17:00:00Z',
    budget: 25000,
    items: [{ name: 'Developer Laptop Model X', quantity: 15 }],
    vendorIds: ['2'],
  },
  {
    id: '3',
    rfqId: 'RFQ-003',
    title: 'Annual Website Maintenance',
    description: 'Yearly contract for website maintenance, including security updates and performance monitoring.',
    category: 'IT Services',
    status: 'open',
    createdDate: '2023-10-12T14:00:00Z',
    deadline: '2023-10-30T17:00:00Z',
    budget: 8000,
    items: [{ name: 'Annual Maintenance Contract', quantity: 1 }],
    vendorIds: ['2'],
  },
];

const sampleQuotes: Quote[] = [
  {
    id: '1',
    rfqId: 'RFQ-001',
    vendorId: '1',
    vendorName: 'Global Office Supplies',
    amount: 4850.50,
    status: 'pending',
    submittedDate: '2023-10-03T14:00:00Z',
    validUntil: '2023-11-03T14:00:00Z',
    deliveryTime: '5 business days',
    items: [{ description: 'Bulk office supplies pack', price: 4850.50 }],
  },
  {
    id: '2',
    rfqId: 'RFQ-001',
    vendorId: '2',
    vendorName: 'Tech Solutions Inc.',
    amount: 4950.00,
    status: 'pending',
    submittedDate: '2023-10-04T11:00:00Z',
    validUntil: '2023-11-04T11:00:00Z',
    deliveryTime: '7 business days',
    items: [{ description: 'Office supplies kit', price: 4950.00 }],
  },
  {
    id: '3',
    rfqId: 'RFQ-002',
    vendorId: '2',
    vendorName: 'Tech Solutions Inc.',
    amount: 24500.00,
    status: 'approved',
    submittedDate: '2023-10-10T09:00:00Z',
    validUntil: '2023-11-10T09:00:00Z',
    deliveryTime: '10 business days',
    items: [{ description: '15x Developer Laptop Model X', price: 24500.00 }],
  },
  {
    id: '4',
    rfqId: 'RFQ-001',
    vendorId: '1',
    vendorName: 'Global Office Supplies',
    amount: 4750.00,
    status: 'under_review',
    submittedDate: '2023-10-05T16:00:00Z',
    validUntil: '2023-11-05T16:00:00Z',
    deliveryTime: '6 business days',
    items: [{ description: 'Economy office supplies pack', price: 4750.00 }],
  },
  {
    id: '5',
    rfqId: 'RFQ-002',
    vendorId: '1',
    vendorName: 'Global Office Supplies',
    amount: 25500.00,
    status: 'rejected',
    submittedDate: '2023-10-11T13:20:00Z',
    validUntil: '2023-11-11T13:20:00Z',
    deliveryTime: '14 business days',
    items: [{ description: '15x Standard Laptop Model S', price: 25500.00 }],
  },
  {
    id: '6',
    rfqId: 'RFQ-003',
    vendorId: '2',
    vendorName: 'Tech Solutions Inc.',
    amount: 7800.00,
    status: 'pending',
    submittedDate: '2023-10-15T10:00:00Z',
    validUntil: '2023-11-15T10:00:00Z',
    deliveryTime: 'N/A',
    items: [{ description: 'Annual Maintenance Contract', price: 7800.00 }],
  },
];

const sampleVendors: Vendor[] = [
  {
    id: '1',
    name: 'Global Office Supplies',
    contactPerson: 'Jane Doe',
    email: 'jane.d@globalofficesupplies.com',
    phone: '123-456-7890',
    address: '123 Supply Chain Ave, Business City, 12345',
    specialties: ['Office Supplies', 'Furniture'],
    rating: 4.8,
    status: 'Active',
    totalOrders: 25,
  },
  {
    id: '2',
    name: 'Tech Solutions Inc.',
    contactPerson: 'John Smith',
    email: 'j.smith@techsolutions.com',
    phone: '987-654-3210',
    address: '456 Tech Park, Silicon Valley, 67890',
    specialties: ['IT Equipment', 'Software'],
    rating: 4.5,
    status: 'Active',
    totalOrders: 15,
  },
];

const sampleOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'PO-2023-001',
    rfqId: 'RFQ-001',
    vendorId: '1',
    vendorName: 'Global Office Supplies',
    amount: 4850.50,
    orderDate: '2023-10-25T10:00:00Z',
    expectedDeliveryDate: '2023-11-01T17:00:00Z',
    status: 'shipped',
    priority: 'High',
    items: [
      { id: 'item-1', description: 'A4 Paper Ream', quantity: 100, unitPrice: 25.00 },
      { id: 'item-2', description: 'Black Ballpoint Pens', quantity: 500, unitPrice: 4.70 },
    ],
  },
];

export default function VendorManagementApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rfqs] = useState<RFQ[]>(sampleRfqs);
  const [quotes] = useState<Quote[]>(sampleQuotes);
  const [vendors] = useState<Vendor[]>(sampleVendors);
  const [orders] = useState<Order[]>(sampleOrders);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedItem, setSelectedItem] = useState<RFQ | Vendor | Quote | Order | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setCurrentUser(null);
        } else if (profile) {
          const user: User = {
            id: profile.id,
            name: profile.full_name,
            role: profile.role,
            email: session.user.email!,
            avatarUrl: profile.avatar_url,
          };
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleOpenModal = (type: ModalType, item: RFQ | Vendor | Quote | Order | null = null) => {
    setModalType(type);
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    if (authView === 'signup') {
      return <SignUpScreen onSignUpSuccess={() => setAuthView('login')} onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <LoginScreen onLogin={handleLogin} onSwitchToSignUp={() => setAuthView('signup')} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setCurrentUser={setCurrentUser}
      />
      <main className="flex-1 p-8">
        {activeTab === 'dashboard' && (
          <Dashboard currentUser={currentUser} rfqs={rfqs} quotes={quotes} vendors={vendors} orders={orders} />
        )}
        {activeTab === 'rfqs' && (
          <RFQManagement
            rfqs={rfqs}
            onOpenModal={handleOpenModal}
          />
        )}
        {activeTab === 'quotes' && (
          <QuoteComparison rfqs={rfqs} quotes={quotes} />
        )}
        {activeTab === 'vendors' && (
          <VendorManagement
            vendors={vendors}
            onOpenModal={handleOpenModal}
          />
        )}
        {activeTab === 'documents' && <DocumentManagement />}
        {activeTab === 'orders' && <PurchaseOrders orders={orders} />}
        {modalType && (
          <Modal
            isOpen={!!modalType}
            onClose={handleCloseModal}
            modalType={modalType}
            item={selectedItem}
            // setItem={setSelectedItem} // This might be needed for forms inside the modal
          />
        )}
      </main>
    </div>
  );
}
