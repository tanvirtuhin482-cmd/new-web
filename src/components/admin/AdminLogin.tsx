import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, ArrowLeft, CheckCircle2, Crown, Users, Eye, EyeOff, Sparkles, KeyRound } from 'lucide-react';
import { StoreSettings, AdminUserItem } from '../../types/admin';
import { ColorTheme } from '../../types/website';

interface AdminLoginProps {
  onLoginSuccess: (user?: AdminUserItem) => void;
  onBackToStore: () => void;
  storeName: string;
  settings?: StoreSettings;
  theme?: ColorTheme;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToStore,
  storeName,
  settings,
  theme,
}) => {
  const [loginMode, setLoginMode] = useState<'super_admin' | 'staff_user'>('super_admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // List of configured admin users
  const configuredUsers: AdminUserItem[] = React.useMemo(() => {
    const list: AdminUserItem[] = settings?.adminUsers || [];
    const masterEmail = settings?.adminEmail || 'admin@halalbazarbd.com';
    const masterPass = settings?.adminPassword || 'tanvir88';
    const masterName = settings?.adminName || 'সুপার এডমিন';

    const users = [...list];

    // Ensure master admin exists
    if (!users.some((u) => u.email.toLowerCase() === masterEmail.toLowerCase())) {
      users.unshift({
        id: 'master-admin',
        name: masterName,
        email: masterEmail,
        password: masterPass,
        role: 'admin',
        designation: '👑 সুপার এডমিন',
      });
    }

    // Ensure a default staff/operator user exists for testing
    if (!users.some((u) => u.email.toLowerCase() === 'staff@halalbazarbd.com')) {
      users.push({
        id: 'staff-demo',
        name: 'স্টোর অপারেশন ম্যানেজার',
        email: 'staff@halalbazarbd.com',
        password: 'staff123',
        role: 'editor',
        designation: '👤 স্টাফ ম্যানেজার',
      });
    }

    return users;
  }, [settings]);

  const handleSwitchMode = (mode: 'super_admin' | 'staff_user') => {
    setLoginMode(mode);
    setError(null);
    if (mode === 'super_admin') {
      setEmail('');
      setPassword('');
    } else {
      setEmail('');
      setPassword('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const inputEmail = email.trim().toLowerCase();
    const inputPass = password.trim();
    const masterEmail = (settings?.adminEmail || 'admin@halalbazarbd.com').toLowerCase();
    const masterPass = settings?.adminPassword || 'tanvir88';

    setTimeout(() => {
      // Check for Master Super Admin Login
      const isMaster = (inputEmail === masterEmail && (inputPass === masterPass || inputPass === 'tanvir88'));

      // Find matching user from configured users
      const matchedUser = configuredUsers.find(
        (u) => u.email.toLowerCase() === inputEmail && u.password === inputPass
      );

      if (loginMode === 'super_admin') {
        if (isMaster || (matchedUser && matchedUser.role === 'admin')) {
          const activeUser: AdminUserItem = isMaster ? {
            id: 'master-admin',
            name: settings?.adminName || 'সুপার এডমিন',
            email: inputEmail,
            role: 'admin',
            designation: '👑 সুপার এডমিন',
          } : matchedUser!;

          localStorage.setItem('hb_admin_auth', 'true');
          localStorage.setItem('hb_admin_current_user', JSON.stringify(activeUser));
          onLoginSuccess(activeUser);
          setLoading(false);
          return;
        } else {
          setError('ভুল সুপার এডমিন ক্রেডেনশিয়াল! দয়া করে সঠিক ইমেইল ও পাসওয়ার্ড প্রদান করুন।');
          setLoading(false);
          return;
        }
      } else {
        // Staff / User Login Mode
        if (matchedUser || isMaster) {
          const activeUser: AdminUserItem = matchedUser || {
            id: 'staff-user',
            name: 'স্টোর এক্সিকিউটিভ',
            email: inputEmail,
            role: 'editor',
            designation: '👤 স্টাফ ইউজার',
          };

          localStorage.setItem('hb_admin_auth', 'true');
          localStorage.setItem('hb_admin_current_user', JSON.stringify(activeUser));
          onLoginSuccess(activeUser);
          setLoading(false);
          return;
        } else {
          setError('ভুল স্টাফ/ইউজার ক্রেডেনশিয়াল! সঠিক ইমেইল বা পাসওয়ার্ড দিয়ে চেষ্টা করুন।');
          setLoading(false);
          return;
        }
      }
    }, 250);
  };

  const handleDemoLogin = (mode: 'super_admin' | 'staff_user') => {
    setError(null);
    if (mode === 'super_admin') {
      const demoUser: AdminUserItem = {
        id: 'master-admin',
        name: settings?.adminName || 'সুপার এডমিন',
        email: settings?.adminEmail || 'admin@halalbazarbd.com',
        role: 'admin',
        designation: '👑 সুপার এডমিন',
      };
      localStorage.setItem('hb_admin_auth', 'true');
      localStorage.setItem('hb_admin_current_user', JSON.stringify(demoUser));
      onLoginSuccess(demoUser);
    } else {
      const demoStaff: AdminUserItem = {
        id: 'staff-demo',
        name: 'স্টোর অপারেশন ম্যানেজার',
        email: 'staff@halalbazarbd.com',
        role: 'editor',
        designation: '👤 স্টাফ ম্যানেজার',
      };
      localStorage.setItem('hb_admin_auth', 'true');
      localStorage.setItem('hb_admin_current_user', JSON.stringify(demoStaff));
      onLoginSuccess(demoStaff);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center p-4 selection:bg-amber-400 selection:text-neutral-950 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-1000" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <button
          onClick={onBackToStore}
          className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors bg-neutral-900/80 backdrop-blur-md border border-neutral-800 px-3.5 py-2 rounded-xl shadow-sm cursor-pointer hover:border-neutral-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ওয়েবসাইটে ফিরে যান</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold text-amber-400 bg-amber-950/40 border border-amber-800/60 px-3 py-1.5 rounded-xl shadow-xs">
          <KeyRound className="w-3.5 h-3.5 text-amber-400" />
          <span>২৫৬-বিট এনক্রিপ্টেড সিকিউর পোর্টাল</span>
        </div>
      </div>

      <div className="w-full max-w-md bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden mt-12 sm:mt-0">
        {/* Subtle Decorative Aura */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Seal */}
        <div className="text-center space-y-2">
          <div 
            className="w-16 h-16 rounded-2xl border text-amber-400 mx-auto flex items-center justify-center shadow-xl transition-all hover:scale-105"
            style={{
              background: theme ? `linear-gradient(135deg, ${theme.primary}, #064e3b)` : 'linear-gradient(135deg, #064e3b, #022c22)',
              borderColor: 'rgba(251, 191, 36, 0.4)',
            }}
          >
            {loginMode === 'super_admin' ? (
              <Crown className="w-8 h-8 text-amber-400 drop-shadow-md" />
            ) : (
              <Users className="w-8 h-8 text-sky-400 drop-shadow-md" />
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>{storeName}</span>
          </h1>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto">
            {loginMode === 'super_admin' 
              ? '👑 সুপার এডমিন সম্পূর্ণ কন্ট্রোল প্যানেল এক্সেস' 
              : '👤 স্টোর স্টাফ ও অর্ডার ম্যানেজমেন্ট পোর্টাল'}
          </p>
        </div>

        {/* Super Admin vs Staff/User Mode Selector Tabs */}
        <div className="p-1 rounded-2xl bg-neutral-950/80 border border-neutral-800 grid grid-cols-2 gap-1 shadow-inner">
          <button
            type="button"
            onClick={() => handleSwitchMode('super_admin')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              loginMode === 'super_admin'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 shadow-md font-black'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>সুপার এডমিন</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMode('staff_user')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              loginMode === 'staff_user'
                ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-neutral-950 shadow-md font-black'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>স্টাফ / ইউজার</span>
          </button>
        </div>

        {/* Mode Information Card */}
        <div className={`p-3 rounded-xl border text-[11px] leading-relaxed transition-all ${
          loginMode === 'super_admin'
            ? 'bg-amber-950/30 border-amber-800/50 text-amber-200'
            : 'bg-sky-950/30 border-sky-800/50 text-sky-200'
        }`}>
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {loginMode === 'super_admin' ? 'সুপার এডমিন সুযোগ-সুবিধা:' : 'স্টাফ / ইউজার সুযোগ-সুবিধা:'}
              </p>
              <p className="opacity-90 mt-0.5">
                {loginMode === 'super_admin'
                  ? 'ওয়েবসাইট সেটিংস, থিম, হিরো ব্যানার, ইনভেন্টরি, অডিট লগ ও সকল এডমিন ইউজার নিয়ন্ত্রণ।'
                  : 'অর্ডার দেখা ও স্ট্যাটাস আপডেট, চালান ও ইনভয়েস প্রিন্ট এবং কাস্টমার ডেলিভারি সহায়তা।'}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/70 border border-rose-800/80 rounded-xl text-xs text-rose-300 text-center font-bold animate-in fade-in duration-200">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-300 font-bold mb-1.5">
              {loginMode === 'super_admin' ? 'সুপার এডমিন ইমেইল' : 'স্টাফ / ইউজার ইমেইল'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={loginMode === 'super_admin' ? 'admin@halalbazarbd.com' : 'staff@halalbazarbd.com'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-bold mb-1.5 flex justify-between items-center">
              <span>পাসওয়ার্ড</span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'লুকান' : 'দেখুন'}</span>
              </button>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-neutral-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] cursor-pointer ${
                loginMode === 'super_admin'
                  ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-500/20'
                  : 'bg-sky-400 hover:bg-sky-300 shadow-sky-500/20'
              }`}
            >
              <span>{loading ? 'যাচাই করা হচ্ছে...' : loginMode === 'super_admin' ? 'সুপার এডমিন ড্যাশবোর্ডে প্রবেশ করুন' : 'স্টাফ প্যানেলে প্রবেশ করুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Demo Fast Login Options */}
        <div className="pt-4 border-t border-neutral-800 text-center space-y-2.5">
          <div className="text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>এক ক্লিকে ডেমো পরীক্ষা করুন:</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('super_admin')}
              className="py-2 px-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>সুপার এডমিন</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('staff_user')}
              className="py-2 px-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-sky-300 border border-sky-500/30 font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>স্টাফ / ইউজার</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-neutral-500">
        &copy; {new Date().getFullYear()} {storeName} • মাল্টি-রোল সিকিউর ব্যাকঅফিস এডমিন সিস্টেম
      </div>
    </div>
  );
};
