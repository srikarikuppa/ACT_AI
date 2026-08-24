import React, { useState } from 'react';
import { Shield, Volume2, VolumeX, PhoneCall, ChevronDown, Check, Info } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { LANGUAGES, TRANSLATIONS } from '../utils/translations';
import { speakText, stopSpeech } from '../utils/speechUtils';

interface HeaderProps {
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onOpenEmergencyModal: () => void;
  onOpenTrackerModal: () => void;
  currentStep: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onSelectLanguage,
  onOpenEmergencyModal,
  onOpenTrackerModal,
  currentStep,
}) => {
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isSpeakingPage, setIsSpeakingPage] = useState(false);
  const [showPrototypeNotice, setShowPrototypeNotice] = useState(true);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const selectedLangObj = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  const handleToggleSpeakPage = () => {
    if (isSpeakingPage) {
      stopSpeech();
      setIsSpeakingPage(false);
      return;
    }

    setIsSpeakingPage(true);
    let promptText = '';
    if (currentStep === 1) promptText = t.audioPrompts.pageGuide1;
    else if (currentStep === 2) promptText = t.audioPrompts.pageGuide2;
    else if (currentStep === 3) promptText = t.audioPrompts.pageGuide3;
    else if (currentStep === 4) promptText = t.audioPrompts.pageGuide4;
    else if (currentStep === 5) promptText = t.audioPrompts.pageGuide5;

    speakText(
      promptText,
      currentLanguage,
      () => setIsSpeakingPage(true),
      () => setIsSpeakingPage(false)
    );
  };

  return (
    <header className="w-full bg-[#161B22] border-b border-[#30363D] sticky top-0 z-40 shadow-xl">
      {/* Prototype Disclaimer Banner */}
      {showPrototypeNotice && (
        <div className="bg-amber-950/80 border-b border-amber-500/30 px-4 py-2 text-amber-200 text-xs sm:text-sm flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="font-semibold">{t.appName} {t.prototypePrefix}:</strong> {t.prototypeNotice}
            </span>
          </div>
          <button
            onClick={() => setShowPrototypeNotice(false)}
            className="text-amber-400 hover:text-white text-xs px-2 py-0.5 rounded bg-amber-900/50 hover:bg-amber-900"
          >
            {t.dismiss}
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{t.appName}</h1>
              <span className="bg-blue-600/10 text-blue-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-600/30">
                {t.ruralSafeBadge}
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block font-medium">{t.tagline}</p>
          </div>
        </div>

        {/* Header Controls: Voice Guide, Language Selector, Emergency SOS */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Track Case Button */}
          <button
            onClick={onOpenTrackerModal}
            className="hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#21262D] hover:bg-[#30363D] text-slate-200 text-xs sm:text-sm font-semibold border border-gray-700 transition-all shadow-md"
            title="Track Report Status"
          >
            <span className="font-mono text-blue-400">#</span> {t.trackReportStatus}
          </button>

          {/* Global Voice Guidance Button */}
          <button
            onClick={handleToggleSpeakPage}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm transition-all border shadow-md min-h-[48px] ${
              isSpeakingPage
                ? 'bg-amber-500 text-black border-amber-300 animate-pulse'
                : 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border-blue-600/30'
            }`}
            title="Listen to Page Guidance"
          >
            {isSpeakingPage ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-blue-400" />}
            <span className="hidden xs:inline">{isSpeakingPage ? t.stopListening : t.listenPage}</span>
          </button>

          {/* Quick Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#161B22] hover:bg-[#21262D] border border-gray-700 text-white text-xs sm:text-sm font-medium min-h-[48px] transition-all"
            >
              <span className="text-base">{selectedLangObj.flag}</span>
              <span className="font-semibold text-blue-400">{selectedLangObj.nativeName}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {isLangDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-[#161B22] border border-gray-700 rounded-2xl shadow-2xl z-50 py-2 divide-y divide-[#21262D]">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelectLanguage(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center justify-between text-sm font-medium hover:bg-[#21262D] transition-colors ${
                        currentLanguage === lang.code ? 'text-blue-400 font-bold bg-[#21262D]/50' : 'text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                        <span className="text-xs text-slate-500 font-normal">({lang.name})</span>
                      </div>
                      {currentLanguage === lang.code && <Check className="w-4 h-4 text-blue-400" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Red Emergency SOS Button */}
          <button
            onClick={onOpenEmergencyModal}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-2xl font-bold shadow-lg shadow-red-900/40 text-sm sm:text-base uppercase tracking-wider transition-all transform active:scale-95 min-h-[48px]"
          >
            <PhoneCall className="w-5 h-5 animate-bounce" />
            <span className="tracking-wide uppercase font-black">{t.emergencySos}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
