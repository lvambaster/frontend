"use server";

import { api } from "@/app/services/api";
import { redirect } from "next/navigation";

export async function registerMotoqueiro(formData: FormData) {
  const name = formData.get("name") as string;
  const telefone = formData.get("telefone") as string | null;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!name || !password) {
    throw new Error("Preencha todos os campos obrigatórios!");
  }

  if (password !== confirmPassword) {
    throw new Error("As senhas não coincidem!");
  }

  // Tenta cadastrar usando axios
  let res;
  try {
    res = await api.post("/bikers", { name, telefone, password });
  } catch (err: any) {
    console.error("Erro ao cadastrar:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || err.message);
  }

  // Redireciona apenas se cadastro deu certo
  if (res.status === 201 || res.status === 200) {
    redirect("/"); // redireciona para login
  }
}
