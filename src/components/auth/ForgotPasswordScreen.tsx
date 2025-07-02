import React, { useState, FormEvent } from 'react';
import { supabase } from '@/utils/supabaseClient';

interface ForgotPasswordScreenProps {
  onSwitchToLogin: () => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    const redirectTo = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/'
      : window.location.origin;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('If an account exists for this email, a password reset link has been sent.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-gray-600 mt-2">Enter your email to receive a reset link</p>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handlePasswordReset} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600">
          <p>
            Remembered your password?{' '}
            <button onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:underline">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
