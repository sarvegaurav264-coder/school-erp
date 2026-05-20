import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineAcademicCap, HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error('Please fill in all fields');
    }
    setLoading(true);
    try {
      await login(formData);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-950">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-violet-600 to-primary-800" />
        <div className="absolute inset-0 bg-grid opacity-20" />

        {/* Floating shapes */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 border border-white/10 rounded-2xl rotate-12 animate-pulse-slow" />
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 border border-white/10 rounded-xl -rotate-12 animate-pulse-slow" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-8 shadow-2xl ring-1 ring-white/20">
            <HiOutlineAcademicCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">School ERP</h1>
          <p className="text-xl text-white/70 mb-8 max-w-md">Enterprise-grade School Management System</p>

          <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
            {[
              { label: 'Students', value: '2,500+' },
              { label: 'Teachers', value: '150+' },
              { label: 'Classes', value: '50+' },
              { label: 'Modules', value: '12+' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shadow-2xl shadow-primary-500/30">
              <HiOutlineAcademicCap className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-dark-50 mb-2">Welcome back</h2>
            <p className="text-dark-400">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-text">Email Address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  id="login-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@school.com"
                  className="input-field pl-12"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="label-text">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field pl-12 pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                >
                  {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-dark-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Create account
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 p-4 glass-card rounded-xl border border-primary-500/10">
            <p className="text-xs text-dark-500 mb-2 font-medium">Demo Credentials</p>
            <p className="text-xs text-dark-400">Email: <span className="text-primary-400 font-mono">admin@school.com</span></p>
            <p className="text-xs text-dark-400">Password: <span className="text-primary-400 font-mono">admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
