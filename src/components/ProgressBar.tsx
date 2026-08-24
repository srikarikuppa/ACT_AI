import React from 'react';
import { Mic, MapPin, Camera, Bot, CheckCircle2, Volume2 } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { speakText } from '../utils/speechUtils';

interface ProgressBarProps {
  currentStep: 1 | 2 | 3 | 4 | 5;
  onSelectStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  language: SupportedLanguage;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  onSelectStep,
  language,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const pb = t.progressBar || {
    speak: 'Speak',
    where: 'Where',
    proof: 'Proof',
    check: 'Check',
    send: 'Send',
    stepAnnouncement: 'Step',
  };

  const steps = [
    { id: 1 as const, title: t.step1Title, shortLabel: pb.speak, icon: Mic, emoji: '🎙️' },
    { id: 2 as const, title: t.step2Title, shortLabel: pb.where, icon: MapPin, emoji: '📍' },
    { id: 3 as const, title: t.step3Title, shortLabel: pb.proof, icon: Camera, emoji: '📸' },
    { id: 4 as const, title: t.step4Title, shortLabel: pb.check, icon: Bot, emoji: '🤖' },
    { id: 5 as const, title: t.step5Title, shortLabel: pb.send, icon: CheckCircle2, emoji: '✅' },
  ];

  const handleStepVoice = (stepNum: number, stepTitle: string) => {
    speakText(`${pb.stepAnnouncement} ${stepNum}: ${stepTitle}`, language);
  };

  return (
    <div className="w-full bg-[#0D1117] border-b border-gray-800 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between relative px-4 sm:px-8">
          {/* Progress Connecting Line */}
          <div className="absolute top-1/2 left-10 right-10 h-1 bg-gray-800 -translate-y-1/2 rounded-full -z-0" />
          <div
            className="absolute top-1/2 left-10 h-1 bg-blue-500 -translate-y-1/2 rounded-full transition-all duration-500 -z-0"
            style={{ width: `${((currentStep - 1) / 4) * 85}%` }}
          />

          {/* Step Icons */}
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-1.5">
                <button
                  onClick={() => {
                    if (step.id <= currentStep) {
                      onSelectStep(step.id);
                    }
                  }}
                  disabled={step.id > currentStep}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold transition-all duration-300 border-4 border-[#0D1117] shadow-xl ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-blue-500/40 scale-110'
                      : isCompleted
                      ? 'bg-blue-950/80 text-blue-300 border-blue-500/60 hover:bg-blue-900'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-70'
                  }`}
                  title={`${step.id}. ${step.title}`}
                >
                  <span className={`text-xl sm:text-2xl ${isActive || isCompleted ? 'opacity-100' : 'opacity-50'}`}>
                    {step.emoji}
                  </span>
                </button>

                <div className="flex items-center gap-1">
                  <span
                    className={`text-xs sm:text-sm uppercase tracking-wider font-bold ${
                      isActive ? 'text-blue-400' : isCompleted ? 'text-slate-300' : 'text-gray-500'
                    }`}
                  >
                    {step.shortLabel}
                  </span>
                  {isActive && (
                    <button
                      onClick={() => handleStepVoice(step.id, step.title)}
                      className="p-0.5 text-blue-400 hover:text-white rounded-full"
                      title="Listen to step name"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
