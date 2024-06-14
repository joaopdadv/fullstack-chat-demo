import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

export const metadata = {
  title: "Chat Demo",
  description: "Demo de chat usando next.js e nest.js",
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
          {children}
        </body>
    </html>
  );
}
