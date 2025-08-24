import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProviders } from './modules/Modules__Imports';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "La Consolacion College Bacolod AI",
  description:
    "AI PDF reader for LCC Bacolod: Summarize, ask questions, and interact with your documents smarter and faster.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProviders>
          {children}
        </WalletProviders>
      </body>
    </html>
  );
}
