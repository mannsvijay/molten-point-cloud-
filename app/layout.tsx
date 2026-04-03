import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hero",
});

export const metadata: Metadata = {
  title: "Chromatic Flux — The Molten Point Cloud",
  description:
    "An immersive, experimental event discovery environment — liquid chrome and volatile particles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${anton.variable} ${inter.className}`}>
        {children}
      </body>
    </html>
  );
}
