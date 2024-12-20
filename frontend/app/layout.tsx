import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppStateProvider, ThemeProvider, WalletProviders, EASProvider, ApolloProvider } from "./provider";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Payright",
  description: "Preserve the rights of your employees",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-purple-200">
      <body
        className={`${geistSans.variable} ${geistMono.variable}  bg-purple-200`}
      >
        <ApolloProvider >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <AppStateProvider>
              <WalletProviders>
                <EASProvider >
                  {children}
                </EASProvider>
              </WalletProviders>
            </AppStateProvider>
          </ThemeProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
