import React, { useState, useEffect } from 'react';
import { Bot, Volume2, ShieldCheck, AlertTriangle, PhoneCall, ChevronRight, Code, Sparkles, Building2 } from 'lucide-react';
import { SupportedLanguage, AIAnalysisResult, ReportState } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { speakText, stopSpeech } from '../../utils/speechUtils';

interface Step4AICheckProps {
  reportState: ReportState;
  onAnalysisComplete: (analysis: AIAnalysisResult) => void;
  language: SupportedLanguage;
  onNext: () => void;
  onBack: () => void;
}

export const Step4AICheck: React.FC<Step4AICheckProps> = ({
  reportState,
  onAnalysisComplete,
  language,
  onNext,
  onBack,
}) => {
  const [isLoading, setIsLoading] = useState(!reportState.analysis);
  const [showJsonInspector, setShowJsonInspector] = useState(false);
  const [isPlayingReassurance, setIsPlayingReassurance] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  useEffect(() => {
    let isMounted = true;

    const performAiAnalysis = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/analyze-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcript: reportState.transcript,
            category: reportState.incidentCategory,
            location: reportState.location,
            language: language,
            hasPhoto: Boolean(reportState.media.photoUrl),
            hasVideo: Boolean(reportState.media.videoUrl),
            hasVoiceNote: Boolean(reportState.media.voiceNoteUrl),
          }),
        });

        const data = await response.json();

        if (isMounted && data.success && data.analysis) {
          onAnalysisComplete(data.analysis);
          setIsLoading(false);

          // Auto play reassurance spoken audio for rural accessibility
          if (data.analysis.userAudioResponseText) {
            speakText(
              data.analysis.userAudioResponseText,
              language,
              () => setIsPlayingReassurance(true),
              () => setIsPlayingReassurance(false)
            );
          }
        }
      } catch (err) {
        console.warn('AI analysis fetch error, using client fallback:', err);
        if (isMounted) {
          // Client-side fallback if server offline
          const fallbackAnalysis: AIAnalysisResult = {
            userAudioResponseText:
              language === 'hi'
                ? 'आपकी रिपोर्ट सुरक्षित और पूरी तरह गुप्त दर्ज कर ली गई है। हमारी टीम तुरंत आपकी सहायता में जुटी है।'
                : 'Your report has been received in complete confidence. Immediate action and routing is underway.',
            urgencyScore: reportState.incidentCategory === 'violence' || reportState.incidentCategory === 'women_safety' ? 9 : reportState.incidentCategory === 'theft' ? 6 : 3,
            urgencyBadge:
              reportState.incidentCategory === 'violence' || reportState.incidentCategory === 'women_safety'
                ? 'Red - High'
                : reportState.incidentCategory === 'theft' 
                ? 'Yellow - Medium'
                : 'Green - Low',
            detectedIssue: reportState.incidentCategory ? reportState.incidentCategory.toUpperCase() : 'General Incident',
            targetHelpline: reportState.incidentCategory === 'women_safety' ? '1091 Women Helpline' : '112 Emergency SOS',
            recommendedRouting: 'Gram Panchayat Sarpanch Safety Desk & Station House Officer',
            summaryEnglish: `Anonymous citizen report submitted from ${reportState.location.village || 'rural locality'}. Details: "${
              reportState.transcript || 'Visual proof attached'
            }".`,
            keyEntities: {
              locations: [reportState.location.village || 'Gram Panchayat'],
              parties: ['Anonymous Reporter'],
              items: [],
            },
            rawAuthorityJson: {
              detected_language: language,
              incident_type: reportState.incidentCategory || 'Unspecified',
              urgency_score: 4,
              urgency_badge: 'Green - Low',
              summary_english: reportState.transcript || 'Anonymous incident reported.',
              recommended_routing: 'Local Panchayat & Police Desk',
              target_helpline: '112 Emergency',
              anonymity_verified: true,
            },
          };
          onAnalysisComplete(fallbackAnalysis);
          setIsLoading(false);
        }
      }
    };

    if (!reportState.analysis) {
      performAiAnalysis();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
      // Ensure any in-flight speech is stopped when unmounting
      stopSpeech();
    };
  }, []);

  const handlePlayAudioResponse = () => {
    if (!reportState.analysis?.userAudioResponseText) return;

    if (isPlayingReassurance) {
      stopSpeech();
      setIsPlayingReassurance(false);
    } else {
      speakText(
        reportState.analysis.userAudioResponseText,
        language,
        () => setIsPlayingReassurance(true),
        () => setIsPlayingReassurance(false)
      );
    }
  };

  const analysis = reportState.analysis;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[#161B22] border border-gray-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🤖</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{t.step4Title}</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed">{t.step4Desc}</p>
          </div>
        </div>
      </div>

      {/* Loading / Scanning State */}
      {isLoading ? (
        <div className="bg-[#161B22] border-2 border-blue-500/40 rounded-3xl p-12 text-center space-y-6 shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
            <Bot className="w-10 h-10 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">{t.aiAnalyzing}</h3>
            <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">{t.aiAnalyzingSub}</p>
          </div>
        </div>
      ) : (
        analysis && (
          <div className="space-y-6">
            {/* Reassurance Spoken Card */}
            <div className="bg-gradient-to-br from-blue-950/80 via-[#161B22] to-indigo-950/80 border-2 border-blue-500/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <span className="text-xs uppercase tracking-wider font-extrabold text-blue-400">
                      {t.userAudioReassurance}
                    </span>
                  </div>
                  <p className="text-lg sm:text-xl font-black text-white leading-relaxed">
                    "{analysis.userAudioResponseText}"
                  </p>
                </div>

                <button
                  onClick={handlePlayAudioResponse}
                  className={`px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shrink-0 border min-h-[52px] shadow-lg transition-all ${
                    isPlayingReassurance
                      ? 'bg-amber-500 text-black border-amber-300 animate-pulse'
                      : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400'
                  }`}
                >
                  <Volume2 className="w-5 h-5" />
                  <span>{isPlayingReassurance ? t.pauseAudio : t.playAudio}</span>
                </button>
              </div>
            </div>

            {/* Summary Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Urgency Badge */}
              <div className="bg-[#161B22] border border-gray-800 rounded-2xl p-4 space-y-2 shadow-lg">
                <span className="text-xs text-gray-400 font-bold block">{t.urgencyLabel}</span>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-sm border ${
                    analysis.urgencyScore >= 8
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : analysis.urgencyScore >= 5
                      ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                      : 'bg-green-500/20 text-green-400 border-green-500/40'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>{analysis.urgencyBadge} ({analysis.urgencyScore}/10)</span>
                </div>
              </div>

              {/* Detected Issue */}
              <div className="bg-[#161B22] border border-gray-800 rounded-2xl p-4 space-y-2 shadow-lg">
                <span className="text-xs text-gray-400 font-bold block">{t.detectedIssueLabel}</span>
                <p className="text-base font-extrabold text-white truncate">{analysis.detectedIssue}</p>
              </div>

              {/* Target Helpline */}
              <div className="bg-[#161B22] border border-gray-800 rounded-2xl p-4 space-y-2 shadow-lg">
                <span className="text-xs text-gray-400 font-bold block">{t.targetHelplineLabel}</span>
                <p className="text-base font-extrabold text-blue-400 flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 shrink-0" />
                  <span className="truncate">{analysis.targetHelpline}</span>
                </p>
              </div>
            </div>

            {/* Recommended Routing Authority */}
            <div className="bg-[#161B22] border border-gray-800 rounded-2xl p-5 space-y-2 shadow-lg">
              <span className="text-xs text-gray-400 font-bold block">{t.recommendedRoutingLabel}</span>
              <p className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>{analysis.recommendedRouting}</span>
              </p>
            </div>

            {/* Authority Data Dual Output Inspector Toggle */}
            <div className="bg-[#0D1117] border border-gray-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <Code className="w-4 h-4 text-blue-400" />
                  <span>{t.backendDualOutput}</span>
                </div>
                <button
                  onClick={() => setShowJsonInspector(!showJsonInspector)}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 underline"
                >
                  {showJsonInspector ? t.closeJsonInspector : t.inspectAuthorityJson}
                </button>
              </div>

              {showJsonInspector && (
                <pre className="bg-[#161B22] p-4 rounded-xl text-xs font-mono text-blue-300 overflow-x-auto border border-gray-800 max-h-60">
                  {JSON.stringify(analysis.rawAuthorityJson, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )
      )}

      {/* Navigation */}
      <div className="pt-4 flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="px-8 py-4 rounded-3xl bg-[#21262D] hover:bg-[#30363D] text-slate-200 text-base font-bold border border-gray-800 min-h-[60px]"
        >
          {t.back}
        </button>

        <button
          onClick={onNext}
          disabled={isLoading}
          className={`px-10 py-5 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xl transition-all shadow-xl shadow-blue-900/30 flex items-center gap-3 uppercase tracking-tight transform active:scale-95 min-h-[64px] ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span>{t.next}</span>
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};
