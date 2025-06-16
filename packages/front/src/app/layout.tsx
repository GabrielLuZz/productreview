import type { Metadata } from "next";
import "./globals.css";
import { CoreProvider } from "./core-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Product review",
  description:
    "aplicação full stack para cadastro e gerenciamento de avaliações de produtos destinados à venda.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  robots: {
    index: process.env.APP_ENV !== "production",
    follow: process.env.APP_ENV !== "production",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`antialiased`}>
        <CoreProvider>
          <Toaster />
          {children}
        </CoreProvider>
      </body>
    </html>
  );
}
