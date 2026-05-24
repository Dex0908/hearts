'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { calculateRemainingETA, type Order, type OrderStatus } from '@skyhearts/shared';

export const dynamic = 'force-dynamic';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  PENDING:     { label: 'Pending',     color: 'text-yellow-400 bg-yellow-400/10',    icon: '⏳' },
  CONFIRMED:   { label: 'Confirmed',   color: 'text-blue-400 bg-blue-400/10',        icon: '✅' },
  IN_PROGRESS: { label: 'In Progress', color: 'text-sky-gold bg-sky-gold/10',        icon: '❤️' },
  COMPLETED:   { label: 'Completed',   color: 'text-green-400 bg-green-400/10',      icon: '🎉' },
  CANCELLED:   { label: 'Cancelled',   color: 'text-red-400 bg-red-400/10',          icon: '❌' },
};

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<{ name?: string; email: string; telegramLinked: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ordersRes, userRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/user/me'),
        ]);
        if (ordersRes.ok) setOrders((await ordersRes.json()).data || []);
        if (userRes.ok) setUser((await userRes.json()).data);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const activeOrders = orders.filter((o) =>
    ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(o.status)
  );
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 heart-beat">❤️</div>
          <p className="text-sky-mist">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🕯️</span>
              <span className="font-display font-bold text-xl text-gold">SkyHearts</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-sky-light">
              Welcome back{user?.name ? `, ${user.name}` : ''}
            </h1>
            <p className="text-sky-mist text-sm">{user?.email}</p>
          </div>
          <Link href="/order" className="btn-primary px-5 py-3 rounded-xl font-semibold">
            + New Order
          </Link>
        </div>

        {/* Telegram Link Banner */}
        {!user?.telegramLinked && (
          <div className="glass rounded-2xl p-5 mb-8 border border-sky-gold/30 flex items-center gap-4">
            <div className="text-3xl">✈️</div>
            <div className="flex-1">
              <div className="font-semibold text-sky-light">Link Telegram for notifications</div>
              <div className="text-sky-mist text-sm">Get real-time heart delivery updates on Telegram</div>
            </div>
            <Link href="/dashboard/telegram" className="btn-ghost px-4 py-2 rounded-xl text-sm whitespace-nowrap">
              Link Now
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Active Orders', value: activeOrders.length, icon: '❤️' },
            { label: 'Completed', value: completedOrders.length, icon: '🎉' },
            {
              label: 'Hearts Received',
              value: orders.reduce((a, o) => a + o.heartsDelivered, 0),
              icon: '✨',
            },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="font-display text-2xl font-bold text-gold">{stat.value}</div>
              <div className="text-sky-mist text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <div className="mb-10">
            <h2 className="font-display text-xl font-bold text-sky-light mb-4">Active Orders</h2>
            <div className="space-y-4">
              {activeOrders.map((order) => {
                const progress = Math.round((order.heartsDelivered / order.hearts) * 100);
                const remaining = calculateRemainingETA(order.hearts, order.heartsDelivered);
                const status = STATUS_CONFIG[order.status];
                return (
                  <div key={order.id} className="glass rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sky-mist text-xs">#{order.id.slice(-8)}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${status.color}`}>
                            {status.icon} {status.label}
                          </span>
                        </div>
                        <div className="font-display text-lg font-bold text-sky-light">
                          {order.hearts} Hearts
                        </div>
                        <div className="text-sky-mist text-sm">{order.skyFriendCode}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sky-gold font-bold">${Number(order.price).toFixed(2)}</div>
                        <div className="text-sky-mist text-xs">~{remaining} days left</div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-sky-mist mb-2">
                        <span>{order.heartsDelivered}/{order.hearts} hearts delivered</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-ember via-sky-amber to-sky-gold rounded-full progress-glow transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-sky-mist text-sm">
                      <span>❤️</span>
                      <span>{order.heartsDelivered} of {order.hearts} hearts delivered</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order History */}
        {completedOrders.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-bold text-sky-light mb-4">Order History</h2>
            <div className="space-y-3">
              {completedOrders.map((order) => {
                const status = STATUS_CONFIG[order.status];
                return (
                  <div key={order.id} className="glass rounded-2xl p-4 flex items-center gap-4">
                    <div className="text-2xl">{status.icon}</div>
                    <div className="flex-1">
                      <div className="text-sky-light font-semibold">{order.hearts} Hearts</div>
                      <div className="text-sky-mist text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sky-gold font-bold">${Number(order.price).toFixed(2)}</div>
                      <div className={`text-xs ${status.color} px-2 py-0.5 rounded-full`}>
                        {status.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {orders.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌟</div>
            <h3 className="font-display text-xl font-bold text-sky-light mb-2">No orders yet</h3>
            <p className="text-sky-mist mb-6">Start your journey by ordering your first hearts!</p>
            <Link href="/order" className="btn-primary px-8 py-3 rounded-xl inline-block font-semibold">
              Order Hearts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
