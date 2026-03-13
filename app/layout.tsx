import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crossy Road — Hop, Dodge, Survive",
  description:
    "A neon-styled browser take on the classic arcade hopper. Dodge traffic, ride logs, and see how far you can go.",
  keywords: ["crossy road", "arcade", "frogger", "browser game", "next.js"],
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-[#0d0d1a] overflow-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
