import React, { useState, useEffect } from 'react';
import { ShieldCheck, IndianRupee, Users, Sparkles, Eye, Lock, ArrowUpRight } from 'lucide-react';
import { Navbar } from '../components/Navbar.js';

interface AdminStats {
  totalDrafts: number;
  totalPaidOrders: number;
  totalRevenueInr: number;
  totalPublishedSurprises: number;
  totalViews: number;
  funnel: Record<string, number>;
}

interface AdminOrder {
  _id: string;
  draftId: string;
  provider: string;
  providerOrderId: string;
  amount: number;
  currency: string;
  status: string;
  contact?: string;
  createdAt: string;
}

export const AdminPage: React.FC = () => {
  const [token, setToken] = useState<string>(
    localStorage.getItem('lumiwish_admin_token') || ''
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminData = async (authToken: string) => {
    setLoading(true);
    setError(null);

    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${authToken}` },
        }),
        fetch('/api/admin/orders', {
          headers: { 'Authorization': `Bearer ${authToken}` },
        }),
      ]);

      if (statsRes.ok && ordersRes.ok) {
        const statsData = await statsRes.json();
        const ordersData = await ordersRes.json();
        setStats(statsData);
        setOrders(ordersData);
        setIsAuthenticated(true);
        localStorage.setItem('lumiwish_admin_token', authToken);
      } else {
        setIsAuthenticated(false);
        setError('Invalid admin token. Please verify ADMIN_TOKEN from server config.');
      }
    } catch {
      setError('Failed to connect to admin server');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData(token);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      fetchAdminData(token.trim());
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 py-8 flex-1">
        {!isAuthenticated ? (
          <div className="max-w-sm mx-auto bg-white rounded-3xl p-8 shadow-soft border border-peach-100 text-center mt-10">
            <div className="w-14 h-14 rounded-2xl bg-peach-100 text-coral-500 mx-auto flex items-center justify-center mb-3">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-1">
              Admin Portal
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Enter your secret ADMIN_TOKEN to view metrics and orders
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ADMIN_TOKEN..."
                className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-peach-200 focus:border-coral-500 outline-none text-sm font-mono text-gray-800"
              />

              {error && (
                <p className="text-xs text-rose-500 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl font-heading font-semibold text-white bg-gradient-to-r from-coral-500 to-amber-500 hover:from-coral-600 hover:to-amber-600 shadow-md text-sm transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Access Dashboard'}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading text-3xl font-bold text-gray-900">
                  Platform Overview
                </h1>
                <p className="text-xs text-gray-500">
                  Live performance, order tracking and funnel conversion analytics
                </p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('lumiwish_admin_token');
                  setIsAuthenticated(false);
                }}
                className="text-xs font-semibold text-gray-400 hover:text-gray-600 underline"
              >
                Sign out
              </button>
            </div>

            {/* 4 Top Metric Cards */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white border border-peach-100 shadow-soft">
                  <div className="flex items-center justify-between text-gray-400 mb-2">
                    <span className="text-xs font-semibold">Total Revenue</span>
                    <IndianRupee className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
                    ₹{stats.totalRevenueInr.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium block mt-1">
                    {stats.totalPaidOrders} paid orders
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-peach-100 shadow-soft">
                  <div className="flex items-center justify-between text-gray-400 mb-2">
                    <span className="text-xs font-semibold">Total Drafts</span>
                    <Users className="w-4 h-4 text-coral-500" />
                  </div>
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
                    {stats.totalDrafts}
                  </span>
                  <span className="text-[11px] text-gray-400 block mt-1">Created in wizard</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-peach-100 shadow-soft">
                  <div className="flex items-center justify-between text-gray-400 mb-2">
                    <span className="text-xs font-semibold">Live Surprises</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
                    {stats.totalPublishedSurprises}
                  </span>
                  <span className="text-[11px] text-amber-600 font-medium block mt-1">Active links</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-peach-100 shadow-soft">
                  <div className="flex items-center justify-between text-gray-400 mb-2">
                    <span className="text-xs font-semibold">Total Views</span>
                    <Eye className="w-4 h-4 text-purple-500" />
                  </div>
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
                    {stats.totalViews}
                  </span>
                  <span className="text-[11px] text-purple-600 font-medium block mt-1">Surprise opens</span>
                </div>
              </div>
            )}

            {/* Funnel Conversion Analytics */}
            {stats && stats.funnel && (
              <div className="p-6 rounded-3xl bg-white border border-peach-100 shadow-soft">
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-4">
                  Funnel Drop-Off Analytics
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
                  {Object.entries(stats.funnel).map(([step, count]) => (
                    <div key={step} className="p-3 bg-cream-50 rounded-2xl border border-peach-100">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block truncate">
                        {step.replace(/_/g, ' ')}
                      </span>
                      <span className="font-heading font-extrabold text-xl text-gray-900 mt-1 block">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Orders Table */}
            <div className="p-6 rounded-3xl bg-white border border-peach-100 shadow-soft">
              <h3 className="font-heading font-bold text-lg text-gray-900 mb-4">
                Recent Orders
              </h3>
              {orders.length === 0 ? (
                <p className="text-xs text-gray-400">No orders recorded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-600">
                    <thead className="bg-cream-50 text-gray-400 uppercase font-semibold text-[10px] border-b border-peach-100">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-peach-100/60">
                      {orders.map((o) => (
                        <tr key={o._id} className="hover:bg-cream-50/50">
                          <td className="p-3 text-gray-400">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 font-mono font-medium text-gray-900">
                            {o.providerOrderId || o._id}
                          </td>
                          <td className="p-3">{o.contact || '—'}</td>
                          <td className="p-3 font-semibold text-gray-900">
                            ₹{o.amount / 100}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                o.status === 'paid'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
