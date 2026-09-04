import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, ShieldCheck, MapPin, Clock, AlertTriangle, BarChart2 } from 'lucide-react';
import { SavedReportRecord, TrackingStatus } from '../types';
import { AuthorityAnalytics } from './AuthorityAnalytics';

interface PoliceDashboardProps {
  onBack: () => void;
}

export const PoliceDashboard: React.FC<PoliceDashboardProps> = ({ onBack }) => {
  const [reports, setReports] = useState<SavedReportRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatCaseCode, setActiveChatCaseCode] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'reports' | 'analytics'>('reports');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    try {
      const stored = localStorage.getItem('act_ai_saved_reports');
      if (stored) {
        setReports(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('LocalStorage error loading reports:', e);
    }
  };

  const handleUpdateStatus = (caseCode: string, newStatus: TrackingStatus) => {
    const updatedReports = reports.map(report => {
      if (report.caseCode === caseCode) {
        return { 
          ...report, 
          status: newStatus,
          updatedAt: new Date().toLocaleString()
        };
      }
      return report;
    });

    setReports(updatedReports);
    try {
      localStorage.setItem('act_ai_saved_reports', JSON.stringify(updatedReports));
    } catch (e) {
      console.error('Failed to save updated reports', e);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    const u = (urgency || '').toLowerCase();
    if (u.includes('red') || u.includes('high') || u.includes('8') || u.includes('9') || u.includes('10')) return 'text-red-400 bg-red-400/10 border-red-400/30';
    if (u.includes('yellow') || u.includes('medium') || u.includes('5') || u.includes('6') || u.includes('7') || u.includes('orange') || u.includes('urgent')) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    if (u.includes('green') || u.includes('low') || u.includes('1') || u.includes('2') || u.includes('3') || u.includes('4')) return 'text-green-400 bg-green-400/10 border-green-400/30';
    return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
  };

  const getStatusColor = (status: TrackingStatus) => {
    switch (status) {
      case 'Submitted': return 'text-slate-300 bg-slate-500/20 border-slate-500/30';
      case 'Under Review': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'Action Taken': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
      case 'Resolved': return 'text-green-400 bg-green-400/10 border-green-400/30';
      default: return 'text-slate-300 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getUrgencyValue = (urgency: string) => {
    const u = (urgency || '').toLowerCase();
    if (u.includes('red') || u.includes('high') || u.includes('8') || u.includes('9') || u.includes('10')) return 3;
    if (u.includes('orange') || u.includes('urgent') || u.includes('6') || u.includes('7')) return 2;
    return 1;
  };

  const filteredReports = reports.filter(r => 
    r.caseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.location.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => getUrgencyValue(b.urgency) - getUrgencyValue(a.urgency));

  const handleSendChat = (e: React.FormEvent, caseCode: string) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const updatedReports = reports.map(report => {
      if (report.caseCode === caseCode) {
        return {
          ...report,
          messages: [
            ...(report.messages || []),
            { sender: 'police' as const, text: chatMessage.trim(), timestamp: new Date().toLocaleString() }
          ]
        };
      }
      return report;
    });

    setReports(updatedReports);
    try {
      localStorage.setItem('act_ai_saved_reports', JSON.stringify(updatedReports));
    } catch (e) {
      console.error('Failed to save chat', e);
    }
    setChatMessage('');
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#161B22] border-b border-[#30363D] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </button>
            <div className="flex items-center gap-3 border-l border-[#30363D] pl-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Authority Dashboard</h1>
                <p className="text-xs text-orange-400/80 font-medium tracking-wide uppercase">Secure Police Network</p>
              </div>
            </div>
          </div>
          
          <div className="relative hidden md:block w-96">
            <input 
              type="text" 
              placeholder="Search by Case Code, Location, or Category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#30363D] focus:border-orange-500/50 rounded-full px-4 py-2.5 pl-11 text-sm outline-none transition-colors"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 mt-4 flex gap-6 border-b border-[#30363D]">
          <button 
            onClick={() => setActiveTab('reports')} 
            className={`pb-3 px-2 font-semibold text-sm flex items-center gap-2 transition-colors ${activeTab === 'reports' ? 'text-orange-400 border-b-2 border-orange-500' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <ShieldCheck className="w-4 h-4" /> Live Incident Reports
          </button>
          <button 
            onClick={() => setActiveTab('analytics')} 
            className={`pb-3 px-2 font-semibold text-sm flex items-center gap-2 transition-colors ${activeTab === 'analytics' ? 'text-orange-400 border-b-2 border-orange-500' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <BarChart2 className="w-4 h-4" /> Crime Analytics (CSV)
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {activeTab === 'analytics' ? (
          <AuthorityAnalytics />
        ) : (
          <>
            <div className="md:hidden relative mb-6">
              <input 
                type="text" 
                placeholder="Search cases..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161B22] border border-[#30363D] focus:border-orange-500/50 rounded-xl px-4 py-3 pl-11 text-sm outline-none"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
            <ShieldCheck className="w-16 h-16 text-slate-700" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-300">No cases found</h3>
              <p className="text-slate-500">When citizens submit reports, they will appear here.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredReports.map((report) => (
              <div key={report.caseCode} className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 shadow-xl hover:border-[#30363D]/80 transition-colors flex flex-col h-full">
                {/* Case Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="font-mono text-xl font-bold text-white">{report.caseCode}</span>
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <span className="text-slate-500"><Clock className="w-3.5 h-3.5 inline mr-1" />{report.submittedAt}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getUrgencyColor(report.urgency)} flex items-center gap-1.5`}>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {report.urgency.split(' - ')[0]}
                  </div>
                </div>

                {/* Case Details */}
                <div className="flex-1 space-y-3 mb-6">
                  <div className="flex items-start gap-3 bg-[#0D1117] p-3 rounded-xl border border-[#21262D]">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 font-medium block">Category</span>
                      <span className="text-sm font-bold text-slate-200">{report.category}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-[#0D1117] p-3 rounded-xl border border-[#21262D]">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 font-medium block">Location</span>
                      <span className="text-sm font-bold text-slate-200">{report.location}</span>
                    </div>
                  </div>

                  <div className="bg-[#0D1117] p-3.5 rounded-xl border border-[#21262D]">
                    <span className="text-xs text-slate-500 font-medium block mb-1">AI Generated Summary</span>
                    <p className="text-sm text-slate-300 leading-relaxed">{report.summary}</p>
                  </div>
                </div>

                {/* Status Update & Chat Actions */}
                <div className="border-t border-[#30363D] pt-4 mt-auto space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setActiveChatCaseCode(activeChatCaseCode === report.caseCode ? null : report.caseCode)}
                      className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {activeChatCaseCode === report.caseCode ? 'Close Chat' : 'Chat with Informant'}
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400 font-medium hidden sm:inline">Status:</span>
                      <select
                        value={report.status}
                        onChange={(e) => handleUpdateStatus(report.caseCode, e.target.value as TrackingStatus)}
                        className={`appearance-none outline-none text-sm font-bold px-3 py-1.5 pr-8 rounded-lg border cursor-pointer transition-colors ${getStatusColor(report.status)}`}
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.2em' }}
                      >
                        <option value="Submitted" className="bg-[#161B22] text-slate-300">Submitted</option>
                        <option value="Under Review" className="bg-[#161B22] text-yellow-400">Under Review</option>
                        <option value="Action Taken" className="bg-[#161B22] text-orange-400">Action Taken</option>
                        <option value="Resolved" className="bg-[#161B22] text-green-400">Resolved</option>
                      </select>
                    </div>
                  </div>

                  {activeChatCaseCode === report.caseCode && (
                    <div className="bg-[#0D1117] border border-[#21262D] rounded-xl p-3 animate-fade-in">
                      <div className="h-40 overflow-y-auto mb-3 space-y-2 pr-1">
                        {(!report.messages || report.messages.length === 0) ? (
                          <p className="text-xs text-slate-500 text-center italic mt-12">No messages. You can reach out to the informant here.</p>
                        ) : (
                          report.messages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.sender === 'police' ? 'items-end' : 'items-start'}`}>
                              <div className={`max-w-[85%] rounded-xl px-3 py-1.5 text-sm ${msg.sender === 'police' ? 'bg-orange-600/20 text-orange-400 border border-orange-500/30 rounded-br-sm' : 'bg-[#21262D] text-slate-300 border border-[#30363D] rounded-bl-sm'}`}>
                                {msg.text}
                              </div>
                              <span className="text-[9px] text-slate-500 mt-0.5">{msg.timestamp}</span>
                            </div>
                          ))
                        )}
                      </div>
                      <form onSubmit={(e) => handleSendChat(e, report.caseCode)} className="flex gap-2">
                        <input
                          type="text"
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          placeholder="Reply to informant..."
                          className="flex-1 bg-[#161B22] border border-[#30363D] focus:border-orange-500/50 text-white rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={!chatMessage.trim()}
                          className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white px-3 py-2 rounded-lg font-bold text-sm transition-colors"
                        >
                          Send
                        </button>
                      </form>
                    </div>
                  )}

                  {report.updatedAt && (
                    <p className="text-[10px] text-slate-500 text-right mt-1.5">Last updated: {report.updatedAt}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        </>
        )}
      </main>
    </div>
  );
};
