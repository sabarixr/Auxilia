import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Auxilia Admin | AI-Powered Parametric Insurance",
  description: "Admin dashboard for managing parametric insurance policies, claims, and riders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full bg-slate-50 font-sans">
        <Sidebar />
        <div className="ml-64 flex-1 transition-all duration-300">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
