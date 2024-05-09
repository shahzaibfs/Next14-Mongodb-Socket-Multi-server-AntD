import ModalCtxProvider from "@/ctx/modals.ctx";
import "@/styles/globals.css";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Server Info by <shahzaibalam231@gmail.com>",
  description:
    "You can Monitor the server traffic and health and analyze your server.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>{
        <ModalCtxProvider>
          {children}
        </ModalCtxProvider>
      }</body>
    </html>
  );
}
