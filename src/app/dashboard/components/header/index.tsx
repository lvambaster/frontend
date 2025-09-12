"use client";
import styles from './styles.module.scss';
import Image from 'next/image';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();

  async function handleLogout() {
    deleteCookie("session", { path: "/" });
    router.replace("/");
  }

  return (
    <header className={styles.header}>
      <Image src="./ENTREGADOR.svg" alt="Logo" width={220} height={40} />

      <nav>
        <a href="/dashboard">Pagamentos</a>
        <a href="/dashboard/consult">Consultas</a>
        <a href="/signup">Cadastrar</a> {/* Link adicionado */}
        <form action={handleLogout}>
          <button>Sair</button>
        </form>
      </nav>
    </header>
  );
}
