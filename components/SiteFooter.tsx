"use client";

export default function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-slate-950/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-slate-400">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} <span className="text-emerald-300 font-semibold">Conect Agro Tech</span>.
            {" "}Todos os direitos reservados.
          </p>
          <p className="opacity-80">
            ROI = (Lucro / Investimento) × 100 • Payback e TMA opcionais
          </p>
        </div>
      </div>
    </footer>
  );
}
