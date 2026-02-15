import type { Metadata } from "next";
import "./theme.css";
import "./globals.css";
import { AuthProvider, User } from "@/context/AuthContext";
import { headers, cookies } from "next/headers";
import { Toaster } from "sonner";
import { TranslationProvider } from "@/context/TranslationContext";
import { getTranslation } from '@/utils/server/translation';
import { getTheme } from "@/utils/theme";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { QueryProvider } from "@/providers/QueryProvider";
import Script from "next/script";

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} app`,
  description: "Basic next app",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user: User | undefined;

  const headersList = await headers();
  const cookiesList = await cookies();

  const meCookie = cookiesList.get("me")?.value;
  if (meCookie) {
    try {
      const decoded = Buffer.from(meCookie, "base64").toString("utf-8");
      user = JSON.parse(decoded);
    } catch (e) { }
  }

  const { lang, translation } = await getTranslation();

  const theme = getTheme(cookiesList.get('theme')?.value, headersList);

  const publicEnv: Record<string, string | undefined> = Object.fromEntries(
    Object.entries(process.env).filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
  );

  return (
    <html className={theme == 'dark' ? theme : ''} lang={lang}>
      <head>
        <Script dangerouslySetInnerHTML={{ __html: `window._env = ${JSON.stringify(publicEnv)};` }} strategy="beforeInteractive" />
      </head>
      <body className="bg-background text-foreground overflow-hidden">
        <NuqsAdapter>
          <QueryProvider>
            <AuthProvider user={user}>
              <TranslationProvider locale={lang} translation={translation}>
                {children}
                <Toaster position="top-center" richColors />
              </TranslationProvider>
            </AuthProvider>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );

}