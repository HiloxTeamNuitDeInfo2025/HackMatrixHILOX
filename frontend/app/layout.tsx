import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "XSS Battle Arena - Nuit de l'Info 2025",
  description: "Retro terminal-style XSS CTF challenge platform. Educational cybersecurity training game.",
  keywords: ["XSS", "CTF", "Cybersecurity", "Hacking", "Training", "Nuit de l'Info"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=VT323&family=Press+Start+2P&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

