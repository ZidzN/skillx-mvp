import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SKILLX — Skill Menjadi Peluang",
  description: "Marketplace jasa & talenta mahasiswa berbasis teknologi."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
