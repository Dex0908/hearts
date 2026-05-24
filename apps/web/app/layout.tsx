import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SkyHearts — Hearts Delivery for Sky: Children of the Light',
  description:
    'Buy hearts for Sky: Children of the Light safely and quickly. Custom packages, fast delivery, 24/7 support.',
  keywords: ['Sky Children of the Light', 'hearts', 'buy hearts', 'Sky game'],
  openGraph: {
    title: 'SkyHearts',
    description: 'Hearts Delivery for Sky: Children of the Light',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-sky-void font-body antialiased">
        {/* Star field background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="star absolute rounded-full bg-white"
              style={{
                width:  `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                left:   `${Math.random() * 100}%`,
                top:    `${Math.random() * 100}%`,
                '--duration': `${Math.random() * 4 + 2}s`,
                '--delay':    `${Math.random() * 4}s`,
              } as React.CSSProperties}
            />
          ))}
          {/* Ambient orbs */}
          <div className="candle-orb w-96 h-96 top-20 left-1/4 opacity-40" />
          <div className="candle-orb w-64 h-64 bottom-40 right-1/4 opacity-30" />
        </div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
