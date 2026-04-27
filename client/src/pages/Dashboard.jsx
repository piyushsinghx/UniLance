import { useState, useEffect, useCallback, useContext } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Star, TrendingUp, Package, Clock, Eye, Plus, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';
import { formatPrice } from '../utils/formatDate';
import { getDashboardStats, getEarningsData, getGigPerformance } from '../services/analyticsService';
import { getOrders } from '../services/orderService';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { SkeletonDashboard } from '../components/Loader';
import { OrderEmptyState } from '../components/EmptyState';
import { SocketContext } from '../context/SocketContext';
import CountUp from '../components/CountUp';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45, ease: 'easeOut' } }),
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass border border-[var(--border)] rounded-xl px-4 py-3 shadow-xl text-xs">
      <p className="text-[var(--text-muted)] mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="font-bold" style={{ color: p.color }}>
          {p.name}: {p.dataKey === 'earnings' ? formatPrice(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

const DONUT_COLORS = ['#F59E0B', '#6C63FF', '#43E97B', '#FF6584'];

const StatCard = ({ label, value, icon: Icon, color, trend, prefix = '' }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    animate="show"
    whileHover={{ y: -3 }}
    className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-5 card-hover relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0`}>
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
            trend >= 0 ? 'text-[var(--color-success)] bg-[var(--color-success)]/10' : 'text-[var(--color-error)] bg-[var(--color-error)]/10'
          }`}>
            {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-[var(--text-primary)]">{prefix}{value}</p>
      <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">{label}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { socket } = useContext(SocketContext);

  const [loading, setLoading] = useState(true);
  const [earningsPeriod, setEarningsPeriod] = useState('monthly');
  const [stats, setStats] = useState(null);
  const [earningsData, setEarningsData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [gigPerformance, setGigPerformance] = useState([]);

  const fetchDashboardData = useCallback(async ({ withLoader = true } = {}) => {
    try {
      if (withLoader) setLoading(true);
      const [statsRes, earningsRes, ordersRes] = await Promise.all([
        getDashboardStats(),
        getEarningsData({ period: earningsPeriod }),
        getOrders({ limit: 5, role: user.role }),
      ]);
      setStats(statsRes.data);
      setEarningsData(earningsRes.data);
      setRecentOrders(ordersRes.data);
      if (user.role === 'seller') {
        const perfRes = await getGigPerformance();
        setGigPerformance(perfRes.data);
      }
    } catch (err) {
      console.error('Dashboard data error:', err);
    } finally {
      if (withLoader) setLoading(false);
    }
  }, [earningsPeriod, user.role]);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  useEffect(() => {
    if (!socket) return;
    const refresh = () => fetchDashboardData({ withLoader: false });
    socket.on('orderStatusUpdate', refresh);
    socket.on('newNotification', refresh);
    return () => { socket.off('orderStatusUpdate', refresh); socket.off('newNotification', refresh); };
  }, [socket, fetchDashboardData]);

  if (loading) return <SkeletonDashboard />;

  const isSeller = user.role === 'seller';
  const topGig = gigPerformance[0];

  const statCards = isSeller ? [
    { label: 'Total Earnings', value: formatPrice(stats?.totalEarnings || 0), icon: DollarSign, color: 'text-[var(--color-success)] bg-[var(--color-success)]/10', trend: 12 },
    { label: 'Active Orders', value: stats?.activeOrders || 0, icon: ShoppingBag, color: 'text-[var(--color-primary)] bg-[var(--color-primary)]/10', trend: 5 },
    { label: 'Avg Rating', value: (stats?.avgRating || 0).toFixed(1), icon: Star, color: 'text-[var(--color-warning)] bg-[var(--color-warning)]/10', trend: 2 },
    { label: 'Profile Views', value: stats?.totalViews || 0, icon: Eye, color: 'text-blue-400 bg-blue-400/10', trend: -3 },
    { label: 'Completed', value: stats?.completedOrders || 0, icon: Package, color: 'text-[var(--color-accent)] bg-[var(--color-accent)]/10' },
    { label: 'Conversion', value: `${stats?.conversionRate || 0}%`, icon: TrendingUp, color: 'text-purple-400 bg-purple-400/10', trend: 8 },
  ] : [
    { label: 'Orders Placed', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'text-[var(--color-primary)] bg-[var(--color-primary)]/10' },
    { label: 'Active Orders', value: stats?.activeOrders || 0, icon: Clock, color: 'text-[var(--color-warning)] bg-[var(--color-warning)]/10' },
    { label: 'Completed', value: stats?.completedOrders || 0, icon: Package, color: 'text-[var(--color-accent)] bg-[var(--color-accent)]/10' },
    { label: 'Avg Rating Given', value: stats?.avgRating || '0.0', icon: Star, color: 'text-[var(--color-warning)] bg-[var(--color-warning)]/10' },
  ];

  // Donut data
  const donutData = [
    { name: 'Pending', value: stats?.pendingOrders || 0 },
    { name: 'Active', value: stats?.activeOrders || 0 },
    { name: 'Delivered', value: (stats?.completedOrders || 0) - (stats?.activeOrders || 0) },
    { name: 'Completed', value: stats?.completedOrders || 0 },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Here's what's happening with your account today.</p>
        </div>
        {isSeller && (
          <Link to="/dashboard/create-gig">
            <Button size="md">
              <Plus size={16} /> New Gig
            </Button>
          </Link>
        )}
      </motion.div>

      {/* Stat cards */}
      <div className={`grid gap-4 ${isSeller ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6' : 'grid-cols-2 lg:grid-cols-4'}`}>
        {statCards.map((card, i) => (
          <motion.div key={card.label} custom={i} variants={fadeUp} initial="hidden" animate="show">
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Top gig highlight */}
      {isSeller && topGig && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-[var(--color-primary)]/10 via-[var(--color-accent)]/10 to-transparent border border-[var(--color-primary)]/20 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)] font-bold mb-2">⭐ Top Performer</p>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">{topGig.title}</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {topGig.orderCount} orders · {topGig.viewCount} views · {topGig.conversionRate}% conversion
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm font-bold text-[var(--text-primary)]">
              {formatPrice(topGig.price)} starting
            </span>
            <span className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm font-bold text-[var(--color-warning)] flex items-center gap-1.5">
              <Star size={14} className="fill-[var(--color-warning)]" /> {topGig.rating.toFixed(1)}
            </span>
          </div>
        </motion.div>
      )}

      {/* Charts */}
      {isSeller && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Earnings area chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">Earnings Overview</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Revenue across selected period</p>
              </div>
              <div className="flex items-center gap-1 bg-[var(--bg-primary)] p-1 rounded-xl">
                {['weekly', 'monthly'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setEarningsPeriod(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      earningsPeriod === p
                        ? 'bg-[var(--color-primary)] text-white shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            {earningsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={earningsData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#43E97B" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#43E97B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="earnings" name="Earnings" stroke="#6C63FF" strokeWidth={2.5} fill="url(#colorEarnings)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[240px] flex items-center justify-center text-[var(--text-muted)] text-sm">
                Not enough data yet.
              </div>
            )}
          </motion.div>

          {/* Order status donut */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6"
          >
            <h3 className="font-bold text-[var(--text-primary)] mb-1">Order Status</h3>
            <p className="text-xs text-[var(--text-muted)] mb-6">Current breakdown</p>
            {donutData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {donutData.map((_, i) => (
                        <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {donutData.map((entry, i) => (
                    <div key={entry.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: DONUT_COLORS[i] }} />
                        <span className="text-[var(--text-muted)]">{entry.name}</span>
                      </div>
                      <span className="font-bold text-[var(--text-primary)]">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[160px] flex items-center justify-center text-[var(--text-muted)] text-sm">No order data</div>
            )}
          </motion.div>
        </div>
      )}

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
        className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[var(--border)] flex justify-between items-center">
          <div>
            <h3 className="font-bold text-[var(--text-primary)]">Recent Orders</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Latest activity on your account</p>
          </div>
          <Link to="/dashboard/orders" className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1">
            View All <ArrowUpRight size={12} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <OrderEmptyState isSeller={isSeller} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {['Gig', isSeller ? 'Buyer' : 'Seller', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-6 py-3 bg-[var(--bg-primary)]/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {recentOrders.map((order) => (
                  <motion.tr
                    key={order._id}
                    whileHover={{ backgroundColor: 'rgba(99,102,241,0.04)' }}
                    className="transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link to={`/dashboard/orders/${order._id}`} className="text-sm font-medium text-[var(--text-primary)] hover:text-[var(--color-primary)] transition-colors line-clamp-1 max-w-[200px]">
                        {order.gig?.title || 'Unknown Gig'}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {(isSeller ? order.buyer?.name : order.seller?.name)?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm text-[var(--text-secondary)]">
                          {isSeller ? order.buyer?.name : order.seller?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[var(--text-primary)]">{formatPrice(order.price)}</td>
                    <td className="px-6 py-4"><OrderStatusBadge status={order.status} /></td>
                    <td className="px-6 py-4 text-xs text-[var(--text-muted)]">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Gig Performance */}
      {isSeller && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[var(--text-primary)]">Gig Performance</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Views, orders and conversion by gig</p>
            </div>
            <Link to="/dashboard/gigs">
              <Button size="sm" variant="outline">Manage Gigs</Button>
            </Link>
          </div>

          {gigPerformance.length === 0 ? (
            <div className="p-12 flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                <Package size={24} className="text-[var(--color-primary)]" />
              </div>
              <p className="text-[var(--text-muted)] text-sm">You haven't created any gigs yet.</p>
              <Link to="/dashboard/create-gig">
                <Button size="sm"><Plus size={14} /> Create Your First Gig</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {gigPerformance.map((gig, i) => (
                <motion.div
                  key={gig._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-[var(--bg-hover)]/30 transition-colors gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-black shrink-0 text-lg">
                      {gig.title.charAt(0)}
                    </div>
                    <div>
                      <Link to={`/gigs/${gig._id}`} className="text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                        {gig.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1"><Star size={10} className="fill-[var(--color-warning)] text-[var(--color-warning)]" />{gig.rating.toFixed(1)}</span>
                        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1"><Eye size={10} />{gig.viewCount}</span>
                        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1"><ShoppingBag size={10} />{gig.orderCount}</span>
                        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1"><TrendingUp size={10} />{gig.conversionRate}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-black text-[var(--text-primary)]">{formatPrice(gig.price)}</span>
                    <span className={`px-3 py-1 text-xs rounded-full font-bold ${gig.isActive ? 'text-[var(--color-success)] bg-[var(--color-success)]/10' : 'text-[var(--text-muted)] bg-[var(--bg-hover)]'}`}>
                      {gig.isActive ? 'Active' : 'Paused'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
