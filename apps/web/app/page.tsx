'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { PRICE_PACKAGES, calculateETA } from '@skyhearts/shared';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕯️</span>
            <span className="font-display font-bold text-xl text-gold">SkyHearts</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-sm px-4 py-2 rounded-full">
              Sign In
            </Link>
            <Link href="/order" className="btn-primary text-sm px-5 py-2 rounded-full">
              Order Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-20">
        <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Floating heart */}
          <div className="text-7xl mb-6 heart-beat">❤️</div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gold">Hearts</span> for<br />
            <span className="text-sky-light">Sky Children</span>
          </h1>

          <p className="text-sky-mist text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Fast, safe & reliable heart delivery for{' '}
            <em className="text-sky-light not-italic">Sky: Children of the Light</em>.
            Custom packages, real progress tracking, delivered with care.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/order"
              className="btn-primary px-8 py-4 rounded-2xl text-lg font-display font-semibold"
            >
              ✨ Order Hearts
            </Link>
            <Link
              href="/auth/register"
              className="btn-ghost px-8 py-4 rounded-2xl text-lg"
            >
              Create Account
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 justify-center mt-12 text-sm text-sky-mist">
            <div className="flex items-center gap-2">
              <span>⚡</span> Fast Delivery
            </div>
            <div className="flex items-center gap-2">
              <span>🔒</span> 100% Safe
            </div>
            <div className="flex items-center gap-2">
              <span>📱</span> Progress Tracking
            </div>
            <div className="flex items-center gap-2">
              <span>💬</span> Telegram Updates
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gold mb-4">
              Heart Packages
            </h2>
            <p className="text-sky-mist max-w-xl mx-auto">
              Choose a preset package or order a custom amount. Price scales with volume — the more hearts, the better the rate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRICE_PACKAGES.map((pkg) => (
              <div
                key={pkg.hearts}
                className={`glass rounded-3xl p-6 relative transition-transform hover:-translate-y-1 hover:shadow-candle ${
                  pkg.popular ? 'border-sky-gold/40' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-amber to-sky-gold text-sky-void text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                {pkg.label && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-ember to-sky-amber text-white text-xs font-bold px-4 py-1 rounded-full">
                    {pkg.label}
                  </div>
                )}

                <div className="text-4xl mb-3">{'❤️'.repeat(Math.min(pkg.hearts / 50, 5) + 1)}</div>
                <div className="font-display text-3xl font-bold text-gold mb-1">
                  {pkg.hearts} Hearts
                </div>
                <div className="text-sky-mist text-sm mb-4">
                  ETA: ~{calculateETA(pkg.hearts)} days
                </div>
                <div className="text-2xl font-bold text-sky-light mb-6">
                  ${pkg.price.toFixed(2)}
                </div>
                <Link
                  href={`/order?hearts=${pkg.hearts}`}
                  className="btn-primary w-full py-3 rounded-xl text-center block font-semibold"
                >
                  Order Now
                </Link>
              </div>
            ))}
          </div>

          {/* Custom amount */}
          <div className="mt-8 glass rounded-3xl p-8 text-center">
            <div className="text-4xl mb-3">🌟</div>
            <h3 className="font-display text-2xl font-bold text-gold mb-2">Custom Amount</h3>
            <p className="text-sky-mist mb-6">Need a specific number? Order any amount you want.</p>
            <Link
              href="/order?custom=true"
              className="btn-ghost px-8 py-3 rounded-xl inline-block"
            >
              Custom Order →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gold text-center mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: '🛒', step: '01', title: 'Place Order', desc: 'Choose your package and enter your Sky friend code' },
              { icon: '💳', step: '02', title: 'Payment', desc: 'Secure payment confirmation via your chosen contact' },
              { icon: '❤️', step: '03', title: 'Delivery', desc: 'We deliver hearts daily, up to 50 per day' },
              { icon: '✅', step: '04', title: 'Tracking', desc: 'Real-time progress via dashboard & Telegram' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="text-sky-gold/50 text-xs font-mono mb-2">STEP {item.step}</div>
                <h3 className="font-display text-lg font-bold text-sky-light mb-2">{item.title}</h3>
                <p className="text-sky-mist text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sky-gold/10 py-8 px-6 text-center text-sky-mist/50 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span>🕯️</span>
          <span className="font-display text-sky-gold/60">SkyHearts</span>
        </div>
        <p>Not affiliated with thatgamecompany. Fan-made service.</p>
      </footer>
    </div>
  );
}
