import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Our Family Meals",
  description: "Our family recipe collection—favorites, old standbys, and dishes worth remembering.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
