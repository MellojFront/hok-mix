import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hookah Mix Creator",
  description: "Приложение для создания и хранения рецептов кальянных миксов",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className="antialiased bg-slate-900 text-slate-100">
        {children}
      </body>
    </html>
  );
}