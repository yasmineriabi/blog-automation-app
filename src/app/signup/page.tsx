"use client";

import React, { useState, useEffect } from 'react'

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Signup failed');
      } else {
        setSuccess('Account created! You can now sign in.');
        setUsername(''); setEmail(''); setPassword(''); setConfirmPassword('');
        setTimeout(() => { window.location.href = '/login'; }, 1500);
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className={`w-full max-w-md z-10 transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} bg-white rounded-lg shadow-lg border border-slate-200 p-10 md:p-12 relative`}> 
        {/* Accent Bar */}
        <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-indigo-500 via-teal-400 to-indigo-400 rounded-t-lg" />
        <div className="flex flex-col items-center mb-8 mt-2">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="mb-2" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="5" fill="#6366F1" fillOpacity="0.12" />
            <path d="M12 7v5l3 3" stroke="#14b8a6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight font-sans text-center">Sign Up</h1>
          <p className="text-slate-500 text-base font-medium text-center">Create your account and join us!</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label htmlFor="username" className="block mb-1 text-base font-semibold text-slate-700">Username</label>
            <input type="text" name="username" id="username" className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 transition font-sans text-base bg-white" placeholder="Your username" required value={username} onChange={e => setUsername(e.target.value)} autoComplete="nope" readOnly onFocus={e => e.target.removeAttribute('readOnly')} />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 text-base font-semibold text-slate-700">Email</label>
            <input type="email" name="email" id="email" className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 transition font-sans text-base bg-white" placeholder="you@email.com" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="nope" readOnly onFocus={e => e.target.removeAttribute('readOnly')} />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-base font-semibold text-slate-700">Password</label>
            <input type="password" name="password" id="password" className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 transition font-sans text-base bg-white" placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="nope" readOnly onFocus={e => e.target.removeAttribute('readOnly')} />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block mb-1 text-base font-semibold text-slate-700">Confirm Password</label>
            <input type="password" name="confirmPassword" id="confirmPassword" className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 transition font-sans text-base bg-white" placeholder="••••••••" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="nope" readOnly onFocus={e => e.target.removeAttribute('readOnly')} />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-teal-400 text-white font-semibold rounded-md shadow hover:from-teal-400 hover:to-indigo-500 transition text-base" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
          {error && <p className="text-center text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-center text-green-600 text-sm mt-2">{success}</p>}
          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account? <a href="/login" className="font-semibold text-indigo-500 hover:underline">Sign in</a>
          </p>
        </form>
      </div>
    </section>
  )
} 