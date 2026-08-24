import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Type, AlertCircle, CheckCircle } from 'lucide-react';
import { SupportedLanguage, IncidentCategory, CategoryInfo } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { speakText, createSpeechRecognition, isSpeechRecognitionSupported } from '../../utils/speechUtils';

interface Step1SpeakProps {
  transcript: string;
  onTranscriptChange: (text: string) => void;
  selectedCategory: IncidentCategory | '';
  onSelectCategory: (cat: IncidentCategory) => void;
  language: SupportedLanguage;
  onNext: () => void;
}

export const CATEGORIES_CONFIG: CategoryInfo[] = [
  {
    id: 'theft',
    titleKey: 'theft',
    defaultTitle: 'Theft / Robbery',
    iconName: '🛵',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-500/50',
  },
  {
    id: 'violence',
    titleKey: 'violence',
    defaultTitle: 'Violence / Assault',
    iconName: '⚠️',
    color: 'from-red-500 to-rose-700',
    bgColor: 'bg-red-950/40',
    borderColor: 'border-red-500/50',
  },
  {
    id: 'land_crop',
    titleKey: 'land_crop',
    defaultTitle: 'Land / Crop Dispute',
    iconName: '🌾',
    color: 'from-yellow-500 to-emerald-600',
    bgColor: 'bg-yellow-950/40',
    borderColor: 'border-yellow-500/50',
  },
  {
    id: 'women_safety',
    titleKey: 'women_safety',
    defaultTitle: 'Women Safety',
    iconName: '👩',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-950/40',
    borderColor: 'border-purple-500/50',
  },
  {
    id: 'other',
    titleKey: 'other',
    defaultTitle: 'Other Incident',
    iconName: '❓',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-950/40',
    borderColor: 'border-blue-500/50',
  },
];

export const Step1Speak: React.FC<Step1SpeakProps> = ({
  transcript,
  onTranscriptChange,
  selectedCategory,
  onSelectCategory,
  language,
  onNext,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const recognitionRef = useRef<any>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    setSpeechError('');

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      setSpeechError('Live speech recognition is not supported in this browser tab. You can type what happened in the box below.');
      return;
    }

    const rec = createSpeechRecognition(
      language,
      (text, isFinal) => {
        onTranscriptChange(text);
      },
      (err) => {
        setSpeechError(err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    if (rec) {
      recognitionRef.current = rec;
      try {
        rec.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setIsRecording(false);
      }
    }
  };

  const handleSpeakCategory = (catTitle: string) => {
    speakText(`Category: ${catTitle}`, language);
  };

  const handleSpeakInstructions = () => {
    speakText(t.audioPrompts.pageGuide1, language);
  };

  const isFormValid = Boolean(transcript.trim() || selectedCategory);

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Title & Speech Guidance */}
      <div className="bg-[#161B22] border border-gray-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🎙️</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{t.step1Title}</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed">{t.step1Desc}</p>
          </div>
          <button
            onClick={handleSpeakInstructions}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-bold text-xs sm:text-sm border border-blue-600/30 shrink-0 min-h-[48px] transition-all"
            title={t.listen}
          >
            <Volume2 className="w-5 h-5 text-blue-400" />
            <span className="hidden sm:inline">{t.listen}</span>
          </button>
        </div>
      </div>

      {/* Security Guaranteed Banner */}
      <div className="bg-blue-600/5 border border-blue-600/20 p-5 rounded-3xl flex items-center gap-4">
        <span className="text-3xl">🛡️</span>
        <div className="text-sm text-blue-200 font-medium">
          <span className="block font-bold text-base text-white">{t.securityTitle}</span>
          {t.securityDesc}
        </div>
      </div>

      {/* HUGE Central Microphone Button */}
      <div className="flex flex-col items-center justify-center space-y-6 py-6 bg-[#161B22] border border-gray-800 rounded-[40px] p-8 sm:p-12 shadow-2xl">
        <div className="relative flex items-center justify-center">
          {/* Pulse Waves when Recording */}
          {isRecording ? (
            <>
              <div className="absolute w-64 h-64 border-2 border-red-500/30 rounded-full animate-ping" />
              <div className="absolute w-52 h-52 border-2 border-red-500/40 rounded-full animate-pulse" />
            </>
          ) : (
            <>
              <div className="absolute w-64 h-64 border-2 border-blue-500/20 rounded-full pointer-events-none" />
              <div className="absolute w-52 h-52 border-2 border-blue-500/40 rounded-full pointer-events-none" />
            </>
          )}

          <button
            onClick={toggleRecording}
            className={`relative z-10 w-40 h-40 rounded-full flex flex-col items-center justify-center text-white font-black shadow-2xl transition-all duration-300 border-4 transform active:scale-95 ${
              isRecording
                ? 'bg-gradient-to-br from-red-600 via-rose-600 to-red-800 border-red-300 shadow-red-900/60 ring-8 ring-red-500/30'
                : 'bg-blue-600 hover:bg-blue-500 border-blue-400 shadow-blue-500/50 hover:scale-105'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-14 h-14 text-white mb-1 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-white">{t.tapToStop}</span>
              </>
            ) : (
              <>
                <Mic className="w-14 h-14 text-white mb-1" />
                <span className="text-sm font-black uppercase tracking-widest text-white">{t.pressToSpeak}</span>
              </>
            )}
          </button>
        </div>

        {/* Live Status Text */}
        <div className="text-center">
          {isRecording ? (
            <div className="flex items-center gap-2 text-red-400 font-extrabold text-base sm:text-lg animate-pulse bg-red-950/60 px-5 py-2 rounded-full border border-red-500/40">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <span>{t.listeningNow}</span>
            </div>
          ) : (
            <p className="text-base sm:text-lg text-gray-400 font-medium max-w-md mx-auto">
              {t.micSubtitle}
            </p>
          )}
        </div>

        {speechError && (
          <div className="bg-amber-950/80 border border-amber-500/50 text-amber-200 p-3.5 rounded-2xl text-xs sm:text-sm max-w-md text-center flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{speechError}</span>
          </div>
        )}
      </div>

      {/* Transcript / Text Input Fallback */}
      <div className="bg-[#161B22] border border-gray-800 rounded-3xl p-6 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <label className="text-sm font-extrabold text-slate-200 flex items-center gap-2">
            <Type className="w-4 h-4 text-blue-400" />
            <span>{t.orTypeText}</span>
          </label>
          {transcript && (
            <button
              onClick={() => speakText(transcript, language)}
              className="p-1.5 text-xs text-blue-400 hover:text-white flex items-center gap-1 bg-[#21262D] rounded-xl border border-gray-700"
              title={t.readBack}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{t.readBack}</span>
            </button>
          )}
        </div>

        <textarea
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          placeholder={t.placeholderText}
          rows={3}
          className="w-full bg-[#0D1117] border border-gray-800 focus:border-blue-500 text-white rounded-2xl p-4 text-base sm:text-lg font-medium placeholder:text-gray-500 outline-none transition-colors shadow-inner"
        />
      </div>

      {/* Large Visual Picture Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{t.chooseCategoryTitle}</span>
          </h3>
          <span className="text-xs text-gray-400 font-medium">{t.selectCategoryHint}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {CATEGORIES_CONFIG.map((cat) => {
            const translatedTitle = t.categories[cat.titleKey] || cat.defaultTitle;
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`cursor-pointer rounded-3xl p-5 flex flex-col items-center justify-center text-center transition-all border-2 min-h-[110px] relative shadow-lg ${
                  isSelected
                    ? 'bg-blue-600/10 border-blue-500 ring-4 ring-blue-500/20'
                    : 'bg-[#161B22] border-gray-800 hover:border-blue-500 hover:bg-[#21262D]'
                }`}
              >
                {/* Speaker Button on each card */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeakCategory(translatedTitle);
                  }}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-[#21262D]"
                  title={t.listen}
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                <span className="text-4xl mb-2">{cat.iconName}</span>
                <span
                  className={`text-base font-bold leading-tight ${
                    isSelected ? 'text-blue-400 font-extrabold' : 'text-white'
                  }`}
                >
                  {translatedTitle}
                </span>

                {isSelected && (
                  <div className="mt-2 text-xs text-blue-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span>{t.selected}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Step Button */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={onNext}
          disabled={!isFormValid}
          className={`w-full sm:w-auto px-10 py-5 rounded-3xl font-black text-xl transition-all shadow-xl min-h-[64px] flex items-center justify-center gap-3 uppercase tracking-tight ${
            isFormValid
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30 transform active:scale-95'
              : 'bg-[#21262D] text-gray-500 border border-gray-800 cursor-not-allowed opacity-60'
          }`}
        >
          <span>{t.next}</span>
          <span className="text-2xl">➔</span>
        </button>
      </div>
    </div>
  );
};
