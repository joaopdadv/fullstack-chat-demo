import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

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
    <html lang="pt-br" className={`${GeistSans.variable}`}>
        <body>
            <main className="flex min-h-screen flex-col items-center justify-center text-black">
                {children}
            </main>
        </body>
    </html>
  );
}