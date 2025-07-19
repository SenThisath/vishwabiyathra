import type { Metadata } from "next";
import { Comic_Neue } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import ClientProvider from "@/components/ClientProvider";
import "./globals.css";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import Head from "next/head";
import ClientProtection from "@/components/Protection";

const comicNeue = Comic_Neue({
  variable: "--font-comic-neue",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

const myLocalFont = localFont({
  src: "../public/digital-7.ttf",
  variable: "--font-digital",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vishwabhiyathra `25",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body
          className={`${comicNeue.variable} ${myLocalFont.variable} antialiased`}
          suppressHydrationWarning
        >
          <ClientProtection />
          <ClientProvider>
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </ClientProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
