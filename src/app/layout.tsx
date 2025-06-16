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
  openGraph: {
    title: "Radionuclide Industry Ecosystem",
    description: "An overview of isotope types, ligands, targets, companies in the space, manufacturing methods, global demand, and current access.",
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Radionuclide Industry Ecosystem Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Radionuclide Industry Ecosystem",
    description: "An overview of isotope types, ligands, targets, companies in the space, manufacturing methods, global demand, and current access.",
    images: ["/social-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-P7N6R6Q866"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-P7N6R6Q866');
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${helveticaNow.variable}`}>
        <div className="mx-auto w-full ">
          {children}
        </div>
      </body>
    </html>
  );
}