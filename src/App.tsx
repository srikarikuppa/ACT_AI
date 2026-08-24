import React, { useState, useEffect } from 'react';
import { SupportedLanguage, ReportState, AIAnalysisResult, SavedReportRecord } from './types';
import { TRANSLATIONS } from './utils/translations';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { EmergencyModal } from './components/EmergencyModal';
import { CaseTrackerModal } from './components/CaseTrackerModal';
import { Step1Speak } from './components/steps/Step1Speak';
import { Step2Location } from './components/steps/Step2Location';
import { Step3Proof } from './components/steps/Step3Proof';
import { Step4AICheck } from './components/steps/Step4AICheck';
import { Step5SendConfirm } from './components/steps/Step5SendConfirm';

export default function App() {
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [savedReports, setSavedReports] = useState<SavedReportRecord[]>([]);

  // Generate random case code e.g. #ACT-4029
  const generateCaseCode = () => {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `#ACT-${num}`;
  };

  const [reportState, setReportState] = useState<ReportState>({
    step: 1,
    language: 'en',
    transcript: '',
    incidentCategory: '',
    location: {
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      village: 'Shivpur Gram Panchayat',
      lat: 25.3176,
      lng: 82.9739,
      rawAddress: 'Shivpur Gram Panchayat, Varanasi',
    },
    media: {},
    analysis: null,
    isAnalyzing: false,
    caseCode: generateCaseCode(),
    submittedAt: null,
  });

  // Load saved reports from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('act_ai_saved_reports');
      if (stored) {
        setSavedReports(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('LocalStorage error loading reports:', e);
    }
  }, []);

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setReportState((prev) => ({ ...prev, language: lang }));
  };

  const handleSelectStep = (step: 1 | 2 | 3 | 4 | 5) => {
    setReportState((prev) => ({ ...prev, step }));
  };

  const handleAnalysisComplete = (analysis: AIAnalysisResult) => {
    setReportState((prev) => ({
      ...prev,
      analysis,
      isAnalyzing: false,
    }));
  };

  const handleSendReport = () => {
    const timestamp = new Date().toLocaleString();
    const updatedState = {
      ...reportState,
      submittedAt: timestamp,
    };
    setReportState(updatedState);

    const newRecord: SavedReportRecord = {
      caseCode: reportState.caseCode,
      submittedAt: timestamp,
      category: reportState.incidentCategory ? reportState.incidentCategory.toUpperCase() : 'General Safety',
      location: `${reportState.location.village}, ${reportState.location.district}`,
      status: 'Received',
      urgency: reportState.analysis?.urgencyBadge || 'Yellow - Medium',
      summary: reportState.analysis?.summaryEnglish || reportState.transcript || 'Anonymous incident reported.',
      targetHelpline: reportState.analysis?.targetHelpline || '112 Emergency SOS',
    };

    const updatedList = [newRecord, ...savedReports];
    setSavedReports(updatedList);

    try {
      localStorage.setItem('act_ai_saved_reports', JSON.stringify(updatedList));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const handleResetReport = () => {
    setReportState({
      step: 1,
      language: language,
      transcript: '',
      incidentCategory: '',
      location: {
        state: 'Uttar Pradesh',
        district: 'Varanasi',
        village: 'Shivpur Gram Panchayat',
        lat: 25.3176,
        lng: 82.9739,
        rawAddress: 'Shivpur Gram Panchayat, Varanasi',
      },
      media: {},
      analysis: null,
      isAnalyzing: false,
      caseCode: generateCaseCode(),
      submittedAt: null,
    });
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header & Navigation */}
      <Header
        currentLanguage={language}
        onSelectLanguage={handleLanguageSelect}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenTrackerModal={() => setIsTrackerModalOpen(true)}
        currentStep={reportState.step}
      />

      {/* Visual Progress Bar (Step 1 -> 5) */}
      <ProgressBar
        currentStep={reportState.step}
        onSelectStep={handleSelectStep}
        language={language}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        {reportState.step === 1 && (
          <Step1Speak
            transcript={reportState.transcript}
            onTranscriptChange={(text) => setReportState((prev) => ({ ...prev, transcript: text }))}
            selectedCategory={reportState.incidentCategory}
            onSelectCategory={(cat) => setReportState((prev) => ({ ...prev, incidentCategory: cat }))}
            language={language}
            onNext={() => handleSelectStep(2)}
          />
        )}

        {reportState.step === 2 && (
          <Step2Location
            location={reportState.location}
            onLocationChange={(loc) => setReportState((prev) => ({ ...prev, location: loc }))}
            language={language}
            onNext={() => handleSelectStep(3)}
            onBack={() => handleSelectStep(1)}
          />
        )}

        {reportState.step === 3 && (
          <Step3Proof
            media={reportState.media}
            onMediaChange={(med) => setReportState((prev) => ({ ...prev, media: med }))}
            language={language}
            onNext={() => handleSelectStep(4)}
            onBack={() => handleSelectStep(2)}
          />
        )}

        {reportState.step === 4 && (
          <Step4AICheck
            reportState={reportState}
            onAnalysisComplete={handleAnalysisComplete}
            language={language}
            onNext={() => handleSelectStep(5)}
            onBack={() => handleSelectStep(3)}
          />
        )}

        {reportState.step === 5 && (
          <Step5SendConfirm
            reportState={reportState}
            onSendReport={handleSendReport}
            onResetReport={handleResetReport}
            language={language}
            onOpenTracker={() => setIsTrackerModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#161B22] border-t border-gray-800 py-6 px-4 text-center text-xs text-gray-400 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-extrabold text-slate-200">
            {TRANSLATIONS[language]?.ruralSafetyNetwork || 'ACT.ai Rural Safety Network'}
          </span>
        </div>
        <p className="max-w-xl mx-auto text-gray-400 leading-relaxed">
          {TRANSLATIONS[language]?.footerDesc || 'Designed for compassionate, hyper-simplified rural anonymous reporting.'}
        </p>
      </footer>

      {/* Emergency SOS Helpline Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        language={language}
      />

      {/* Case Tracker Modal */}
      <CaseTrackerModal
        isOpen={isTrackerModalOpen}
        onClose={() => setIsTrackerModalOpen(false)}
        language={language}
        savedReports={savedReports}
      />
    </div>
  );
}
