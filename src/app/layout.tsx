import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { prisma } from "@/lib/prisma";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexus Gamer | O Portal Definitivo de Jogos",
  description: "Notícias, reviews, ofertas e cultura gamer automatizada por Inteligência Artificial.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Buscar cor de destaque injetada pela IA (com fallback para falhas de conexão no build)
  let accentColor = '#00f3ff'; // Default Neon Blue
  try {
    const accentConfig = await prisma.siteConfig.findUnique({
      where: { key: 'themeAccentColor' }
    });
    if (accentConfig) accentColor = accentConfig.value;
  } catch (e) {
    console.warn('[Build] Falha ao conectar no banco para buscar tema. Usando padrão.');
  }

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable}`}
      style={{ '--accent-neon-blue': accentColor } as React.CSSProperties}
    >
      <body>{children}</body>
    </html>
  );
}
