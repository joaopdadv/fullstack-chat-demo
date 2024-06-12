'use client'

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function LoginPage() {
  return (
      <div className="h-max w-96 bg-gray-300 p-10 rounded">
        <h2 className="text-center mb-4 text-3xl">Login</h2>
        <form action="" className="flex flex-col gap-3 align-center justify-center">
          <Input placeholder="email"/>
          <Input placeholder="senha"/>
          <Button>Entrar</Button>
        </form>
        <Link href={'/cadastro'} className="underline block mt-4 ml-auto mr-auto w-max">Cadastre-se</Link>
      </div>
  );
}