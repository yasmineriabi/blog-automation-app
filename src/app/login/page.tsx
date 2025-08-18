"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import FormInput from "../../components/FormInput";
import PasswordInput from "../../components/PasswordInput";
import Button from "../../components/Button";
import FormMessage from "../../components/FormMessage";
import FormCard from "../../components/FormCard";
import AccentIcon from "../../components/AccentIcon";
import useAuth from "../../store/auth/index";
import * as Yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  rememberMe: Yup.boolean(),
});

export default function LoginPage() {
  const router = useRouter();
  const { login, authenticated } = useAuth();

  useEffect(() => {
    if (authenticated) {
      router.replace("/dashboard");
    }
  }, [authenticated, router]);

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

  const { errors, touched, isSubmitting } = formik;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted via-background to-muted p-4">
      <FormCard
        // icon={<AccentIcon />}
        header={
          <>
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </>
        }
      >
        <FormikProvider value={formik}>
          <Form
            className="space-y-4"
            onSubmit={formik.handleSubmit}
            autoComplete="off"
          >
            <FormInput
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="you@example.com"
              autoComplete="off"
              readOnly
              onFocus={(e) => e.target.removeAttribute("readOnly")}
              error={formik.touched.email && formik.errors.email}
            />

            <PasswordInput
              label="Password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="••••••••"
              autoComplete="off"
              readOnly
              onFocus={(e) => e.target.removeAttribute("readOnly")}
              error={formik.touched.password && formik.errors.password}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formik.values.rememberMe}
                  onChange={formik.handleChange}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-2"
                />
                <label htmlFor="rememberMe" className="text-sm text-foreground">
                  Remember me
                </label>
              </div>
            </div>

            <Button type="submit" loading={isSubmitting} className="w-full">
              Sign In
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </Form>
        </FormikProvider>
      </FormCard>
    </div>
  );
}
