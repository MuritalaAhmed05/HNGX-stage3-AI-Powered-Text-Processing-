import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import { ThemeProvider } from "@/components/theme-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI-Powered Text Processing Interface  ",
  description: "Translate, summarize, and detect language effortlessly with our AI-powered chat interface.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <Head>
        <meta httpEquiv="origin-trial" content="AhfBNAl3YbQQE6DD//XSvLeWi4dPLchJH6HWDrLWW9o/hH72p0KUZgtJM+k4/1l6ZqvqS6SIciE6N4hKeMx4cQEAAACQeyJvcmlnaW4iOiJodHRwczovL2huZ3gtc3RhZ2UzLWFpLXBvd2VyZWQtdGV4dC1wcm9jZXNzaW5nLnZlcmNlbC5hcHA6NDQzIiwiZmVhdHVyZSI6IkFJU3VtbWFyaXphdGlvbkFQSSIsImV4cGlyeSI6MTc1MzE0MjQwMCwiaXNTdWJkb21haW4iOnRydWV9" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
