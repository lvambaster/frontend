import styles from './page.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/app/services/api'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default function Page(){

  async function handleLogin(formData: FormData){
    "use server"

    const telefone = formData.get("telefone")
    const password = formData.get("password")

    if(telefone === "" || password === ""){
      return;
    }

    try{

      const response = await api.post("/session", {
        telefone,
        password
      })

      if(!response.data.token){
        return;
      }

      console.log(response.data);

      const expressTime = 60 * 60 * 24 * 30 * 1000 // 30 dias
      const cookieStore = await cookies();

     cookieStore.set("session", response.data.token, {
        maxAge: expressTime,
        path: "/",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
      });

    }catch(err){
      console.log(err);
      return;
    }

    redirect("/dashboard")

  }

  return(
    <>
      <div className={styles["login-page"]}>
       <Image
          src="././ENTREGADOR.svg"
          alt="Logo da pizzaria"
          width={240}
          height={160}
        />

        <section className={styles["login-Container"]}>
          <form action={handleLogin}>
            <input 
              type="tel"
              required
              name="telefone"
              placeholder="(XX) XXXXX-XXXX"
              className={styles.input}
            />

            <input 
              type="password"
              required
              name="password"
              placeholder="***********"
              className={styles.input}
            />

            <button type="submit" className={styles.button}>
              Acessar
            </button>
          </form>

          <Link href="/signup" className={styles.text}>
            Não possui uma conta? Cadastre-se
          </Link>

        </section>

      </div>      
    </>
  )
}