import React, { useState } from 'react';
import { ShieldCheck, Volume2, Copy, Check, RefreshCw, Send, Lock, ArrowRight } from 'lucide-react';
import { SupportedLanguage, ReportState } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { speakText } from '../../utils/speechUtils';

interface Step5SendConfirmProps {
  reportState: ReportState;
  onSendReport: () => void;
  onResetReport: () => void;
  language: SupportedLanguage;
  onOpenTracker: () => void;
}

export const Step5SendConfirm: React.FC<Step5SendConfirmProps> = ({
  reportState,
  onSendReport,
  onResetReport,
  language,
  onOpenTracker,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const isSubmitted = Boolean(reportState.submittedAt);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(reportState.caseCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSpeakCaseCode = () => {
    // Speak case code clearly digit by digit for rural audio clarity
    const cleanCodeDigits = reportState.caseCode.replace('#', '').split('').join(' ');
    const speechMessage =
      language === 'hi'
        ? `आपका गुप्त केस कोड है ${cleanCodeDigits}। इसे सुरक्षित रखें।`
        : `Your confidential case code is ${cleanCodeDigits}. Please keep this code safe.`;

    speakText(speechMessage, language);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {!isSubmitted ? (
        /* Pre-submit Review & GIANT SEND Button */
        <div className="space-y-6">
          <div className="bg-[#161B22] border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
              <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-600/30">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{t.step5Title}</h2>
                <p className="text-sm text-gray-400 font-medium">{t.step5Desc}</p>
              </div>
            </div>

            {/* Summary Review Box */}
            <div className="bg-[#0D1117] rounded-2xl p-4 border border-gray-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-gray-400 block font-bold">{t.categoryLabel}</span>
                  <span className="font-extrabold text-white">
                    {reportState.incidentCategory ? reportState.incidentCategory.toUpperCase() : 'General Safety'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-bold">{t.locationLabel}</span>
                  <span className="font-extrabold text-blue-400">
                    {reportState.location.village || 'Location Selected'}
                  </span>
                </div>
              </div>

              {reportState.transcript && (
                <div>
                  <span className="text-xs text-gray-400 block font-bold">{t.step1Title}</span>
                  <p className="text-xs text-slate-300 bg-[#161B22] p-3 rounded-xl border border-gray-800 italic mt-1">
                    "{reportState.transcript}"
                  </p>
                </div>
              )}
            </div>

            <div className="bg-blue-950/60 border border-blue-500/40 p-4 rounded-2xl text-blue-300 text-xs sm:text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
              <span>✓ {t.securityDesc}</span>
            </div>
          </div>

          {/* GIANT "SEND REPORT SAFELY" BUTTON */}
          <button
            onClick={onSendReport}
            className="w-full py-6 px-8 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 hover:from-blue-500 hover:to-indigo-400 text-white font-black text-2xl rounded-3xl shadow-2xl shadow-blue-900/60 border-2 border-blue-400 flex items-center justify-center gap-3 transition-all transform active:scale-95 min-h-[72px]"
          >
            <Send className="w-8 h-8 text-white animate-pulse" />
            <span className="uppercase tracking-wider font-extrabold">{t.sendReportSafely}</span>
          </button>
        </div>
      ) : (
        /* Post-submit Success View with Large Case Code & Voice Button */
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#161B22] via-blue-950/40 to-[#161B22] border-2 border-blue-500/60 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            {/* Success Shield Icon */}
            <div className="w-24 h-24 rounded-3xl bg-blue-600 text-white mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/30 border-4 border-blue-400">
              <ShieldCheck className="w-14 h-14" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{t.reportSubmittedSuccess}</h2>
              <p className="text-sm text-gray-400 font-medium mt-1 max-w-md mx-auto">
                {t.securityDesc}
              </p>
            </div>

            {/* Giant Case Code Display Box */}
            <div className="bg-[#0D1117] border-2 border-blue-500/60 rounded-3xl p-6 max-w-md mx-auto space-y-4 shadow-inner">
              <span className="text-xs uppercase font-extrabold tracking-widest text-gray-400 block">
                {t.yourCaseCode}
              </span>

              <div className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-blue-400 select-all">
                {reportState.caseCode}
              </div>

              {/* Action Buttons for Case Code */}
              <div className="flex items-center justify-center gap-3 pt-2">
                {/* Listen to Case Code Button */}
                <button
                  onClick={handleSpeakCaseCode}
                  className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg min-h-[48px]"
                  title="Listen to Case Code"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>{t.listenToCaseCode}</span>
                </button>

                {/* Copy Code Button */}
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-3 rounded-2xl bg-[#21262D] hover:bg-[#30363D] text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-gray-700 min-h-[48px]"
                >
                  {isCopied ? <Check className="w-5 h-5 text-blue-400" /> : <Copy className="w-5 h-5" />}
                  <span>{isCopied ? t.copied : t.copyCaseCode}</span>
                </button>
              </div>
            </div>

            {/* Reassurance pill */}
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              💡 Save your case code above. You can enter this code anytime to check the status of your report.
            </p>
          </div>

          {/* Bottom Action Options */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenTracker}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#21262D] hover:bg-[#30363D] text-blue-400 font-extrabold text-base border border-blue-600/40 min-h-[56px] flex items-center justify-center gap-2"
            >
              <span>{t.trackReportStatus}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onResetReport}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#161B22] hover:bg-[#21262D] text-slate-200 font-bold text-base border border-gray-700 min-h-[56px] flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>{t.fileAnotherReport}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
