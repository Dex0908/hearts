import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SkyHearts Admin',
  description: 'SkyHearts Admin Panel',
  robots: 'noindex,nofollow',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-admin-bg font-body antialiased">
        {children}
      </body>
    </html>
  );
}
