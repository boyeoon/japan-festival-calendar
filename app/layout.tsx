import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Japan Festival Calendar",
  description: "Experience Japanese festival events in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
