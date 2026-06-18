import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mentoria Hub",
  description: "Образовательная платформа для учеников 8–11 классов",
};

// Runs synchronously before first paint — reads localStorage and sets
// data-theme on <html> so there is no flash of wrong theme on load.
const themeInitScript = `(function(){try{var t=localStorage.getItem('mentoria-theme')||'system';if(t==='dark')document.documentElement.setAttribute('data-theme','dark');else if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})();`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
