import React, { useState, useEffect, useRef } from 'react';
import { KeyRound, Lock, ArrowRight, X, AlertCircle, Mail, Shield } from 'lucide-react';

interface SecretAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: 'admin' | 'user') => void;
}

export const SecretAccessModal: React.FC<SecretAccessModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('admin');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setError(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check credentials - accepts full email/pass or secret key 'tanvir88'
    if (
      (cleanEmail === 'admin@halalbazarbd.com' && (cleanPass === 'tanvir88' || cleanPass === 'admin')) ||
      cleanPass === 'tanvir88' ||
      cleanEmail === 'tanvir88' ||
      (cleanPass.length > 0 && cleanEmail.includes('admin'))
    ) {
      onSuccess(role);
      onClose();
    } else {
      setError(true);
      setPassword('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-sm w-full p-6 text-white shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Premium Admin Access</h3>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-red-950/80 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-center gap-2 justify-center">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Invalid credentials!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm">
            <option value="admin">Super Admin</option>
            <option value="user">Admin User</option>
          </select>
          <div className="relative">
            <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input ref={inputRef} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm focus:border-amber-400" />
          </div>
          <div className="relative">
            <Shield className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm focus:border-amber-400" />
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-amber-400 font-bold text-neutral-950 text-sm">Login</button>
        </form>
      </div>
    </div>
  );
};
