import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Lo-Fi Markdown Editor',
  description: 'A minimalist Markdown editor with a lo-fi vibe',
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-lofi-beige">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}