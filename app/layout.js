import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Spendly",
  description: "One stop solution for all your expenses",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />
          <footer className="bg-blue-50 py-12 ">
            <div className="container mx-auto text-center text-gray-600 ">
              <p>Made by Siddhant Chaudhary</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
