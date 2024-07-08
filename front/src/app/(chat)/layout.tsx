import "~/styles/globals.css";

export const metadata = {
  title: "Conversas",
  description: "Demo de chat usando next.js e nest.js",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode,
}) {

  return (
    <main className="box-border h-screen"> 
      {children}
    </main>
  );
}
