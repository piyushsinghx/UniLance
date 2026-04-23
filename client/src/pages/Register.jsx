import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, GraduationCap, Info } from 'lucide-react';
import { registerUser } from '../services/authService';
import { uploadImage } from '../services/uploadService';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';
import FileUpload from '../components/FileUpload';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    university: '',
  });
  const [collegeIdFile, setCollegeIdFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const isCollegeEmail =
    formData.email.endsWith('.edu') ||
    formData.email.endsWith('.ac.in') ||
    formData.email.includes('.ac.');
  const needsManualVerification = Boolean(formData.email) && !isCollegeEmail;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (needsManualVerification && !collegeIdFile) {
      setError('Upload a college ID if you are not using an academic email.');
      return;
    }

    setLoading(true);
    try {
      let collegeIdImageUrl = '';
      if (collegeIdFile) {
        const fileData = new FormData();
        fileData.append('image', collegeIdFile);
        const uploadRes = await uploadImage(fileData);
        collegeIdImageUrl = uploadRes.data.url;
      }

      const { data } = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        university: formData.university,
        collegeIdImage: collegeIdImageUrl,
      });

      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-bg-primary">
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white text-xl">U</div>
            <span className="text-2xl font-bold text-text-primary">Uni<span className="text-primary">Lance</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Create your account</h1>
          <p className="text-text-secondary text-sm">Join the student freelance revolution</p>
        </div>

        <div className="bg-bg-secondary rounded-2xl border border-border p-8">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {['buyer', 'seller'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all ${
                      formData.role === role
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-bg-primary border-border text-text-secondary hover:border-border-light'
                    }`}
                  >
                    {role === 'buyer' ? 'Hire Talent' : 'Sell Services'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-bg-primary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">College Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@university.edu"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-bg-primary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
              </div>
              {formData.email && (
                <div className={`flex items-center gap-1.5 mt-2 text-xs ${isCollegeEmail ? 'text-success' : 'text-warning'}`}>
                  <Info size={12} />
                  {isCollegeEmail
                    ? 'College email detected - your account will be auto-verified.'
                    : 'Manual review required - upload your college ID to continue.'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">University</label>
              <div className="relative">
                <GraduationCap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  placeholder="MIT, Stanford, etc."
                  className="w-full pl-11 pr-4 py-3 bg-bg-primary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
              </div>
            </div>

            {needsManualVerification && (
              <div className="bg-bg-primary border border-border rounded-xl p-4 mt-2">
                <label className="block text-sm font-medium text-text-primary mb-2">College ID Verification</label>
                <p className="text-xs text-text-secondary mb-3">
                  UniLance is a student-only network. Upload your college ID when you are not signing up with an academic email.
                </p>
                <FileUpload
                  accept="*"
                  maxSizeMB={5}
                  onUploadSelect={(files) => setCollegeIdFile(files[0])}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  required
                  className="w-full pl-11 pr-12 py-3 bg-bg-primary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repeat your password"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-bg-primary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-hover font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
