'use client';

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { setCookie } from "cookies-next"
import { useRouter } from "next/navigation";
import { type Session } from "~/types/session";

export default function LoginPage() {

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitForm = async (event:FormEvent) => {

    event.preventDefault()

    const res = await fetch(`${process.env.PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers:{
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          email,
          password
      })
    });

    const response = await res.json() as Session;
    response.expirationDate =  Date.now() + 4 * 60 * 60 * 1000; // 4 horas de validade na session
    setCookie("pdi_chat_user", response);
    router.push("/conversas");
  }

  return (
    <div className="h-max w-96 bg-gray-300 p-10 rounded">
      <h2 className="text-center mb-4 text-3xl">Login</h2>
      <form onSubmit={(event:FormEvent) => submitForm(event)} className="flex flex-col gap-3 align-center justify-center">
        <Input 
          type="email" 
          placeholder="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <Input 
          type="password"
          placeholder="senha" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <Button type="submit">Entrar</Button>
      </form>
      <Link href="/cadastro" className="underline block mt-4 ml-auto mr-auto w-max">
        Cadastre-se
      </Link>
    </div>
  );
}