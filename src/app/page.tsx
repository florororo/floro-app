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
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="absolute top-4 right-4 z-10">
          <LocaleSwitcher />
        </div>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
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
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                >
                  {translations("common.signIn")}
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                >
                  {translations("common.signUp")}
                </Link>
              </div>
            ) : (
              <form>
                <button
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
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
