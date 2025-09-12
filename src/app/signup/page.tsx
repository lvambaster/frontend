"use client";

import Image from "next/image";
import styles from "../page.module.scss";
import { registerMotoqueiro } from "./actions";
import { useRouter } from "next/navigation";
import { Header } from "../dashboard/components/header"; // ajuste o caminho se necessário

export default function Signup() {
  const router = useRouter();

  return (
    <>
      <Header /> {/* Navbar adicionada */}
      <div className={styles["login-page"]}>
        <div className={styles["logo"]}>
          <Image src="/ENTREGADOR.svg" alt="Logo" width={420} height={220} />
        </div>

        <section className={styles.login}>
          <h1>Cadastro de Motoqueiro</h1>
          <p>Preencha os dados para criar sua conta</p>

          <form
            action={async (formData: FormData) => {
              try {
                await registerMotoqueiro(formData);
                alert("Cadastro concluído! Você será redirecionado ao login.");
                router.push("/"); // redireciona para login
              } catch (err: any) {
                alert(err.message || "Erro ao cadastrar motoqueiro");
              }
            }}
          >
            <input
              type="text"
              name="name"
              placeholder="Nome completo"
              required
              className={styles["form input"]}
            />

            <input
              type="text"
              name="telefone"
              placeholder="Telefone (opcional)"
              className={styles["form input"]}
            />

            <input
              type="password"
              name="password"
              placeholder="Senha"
              required
              className={styles["form input"]}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar senha"
              required
              className={styles["form input"]}
            />

            <button type="submit" className={styles.button}>
              Cadastrar
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
