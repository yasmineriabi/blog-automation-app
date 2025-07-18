"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isValidEmail, doPasswordsMatch } from '@/utils/validation';
import { signupApi } from '@/utils/authApi';

export default function SignupSession() {
  const { push } = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(120deg, #e0e7ff 0%, #fdf2fa 100%)'}}>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center relative">
        {/* Gradient Icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-purple-300 shadow-md mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="#fff" />
            <path d="M12 7v5l3 3" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 text-center">Create Account</h1>
        <p className="text-base text-purple-400 mb-8 text-center">Sign up to get started</p>
        <form className="w-full space-y-5" onSubmit={async (e) => {
          e.preventDefault();
          setError('');
          setSuccess('');
          if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
          }
          if (!doPasswordsMatch(password, confirmPassword)) {
            setError('Passwords do not match');
            return;
          }
          setLoading(true);
          try {
            const { ok, data } = await signupApi(username, email, password, confirmPassword);
            if (!ok) {
              setError(data.message || 'Signup failed');
            } else {
              setSuccess('Account created! You can now sign in.');
              setUsername(''); setEmail(''); setPassword(''); setConfirmPassword('');
              setTimeout(() => { push('/login'); }, 1500);
            }
          } catch (err) {
            setError('Network error');
          } finally {
            setLoading(false);
          }
        }} autoComplete="off">
          <div>
            <label htmlFor="username" className="block mb-1 text-sm font-medium text-blue-600">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Your username"
              autoComplete="off"
              readOnly
              onFocus={e => e.target.removeAttribute('readOnly')}
              className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition text-base bg-white placeholder:text-blue-200"
              required
            />
          </div>
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
          <div>
            <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-blue-600">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="off"
              readOnly
              onFocus={e => e.target.removeAttribute('readOnly')}
              className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition text-base bg-white placeholder:text-blue-200"
              required
            />
          </div>
          <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-blue-400 to-purple-300 text-white font-semibold rounded-lg shadow-md hover:from-purple-300 hover:to-blue-400 transition text-base" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
          {error && <p className="text-center text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-center text-green-600 text-sm mt-2">{success}</p>}
          <p className="text-center text-sm text-purple-400 mt-4">
            Already have an account? <a href="/login" className="font-semibold text-purple-500 hover:underline">Sign in</a>
          </p>
        </form>
      </div>
    </section>
  );
} 