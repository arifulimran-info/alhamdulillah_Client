import { Fraunces, Hind_Siliguri } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import LangRoot from "@/components/LangRoot";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const hind = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-hind", display: "swap" });

export const metadata = {
  title: { default: "AgroBazar - Pure farm products and seasonal pre-orders", template: "%s | AgroBazar" },
  description: "Honey, ghee, khejurer gur, rice and spices straight from the farm. Pre-order seasonal harvests.",
};

const themeScript = `try{var t=localStorage.getItem("agro-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="agro" className={`${fraunces.variable} ${hind.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className="min-h-screen bg-base-100 text-base-content antialiased">
        <LangRoot>
          <Navbar />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <FloatingContact />
        </LangRoot>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
