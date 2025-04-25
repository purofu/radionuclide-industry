
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Add our custom Helvetica Now Display font
const helveticaNow = localFont({
  src: [
    {
      path: '../../public/fonts/HelveticaNowDisplay-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/HelveticaNowDisplay-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-helvetica-now',
});

export const metadata: Metadata = {
  title: "Radionuclide Industry Ecosystem",
  description: "An overview of isotope types, ligands, targets, companies in the space, manufacturing methods, global demand, and current access.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${helveticaNow.variable}`}>
        <div className="mx-auto w-full ">
          {children}
        </div>
      </body>
    </html>
  );
}