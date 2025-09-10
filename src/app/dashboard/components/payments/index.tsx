"use client";

import { useState } from "react";
import styles from "./page.module.scss";

const API_URL = "https://backendadmentregas.vercel.app"; // backend Vercel

export default function Payments() {
  const [motoqueiroId, setMotoqueiroId] = useState("");
  const [valorPago, setValorPago] = useState("");
  const [quantidadeEntregas, setQuantidadeEntregas] = useState("");
  const [observacao, setObservacao] = useState("");

  async function handleAddPayment(e: React.FormEvent) {
    e.preventDefault();

    if (!motoqueiroId || !valorPago || !quantidadeEntregas) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motoqueiroId: Number(motoqueiroId),
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
      setMotoqueiroId("");
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

      <form onSubmit={handleAddPayment} className={styles.form}>
        <input
          type="number"
          placeholder="ID do motoqueiro"
          value={motoqueiroId}
          onChange={(e) => setMotoqueiroId(e.target.value)}
          required
        />

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
    </div>
  );
}
