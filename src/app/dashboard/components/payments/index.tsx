"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";

interface Motoqueiro {
  id: number;
  name: string;
  telefone?: string;
}

const API_URL = "https://backendadmentregas.vercel.app"; // backend Vercel

export default function Payments() {
  const [motoqueiros, setMotoqueiros] = useState<Motoqueiro[]>([]);
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

  // Cadastrar pagamento para todos os motoqueiros
  async function handleAddPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!valorPago || !quantidadeEntregas) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      for (const m of motoqueiros) {
        await fetch(`${API_URL}/payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            motoqueiroId: m.id,
            valorPago: Number(valorPago),
            quantidadeEntregas: Number(quantidadeEntregas),
            observacao,
          }),
        });
      }

      alert("Pagamentos cadastrados para todos os motoqueiros!");
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
        <>
          <div className={styles.motoqueirosList}>
            <h2>Motoqueiros cadastrados:</h2>
            {motoqueiros.map((m) => (
              <div key={m.id} className={styles.motoqueiroCard}>
                <p><strong>Nome:</strong> {m.name}</p>
                {m.telefone && <p><strong>Telefone:</strong> {m.telefone}</p>}
              </div>
            ))}
          </div>

          <form onSubmit={handleAddPayment} className={styles.form}>
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

            <button type="submit">Cadastrar Pagamento para todos</button>
          </form>
        </>
      )}
    </div>
  );
}
