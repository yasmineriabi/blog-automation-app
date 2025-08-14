"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";
import FormMessage from "../../components/FormMessage";
import FormCard from "../../components/FormCard";
import AccentIcon from "../../components/AccentIcon";
import useAuth from "../../store/auth/index";
import * as Yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";

const SignUpSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function SignupPage() {
  const router = useRouter();
  const { register, authenticated } = useAuth();

  useEffect(() => {
    if (authenticated) {
      router.replace("/dashboard");
    }
  }, [authenticated, router]);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: SignUpSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await register({
          username: values.username,
          email: values.email,
          password: values.password,
        });
        router.push("/login");
      } catch (error) {
        console.error("Registration failed:", error);
      }
      setSubmitting(false);
    },
  });

  const { errors, touched, isSubmitting } = formik;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted via-background to-muted p-4">
      <FormCard
        icon={<AccentIcon />}
        header={
          <>
            <h1 className="text-2xl font-bold text-foreground">
              Create Account
            </h1>
            <p className="text-muted-foreground">
              Sign up to get started with our platform
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
              label="Username"
              id="username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              placeholder="Your username"
              autoComplete="off"
              readOnly
              onFocus={(e) => e.target.removeAttribute("readOnly")}
              error={formik.touched.username && formik.errors.username}
            />

            <FormInput
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="you@example.com"
              autoComplete="off"
              readOnly
              onFocus={(e) => e.target.removeAttribute("readOnly")}
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
              onFocus={(e) => e.target.removeAttribute("readOnly")}
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
              onFocus={(e) => e.target.removeAttribute("readOnly")}
              error={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
            />

            <Button type="submit" loading={isSubmitting} className="w-full">
              Sign Up
            </Button>

            <FormMessage
              message={
                errors.username ||
                errors.email ||
                errors.password ||
                errors.confirmPassword ||
                ""
              }
              type="error"
            />

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </Form>
        </FormikProvider>
      </FormCard>
    </div>
  );
}
