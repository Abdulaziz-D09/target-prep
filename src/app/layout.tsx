import type { Metadata } from "next";
import "./globals.css";
import SidebarWrapper from "@/components/SidebarWrapper";
import SiteAtmosphereWrapper from "@/components/SiteAtmosphereWrapper";
import RouteTransition from "@/components/RouteTransition";

export const metadata: Metadata = {
  title: "Target Prep - SAT Preparation",
  description: "Master the Digital SAT with interactive practice tests.",
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
        <script id="targetprep-site-tone-init" dangerouslySetInnerHTML={{ __html: siteToneInitScript }} />
      </head>
      <body className="flex h-screen overflow-hidden bg-[var(--site-shell-bg)] transition-colors duration-300">
        <SiteAtmosphereWrapper />
        <SidebarWrapper />
        <main className="relative flex-1 overflow-y-auto">
          <RouteTransition>{children}</RouteTransition>
        </main>
      </body>
    </html>
  );
}
