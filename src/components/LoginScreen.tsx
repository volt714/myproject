import React, { useState, FormEvent } from 'react';

// Type definitions
interface User {
  id: string;
  name: string;
  role: 'admin' | 'vendor';
  email: string;
  avatarUrl?: string;
}

interface LoginData {
  email: string;
  password: string;
  role: 'admin' | 'vendor';
}

interface LoginScreenProps {
  onLogin?: (user: User) => void; // preferred
  setCurrentUser?: (user: User) => void; // legacy fallback
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, setCurrentUser }) => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
    role: 'admin'
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    
    if (!loginData.email.trim() || !loginData.password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Demo authentication logic
      const isValidLogin = (
        (loginData.email === 'admin@company.com' && loginData.password === 'password' && loginData.role === 'admin') ||
        (loginData.email === 'vendor@company.com' && loginData.password === 'password' && loginData.role === 'vendor')
      );

      if (!isValidLogin) {
        setError('Invalid credentials. Please check your email, password, and role.');
        return;
      }

      const user: User = {
        id: loginData.role === 'admin' ? 'admin_001' : 'vendor_001',
        name: loginData.role === 'admin' ? 'System Administrator' : 'Vendor Representative',
        role: loginData.role,
        email: loginData.email,
        avatarUrl: `https://i.pravatar.cc/150?u=${loginData.email}`,
      };

      if (onLogin) {
        onLogin(user);
      } else if (setCurrentUser) {
        setCurrentUser(user);
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setLoginData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Management</h1>
          <p className="text-gray-600 text-sm">Welcome back! Please sign in to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={loginData.email}
              onChange={handleInputChange('email')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={loginData.password}
              onChange={handleInputChange('password')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="role">Role</label>
            <select
              id="role"
              value={loginData.role}
              onChange={handleInputChange('role') as any}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="admin">Admin</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2 text-center">Demo Credentials</p>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span className="font-medium">Admin:</span>
              <span>admin@company.com / password</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Vendor:</span>
              <span>vendor@company.com / password</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Protected by enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;