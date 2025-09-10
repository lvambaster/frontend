"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.scss";
import { registerMotoqueiro } from "./actions";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  return (
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
            } catch (err: any) {
              // Se for NEXT_REDIRECT ou qualquer outro erro
              const redirectToLogin = confirm(
                err.message.includes("NEXT_REDIRECT")
                  ? "Cadastro concluído! Clique em OK para ir ao login."
                  : err.message
              );
              if (redirectToLogin) {
                router.push("/"); // redireciona para login
              }
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

        <Link href="/" className={styles.text}>
          Já possui uma conta? Faça login
        </Link>
      </section>
    </div>
  );
}
