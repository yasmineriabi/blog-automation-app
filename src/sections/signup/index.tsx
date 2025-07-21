"use client";

import React from 'react';
import Link from 'next/link';
import FormInput from '@/components/FormInput';
import Button from '@/components/Button';
import FormMessage from '@/components/FormMessage';
import useAuth from '@/store/auth';
import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';

const SignUpSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string().required('Confirm password is required'),
});

export default function SignupSession() {
  const { register } = useAuth();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: SignUpSchema,
    onSubmit: async (values, { setSubmitting }) => {
        await register({
        username: values.username,
        email: values.email,
        password: values.password,
      });
      setSubmitting(false);
    },
  });


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

          <FormikProvider value={formik}>
                  <Form>
          <FormInput
            label="Username"
            id="username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            placeholder="Your username"
            autoComplete="off"
            readOnly
            error={formik.touched.username && formik.errors.username}
          />
          <FormInput
            label="Email"
            id="email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            placeholder="you@email.com"
            autoComplete="off"
            readOnly
            onFocus={e => e.target.removeAttribute('readOnly')}
            error={formik.touched.email && formik.errors.email}
          />
          <FormInput
            label="Password"
            id="password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            placeholder="••••••••"
            autoComplete="off"
            readOnly
            onFocus={e => e.target.removeAttribute('readOnly')}
            error={formik.touched.password && formik.errors.password}
          />
          <FormInput
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            placeholder="••••••••"
            autoComplete="off"
            readOnly
            onFocus={e => e.target.removeAttribute('readOnly')}
          />
          <FormInput
            label="Password"
            id="password"
            name="password"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            placeholder="••••••••"
            autoComplete="off"
            readOnly
            onFocus={e => e.target.removeAttribute('readOnly')}
          />
          <FormInput
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            placeholder="••••••••"
            autoComplete="off"
            readOnly
            onFocus={e => e.target.removeAttribute('readOnly')}
          />
          <Button type="submit" loading={formik.isSubmitting}>
            Sign Up
          </Button>
          <FormMessage message={formik.errors.username || ''} type="error" />
          <FormMessage message={formik.errors.email || ''} type="error" />
          <FormMessage message={formik.errors.password || ''} type="error" />
          <FormMessage message={formik.errors.confirmPassword || ''} type="error" />
          <p className="text-center text-sm text-purple-400 mt-4">
            Already have an account? <Link href="/login" className="font-semibold text-blue-600 hover:underline">Sign in</Link>
          </p>
        </Form>
          </FormikProvider>
      </div>
    </section>
  );
} 