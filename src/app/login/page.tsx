"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Link from "next/link";

import { authClient } from "~/server/better-auth/client";

export default function LoginPage() {
  const router = useRouter();
  const translations = useTranslations("auth.signIn");
  const commonTranslations = useTranslations("common");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
        onError: (context) => {
          setError(context.error?.message ?? translations("error"));
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white/10 p-8 shadow-lg">
          <h1 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-white">
            {translations("title")}
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-white/90"
              >
                {commonTranslations("email")}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={isLoading}
                className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:bg-white/20 focus:ring-2 focus:ring-[hsl(280,100%,70%)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={translations("emailPlaceholder")}
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-white/90"
              >
                {commonTranslations("password")}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                disabled={isLoading}
                className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:bg-white/20 focus:ring-2 focus:ring-[hsl(280,100%,70%)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={translations("passwordPlaceholder")}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/50 bg-red-500/20 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20 focus:ring-2 focus:ring-[hsl(280,100%,70%)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? translations("submitting") : translations("submit")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/80">
              {translations("noAccount")}{" "}
              <Link
                href="/signup"
                className="font-semibold text-[hsl(280,100%,70%)] hover:underline"
              >
                {translations("signUpLink")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

