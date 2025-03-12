import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const LINESeedKR = localFont({
  src: "./fonts/LINESeedKR-Rg.woff2",
  variable: "--font-line-kr",
  display: "swap",
});

const LINESeedJP = localFont({
  src: "./fonts/LINESeedJP_OTF_Rg.woff2",
  variable: "--font-line-jp",
  display: "swap",
});

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
      <body
        className={`${LINESeedKR.variable} ${LINESeedJP.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
