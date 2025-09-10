"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";

interface Motoqueiro {
  id: number;
  name: string;
}

interface Pagamento {
  id: number;
  motoqueiroNome: string;
  valorPago: number;
  quantidadeEntregas: number;
  dataPagamento: string;
  observacao?: string;
}

const API_URL = "http://localhost:3333";

export default function ConsultaPayments() {
  const [motoqueiros, setMotoqueiros] = useState<Motoqueiro[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [selectedMotoqueiro, setSelectedMotoqueiro] = useState<number | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Buscar motoqueiros
  useEffect(() => {
    async function fetchMotoqueiros() {
      try {
        const res = await fetch(`${API_URL}/bikers`);
        if (!res.ok) throw new Error("Erro ao buscar motoqueiros");
        const data = await res.json();
        setMotoqueiros(data);
      } catch (err) {
        console.error("Erro ao carregar motoqueiros:", err);
      }
    }
    fetchMotoqueiros();
  }, []);

  // Buscar pagamentos
  async function fetchPagamentos() {
    try {
      const query = new URLSearchParams();
      if (selectedMotoqueiro) query.append("motoqueiroId", String(selectedMotoqueiro));
      if (startDate) query.append("startDate", startDate);
      if (endDate) query.append("endDate", endDate);

      const res = await fetch(`${API_URL}/payments?${query.toString()}`);
      if (!res.ok) throw new Error("Erro ao buscar pagamentos");
      const data = await res.json();
      setPagamentos(
        data.map((p: Pagamento) => ({
          ...p,
          dataPagamento: new Date(p.dataPagamento).toLocaleDateString("pt-BR"),
        }))
      );
    } catch (err) {
      console.error("Erro ao carregar pagamentos:", err);
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Consulta de Pagamentos</h1>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          fetchPagamentos();
        }}
      >
        <select
          value={selectedMotoqueiro}
          onChange={(e) => setSelectedMotoqueiro(Number(e.target.value))}
          className={styles.select}
        >
          <option value="">Todos os motoqueiros</option>
          {motoqueiros.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={styles.input}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          Consultar
        </button>
      </form>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Motoqueiro</th>
            <th>Valor Pago</th>
            <th>Qtd Entregas</th>
            <th>Data</th>
            <th>Observação</th>
          </tr>
        </thead>
        <tbody>
          {pagamentos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.motoqueiroNome}</td>
              <td>R$ {p.valorPago.toFixed(2)}</td>
              <td>{p.quantidadeEntregas}</td>
              <td>{p.dataPagamento}</td>
              <td>{p.observacao || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
