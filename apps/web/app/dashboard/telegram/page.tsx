'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TelegramLinkPage() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/user/telegram-token', { method: 'POST' })
      .then((r) => r.json())
      .then((d) => { if (d.data?.token) setToken(d.data.token); })
      .finally(() => setLoading(false));
  }, []);

  function copy() {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-md mx-auto">
        <Link href="/dashboard" className="text-sky-mist hover:text-sky-light text-sm mb-8 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="text-center mb-10">
          <div className="text-5xl mb-4">✈️</div>
          <h1 className="font-display text-2xl font-bold text-gold">Link Telegram</h1>
          <p className="text-sky-mist mt-2">Get real-time delivery updates on Telegram</p>
        </div>

        <div className="glass rounded-3xl p-8 space-y-6">
          <div className="space-y-4">
            {[
              { step: '1', text: 'Open our Telegram bot', link: 'https://t.me/skyhearts_bot', cta: 'Open Bot →' },
              { step: '2', text: 'Send /start to the bot' },
              { step: '3', text: 'Click "Link Account" and enter the token below' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-sky-gold/20 text-sky-gold font-bold flex items-center justify-center text-sm shrink-0">
                  {item.step}
                </div>
                <div className="flex-1 pt-1">
                  <span className="text-sky-light">{item.text}</span>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer"
                      className="ml-2 text-sky-gold hover:underline text-sm">{item.cta}</a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="text-sky-mist text-sm mb-2 block">Your Link Token</label>
            {loading ? (
              <div className="sky-input px-4 py-3 rounded-xl text-sky-mist/40 animate-pulse">Generating...</div>
            ) : (
              <div className="flex gap-2">
                <div className="sky-input flex-1 px-4 py-3 rounded-xl font-mono text-sm tracking-wider">
                  {token || 'Error generating token'}
                </div>
                <button onClick={copy} className="btn-ghost px-4 py-3 rounded-xl text-sm whitespace-nowrap">
                  {copied ? '✅' : '📋 Copy'}
                </button>
              </div>
            )}
            <p className="text-sky-mist/50 text-xs mt-2">Token expires in 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}
