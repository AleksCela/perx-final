import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Perx — perks people actually want",
  description:
    "A two-sided benefits marketplace built for Albania and ready for the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
