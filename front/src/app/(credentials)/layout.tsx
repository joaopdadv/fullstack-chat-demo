import "~/styles/globals.css";

export const metadata = {
  title: "Entrar",
  description: "Entre no sistema de chat",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-black relative">
        {children}
    </main>
  );
}