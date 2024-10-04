import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Panizzería",
  description: "Comidas y panes de alta calidad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          {children}
      </body>
    </html>
  );
}
