"use client";

import Link from 'next/link';
import FormInput from '@/components/FormInput';
import Button from '@/components/Button';
import FormMessage from '@/components/FormMessage';
import useAuth from '@/store/auth';
import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';

const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
  rememberMe: Yup.boolean(),
});

export default function LoginSession() {
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
      showPassword: false,
    },

    validationSchema: SignInSchema,
    onSubmit: async (values, { setSubmitting }) => {
      await login({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });
      setSubmitting(false);
    },
  });

  const { errors, touched, getFieldProps, setFieldValue, isSubmitting } =
    formik;

 
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
        <FormikProvider value={formik}>
          <Form className="w-full space-y-5" onSubmit={formik.handleSubmit} autoComplete="off">
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
            type={formik.values.showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            placeholder="••••••••"
            autoComplete="off"
            readOnly
            onFocus={e => e.target.removeAttribute('readOnly')}
            error={formik.touched.password && formik.errors.password}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" id="rememberMe" name="rememberMe" checked={formik.values.rememberMe} onChange={formik.handleChange} />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            </div>
          <Button type="submit" loading={isSubmitting}>
            Sign In
          </Button>
          <FormMessage message={errors.email || ''} type="error" />
          <p className="text-center text-sm text-purple-400 mt-4">
            Don’t have an account? <Link href="/signup" className="font-semibold text-blue-600 hover:underline">Sign up</Link>
          </p>
        </Form>
        </FormikProvider>
      </div>
    </section>
  );
}

