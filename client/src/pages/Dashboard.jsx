import { useState, useEffect, useCallback, useContext } from 'react';
import { DollarSign, ShoppingBag, Star, TrendingUp, Package, Clock, Eye, Plus, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';
import { formatPrice } from '../utils/formatDate';
import { getDashboardStats, getEarningsData, getGigPerformance } from '../services/analyticsService';
import { getOrders } from '../services/orderService';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { PageLoader } from '../components/Loader';
import { OrderEmptyState } from '../components/EmptyState';
import { SocketContext } from '../context/SocketContext';

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
      if (withLoader) {
        setLoading(true);
      }

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
      } else {
        setGigPerformance([]);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      if (withLoader) {
        setLoading(false);
      }
    }
  }, [earningsPeriod, user.role]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const handleRealtimeRefresh = () => {
      fetchDashboardData({ withLoader: false });
    };

    socket.on('orderStatusUpdate', handleRealtimeRefresh);
    socket.on('newNotification', handleRealtimeRefresh);

    return () => {
      socket.off('orderStatusUpdate', handleRealtimeRefresh);
      socket.off('newNotification', handleRealtimeRefresh);
    };
  }, [socket, fetchDashboardData]);

  if (loading) return <PageLoader />;

  const topGig = gigPerformance[0];
  const statCards = user.role === 'seller'
    ? [
        { label: 'Total Earnings', value: formatPrice(stats?.totalEarnings || 0), icon: DollarSign, color: 'text-success bg-success/10' },
        { label: 'Active Orders', value: stats?.activeOrders || 0, icon: ShoppingBag, color: 'text-primary bg-primary/10' },
        { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: Clock, color: 'text-warning bg-warning/10' },
        { label: 'Completed Orders', value: stats?.completedOrders || 0, icon: Package, color: 'text-accent bg-accent/10' },
        { label: 'Profile Views', value: stats?.totalViews || 0, icon: Eye, color: 'text-blue-500 bg-blue-500/10' },
        { label: 'Conversion Rate', value: `${stats?.conversionRate || 0}%`, icon: TrendingUp, color: 'text-purple-500 bg-purple-500/10' },
      ]
    : [
        { label: 'Orders Placed', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'text-primary bg-primary/10' },
        { label: 'Active Orders', value: stats?.activeOrders || 0, icon: Clock, color: 'text-warning bg-warning/10' },
        { label: 'Completed Orders', value: stats?.completedOrders || 0, icon: Package, color: 'text-accent bg-accent/10' },
        { label: 'Seller Rating', value: stats?.avgRating || '0.0', icon: Star, color: 'text-warning bg-warning/10' },
      ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Welcome back, {user?.name || 'User'}</h1>
          <p className="text-text-secondary text-sm">Live orders, earnings, and gig performance all in one place.</p>
        </div>
        {user?.role === 'seller' && (
          <Link to="/dashboard/create-gig">
            <Button><Plus size={16} /> New Gig</Button>
          </Link>
        )}
      </div>

      <div className={`grid gap-4 ${user.role === 'seller' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6' : 'grid-cols-2 lg:grid-cols-4'}`}>
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-bg-secondary rounded-xl border border-border p-4 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                <Icon size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            <p className="text-xs text-text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {user.role === 'seller' && (
        <>
          {topGig && (
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-transparent border border-primary/20 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">Top Performer</p>
                <h2 className="text-xl font-bold text-text-primary">{topGig.title}</h2>
                <p className="text-sm text-text-secondary mt-1">
                  {topGig.orderCount} orders, {topGig.viewCount} views, and {topGig.conversionRate}% conversion.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="px-3 py-2 rounded-xl bg-bg-secondary border border-border text-text-primary">{formatPrice(topGig.price)} starting</span>
                <span className="px-3 py-2 rounded-xl bg-bg-secondary border border-border text-text-primary flex items-center gap-2">
                  <BarChart3 size={16} /> {topGig.rating.toFixed(1)} rating
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-bg-secondary rounded-xl border border-border p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h3 className="text-sm font-semibold text-text-primary">Earnings Overview</h3>
                <div className="flex items-center gap-2">
                  {['weekly', 'monthly'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setEarningsPeriod(period)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                        earningsPeriod === period
                          ? 'bg-primary text-white'
                          : 'bg-bg-card text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              {earningsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={earningsData}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="label" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC' }} />
                    <Area type="monotone" dataKey="earnings" stroke="#6366F1" strokeWidth={2} fill="url(#colorEarnings)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-text-muted text-sm">
                  Not enough data to display chart.
                </div>
              )}
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h3 className="text-sm font-semibold text-text-primary">Order Volume</h3>
                <p className="text-xs text-text-muted capitalize">{earningsPeriod} trend</p>
              </div>
              {earningsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="label" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC' }} />
                    <Bar dataKey="orders" fill="#22D3EE" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-text-muted text-sm">
                  Not enough data to display chart.
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="bg-bg-secondary rounded-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="text-sm font-semibold text-text-primary">Recent Orders</h3>
          <Link to="/dashboard/orders" className="text-xs text-primary hover:text-primary-hover transition-colors">
            View All
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <OrderEmptyState isSeller={user.role === 'seller'} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-bg-card/30">
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Gig</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">{user.role === 'seller' ? 'Buyer' : 'Seller'}</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Price</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-border last:border-0 hover:bg-bg-card/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/dashboard/orders/${order._id}`} className="text-sm text-text-primary font-medium hover:text-primary transition-colors">
                        {order.gig?.title || 'Unknown Gig'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-[10px] font-bold">
                        {(user.role === 'seller' ? order.buyer?.name : order.seller?.name)?.charAt(0) || 'U'}
                      </div>
                      {user.role === 'seller' ? order.buyer?.name : order.seller?.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-primary font-semibold">{formatPrice(order.price)}</td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {user?.role === 'seller' && (
        <div className="bg-bg-secondary rounded-xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Gig Performance</h3>
            <Link to="/dashboard/gigs">
              <Button size="sm" variant="outline">Manage Gigs</Button>
            </Link>
          </div>

          {gigPerformance.length === 0 ? (
            <div className="p-8 justify-center flex flex-col items-center">
              <p className="text-text-secondary text-sm mb-4">You have not created any gigs yet.</p>
              <Link to="/dashboard/create-gig">
                <Button size="sm"><Plus size={16} /> Create Your First Gig</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {gigPerformance.map((gig) => (
                <div key={gig._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-bg-card/50 transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shrink-0">
                      {gig.title.charAt(0)}
                    </div>
                    <div>
                      <Link to={`/gigs/${gig._id}`} className="text-sm font-medium text-text-primary hover:text-primary transition-colors line-clamp-1">
                        {gig.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5">
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Star size={10} className="fill-warning text-warning" /> {gig.rating.toFixed(1)} ({gig.reviewCount})
                        </span>
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Eye size={10} /> {gig.viewCount} views
                        </span>
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <ShoppingBag size={10} /> {gig.orderCount} orders
                        </span>
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <TrendingUp size={10} /> {gig.conversionRate}% conversion
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 min-w-[120px]">
                    <span className="text-sm font-bold text-text-primary">{formatPrice(gig.price)}</span>
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${gig.isActive ? 'text-success bg-success/10' : 'text-text-muted bg-bg-card'}`}>
                      {gig.isActive ? 'Active' : 'Paused'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
