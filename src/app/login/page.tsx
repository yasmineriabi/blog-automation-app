"use client";

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const {push} = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const [formData, setFormData] = useState({
  email: '',
  password: ''
})
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    setEmail('');
    setPassword('');
    setShow(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
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
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className={`w-full max-w-md z-10 transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} bg-white rounded-lg shadow-lg border border-slate-200 p-10 md:p-12 relative`}> 
        {/* Accent Bar */}
        <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-indigo-500 via-teal-400 to-indigo-400 rounded-t-lg" />
        <div className="flex flex-col items-center mb-8 mt-2">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="mb-2" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="5" fill="#6366F1" fillOpacity="0.12" />
            <path d="M7 12l3 3 7-7" stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight font-sans text-center">Sign In</h1>
          <p className="text-slate-500 text-base font-medium text-center">Welcome back! Please login to your account.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-1 text-base font-semibold text-slate-700">Email</label>
            <input type="email" name="email" id="email" className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 transition font-sans text-base bg-white" placeholder="you@email.com" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-base font-semibold text-slate-700">Password</label>
            <input type="password" name="password" id="password" className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 transition font-sans text-base bg-white" placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="off" />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-teal-400 text-white font-semibold rounded-md shadow hover:from-teal-400 hover:to-indigo-500 transition text-base" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
          {error && <p className="text-center text-red-500 text-sm mt-2">{error}</p>}
          <p className="text-center text-sm text-slate-500 mt-4">
            Don’t have an account? <a href="/signup" className="font-semibold text-indigo-500 hover:underline">Sign up</a>
          </p>
        </form>
      </div>
    </section>
  )
}

