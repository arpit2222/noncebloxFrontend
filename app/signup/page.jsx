"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

export default function Home() {
  // Formik setup
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters")
        .required("Username is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, values);
        console.log("Signup successful:", response.data);
        // Handle successful signup (e.g., redirect or show a success message)
      } catch (error) {
        console.error("Signup failed:", error);
        // Handle signup error (e.g., show an error message)
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Card className="mx-auto max-w-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
            <CardDescription>Enter your details to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Your username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.username && formik.errors.username && (
                  <p className="text-red-500 text-sm">{formik.errors.username}</p>
                )}
              </div>
              
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm">{formik.errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm">{formik.errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
