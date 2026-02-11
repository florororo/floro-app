"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState, useTransition } from "react";

import { updateUserLocale } from "~/server/actions/locale";
import { locales, type Locale } from "~/i18n/config";

export function LocaleSwitcher() {
  const router = useRouter();
  const currentLocale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLocaleChange = async (newLocale: Locale) => {
    if (newLocale === currentLocale || isUpdating) return;

    setIsUpdating(true);
    try {
      // Try to update user locale (will fail silently if not authenticated)
      try {
        await updateUserLocale(newLocale);
      } catch (error) {
        // If not authenticated, store in cookie for guest users
        if (error instanceof Error && error.message === "Not authenticated") {
          document.cookie = `locale=${newLocale}; path=/; max-age=31536000`; // 1 year
        } else {
          throw error;
        }
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Failed to update locale:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="locale-select" className="text-dark-900 text-sm">
        Language:
      </label>
      <select
        id="locale-select"
        value={currentLocale}
        onChange={(e) => handleLocaleChange(e.target.value as Locale)}
        disabled={isPending || isUpdating}
        className="bg-secondary-500 focus:bg-secondary-600 focus:ring-secondary-500 rounded-lg px-3 py-1.5 text-white focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Select language"
      >
        {locales.map((locale) => (
          <option
            key={locale}
            value={locale}
            className="bg-secondary-50 text-dark-900"
          >
            {locale.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
