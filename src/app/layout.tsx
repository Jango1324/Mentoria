import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Mentoria Hub",
  description: "Образовательная платформа для учеников 8–11 классов",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
     <body>{children}</body>
    </html>
  );
}
