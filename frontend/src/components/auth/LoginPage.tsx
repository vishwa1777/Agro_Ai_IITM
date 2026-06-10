import React, { useState, useEffect } from 'react';
import { useUIStore } from '@/store';
import { Leaf, Mail, Lock, AlertCircle, User, TrendingUp } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login } = useUIStore();
  const [selectedRole, setSelectedRole] = useState<'representative' | 'manager'>('representative');
  const [email, setEmail] = useState('amit.sharma@agroai.com');
  const [password, setPassword] = useState('amit123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Auto-fill credentials when switching roles
  useEffect(() => {
    if (selectedRole === 'representative') {
      setEmail('amit.sharma@agroai.com');
      setPassword('amit123');
    } else {
      setEmail('rajesh.kumar@agroai.com');
      setPassword('rajesh123');
    }
    setError('');
  }, [selectedRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (selectedRole === 'representative' && (email !== 'amit.sharma@agroai.com' || password !== 'amit123')) {
      setError('Invalid credentials for Field Representative.');
      return;
    }

    if (selectedRole === 'manager' && (email !== 'rajesh.kumar@agroai.com' || password !== 'rajesh123')) {
      setError('Invalid credentials for District Manager.');
      return;
    }

    // Trigger fake loading sequence
    setLoading(true);
    setLoadingProgress(10);
    
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 15;
      });
    }, 120);

    setTimeout(() => {
      setLoading(false);
      login(selectedRole);
    }, 1000);
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        background: 'radial-gradient(circle at center, #0B2214 0%, #06110B 100%)',
        fontFamily: "'DM Sans', sans-serif"
      }}
    >
      <div 
        className="w-full max-w-md p-8 rounded-2xl relative overflow-hidden transition-all duration-300"
        style={{
          background: 'rgba(11, 23, 16, 0.65)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(85, 216, 64, 0.15)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(85, 216, 64, 0.03)'
        }}
      >
        {/* Background glowing gradients */}
        <div 
          className="absolute -top-32 -right-32 w-64 h-64 rounded-full filter blur-[80px]"
          style={{ background: 'rgba(85, 216, 64, 0.1)' }}
        />
        <div 
          className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full filter blur-[80px]"
          style={{ background: 'rgba(59, 130, 246, 0.05)' }}
        />

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
            style={{
              background: 'linear-gradient(135deg, rgba(85, 216, 64, 0.2) 0%, rgba(45, 106, 79, 0.3) 100%)',
              border: '1px solid rgba(85, 216, 64, 0.25)'
            }}
          >
            <Leaf className="text-[#55D840] size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            AgroAI
          </h1>
          <p className="text-xs text-[#AAB8AA] text-center font-medium">
            Field Intelligence & Operations Platform
          </p>
        </div>

        {/* Role Tabs */}
        <div 
          className="flex p-1 rounded-xl mb-6 relative z-10"
          style={{ background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
        >
          <button
            type="button"
            onClick={() => setSelectedRole('representative')}
            className="flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 border-none outline-none cursor-pointer flex items-center justify-center gap-2"
            style={{
              background: selectedRole === 'representative' ? 'rgba(85, 216, 64, 0.15)' : 'transparent',
              color: selectedRole === 'representative' ? '#55D840' : '#AAB8AA',
              boxShadow: selectedRole === 'representative' ? '0 0 10px rgba(85, 216, 64, 0.1)' : 'none',
              border: 'none',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <User className="size-4" />
            <span>Representative</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('manager')}
            className="flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 border-none outline-none cursor-pointer flex items-center justify-center gap-2"
            style={{
              background: selectedRole === 'manager' ? 'rgba(85, 216, 64, 0.15)' : 'transparent',
              color: selectedRole === 'manager' ? '#55D840' : '#AAB8AA',
              boxShadow: selectedRole === 'manager' ? '0 0 10px rgba(85, 216, 64, 0.1)' : 'none',
              border: 'none',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <TrendingUp className="size-4" />
            <span>District Manager</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {error && (
            <div 
              className="flex items-center gap-2.5 p-3 rounded-lg border border-red-500/20 text-red-400 text-xs font-medium"
              style={{ background: 'rgba(239, 68, 68, 0.08)' }}
            >
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#AAB8AA] mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-[#64748B] size-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#0F1D14] border border-[rgba(120,255,120,0.15)] focus:border-[#55D840] text-sm text-white rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all placeholder:text-[#475569]"
                style={{
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-[#AAB8AA] uppercase tracking-wider">
                Password
              </label>
              <span className="text-[10px] text-[#55D840] font-semibold hover:underline cursor-pointer">
                Forgot?
              </span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-[#64748B] size-4" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0F1D14] border border-[rgba(120,255,120,0.15)] focus:border-[#55D840] text-sm text-white rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all placeholder:text-[#475569]"
                style={{
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #55D840 0%, #2D6A4F 100%)',
              color: '#07110B',
              boxShadow: '0 4px 15px rgba(85, 216, 64, 0.2)',
              border: 'none',
              opacity: loading ? 0.8 : 1
            }}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center w-full">
                <span className="text-xs font-bold animate-pulse text-[#07110B] mb-0.5">Authenticating...</span>
                <div className="w-full h-1 bg-[#2D6A4F]/30 rounded-full overflow-hidden absolute bottom-0 left-0">
                  <div 
                    className="h-full bg-[#55D840] transition-all duration-150"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              'Log In to Dashboard'
            )}
          </button>
        </form>

        {/* Info Footer */}
        <div className="mt-6 text-center text-[10px] text-[#475569] relative z-10">
          AgroAI Security Suite • Demo Access Enabled
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
