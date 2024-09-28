import type { Metadata } from "next";
import "../globals.css";
import { SidebarDemo } from '@/sidebar/contenido_sidebar';

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
        <SidebarDemo>
          {children}
        </SidebarDemo>
      </body>
    </html>
  );
}
