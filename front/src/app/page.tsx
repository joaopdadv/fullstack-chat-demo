import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-black">
      <Link href={'/login'}>Vá para o login</Link>
    </main>
  );
}
