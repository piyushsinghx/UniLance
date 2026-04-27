import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Zap, ArrowRight, Star, Users, TrendingUp } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';
import GradientOrb from '../components/GradientOrb';
import toast from 'react-hot-toast';

const FloatingInput = ({ label, type = 'text', value, onChange, icon: Icon, error, ...rest }) => {
  const [focused, setFocused] = useState(false);
  const isUp = focused || value;

  return (
    <div className="relative">
      <div className={`relative flex items-center bg-[var(--bg-secondary)] border rounded-xl transition-all duration-200 ${
        error ? 'border-[var(--color-error)]' : isUp ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20' : 'border-[var(--border)]'
      }`}>
        {Icon && (
          <Icon size={16} className={`absolute left-4 shrink-0 transition-colors ${isUp ? 'text-[var(--color-primary)]' : 'text-[var(--text-muted)]'}`} />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full bg-transparent pt-5 pb-2 text-sm text-[var(--text-primary)] focus:outline-none ${Icon ? 'pl-10 pr-4' : 'px-4'}`}
          {...rest}
        />
        <label className={`absolute pointer-events-none transition-all duration-200 ${Icon ? 'left-10' : 'left-4'} ${
          isUp ? 'top-1.5 text-[10px] font-semibold text-[var(--color-primary)] uppercase tracking-wider' : 'top-3.5 text-sm text-[var(--text-muted)]'
        }`}>
          {label}
        </label>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-xs text-[var(--color-error)]"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

const FLOATING_STATS = [
  { icon: Users, label: '10K+ Students', color: 'from-blue-500 to-indigo-600' },
  { icon: Star, label: '4.9★ Rating', color: 'from-yellow-500 to-orange-500' },
  { icon: TrendingUp, label: '₹50L+ Earned', color: 'from-emerald-500 to-teal-600' },
];

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid credentials');
      // Shake animation via error state
      setErrors({ general: true });
      setTimeout(() => setErrors({}), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT PANEL — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-secondary)] flex-col items-center justify-center p-12">
        <GradientOrb size={400} color="#22D3EE" top="10%" right="-10%" />
        <GradientOrb size={300} color="#8B5CF6" bottom="10%" left="-5%" delay={4} />

        {/* Logo */}
        <div className="mb-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Zap size={24} className="text-white" />
          </div>
          <span className="text-3xl font-black text-white">UniLance</span>
        </div>

        <h2 className="text-4xl font-extrabold text-white text-center mb-4 leading-tight">
          Welcome back to the<br />Student Economy
        </h2>
        <p className="text-white/70 text-center mb-10 max-w-sm">
          Thousands of students are already building careers and earning real money on UniLance.
        </p>

        {/* Floating stat cards */}
        <div className="w-full max-w-xs space-y-3">
          {FLOATING_STATS.map(({ icon: Icon, label, color }, i) => (
            <motion.div
              key={label}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
              className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                <Icon size={16} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-white">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL — form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 bg-[var(--bg-primary)]">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">UniLance</span>
          </div>

          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">Sign in</h1>
          <p className="text-[var(--text-secondary)] mb-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-[var(--color-primary)] font-semibold hover:underline">
              Get started free
            </Link>
          </p>

          <motion.form
            onSubmit={handleSubmit}
            animate={errors.general ? { x: [-8, 8, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <FloatingInput
              label="Email address"
              type="email"
              value={form.email}
              onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
              icon={Mail}
              error={errors.email}
              autoComplete="email"
            />

            <div className="relative">
              <FloatingInput
                label="Password"
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                icon={Lock}
                error={errors.password}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-[var(--color-primary)] hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Sign In <ArrowRight size={18} />
            </Button>
          </motion.form>

          <div className="mt-6 pt-6 border-t border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-[var(--color-primary)] hover:underline">Terms</Link>
            {' '}&amp;{' '}
            <Link to="/privacy" className="text-[var(--color-primary)] hover:underline">Privacy Policy</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
