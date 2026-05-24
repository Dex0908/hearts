'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  PRICE_PACKAGES,
  calculatePrice,
  calculateETA,
  type ContactMethod,
  CONTACT_LABELS,
} from '@skyhearts/shared';
export const dynamic = 'force-dynamic';
export default function OrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialHearts = Number(searchParams.get('hearts')) || 50;

  const [hearts, setHearts] = useState(initialHearts);
  const [skyFriendCode, setSkyFriendCode] = useState('');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('TELEGRAM');
  const [contactUsername, setContactUsername] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const price = calculatePrice(hearts);
  const eta = calculateETA(hearts);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hearts, skyFriendCode, contactMethod, contactUsername, notes }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { router.push('/auth/login?redirect=/order'); return; }
        throw new Error(data.error || 'Failed to place order');
      }
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="text-sky-mist hover:text-sky-light text-sm">← Back</Link>
        </div>

        <div className="text-center mb-10">
          <div className="text-4xl mb-3">❤️</div>
          <h1 className="font-display text-3xl font-bold text-gold">Order Hearts</h1>
          <p className="text-sky-mist mt-2">for Sky: Children of the Light</p>
        </div>

        {/* Quick packages */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {PRICE_PACKAGES.map((pkg) => (
            <button
              key={pkg.hearts}
              onClick={() => setHearts(pkg.hearts)}
              className={`glass rounded-2xl p-4 text-center transition-all ${
                hearts === pkg.hearts ? 'border-sky-gold/60 bg-sky-gold/10' : ''
              }`}
            >
              {pkg.popular && <div className="text-xs text-sky-gold font-bold mb-1">POPULAR</div>}
              {pkg.label && <div className="text-xs text-sky-amber font-bold mb-1">{pkg.label}</div>}
              <div className="font-display font-bold text-sky-light">{pkg.hearts}❤️</div>
              <div className="text-sky-gold text-sm font-bold">${pkg.price.toFixed(2)}</div>
            </button>
          ))}
        </div>

        <div className="glass rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sky-mist text-sm mb-2 block">
                Hearts Amount <span className="text-sky-gold font-bold">{hearts}</span>
              </label>
              <input
                type="range"
                min={1} max={500} value={hearts}
                onChange={(e) => setHearts(Number(e.target.value))}
                className="w-full accent-yellow-400"
              />
              <div className="flex justify-between text-xs text-sky-mist mt-1">
                <span>1</span><span>500</span>
              </div>
            </div>

            <div>
              <label className="text-sky-mist text-sm mb-2 block">Sky Friend Code *</label>
              <input
                type="text" required
                value={skyFriendCode}
                onChange={(e) => setSkyFriendCode(e.target.value)}
                placeholder="e.g. SKY#12345"
                className="sky-input w-full px-4 py-3 rounded-xl"
              />
            </div>

            <div>
              <label className="text-sky-mist text-sm mb-2 block">Contact Method *</label>
              <select
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value as ContactMethod)}
                className="sky-input w-full px-4 py-3 rounded-xl"
              >
                {(Object.entries(CONTACT_LABELS) as [ContactMethod, string][]).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sky-mist text-sm mb-2 block">Your {CONTACT_LABELS[contactMethod]} Username *</label>
              <input
                type="text" required
                value={contactUsername}
                onChange={(e) => setContactUsername(e.target.value)}
                placeholder="@username"
                className="sky-input w-full px-4 py-3 rounded-xl"
              />
            </div>

            <div>
              <label className="text-sky-mist text-sm mb-2 block">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any special instructions..."
                className="sky-input w-full px-4 py-3 rounded-xl resize-none"
              />
            </div>

            {/* Summary */}
            <div className="glass rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-sky-mist">Hearts</span>
                <span className="text-sky-light font-semibold">{hearts} ❤️</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-sky-mist">Estimated time</span>
                <span className="text-sky-light">~{eta} days</span>
              </div>
              <div className="flex justify-between font-bold border-t border-white/10 pt-2 mt-2">
                <span className="text-sky-mist">Total</span>
                <span className="text-gold text-lg">${price.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 rounded-xl font-display font-semibold text-lg disabled:opacity-60"
            >
              {loading ? '⏳ Placing order...' : `✨ Order ${hearts} Hearts — $${price.toFixed(2)}`}
            </button>
          </form>

          <p className="text-center text-sky-mist/50 text-xs mt-4">
            After placing your order, we'll contact you via {CONTACT_LABELS[contactMethod]} to confirm payment.
          </p>
        </div>
      </div>
    </div>
  );
}
