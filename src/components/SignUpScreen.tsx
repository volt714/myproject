import React, { useState, FormEvent } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { User } from '@/types';

interface SignUpScreenProps {
  onSignUpSuccess: () => void;
  onSwitchToLogin: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUpSuccess, onSwitchToLogin }) => {
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'vendor' as 'admin' | 'vendor',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (field: keyof typeof signupData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSignupData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    if (!signupData.fullName || !signupData.email || !signupData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: signupData.fullName,
          role: signupData.role,
        });

        if (profileError) {
          setError(profileError.message);
        } else {
          alert('Sign-up successful! Please check your email for confirmation.');
          onSignUpSuccess();
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Join our vendor portal today</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="text-sm font-medium text-gray-700 block mb-2">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={signupData.fullName}
              onChange={handleInputChange('fullName')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">Email Address</label>
            <input
              id="email"
              type="email"
              value={signupData.email}
              onChange={handleInputChange('email')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={signupData.password}
              onChange={handleInputChange('password')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label htmlFor="role" className="text-sm font-medium text-gray-700 block mb-2">Role</label>
            <select
              id="role"
              value={signupData.role}
              onChange={handleInputChange('role')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="vendor">Vendor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600">
          <p>
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:underline">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;
