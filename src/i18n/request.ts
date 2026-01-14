import { getRequestConfig } from "next-intl/server";
import { headers, cookies } from "next/headers";
import { defaultLocale, locales, type Locale } from "./config";
import { getSession } from "~/server/better-auth/server";
import { db } from "~/server/db";

export default getRequestConfig(async () => {
  let locale: Locale = defaultLocale;

  // Try to get locale from user session first
  try {
    const session = await getSession();
    if (session?.user?.id) {
    
       const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { locale: true },
      });
      const userLocale = user?.locale;
      if (
        userLocale &&
        typeof userLocale === "string" &&
        locales.includes(userLocale as Locale)
      ) {
        locale = userLocale as Locale;
      } 
    }
  } catch {
    // Session might not be available, continue to cookie/browser detection
  }

  // If no user locale, try to get from cookie (for guest users)
  if (locale === defaultLocale) {
    try {
      const cookieStore = await cookies();
      const localeCookie = cookieStore.get("locale");
      if (
        localeCookie?.value &&
        typeof localeCookie.value === "string" &&
        locales.includes(localeCookie.value as Locale)
      ) {
        locale = localeCookie.value as Locale;
      }
    } catch {
      // Cookies might not be available
    }
  }

  // If still no locale, try to detect from browser Accept-Language header
  if (locale === defaultLocale) {
    try {
      const headersList = await headers();
      const acceptLanguage = headersList.get("accept-language");
      if (acceptLanguage) {
        // Parse Accept-Language header (e.g., "en-US,en;q=0.9,es;q=0.8")
        const languages = acceptLanguage
          .split(",")
          .map(
            (lang) =>
              lang.split(";")[0]?.trim().toLowerCase().split("-")[0] ?? "",
          );

        // Find first matching locale
        const detectedLocale = locales.find((loc) =>
          languages.includes(loc.toLowerCase()),
        );
        if (detectedLocale) {
          locale = detectedLocale;
        }
      }
    } catch {
      // Headers might not be available, use default
    }
  }

  const messagesModule = (await import(`./messages/${locale}.json`)) as {
    default: Record<string, unknown>;
  };

  return {
    locale,
    messages: messagesModule.default,
  };
});
