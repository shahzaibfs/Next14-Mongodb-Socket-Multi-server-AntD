import ModalCtxProvider from "@/ctx/modals.ctx";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import QueryClientProvider from "@/components/query-client";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans min-h-screen relative w-screen ${inter.variable}`}>
        <QueryClientProvider >
          <ModalCtxProvider>
            {children}
          </ModalCtxProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
