import type { Metadata } from "next";
import "./globals.css";
import SidebarWrapper from "@/components/SidebarWrapper";
import SiteAtmosphereWrapper from "@/components/SiteAtmosphereWrapper";
import RouteTransition from "@/components/RouteTransition";
import SupabaseSyncProvider from "@/components/SupabaseSyncProvider";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Target Prep: Free Digital SAT Prep, Practice Tests & Questions",
  description: "Master the Digital SAT with full-length adaptive practice tests, thousands of realistic questions, instant score analytics, and targeted skill building.",
  applicationName: "Target Prep",
  authors: [{ name: "Target Prep" }],
  keywords: ["Digital SAT", "SAT Prep", "Practice Tests", "SAT Math", "SAT Reading", "Target Prep"],
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
  openGraph: {
    title: "Target Prep: Free Digital SAT Prep, Practice Tests & Questions",
    description: "Master the Digital SAT with full-length adaptive practice tests, thousands of realistic questions, instant score analytics, and targeted skill building.",
    url: 'https://www.targetprep.uz',
    siteName: 'Target Prep',
    locale: 'en_US',
    type: 'website',
  },
};

const siteToneInitScript = `
(() => {
  const key = 'targetprep_site_tone';
  const darkShell = '#121826';
  const lightShell = '#f5f8fc';
  let tone = 'dark';

  try {
    tone = window.localStorage.getItem(key) === 'light' ? 'light' : 'dark';
  } catch {
    tone = 'dark';
  }

  document.documentElement.dataset.siteTone = tone;
  document.documentElement.style.colorScheme = tone;
  document.documentElement.style.backgroundColor = tone === 'dark' ? darkShell : lightShell;
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="7zD3xNkiOQ-jMcV-PHN2YGYoNTeBFlXPp7XZY205X1w" />
        <script id="targetprep-site-tone-init" dangerouslySetInnerHTML={{ __html: siteToneInitScript }} />
      </head>
      <body className="flex h-screen overflow-hidden bg-[var(--site-shell-bg)] transition-colors duration-300">
        <SiteAtmosphereWrapper />
        <SupabaseSyncProvider />
        <SidebarWrapper />
        <main className="relative flex-1 flex flex-col overflow-y-auto">
          <Suspense fallback={null}>
            <RouteTransition>{children}</RouteTransition>
          </Suspense>
        </main>
      </body>
    </html>
  );
}
