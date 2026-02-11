import { headers } from "next/headers";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { LocaleSwitcher } from "~/app/_components/locale-switcher";
import { auth } from "~/server/better-auth";
import { getSession } from "~/server/better-auth/server";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await getSession();
  const translations = await getTranslations();

  return (
    <HydrateClient>
      <main className="text-dark-900 relative flex min-h-screen flex-col items-center justify-center">
        <div className="absolute top-4 right-4 z-10">
          <LocaleSwitcher />
        </div>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-dark-900 text-center text-2xl">
              {session && (
                <span>
                  {translations("auth.loggedInAs")} {session.user?.name}
                </span>
              )}
            </p>
            {!session ? (
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Link
                  href="/login"
                  className="bg-primary-500 hover:bg-primary-600 rounded-full px-10 py-3 font-semibold text-white no-underline transition"
                >
                  {translations("common.signIn")}
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary-500 hover:bg-primary-600 rounded-full px-10 py-3 font-semibold text-white no-underline transition"
                >
                  {translations("common.signUp")}
                </Link>
              </div>
            ) : (
              <form>
                <button
                  className="bg-primary-500 hover:bg-primary-600 rounded-full px-10 py-3 font-semibold text-white no-underline transition"
                  formAction={async () => {
                    "use server";
                    await auth.api.signOut({
                      headers: await headers(),
                    });
                    redirect("/");
                  }}
                >
                  {translations("common.signOut")}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
