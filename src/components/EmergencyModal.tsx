import React from 'react';
import { X, PhoneCall, Volume2, ShieldAlert } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { EMERGENCY_HELPLINES } from '../data/locationData';
import { speakText } from '../utils/speechUtils';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const getHelplineInfo = (helplineId: string, defaultName: string, defaultDesc: string) => {
    if (t.helplines && t.helplines[helplineId]) {
      return t.helplines[helplineId];
    }
    return { name: defaultName, desc: defaultDesc };
  };

  const handleSpeakHelpline = (helplineId: string, name: string, num: string, desc: string) => {
    const info = getHelplineInfo(helplineId, name, desc);
    speakText(`${info.name}. ${num}. ${info.desc}`, language);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#161B22] border-2 border-red-500/60 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-red-950/60 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide">{t.emergencySos}</h2>
              <p className="text-xs text-red-100 font-medium">{t.emergencyHeaderSub}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-black/30 hover:bg-black/50 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-sm text-slate-300 font-medium leading-relaxed bg-[#21262D] p-3.5 rounded-2xl border border-[#30363D]">
            {t.emergencyBannerText}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {EMERGENCY_HELPLINES.map((helpline) => {
              const info = getHelplineInfo(helpline.id, helpline.name, helpline.description);
              return (
                <div
                  key={helpline.id}
                  className="bg-[#21262D] border border-[#30363D] hover:border-red-500/50 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-lg transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${helpline.badgeColor}`}>
                        {helpline.id}
                      </span>
                      <button
                        onClick={() => handleSpeakHelpline(helpline.id, helpline.name, helpline.number, helpline.description)}
                        className="p-1 text-slate-400 hover:text-emerald-400"
                        title={t.listen}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="text-base font-extrabold text-white">{info.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{info.desc}</p>
                  </div>

                  <a
                    href={`tel:${helpline.number}`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-base rounded-xl shadow-md min-h-[56px] transition-all transform active:scale-95"
                  >
                    <PhoneCall className="w-5 h-5 animate-pulse" />
                    <span>{t.callHelpline} {helpline.number}</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0D1117] px-6 py-4 border-t border-[#30363D] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-slate-200 text-sm font-bold border border-[#30363D] min-h-[48px]"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

