import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "도파민 나무위키",
  description: "나만의 나무위키를 만들어보세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
