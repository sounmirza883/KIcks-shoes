import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { StoreProvider } from '../components/StoreProvider.tsx';
import './globals.css';

const title = "KICKS. - Built For What's Next";
const description =
  'Authentic premium sneakers, limited edition drops, and urban streetwear footwear storefront.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: 'website' },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* Browser extensions (Grammarly etc.) add attributes to <body> before hydration; this only silences that one element. */}
      <body suppressHydrationWarning>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
