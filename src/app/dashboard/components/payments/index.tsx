"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";

interface Motoqueiro {
  id: number;
  name: string;
}

const API_URL = "https://backendadmentregas.vercel.app"; // Backend Vercel

export default function Payments() {
  const [motoqueiros, setMotoqueiros] = useState<Motoqueiro[]>([]);
  const [selectedMotoqueiro, setSelectedMotoqueiro] = useState("");
  const [valorPago, setValorPago] = useState("");
  const [quantidadeEntregas, setQuantidadeEntregas] = useState("");
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Buscar motoqueiros
  useEffect(() => {
    async function fetchMotoqueiros() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/bikers`);
        if (!res.ok) throw new Error("Erro ao buscar motoqueiros");
        const data = await res.json();
        setMotoqueiros(data);
      } catch (err: any) {
        console.error("Erro ao carregar motoqueiros:", err);
        setError("Erro ao carregar motoqueiros");
      } finally {
        setLoading(false);
      }
    }
    fetchMotoqueiros();
  }, []);

  // Cadastrar pagamento
  async function handleAddPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMotoqueiro || !valorPago || !quantidadeEntregas) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          motoqueiroId: Number(selectedMotoqueiro),
          valorPago: Number(valorPago),
          quantidadeEntregas: Number(quantidadeEntregas),
          observacao,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ${res.status}: ${errorText}`);
      }

      alert("Pagamento cadastrado com sucesso!");
      setSelectedMotoqueiro("");
      setValorPago("");
      setQuantidadeEntregas("");
      setObservacao("");
    } catch (err: any) {
      console.error("Erro ao cadastrar pagamento:", err);
      alert("Erro ao cadastrar pagamento: " + err.message);
    }
  }

  return (
    <div className={styles.container}>
      <h1>Cadastro de Pagamento</h1>

      {loading ? (
        <p>Carregando motoqueiros...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <form onSubmit={handleAddPayment} className={styles.form}>
          <select
            value={selectedMotoqueiro}
            onChange={(e) => setSelectedMotoqueiro(e.target.value)}
            required
          >
            <option value="">Selecione o motoqueiro</option>
            {motoqueiros.map((m) => (
              <option key={m.id} value={m.id.toString()}>
                {m.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Valor pago"
            value={valorPago}
            onChange={(e) => setValorPago(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Quantidade de entregas"
            value={quantidadeEntregas}
            onChange={(e) => setQuantidadeEntregas(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Observação"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />

          <button type="submit">Cadastrar Pagamento</button>
        </form>
      )}
    </div>
  );
}
