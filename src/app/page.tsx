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

          {/* Color palette test – remove when done */}
          <section className="border-dark-200 w-full max-w-md rounded-2xl border p-6">
            <h2 className="text-dark-900 mb-4 font-semibold">
              Color palette test
            </h2>
            <div className="bg-primary-500 flex flex-col gap-4 rounded-xl p-4">
              <input
                type="text"
                placeholder="neutral-200 input"
                className="text-dark-900 placeholder:text-dark-500 rounded-lg border border-neutral-400 bg-neutral-200 px-3 py-2"
              />
              <div
                role="alert"
                className="bg-error-100 text-error-800 border-error-300 rounded-lg border px-3 py-2 text-sm"
              >
                Error alert — something went wrong.
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="bg-secondary-500 hover:bg-secondary-600 rounded-lg px-4 py-2 font-medium text-white"
                >
                  Secondary
                </button>
                <button
                  type="button"
                  className="bg-dark-500 hover:bg-dark-600 rounded-lg px-4 py-2 font-medium text-white"
                >
                  Dark
                </button>
                <button
                  type="button"
                  disabled
                  className="bg-disabled-500 text-dark-600 cursor-not-allowed rounded-lg px-4 py-2 font-medium opacity-70"
                >
                  Disabled
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </HydrateClient>
  );
}
