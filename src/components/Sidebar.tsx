import React from 'react';
import { FileText, DollarSign, Users, Package, Home, LogOut } from 'lucide-react';
import { User } from '@/types';
import { supabase } from '@/utils/supabaseClient';

interface SidebarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setCurrentUser: (user: User | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, activeTab, setActiveTab, setCurrentUser }) => {
  type MenuItem = {
  id: string;
  label: string;
  icon: React.ElementType;
};

const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'rfqs', label: 'RFQ Management', icon: FileText },
    { id: 'quotes', label: 'Quote Comparison', icon: DollarSign },
    { id: 'vendors', label: 'Vendor Management', icon: Users },
    { id: 'orders', label: 'Purchase Orders', icon: Package },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  const handleSignOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      return;
    }
    setCurrentUser(null);
  };

  const getUserInitial = (name: string | undefined): string => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const getRoleDisplayName = (role: string | undefined): string => {
    if (!role) return 'User';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="bg-white w-64 min-h-screen shadow-lg border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Vendor Portal</h1>
        <p className="text-sm text-gray-600 capitalize">{currentUser?.role} Panel</p>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 flex-grow">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          {currentUser?.avatarUrl ? (
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {getUserInitial(currentUser?.name)}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-gray-800">{currentUser?.name}</p>
            <p className="text-xs text-gray-600 capitalize">{getRoleDisplayName(currentUser?.role)}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;