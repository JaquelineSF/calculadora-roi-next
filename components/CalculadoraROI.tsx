"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";

// Gráfico (sem SSR)
const Bar = dynamic(() => import("react-chartjs-2").then((m) => m.Bar), { ssr: false });

// Chart.js core + tipos
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

type Horizonte = "mensal" | "trimestral" | "anual";

type Resultado = {
  receita: number;
  custosVar: number;
  custosFixos: number;
  investimento: number;
  lucro: number;
  roi: number;
  margem: number;
  payback: number; // Infinity quando não recupera
  breakevenReceita: number;
};

export default function CalculadoraROI() {
  const [receita, setReceita] = useState(0);
  const [custosVar, setCustosVar] = useState(0);
  const [custosFixos, setCustosFixos] = useState(0);
  const [investimento, setInvestimento] = useState(0);
  const [horizonte, setHorizonte] = useState<Horizonte>("mensal");
  const [tmaAtiva, setTmaAtiva] = useState(false);
  const [tma, setTma] = useState(0);
  const [resultados, setResultados] = useState<Resultado | null>(null);

  // —— Persistência local
  useEffect(() => {
    const saved = localStorage.getItem("roi-data");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setReceita(Number(p.receita) || 0);
        setCustosVar(Number(p.custosVar) || 0);
        setCustosFixos(Number(p.custosFixos) || 0);
        setInvestimento(Number(p.investimento) || 0);
        setHorizonte((p.horizonte as Horizonte) || "mensal");
        setTmaAtiva(Boolean(p.tmaAtiva));
        setTma(Number(p.tma) || 0);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "roi-data",
      JSON.stringify({ receita, custosVar, custosFixos, investimento, horizonte, tmaAtiva, tma })
    );
  }, [receita, custosVar, custosFixos, investimento, horizonte, tmaAtiva, tma]);

  const fmtBRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const fmtPct = new Intl.NumberFormat("pt-BR", { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const horizonteLabel = () => (horizonte === "mensal" ? "meses" : horizonte === "trimestral" ? "trimestres" : "anos");

  const calcular = () => {
    if (investimento <= 0) {
      alert("Informe um Investimento Inicial maior que zero.");
      return;
    }
    const custosTotais = custosVar + custosFixos;
    const lucro = receita - custosTotais;
    const roiBruto = lucro / investimento;
    const margem = receita > 0 ? lucro / receita : 0;
    const payback = lucro > 0 ? investimento / lucro : Infinity;
    const breakevenReceita = custosTotais;
    const roiAjustado = tmaAtiva ? roiBruto - tma / 100 : roiBruto;

    setResultados({
      receita,
      custosVar,
      custosFixos,
      investimento,
      lucro,
      roi: roiAjustado,
      margem,
      payback,
      breakevenReceita
    });
  };

  // —— Exportar CSV
  const exportCSV = () => {
    if (!resultados) return;
    const rows = [
      ["Indicador", "Valor"],
      ["Receita", fmtBRL.format(resultados.receita)],
      ["Custos Variáveis", fmtBRL.format(resultados.custosVar)],
      ["Custos Fixos", fmtBRL.format(resultados.custosFixos)],
      ["Lucro", fmtBRL.format(resultados.lucro)],
      ["Investimento", fmtBRL.format(resultados.investimento)],
      ["ROI", (resultados.roi * 100).toFixed(2) + "%"],
      ["Margem", fmtPct.format(resultados.margem)],
      ["Payback", resultados.payback === Infinity ? "Não recupera" : `${resultados.payback.toFixed(2)} ${horizonteLabel()}`],
      ["Ponto de Equilíbrio", fmtBRL.format(resultados.breakevenReceita)]
    ];
    const csv = rows.map((r) => r.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resultado-roi.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // —— Dados e opções tipados (Chart.js)
  const dataChart: ChartData<"bar"> = resultados
    ? {
        labels: ["Receita", "Custos Totais", "Lucro"],
        datasets: [
          {
            label: "R$ por período",
            data: [resultados.receita, resultados.custosVar + resultados.custosFixos, resultados.lucro],
            borderWidth: 0
          }
        ]
      }
    : { labels: [], datasets: [] };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { type: "category" },
      y: {
        type: "linear",
        ticks: {
          // assinatura que o TS espera
          callback: (tickValue: string | number) => fmtBRL.format(Number(tickValue))
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">
        <span className="text-emerald-400">Conect Agro Tech</span> — Calculadora de ROI
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Entradas */}
        <Card className="space-y-4 p-4">
          <h2 className="text-lg font-semibold">Entradas</h2>

          <div>
            <Label htmlFor="receita">Receita / Faturamento</Label>
            <Input
              id="receita"
              type="number"
              value={Number.isFinite(receita) ? receita : 0}
              onChange={(e) => setReceita(parseFloat(e.target.value) || 0)}
              placeholder="Ex.: 150000"
            />
          </div>

          <div>
            <Label htmlFor="custosVar">Custos Variáveis</Label>
            <Input
              id="custosVar"
              type="number"
              value={Number.isFinite(custosVar) ? custosVar : 0}
              onChange={(e) => setCustosVar(parseFloat(e.target.value) || 0)}
              placeholder="Ex.: 60000"
            />
          </div>

          <div>
            <Label htmlFor="custosFixos">Custos Fixos</Label>
            <Input
              id="custosFixos"
              type="number"
              value={Number.isFinite(custosFixos) ? custosFixos : 0}
              onChange={(e) => setCustosFixos(parseFloat(e.target.value) || 0)}
              placeholder="Ex.: 30000"
            />
          </div>

          <div>
            <Label htmlFor="investimento">Investimento Inicial</Label>
            <Input
              id="investimento"
              type="number"
              value={Number.isFinite(investimento) ? investimento : 0}
              onChange={(e) => setInvestimento(parseFloat(e.target.value) || 0)}
              placeholder="Ex.: 50000"
            />
          </div>

          <div>
            <Label>Horizonte</Label>
            <Select value={horizonte} onValueChange={(v) => setHorizonte(v as Horizonte)}>
              <SelectItem value="mensal">Mensal</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                className="size-4 accent-emerald-500"
                checked={tmaAtiva}
                onChange={(e) => setTmaAtiva(e.target.checked)}
              />
              Considerar TMA (% ao período)
            </label>
            {tmaAtiva && (
              <Input
                type="number"
                value={Number.isFinite(tma) ? tma : 0}
                onChange={(e) => setTma(parseFloat(e.target.value) || 0)}
                placeholder="Ex.: 1.0"
              />
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={calcular}>Calcular</Button>
            <Button
              variant="ghost"
              onClick={() => {
                setReceita(0);
                setCustosVar(0);
                setCustosFixos(0);
                setInvestimento(0);
                setTmaAtiva(false);
                setTma(0);
                setResultados(null);
              }}
            >
              Limpar
            </Button>
            <Button variant="ghost" onClick={exportCSV}>
              Exportar CSV
            </Button>
          </div>
        </Card>

        {/* Resultados */}
        <Card className="space-y-4 p-4">
          <h2 className="text-lg font-semibold">Resultados</h2>

          {resultados ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Kpi title="Lucro do Período" value={fmtBRL.format(resultados.lucro)} negative={resultados.lucro < 0} />
                <Kpi title="ROI" value={`${(resultados.roi * 100).toFixed(2)}%`} negative={resultados.roi < 0} />
                <Kpi title="Margem Operacional" value={fmtPct.format(resultados.margem)} negative={resultados.margem < 0} />
                <Kpi
                  title="Payback Estimado"
                  value={resultados.payback === Infinity ? "Não recupera" : `${resultados.payback.toFixed(2)} ${horizonteLabel()}`}
                  negative={resultados.payback === Infinity}
                />
              </div>

              <Bar data={dataChart} options={options} />

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400">
                      <th className="py-1">Item</th>
                      <th className="py-1 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <Row k="Receita" v={fmtBRL.format(resultados.receita)} />
                    <Row k="Custos Variáveis" v={fmtBRL.format(resultados.custosVar)} />
                    <Row k="Custos Fixos" v={fmtBRL.format(resultados.custosFixos)} />
                    <Row k={<strong>Lucro Operacional</strong>} v={fmtBRL.format(resultados.lucro)} />
                    <Row k="Investimento Inicial" v={fmtBRL.format(resultados.investimento)} />
                    <Row k={<strong>ROI</strong>} v={`${(resultados.roi * 100).toFixed(2)}%`} />
                    <Row k="Ponto de Equilíbrio (Receita)" v={fmtBRL.format(resultados.breakevenReceita)} />
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">Preencha os dados e clique em Calcular</p>
          )}
        </Card>
      </div>
    </div>
  );
}

function Kpi({ title, value, negative }: { title: string; value: string; negative?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${negative ? "border-red-500/30 bg-red-500/5" : "border-white/10 bg-slate-900/50"}`}>
      <small className="block text-xs text-slate-400">{title}</small>
      <div className="mt-1 text-lg font-extrabold">{value}</div>
    </div>
  );
}

function Row({ k, v }: { k: React.ReactNode; v: React.ReactNode }) {
  return (
    <tr className="border-b border-white/10">
      <td className="py-1">{k}</td>
      <td className="py-1 text-right">{v}</td>
    </tr>
  );
}
