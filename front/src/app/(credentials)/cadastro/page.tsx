import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

function CadastroPage() {
    return (
        <div className="h-max w-96 bg-gray-300 p-10 rounded">
            <h2 className="text-center mb-4 text-3xl">Cadastro</h2>
            <form action="" className="flex flex-col gap-3 align-center justify-center">
            <Input placeholder="nome"/>
            <Input placeholder="email"/>
            <Input placeholder="senha"/>
            <Button>Cadastrar</Button>
            </form>
            <Link href={'/login'} className="underline block mt-4 ml-auto mr-auto w-max">Voltar</Link>
        </div>
    );
}

export default CadastroPage;