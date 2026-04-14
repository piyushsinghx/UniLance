import { useState } from 'react';
import { DollarSign, ShoppingBag, Star, TrendingUp, Package, Clock, Eye, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';
import { formatPrice } from '../utils/formatDate';

const earningsData = [
  { month: 'Jan', earnings: 320 }, { month: 'Feb', earnings: 450 }, { month: 'Mar', earnings: 280 },
  { month: 'Apr', earnings: 620 }, { month: 'May', earnings: 890 }, { month: 'Jun', earnings: 750 },
  { month: 'Jul', earnings: 1100 }, { month: 'Aug', earnings: 980 }, { month: 'Sep', earnings: 1250 },
  { month: 'Oct', earnings: 1400 }, { month: 'Nov', earnings: 1180 }, { month: 'Dec', earnings: 1600 },
];

const ordersData = [
  { month: 'Jan', orders: 5 }, { month: 'Feb', orders: 8 }, { month: 'Mar', orders: 4 },
  { month: 'Apr', orders: 12 }, { month: 'May', orders: 15 }, { month: 'Jun', orders: 11 },
  { month: 'Jul', orders: 18 }, { month: 'Aug', orders: 14 }, { month: 'Sep', orders: 20 },
  { month: 'Oct', orders: 22 }, { month: 'Nov', orders: 19 }, { month: 'Dec', orders: 25 },
];

const MOCK_ORDERS = [
  { _id: 'o1', gig: { title: 'React Website Development' }, buyer: { name: 'John Doe' }, price: 120, status: 'active', createdAt: '2024-11-01T10:30:00' },
  { _id: 'o2', gig: { title: 'Logo Design Package' }, buyer: { name: 'Emily Carter' }, price: 60, status: 'completed', createdAt: '2024-10-28T14:15:00' },
  { _id: 'o3', gig: { title: 'Blog Article Writing' }, buyer: { name: 'Michael Brown' }, price: 25, status: 'pending', createdAt: '2024-11-02T09:00:00' },
  { _id: 'o4', gig: { title: 'Video Editing Project' }, buyer: { name: 'Sarah Kim' }, price: 150, status: 'active', createdAt: '2024-10-30T16:45:00' },
  { _id: 'o5', gig: { title: 'WordPress Customization' }, buyer: { name: 'David Park' }, price: 80, status: 'completed', createdAt: '2024-10-25T11:20:00' },
];

const MOCK_GIGS = [
  { _id: 'g1', title: 'Modern React Website with Tailwind CSS', pricing: { basic: { price: 50 } }, rating: 4.9, reviewCount: 127, orderCount: 234, isActive: true },
  { _id: 'g2', title: 'Professional Logo & Brand Identity', pricing: { basic: { price: 35 } }, rating: 4.8, reviewCount: 89, orderCount: 156, isActive: true },
  { _id: 'g3', title: 'Full-Stack Node.js API Development', pricing: { basic: { price: 80 } }, rating: 4.7, reviewCount: 62, orderCount: 98, isActive: false },
];

const statusColors = { pending: 'text-warning bg-warning/10', active: 'text-accent bg-accent/10', completed: 'text-success bg-success/10', cancelled: 'text-error bg-error/10' };

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Earnings', value: formatPrice(12850), change: '+18.2%', icon: DollarSign, color: 'text-success bg-success/10' },
    { label: 'Active Orders', value: '8', change: '+3', icon: ShoppingBag, color: 'text-primary bg-primary/10' },
    { label: 'Avg. Rating', value: '4.9', change: '+0.1', icon: Star, color: 'text-warning bg-warning/10' },
    { label: 'Profile Views', value: '2,340', change: '+12.5%', icon: Eye, color: 'text-accent bg-accent/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Welcome back, {user?.name || 'User'} 👋</h1>
          <p className="text-text-secondary text-sm">Here's what's happening with your gigs today</p>
        </div>
        {user?.role === 'seller' && (
          <Link to="/dashboard/create-gig">
            <Button><Plus size={16} /> New Gig</Button>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="bg-bg-secondary rounded-xl border border-border p-5 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                <Icon size={20} />
              </div>
              <span className="text-xs font-medium text-success flex items-center gap-1">
                <TrendingUp size={12} /> {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            <p className="text-xs text-text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-secondary rounded-xl border border-border p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Earnings Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={earningsData}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC' }} />
              <Area type="monotone" dataKey="earnings" stroke="#6366F1" strokeWidth={2} fill="url(#colorEarnings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-bg-secondary rounded-xl border border-border p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Orders per Month</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC' }} />
              <Bar dataKey="orders" fill="#22D3EE" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-bg-secondary rounded-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-sm font-semibold text-text-primary">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">Gig</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">Client</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">Price</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.map((order) => (
                <tr key={order._id} className="border-b border-border last:border-0 hover:bg-bg-card/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-text-primary font-medium">{order.gig.title}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{order.buyer.name}</td>
                  <td className="px-6 py-4 text-sm text-text-primary font-semibold">{formatPrice(order.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* My Gigs */}
      {user?.role === 'seller' && (
        <div className="bg-bg-secondary rounded-xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">My Gigs</h3>
            <Link to="/dashboard/create-gig">
              <Button size="sm" variant="outline"><Plus size={14} /> Add Gig</Button>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {MOCK_GIGS.map((gig) => (
              <div key={gig._id} className="flex items-center justify-between p-5 hover:bg-bg-card/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                    {gig.title.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{gig.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-text-muted flex items-center gap-1"><Star size={10} className="fill-warning text-warning" /> {gig.rating}</span>
                      <span className="text-xs text-text-muted">{gig.orderCount} orders</span>
                      <span className="text-xs text-text-muted">From {formatPrice(gig.pricing.basic.price)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${gig.isActive ? 'text-success bg-success/10' : 'text-text-muted bg-bg-card'}`}>
                    {gig.isActive ? 'Active' : 'Paused'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
