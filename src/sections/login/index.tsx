"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isValidEmail } from '@/utils/validation';
import { loginApi } from '@/utils/authApi';

export default function LoginSession() {
  const { push } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(120deg, #e0e7ff 0%, #fdf2fa 100%)'}}>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center relative">
        {/* Gradient Icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-purple-300 shadow-md mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="#fff" />
            <path d="M7 12l3 3 7-7" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 text-center">Welcome Back!</h1>
        <p className="text-base text-purple-400 mb-8 text-center">Sign in to your account</p>
        <form className="w-full space-y-5" onSubmit={async (e) => {
          e.preventDefault();
          setError('');
          if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
          }
          setLoading(true);
          try {
            const { ok, data } = await loginApi(email, password);
            if (!ok) {
              setError(data.message || 'Login failed');
            } else {
              localStorage.setItem('access_token', data.access_token);
              push('/dashboard');
            }
          } catch (err) {
            setError('Network error');
          } finally {
            setLoading(false);
          }
        }} autoComplete="off">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-blue-600">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              autoComplete="off"
              readOnly
              onFocus={e => e.target.removeAttribute('readOnly')}
              className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition text-base bg-white placeholder:text-blue-200"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-blue-600">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="off"
              readOnly
              onFocus={e => e.target.removeAttribute('readOnly')}
              className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition text-base bg-white placeholder:text-blue-200"
              required
            />
          </div>
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2">
              <input id="remember" type="checkbox" className="w-4 h-4 border border-blue-200 rounded bg-white focus:ring-2 focus:ring-blue-200" />
              <label htmlFor="remember" className="text-purple-400">Remember me</label>
            </div>
            <a href="#" className="text-purple-400 hover:underline">Forgot password?</a>
          </div>
          <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-blue-400 to-purple-300 text-white font-semibold rounded-lg shadow-md hover:from-purple-300 hover:to-blue-400 transition text-base" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          {error && <p className="text-center text-red-500 text-sm mt-2">{error}</p>}
          <p className="text-center text-sm text-purple-400 mt-4">
            Don’t have an account? <a href="/signup" className="font-semibold text-purple-500 hover:underline">Sign up</a>
          </p>
        </form>
      </div>
    </section>
  );
}

