'use client';

import { cookies } from "next/headers";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { signIn } from "next-auth/react";

interface UserResponse{
  token:string,
  profile:{
    id:string,
    name:string,
    role:number,
    email:string,
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitForm = async (event:FormEvent) => {

    event.preventDefault()

    await signIn("credentials", {
      email:email,
      password:password,
      redirect:true,
      callbackUrl:"/conversas"
    })
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