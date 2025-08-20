"use client";

import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-slate-950/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/conect-logo.png" // ou .svg se for svg
            alt="Conect Agro Tech"
            width={160}
            height={48}
            priority
          />
          <span className="text-lg font-semibold text-emerald-300">
            Conect Agro Tech
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-300">
          <Link href="/" className="hover:text-emerald-300">
            Calculadora
          </Link>
          <a
            href="mailto:contato@conectagrotech.com"
            className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-emerald-200 hover:bg-emerald-400/20"
          >
            Fale conosco
          </a>
        </nav>
      </div>
    </header>
  );
}
