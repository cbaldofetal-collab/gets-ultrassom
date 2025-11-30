import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gest Ultrassom - Agendamento Inteligente",
  description: "Agendamento inteligente de ultrassons para gestantes da Clínica FMFLA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>{children}</body>
    </html>
  );
}
