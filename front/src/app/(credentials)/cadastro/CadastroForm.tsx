'use client'

import { type FormEvent, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

function CadastroForm() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');

    const submitForm = async (event:FormEvent) => {

        event.preventDefault()
    
        const res = await fetch(`${process.env.PUBLIC_API_URL}/auth/register`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                name,
                password
            })
        });

        console.log(await res.json());
    }

    return (
        <form onSubmit={(event:FormEvent) => submitForm(event)} className="flex flex-col gap-3 align-center justify-center">
            <Input placeholder="nome" value={name} onChange={(e) => setName(e.target.value)}/>
            <Input placeholder="email"  value={email} onChange={(e) => setEmail(e.target.value)}/>
            <Input type="password" placeholder="senha"  value={password} onChange={(e) => setPassword(e.target.value)}/>
            <Button type="submit">Cadastrar</Button>
        </form>
    );
}

export default CadastroForm;