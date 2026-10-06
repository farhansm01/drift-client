"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeSlash, Car } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";

interface FieldErrors {
  email?: string;
  password?: string;
  general?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  function validate(): FieldErrors {
    const newErrors: FieldErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = "Enter a valid email address (e.g. name@example.com).";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const { error: signInError } = await authClient.signIn.email({
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (signInError) {
      const message = signInError.message || "Login failed. Please check your credentials.";
      setErrors({ general: message });
      return;
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#e9e3e6]">
      <div className="w-full max-w-md rounded-2xl border border-[#b2b2b2] bg-white p-8 shadow-2xl">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-2 rounded-xl bg-[#232c33] text-white shadow-md">
            <Car width={22} height={22} />
          </div>
          <span className="font-black tracking-widest text-xl text-[#232c33]">
            DRIFT
          </span>
        </div>

        <h1 className="text-2xl font-black text-[#232c33] mb-1">Welcome Back</h1>
        <p className="text-[#232c33]/70 text-sm mb-6 font-medium">
          Log in to manage your car listings and reviews.
        </p>

        {errors.general && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-600 font-semibold">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#232c33] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-xl bg-[#e9e3e6]/50 border px-3.5 py-2.5 text-[#232c33] text-sm placeholder:text-[#9a8f97] font-medium focus:outline-none focus:bg-white transition ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#b2b2b2] focus:border-[#232c33]"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#232c33] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-xl bg-[#e9e3e6]/50 border px-3.5 py-2.5 pr-10 text-[#232c33] text-sm placeholder:text-[#9a8f97] font-medium focus:outline-none focus:bg-white transition ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#b2b2b2] focus:border-[#232c33]"
                }`}
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a8f97] hover:text-[#232c33] transition"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlash width={18} height={18} />
                ) : (
                  <Eye width={18} height={18} />
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary rounded-xl py-3 text-sm font-bold shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-xs text-[#232c33]/70 mt-6 text-center font-medium">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#232c33] font-bold underline hover:text-[#9a8f97] transition">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}