"use server";

import { cookies } from "next/headers";
import { headers } from "next/headers";
import { getSession } from "~/server/better-auth/server";
import { db } from "~/server/db";
import { locales, type Locale } from "~/i18n/config";

/**
 * Updates the user's locale preference
 */
export async function updateUserLocale(locale: Locale) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  if (!locales.includes(locale)) {
    throw new Error("Invalid locale");
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { locale },
  });
}

/**
 * Detects locale from browser Accept-Language header
 */
export async function detectBrowserLocale(): Promise<Locale> {
  try {
    const headersList = await headers();
    const acceptLanguage = headersList.get("accept-language");
    if (acceptLanguage) {
      // Parse Accept-Language header (e.g., "en-US,en;q=0.9,es;q=0.8")
      const languages = acceptLanguage
        .split(",")
        .map((lang) => lang.split(";")[0].trim().toLowerCase().split("-")[0]);

      // Find first matching locale
      const detectedLocale = locales.find((loc) =>
        languages.includes(loc.toLowerCase()),
      );
      if (detectedLocale) {
        return detectedLocale;
      }
    }
  } catch {
    // Headers might not be available
  }
  return "en";
}

/**
 * Gets locale from cookie (for guest users)
 */
export async function getCookieLocale(): Promise<Locale | null> {
  try {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get("locale");
    if (localeCookie?.value && locales.includes(localeCookie.value as Locale)) {
      return localeCookie.value as Locale;
    }
  } catch {
    // Cookies might not be available
  }
  return null;
}
