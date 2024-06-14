import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import CadastroForm from "./CadastroForm";

function CadastroPage() {
    return (
        <div className="h-max w-96 bg-gray-300 p-10 rounded">
            <h2 className="text-center mb-4 text-3xl">Cadastro</h2>
            <CadastroForm/>
            <Link href={'/login'} className="underline block mt-4 ml-auto mr-auto w-max">Voltar</Link>
        </div>
    );
}

export default CadastroPage;