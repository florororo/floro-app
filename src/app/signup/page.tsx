"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Link from "next/link";

import { authClient } from "~/server/better-auth/client";
import { updateUserLocale } from "~/server/actions/locale";
import { locales, type Locale } from "~/i18n/config";

export default function SignupPage() {
  const router = useRouter();
  const translations = useTranslations("auth.signUp");
  const commonTranslations = useTranslations("common");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedLocale, setDetectedLocale] = useState<Locale>("en");

  // Detect browser locale on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const browserLang =
        navigator.language ??
        (navigator as { userLanguage?: string }).userLanguage ??
        "en";
      const langCode = browserLang.split("-")[0]?.toLowerCase() ?? "en";
      const matchedLocale = locales.find(
        (loc) => loc.toLowerCase() === langCode,
      );
      if (matchedLocale) {
        setDetectedLocale(matchedLocale);
      }
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: async () => {
          // Set user locale after successful signup
          try {
            await updateUserLocale(detectedLocale);
          } catch (err) {
            // Log but don't block signup if locale update fails
            console.error("Failed to set user locale:", err);
          }
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
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-primary-500 rounded-xl p-8 shadow-lg">
          <h1 className="text-dark-500 mb-8 text-center text-4xl font-extrabold tracking-tight">
            {translations("title")}
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-white/90"
              >
                {commonTranslations("name")}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                disabled={isLoading}
                className="text-dark-900 placeholder:text-dark-500 focus:ring-primary-500 w-full rounded-lg bg-neutral-200 px-4 py-3 focus:bg-neutral-200 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={translations("namePlaceholder")}
                autoComplete="name"
              />
            </div>

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
                className="text-dark-900 placeholder:text-dark-500 focus:ring-primary-500 w-full rounded-lg bg-neutral-200 px-4 py-3 focus:bg-neutral-200 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
                className="text-dark-900 placeholder:text-dark-500 focus:ring-primary-500 w-full rounded-lg bg-neutral-200 px-4 py-3 focus:bg-neutral-200 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={translations("passwordPlaceholder")}
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div className="border-error-500/50 bg-error-500/20 text-error-200 rounded-lg border px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="focus:ring-secondary-500 w-full rounded-full bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? translations("submitting") : translations("submit")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/80">
              {translations("hasAccount")}{" "}
              <Link
                href="/login"
                className="text-secondary-500 font-semibold hover:underline"
              >
                {translations("signInLink")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
