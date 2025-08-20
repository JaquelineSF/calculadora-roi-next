import "./../styles/globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import type { Metadata } from "next";

const siteUrl = "https://www.seu-dominio.com"; // TODO: domínio real
const siteName = "Conect Agro Tech — Calculadora de ROI";
const siteDesc = "Ferramenta profissional para calcular ROI, margem e payback com TMA, CSV e gráfico.";
const ogImage = `${siteUrl}/opengraph-image.png`;
const twImage = `${siteUrl}/twitter-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: "%s — Conect Agro Tech"
  },
  description: siteDesc,
  applicationName: siteName,
  manifest: "/manifest.webmanifest", // opcional: comente se não usar
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [{ rel: "icon", url: "/icon.png" }]
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteName,
    description: siteDesc,
    siteName: "Conect Agro Tech",
    images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }]
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDesc,
    images: [twImage],
    creator: "@seu_usuario" // opcional
  },
  alternates: {
    canonical: siteUrl
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-950 text-slate-100">
        <SiteHeader />
        <main className="mx-auto max-w-6xl p-6">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
