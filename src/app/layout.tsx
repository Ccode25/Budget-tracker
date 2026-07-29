import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { AuthSessionProvider } from "@/components/providers/AuthSessionProvider";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

// ─── Metadata ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  applicationName: "BudgetTracker",
  title: {
    default: "BudgetTracker — Modern Personal Finance & Budget Planning",
    template: "%s | BudgetTracker",
  },
  description:
    "A modern personal finance and budget tracker. Track spending, set savings goals, and manage your monthly budget with clarity.",
  keywords: [
    "budget tracker",
    "personal finance",
    "expense tracker",
    "savings goals",
    "spending tracker",
    "money manager",
    "finance app",
    "budget planner",
  ],
  authors: [{ name: "BudgetTracker" }],
  creator: "BudgetTracker",
  publisher: "BudgetTracker",
  manifest: "/manifest.json",

  // ── Open Graph ─────────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://budget-tracker-two-rouge.vercel.app",
    siteName: "BudgetTracker",
    title: "BudgetTracker — Modern Personal Finance",
    description:
      "Track spending, set savings goals, and manage your budget with clarity.",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "BudgetTracker App Icon",
      },
    ],
  },

  // ── Apple PWA ──────────────────────────────────────────────────────────────
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BudgetTracker",
    startupImage: [
      // iPhone 15 Pro Max / 14 Pro Max
      {
        url: "/icon-512.png",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)",
      },
      // iPhone 15 / 14
      {
        url: "/icon-512.png",
        media:
          "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)",
      },
      // iPhone SE
      {
        url: "/icon-192.png",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },

  // ── Icons ──────────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/icon-192.png",
  },

  // ── Robots & canonical ─────────────────────────────────────────────────────
  robots: {
    index: false, // Private app — do not index
    follow: false,
  },
};

// ─── Viewport ────────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f7fc" },
    { media: "(prefers-color-scheme: dark)",  color: "#1a1535" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover", // For iPhone notch / safe areas
};

// ─── Layout ──────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={inter.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* ── Apple PWA meta tags (not covered by Next.js metadata API) ── */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BudgetTracker" />

        {/* ── MS Tile (Windows PWA) ── */}
        <meta name="msapplication-TileColor" content="#7c3aed" />
        <meta name="msapplication-TileImage" content="/icon-192.png" />
        <meta name="msapplication-config" content="none" />

        {/* ── Preconnect for performance ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* ── Apple touch icons ── */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />
      </head>
      <body className={`${inter.className} ${inter.variable}`}>
        <AuthSessionProvider>
          <ThemeProvider>
            {/* Offline & Install banners */}
            <OfflineBanner />
            <PWAInstallPrompt />

            {children}
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </AuthSessionProvider>

        {/* ── Service Worker Registration ── */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    .then(function(reg) {
                      // Listen for SW updates and send SKIP_WAITING
                      reg.addEventListener('updatefound', function() {
                        var newWorker = reg.installing;
                        if (newWorker) {
                          newWorker.addEventListener('statechange', function() {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                              newWorker.postMessage('SKIP_WAITING');
                            }
                          });
                        }
                      });
                    })
                    .catch(function(err) {
                      console.warn('ServiceWorker registration failed:', err);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
