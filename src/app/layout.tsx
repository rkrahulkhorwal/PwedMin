import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PwedMin - Your Dream Wedding Planner",
  description: "Plan your perfect wedding with our beautiful, minimalist wedding planner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
