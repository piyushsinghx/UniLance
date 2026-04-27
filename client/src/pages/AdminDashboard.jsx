import { useState, useEffect } from 'react';
import { Users, ShoppingBag, DollarSign, Star, TrendingUp, Briefcase, Trash2, Search, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import API from '../services/authService';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6 hover:border-[var(--color-primary)]/30 transition-all">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      {sub && <span className="text-xs text-[var(--text-muted)]">{sub}</span>}
    </div>
    <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
    <p className="text-sm text-[var(--text-secondary)] mt-1">{label}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [activity, setActivity] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userPages, setUserPages] = useState(1);

  useEffect(() => {
    fetchStats();
    fetchActivity();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'gigs') fetchGigs();
  }, [activeTab, userPage, searchTerm]);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/admin/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async () => {
    try {
      const { data } = await API.get('/admin/activity');
      setActivity(data);
    } catch (err) {
      console.error('Failed to load activity', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get(`/admin/users?page=${userPage}&search=${searchTerm}`);
      setUsers(data.users);
      setUserPages(data.pages);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/admin/orders');
      setOrders(data.orders);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGigs = async () => {
    try {
      const { data } = await API.get('/admin/gigs');
      setGigs(data.gigs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user and all their gigs?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      fetchUsers();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleDeleteGig = async (id) => {
    if (!window.confirm('Delete this gig?')) return;
    try {
      await API.delete(`/admin/gigs/${id}`);
      fetchGigs();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'orders', label: 'Orders' },
    { id: 'gigs', label: 'Gigs' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
          <Shield size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)]">Platform overview & management</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--bg-secondary)] rounded-xl p-1 mb-8 border border-[var(--border)] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[var(--color-primary)] text-white shadow-lg'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-gradient-to-br from-blue-500 to-blue-600" sub={`+${stats.newUsersLast30Days} this month`} />
            <StatCard icon={Briefcase} label="Total Gigs" value={stats.totalGigs} color="bg-gradient-to-br from-purple-500 to-purple-600" />
            <StatCard icon={ShoppingBag} label="Total Orders" value={stats.totalOrders} color="bg-gradient-to-br from-emerald-500 to-emerald-600" />
            <StatCard icon={DollarSign} label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} color="bg-gradient-to-br from-amber-500 to-orange-500" />
          </div>

          {/* User Breakdown + Order Status */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Users by Role</h3>
              <div className="space-y-3">
                {[
                  { label: 'Buyers', value: stats.usersByRole.buyers, color: 'bg-blue-500', pct: Math.round((stats.usersByRole.buyers / stats.totalUsers) * 100) || 0 },
                  { label: 'Sellers', value: stats.usersByRole.sellers, color: 'bg-purple-500', pct: Math.round((stats.usersByRole.sellers / stats.totalUsers) * 100) || 0 },
                  { label: 'Admins', value: stats.usersByRole.admins, color: 'bg-red-500', pct: Math.round((stats.usersByRole.admins / stats.totalUsers) * 100) || 0 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[var(--text-secondary)]">{item.label}</span>
                      <span className="text-[var(--text-primary)] font-medium">{item.value} ({item.pct}%)</span>
                    </div>
                    <div className="h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Orders by Status</h3>
              <div className="space-y-3">
                {[
                  { label: 'Pending', value: stats.ordersByStatus.pending, color: 'bg-yellow-500' },
                  { label: 'Active', value: stats.ordersByStatus.active, color: 'bg-blue-500' },
                  { label: 'Completed', value: stats.ordersByStatus.completed, color: 'bg-emerald-500' },
                  { label: 'Cancelled', value: stats.ordersByStatus.cancelled, color: 'bg-red-500' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                    </div>
                    <span className="text-sm font-medium text-[var(--text-primary)]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gigs by Category */}
          {stats.gigsByCategory.length > 0 && (
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6 mb-8">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Gigs by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stats.gigsByCategory.map((cat) => (
                  <div key={cat._id} className="bg-[var(--bg-primary)] rounded-xl p-4 border border-[var(--border)]">
                    <p className="text-xs text-[var(--text-muted)] mb-1 capitalize">{cat._id?.replace('-', ' ')}</p>
                    <p className="text-xl font-bold text-[var(--text-primary)]">{cat.count}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          {activity && (
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Recent Signups</h3>
              <div className="space-y-2">
                {activity.recentUsers.map((u) => (
                  <div key={u._id} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{u.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{u.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'seller' ? 'bg-purple-500/20 text-purple-400' : u.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{u.role}</span>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{new Date(u.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">All Users</h3>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setUserPage(1); }}
                className="pl-9 pr-4 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase">Name</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase">Email</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase">Role</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase">University</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase">Joined</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-[var(--border)]/50 hover:bg-[var(--bg-primary)]/50 transition-colors">
                    <td className="py-3 px-2 text-sm text-[var(--text-primary)]">{u.name}</td>
                    <td className="py-3 px-2 text-sm text-[var(--text-secondary)]">{u.email}</td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'seller' ? 'bg-purple-500/20 text-purple-400' : u.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{u.role}</span>
                    </td>
                    <td className="py-3 px-2 text-sm text-[var(--text-muted)]">{u.university || '—'}</td>
                    <td className="py-3 px-2 text-sm text-[var(--text-muted)]">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-2 text-right">
                      {u.role !== 'admin' && (
                        <button onClick={() => handleDeleteUser(u._id)} className="text-red-400 hover:text-red-300 transition-colors p-1">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {userPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setUserPage(Math.max(1, userPage - 1))} disabled={userPage === 1} className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] disabled:opacity-30">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-[var(--text-secondary)]">Page {userPage} of {userPages}</span>
              <button onClick={() => setUserPage(Math.min(userPages, userPage + 1))} disabled={userPage === userPages} className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] disabled:opacity-30">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">All Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase">Gig</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase">Buyer</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase">Seller</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase">Price</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase">Status</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b border-[var(--border)]/50 hover:bg-[var(--bg-primary)]/50 transition-colors">
                    <td className="py-3 px-2 text-sm text-[var(--text-primary)] max-w-[200px] truncate">{o.gig?.title || 'Deleted'}</td>
                    <td className="py-3 px-2 text-sm text-[var(--text-secondary)]">{o.buyer?.name || '—'}</td>
                    <td className="py-3 px-2 text-sm text-[var(--text-secondary)]">{o.seller?.name || '—'}</td>
                    <td className="py-3 px-2 text-sm font-medium text-[var(--text-primary)]">₹{o.price}</td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        o.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                        o.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                        o.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>{o.status}</span>
                    </td>
                    <td className="py-3 px-2 text-sm text-[var(--text-muted)]">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan="6" className="py-8 text-center text-[var(--text-muted)]">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Gigs Tab */}
      {activeTab === 'gigs' && (
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">All Gigs</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase">Title</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase">Seller</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase">Category</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase">Price</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase">Rating</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gigs.map((g) => (
                  <tr key={g._id} className="border-b border-[var(--border)]/50 hover:bg-[var(--bg-primary)]/50 transition-colors">
                    <td className="py-3 px-2 text-sm text-[var(--text-primary)] max-w-[250px] truncate">{g.title}</td>
                    <td className="py-3 px-2 text-sm text-[var(--text-secondary)]">{g.seller?.name || '—'}</td>
                    <td className="py-3 px-2 text-sm text-[var(--text-muted)] capitalize">{g.category?.replace('-', ' ')}</td>
                    <td className="py-3 px-2 text-sm font-medium text-[var(--text-primary)]">₹{g.pricing?.basic?.price || 0}</td>
                    <td className="py-3 px-2 text-sm text-yellow-400">⭐ {g.rating || 0}</td>
                    <td className="py-3 px-2 text-right">
                      <button onClick={() => handleDeleteGig(g._id)} className="text-red-400 hover:text-red-300 transition-colors p-1">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {gigs.length === 0 && (
                  <tr><td colSpan="6" className="py-8 text-center text-[var(--text-muted)]">No gigs yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
