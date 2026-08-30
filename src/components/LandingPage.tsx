import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Lock, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onSelectPortal: (portal: 'citizen' | 'police') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectPortal }) => {
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePoliceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === 'admin123') {
      onSelectPortal('police');
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center p-6 selection:bg-blue-600 selection:text-white animate-fade-in relative overflow-hidden">

      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl w-full z-10 flex flex-col items-center text-center space-y-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#161B22] border border-[#30363D] mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-slate-300 uppercase">ACT.ai Network</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
            Rural Safety <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Ecosystem</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Select your portal to continue. Secure, anonymous reporting for citizens, and efficient case management for authorities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* Citizen Card */}
          <button
            onClick={() => onSelectPortal('citizen')}
            className="group relative flex flex-col items-center p-10 bg-[#161B22] border border-[#30363D] hover:border-blue-500/50 hover:bg-[#1C2128] rounded-3xl transition-all duration-300 shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] text-left w-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="w-20 h-20 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-blue-500/20">
              <ShieldAlert className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-white mb-3 text-center">Citizen Portal</h2>
            <p className="text-slate-400 text-center font-medium leading-relaxed">
              Report an incident anonymously, submit evidence, and track your case status without fear.
            </p>
          </button>

          {/* Police Card */}
          <button
            onClick={() => setShowPinModal(true)}
            className="group relative flex flex-col items-center p-10 bg-[#161B22] border border-[#30363D] hover:border-orange-500/50 hover:bg-[#1C2128] rounded-3xl transition-all duration-300 shadow-2xl hover:shadow-[0_0_40px_rgba(249,115,22,0.1)] text-left w-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="w-20 h-20 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-orange-500/20">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-white mb-3 text-center">Authority Dashboard</h2>
            <p className="text-slate-400 text-center font-medium leading-relaxed">
              Secure police portal to review submitted incidents, dispatch help, and update case tracking statuses.
            </p>
          </button>
        </div>
      </div>

      {/* Police PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#161B22] border border-[#30363D] rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-8 relative">
            <button
              onClick={() => { setShowPinModal(false); setError(false); setPin(''); }}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              ✕
            </button>
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-6 mx-auto border border-orange-500/20">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white text-center mb-2">Restricted Access</h3>
            <p className="text-slate-400 text-center text-sm mb-6">Please enter the authority PIN to access the police dashboard.</p>

            <form onSubmit={handlePoliceSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setError(false); }}
                  placeholder="Enter PIN"
                  autoFocus
                  className={`w-full bg-[#0D1117] border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-[#30363D] focus:border-orange-500'} text-white rounded-xl px-4 py-3 text-center tracking-widest font-mono text-lg outline-none transition-colors`}
                />
                {error && <p className="text-red-400 text-xs text-center mt-2 font-bold animate-pulse">Incorrect PIN. Please try again.</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Access Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
