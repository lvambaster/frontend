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

const API_URL = "https://backendadmentregas.vercel.app";// ajuste para seu backend

export default function ConsultaPayments() {
  const [motoqueiros, setMotoqueiros] = useState<Motoqueiro[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [selectedMotoqueiro, setSelectedMotoqueiro] = useState<number | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Função para pegar o token do cookie ou localStorage
  function getToken() {
    const tokenFromCookie = document.cookie.match(/(^| )session=([^;]+)/)?.[2];
    return tokenFromCookie || localStorage.getItem("token") || "";
  }

  // Buscar motoqueiros
  useEffect(() => {
    async function fetchMotoqueiros() {
      try {
        const token = getToken();
        if (!token) throw new Error("Usuário não autenticado");

        const res = await fetch(`${API_URL}/bikers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Erro ao buscar motoqueiros: ${res.status}`);
        const data = await res.json();
        setMotoqueiros(data);
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar motoqueiros");
      }
    }
    fetchMotoqueiros();
  }, []);

  // Buscar pagamentos
  async function fetchPagamentos() {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuário não autenticado");

      const query = new URLSearchParams();
      if (selectedMotoqueiro) query.append("motoqueiroId", String(selectedMotoqueiro));
      if (startDate) query.append("startDate", startDate);
      if (endDate) query.append("endDate", endDate);

      const res = await fetch(`${API_URL}/payments?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro ao buscar pagamentos: ${res.status} - ${text}`);
      }

      const data = await res.json();
      setPagamentos(
        data.map((p: Pagamento) => ({
          ...p,
          dataPagamento: new Date(p.dataPagamento).toLocaleDateString("pt-BR"),
        }))
      );
    } catch (err: any) {
      console.error(err.message || err);
      alert(err.message || "Erro ao carregar pagamentos");
    }
  }

  // Excluir pagamento
  async function handleDeletePayment(paymentId: number) {
    const confirmDelete = confirm("Tem certeza que deseja excluir este pagamento?");
    if (!confirmDelete) return;

    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/payment/${paymentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erro ao excluir pagamento");
      }

      setPagamentos((prev) => prev.filter((p) => p.id !== paymentId));
      alert("Pagamento excluído com sucesso!");
    } catch (err: any) {
      console.error(err.message || err);
      alert("Erro ao excluir pagamento: " + (err.message || err));
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
          Filtrar
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
            <th>Ações</th>
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
              <td>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeletePayment(p.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
