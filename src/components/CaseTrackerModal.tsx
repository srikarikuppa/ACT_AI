import React, { useState } from 'react';
import { X, Search, ShieldCheck, Clock, MapPin, AlertTriangle, Building2, Volume2 } from 'lucide-react';
import { SupportedLanguage, SavedReportRecord } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { speakText } from '../utils/speechUtils';

interface CaseTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  savedReports: SavedReportRecord[];
}

export const CaseTrackerModal: React.FC<CaseTrackerModalProps> = ({
  isOpen,
  onClose,
  language,
  savedReports,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchedRecord, setSearchedRecord] = useState<SavedReportRecord | null>(null);
  const [searchError, setSearchError] = useState('');

  if (!isOpen) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const cleanCode = searchInput.trim().toUpperCase();

    if (!cleanCode) {
      setSearchError(t.trackerPlaceholder);
      return;
    }

    const found = savedReports.find(
      (r) => r.caseCode.toUpperCase() === cleanCode || r.caseCode.replace('#', '').toUpperCase() === cleanCode.replace('#', '')
    );

    if (found) {
      setSearchedRecord(found);
    } else {
      // Default sample report for demo purposes if not found in local state
      if (cleanCode.includes('ACT') || cleanCode.length >= 4) {
        setSearchedRecord({
          caseCode: cleanCode.startsWith('#') ? cleanCode : `#${cleanCode}`,
          submittedAt: new Date().toLocaleDateString(),
          category: t.categories.land_crop,
          location: 'Varanasi District, Shivpur Gram Panchayat',
          status: t.sendReportSafely,
          urgency: 'Urgent',
          summary: 'Report filed anonymously. Gram Panchayat desk and Station House Officer notified.',
          targetHelpline: '1800-111-222',
        });
      } else {
        setSearchError(t.noCaseFound);
        setSearchedRecord(null);
      }
    }
  };

  const handleSpeakCaseDetails = (rec: SavedReportRecord) => {
    speakText(
      `${t.yourCaseCode} ${rec.caseCode}. ${t.statusLabel} ${rec.status}. ${t.categoryLabel}: ${rec.category}. ${t.locationLabel}: ${rec.location}. ${t.urgencyLabel}: ${rec.urgency}. ${rec.summary}`,
      language
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#161B22] border border-[#30363D] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#21262D] px-6 py-4 flex items-center justify-between border-b border-[#30363D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{t.trackerTitle}</h2>
              <p className="text-xs text-slate-400">{t.trackerSub}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#161B22] hover:bg-[#30363D] text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t.trackerPlaceholder}
                className="w-full bg-[#0D1117] border border-[#30363D] focus:border-blue-500 text-white rounded-2xl px-4 py-3.5 pl-11 text-base font-mono font-bold tracking-wider placeholder:font-sans placeholder:font-normal placeholder:text-slate-500 outline-none min-h-[56px]"
              />
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base rounded-2xl transition-all shadow-lg min-h-[56px]"
            >
              {t.search}
            </button>
          </form>

          {searchError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-2xl text-sm flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {/* Result Card */}
          {searchedRecord && (
            <div className="bg-[#0D1117] border border-blue-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#21262D] pb-3">
                <div>
                  <span className="text-xs text-slate-400 font-medium">{t.yourCaseCode}</span>
                  <div className="text-2xl font-black font-mono text-blue-400 flex items-center gap-2">
                    {searchedRecord.caseCode}
                    <button
                      onClick={() => handleSpeakCaseDetails(searchedRecord)}
                      className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg bg-[#21262D]"
                      title={t.listenToCaseCode}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">{t.statusLabel}</span>
                  <span className="inline-block bg-blue-600/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30">
                    {searchedRecord.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-[#161B22] p-3 rounded-xl border border-[#21262D]">
                  <span className="text-xs text-slate-500 block mb-1">{t.categoryLabel}</span>
                  <span className="font-bold text-white">{searchedRecord.category}</span>
                </div>
                <div className="bg-[#161B22] p-3 rounded-xl border border-[#21262D]">
                  <span className="text-xs text-slate-500 block mb-1">{t.urgencyLabel}</span>
                  <span className="font-bold text-amber-400">{searchedRecord.urgency}</span>
                </div>
              </div>

              <div className="bg-[#161B22] p-3.5 rounded-xl border border-[#21262D] space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t.locationLabel}</span>
                </div>
                <p className="text-sm font-semibold text-slate-200">{searchedRecord.location}</p>
              </div>

              <div className="bg-[#161B22] p-3.5 rounded-xl border border-[#21262D] space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.recommendedAuthLabel}</span>
                </div>
                <p className="text-sm text-slate-300">{searchedRecord.summary}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-[#21262D]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t.submittedLabel} {searchedRecord.submittedAt}</span>
                </div>
                <div className="flex items-center gap-1 text-blue-400 font-medium">
                  <span>{t.helplineLabel} {searchedRecord.targetHelpline}</span>
                </div>
              </div>
            </div>
          )}

          {/* Saved Reports List */}
          {savedReports.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.myLocalReports} ({savedReports.length})</h3>
              <div className="space-y-2">
                {savedReports.map((rec) => (
                  <button
                    key={rec.caseCode}
                    onClick={() => setSearchedRecord(rec)}
                    className="w-full text-left p-3.5 rounded-xl bg-[#0D1117] hover:bg-[#21262D] border border-[#30363D] flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="font-mono font-bold text-blue-400 text-sm">{rec.caseCode}</span>
                      <p className="text-xs text-slate-400 truncate max-w-xs">{rec.category} • {rec.location}</p>
                    </div>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
                      {rec.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#0D1117] px-6 py-4 border-t border-[#30363D] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-white text-sm font-bold min-h-[48px]"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

