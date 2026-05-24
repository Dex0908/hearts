'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Order, OrderStatus, AdminStats } from '@skyhearts/shared';

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING:     'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  CONFIRMED:   'bg-blue-500/15 text-blue-400 border-blue-500/30',
  IN_PROGRESS: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  COMPLETED:   'bg-green-500/15 text-green-400 border-green-500/30',
  CANCELLED:   'bg-red-500/15 text-red-400 border-red-500/30',
};

const STATUS_OPTIONS: OrderStatus[] = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

interface OrderWithUser extends Order {
  user: { email: string; name?: string };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithUser | null>(null);
  const [updateHearts, setUpdateHearts] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [newStatus, setNewStatus] = useState<OrderStatus>('IN_PROGRESS');
  const [updating, setUpdating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'ALL'>('ALL');

  async function load() {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/orders'),
      ]);
      if (statsRes.status === 401 || ordersRes.status === 401) {
        router.push('/login');
        return;
      }
      if (statsRes.ok) setStats((await statsRes.json()).data);
      if (ordersRes.ok) setOrders((await ordersRes.json()).data || []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filteredOrders = filterStatus === 'ALL'
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  async function handleUpdateOrder() {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          heartsDelivered: updateHearts ? Number(updateHearts) : undefined,
          message: updateMessage || undefined,
        }),
      });
      if (res.ok) {
        setSelectedOrder(null);
        setUpdateHearts('');
        setUpdateMessage('');
        await load();
      }
    } catch {}
    setUpdating(false);
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl mb-3">⏳</div>
          <p className="text-admin-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const workloadPct = stats ? Math.min((stats.heartsDeliveredToday / 50) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-admin-bg">
      {/* Sidebar */}
      <div className="flex">
        <aside className="w-60 min-h-screen bg-admin-surface border-r border-admin-border flex flex-col">
          <div className="p-6 border-b border-admin-border">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🕯️</span>
              <div>
                <div className="font-display font-bold text-admin-gold text-sm">SkyHearts</div>
                <div className="text-admin-muted text-xs">Admin Panel</div>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {[
              { icon: '📊', label: 'Dashboard', active: true },
              { icon: '❤️', label: 'Orders' },
              { icon: '👥', label: 'Clients' },
              { icon: '📈', label: 'Analytics' },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors ${
                  item.active
                    ? 'bg-admin-gold/15 text-admin-gold font-medium'
                    : 'text-admin-muted hover:text-admin-text hover:bg-white/5'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </nav>
          <div className="p-4 border-t border-admin-border">
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-admin-muted hover:text-admin-danger transition-colors"
            >
              <span>🚪</span> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-admin-text">Dashboard</h1>
              <p className="text-admin-muted text-sm mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: '💰', color: 'text-admin-gold' },
                  { label: 'Active Orders', value: stats.activeOrders, icon: '❤️', color: 'text-amber-400' },
                  { label: 'Completed', value: stats.completedOrders, icon: '✅', color: 'text-green-400' },
                  { label: 'Total Clients', value: stats.totalClients, icon: '👥', color: 'text-blue-400' },
                ].map((stat) => (
                  <div key={stat.label} className="admin-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{stat.icon}</span>
                    </div>
                    <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                    <div className="text-admin-muted text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Workload */}
            {stats && (
              <div className="admin-card p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-admin-text">Daily Workload</h2>
                  <span className={`text-sm font-mono ${workloadPct >= 90 ? 'text-red-400' : workloadPct >= 70 ? 'text-amber-400' : 'text-green-400'}`}>
                    {stats.heartsDeliveredToday}/50 hearts today
                  </span>
                </div>
                <div className="h-3 bg-admin-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      workloadPct >= 90 ? 'bg-red-500' :
                      workloadPct >= 70 ? 'bg-amber-500' :
                      'bg-gradient-to-r from-amber-500 to-admin-gold'
                    }`}
                    style={{ width: `${workloadPct}%` }}
                  />
                </div>
                {workloadPct >= 90 && (
                  <p className="text-red-400 text-xs mt-2">⚠️ Approaching daily capacity limit</p>
                )}
              </div>
            )}

            {/* Orders Table */}
            <div className="admin-card">
              <div className="p-6 border-b border-admin-border flex items-center justify-between">
                <h2 className="font-semibold text-admin-text">Orders</h2>
                <div className="flex gap-2">
                  {(['ALL', ...STATUS_OPTIONS] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        filterStatus === s
                          ? 'bg-admin-gold text-admin-bg'
                          : 'text-admin-muted hover:text-admin-text'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-admin-border">
                      {['ID', 'Client', 'Hearts', 'Progress', 'Status', 'Price', 'Actions'].map((h) => (
                        <th key={h} className="text-left px-6 py-3 text-admin-muted text-xs font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const pct = Math.round((order.heartsDelivered / order.hearts) * 100);
                      return (
                        <tr key={order.id} className="border-b border-admin-border/50 hover:bg-white/2">
                          <td className="px-6 py-4">
                            <span className="font-mono text-xs text-admin-muted">#{order.id.slice(-8)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-admin-text">{order.user?.name || order.user?.email}</div>
                            <div className="text-xs text-admin-muted">{order.skyFriendCode}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-admin-text font-medium">{order.hearts} ❤️</span>
                          </td>
                          <td className="px-6 py-4 w-32">
                            <div className="text-xs text-admin-muted mb-1">{order.heartsDelivered}/{order.hearts}</div>
                            <div className="h-1.5 bg-admin-border rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-admin-gold rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`status-badge border ${STATUS_COLORS[order.status]}`}>
                              {order.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-admin-gold font-semibold">${Number(order.price).toFixed(2)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setNewStatus(order.status);
                                setUpdateHearts(String(order.heartsDelivered));
                              }}
                              className="text-admin-gold text-sm hover:underline"
                            >
                              Update
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <div className="text-center py-12 text-admin-muted">No orders found</div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Update Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="admin-card p-6 w-full max-w-md">
            <h3 className="font-semibold text-admin-text mb-1">Update Order</h3>
            <p className="text-admin-muted text-sm mb-6">#{selectedOrder.id.slice(-8)} — {selectedOrder.hearts} hearts</p>

            <div className="space-y-4">
              <div>
                <label className="text-admin-muted text-sm mb-1 block">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="admin-input"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-admin-muted text-sm mb-1 block">Hearts Delivered</label>
                <input
                  type="number"
                  min={0}
                  max={selectedOrder.hearts}
                  value={updateHearts}
                  onChange={(e) => setUpdateHearts(e.target.value)}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="text-admin-muted text-sm mb-1 block">Update Message (sends to user)</label>
                <textarea
                  value={updateMessage}
                  onChange={(e) => setUpdateMessage(e.target.value)}
                  rows={3}
                  placeholder="e.g. 40/150 hearts delivered, going great!"
                  className="admin-input resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-2.5 rounded-lg border border-admin-border text-admin-muted hover:text-admin-text transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateOrder}
                disabled={updating}
                className="btn-gold flex-1 py-2.5"
              >
                {updating ? 'Updating...' : 'Save Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
