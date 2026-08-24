import React, { useState, useRef } from 'react';
import { Camera, Video, Mic, Volume2, ShieldCheck, Check, Trash2, Play, Square, ChevronRight } from 'lucide-react';
import { SupportedLanguage, MediaProof } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { speakText } from '../../utils/speechUtils';

interface Step3ProofProps {
  media: MediaProof;
  onMediaChange: (media: MediaProof) => void;
  language: SupportedLanguage;
  onNext: () => void;
  onBack: () => void;
}

export const Step3Proof: React.FC<Step3ProofProps> = ({
  media,
  onMediaChange,
  language,
  onNext,
  onBack,
}) => {
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Handle Photo Capture/Upload
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      onMediaChange({ ...media, photoUrl, photoName: file.name });
    }
  };

  // Handle Video Capture/Upload
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      onMediaChange({ ...media, videoUrl, videoName: file.name });
    }
  };

  // Start Voice Note Recording
  const startVoiceNoteRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const voiceNoteUrl = URL.createObjectURL(audioBlob);
        onMediaChange({
          ...media,
          voiceNoteUrl,
          voiceNoteDuration: recordingSeconds,
        });
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone recording error:', err);
      // Fallback simulated voice note if mic permission denied
      onMediaChange({
        ...media,
        voiceNoteUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg',
        voiceNoteDuration: 5,
      });
    }
  };

  const stopVoiceNoteRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const handleSpeakInstructions = () => {
    speakText(t.audioPrompts.pageGuide3, language);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[#161B22] border border-gray-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">📸</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{t.step3Title}</h2>
              <span className="text-xs bg-gray-800 text-gray-300 font-bold px-2.5 py-1 rounded-full border border-gray-700">
                {t.optionalTag}
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed">{t.step3Desc}</p>
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

      {/* Safety Pill Banner */}
      <div className="bg-blue-950/80 border-2 border-blue-500/50 rounded-2xl p-4 text-blue-200 flex items-center gap-3 shadow-lg">
        <ShieldCheck className="w-7 h-7 text-blue-400 shrink-0" />
        <span className="text-sm sm:text-base font-extrabold">{t.safetyPill}</span>
      </div>

      {/* Proof Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Photo Card */}
        <div className="bg-[#161B22] border border-gray-800 rounded-3xl p-5 flex flex-col items-center text-center justify-between gap-4 shadow-xl min-h-[220px]">
          <input
            type="file"
            ref={photoInputRef}
            accept="image/*"
            capture="environment"
            onChange={handlePhotoSelect}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Camera className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-white">{t.takePhoto}</h3>
            <p className="text-xs text-gray-400 mt-1">{t.captureIncidentPhoto}</p>
          </div>

          {media.photoUrl ? (
            <div className="w-full space-y-2">
              <div className="relative rounded-xl overflow-hidden h-24 border border-amber-500/50">
                <img src={media.photoUrl} alt="Incident Proof" className="w-full h-full object-cover" />
                <button
                  onClick={() => onMediaChange({ ...media, photoUrl: undefined, photoName: undefined })}
                  className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 text-white rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-blue-400 font-bold flex items-center justify-center gap-1">
                <Check className="w-3.5 h-3.5" /> {t.photoAttached}
              </span>
            </div>
          ) : (
            <button
              onClick={() => photoInputRef.current?.click()}
              className="w-full py-3 px-4 bg-[#21262D] hover:bg-[#30363D] text-amber-300 font-bold text-sm rounded-2xl border border-amber-500/40 min-h-[52px] transition-all"
            >
              + {t.addPhotoButton}
            </button>
          )}
        </div>

        {/* Video Card */}
        <div className="bg-[#161B22] border border-gray-800 rounded-3xl p-5 flex flex-col items-center text-center justify-between gap-4 shadow-xl min-h-[220px]">
          <input
            type="file"
            ref={videoInputRef}
            accept="video/*"
            capture="environment"
            onChange={handleVideoSelect}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Video className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-white">{t.recordVideo}</h3>
            <p className="text-xs text-gray-400 mt-1">{t.shortVideoClip}</p>
          </div>

          {media.videoUrl ? (
            <div className="w-full space-y-2">
              <div className="relative rounded-xl overflow-hidden bg-black/50 p-2 border border-cyan-500/50 flex items-center justify-between">
                <span className="text-xs text-cyan-300 font-mono truncate max-w-[120px]">
                  {media.videoName || 'Video Clip'}
                </span>
                <button
                  onClick={() => onMediaChange({ ...media, videoUrl: undefined, videoName: undefined })}
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-blue-400 font-bold flex items-center justify-center gap-1">
                <Check className="w-3.5 h-3.5" /> {t.videoAttached}
              </span>
            </div>
          ) : (
            <button
              onClick={() => videoInputRef.current?.click()}
              className="w-full py-3 px-4 bg-[#21262D] hover:bg-[#30363D] text-cyan-300 font-bold text-sm rounded-2xl border border-cyan-500/40 min-h-[52px] transition-all"
            >
              + {t.addVideoButton}
            </button>
          )}
        </div>

        {/* Voice Note Card */}
        <div className="bg-[#161B22] border border-gray-800 rounded-3xl p-5 flex flex-col items-center text-center justify-between gap-4 shadow-xl min-h-[220px]">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Mic className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-white">{t.addVoiceNote}</h3>
            <p className="text-xs text-gray-400 mt-1">{t.recordAudioDesc}</p>
          </div>

          {isRecordingAudio ? (
            <button
              onClick={stopVoiceNoteRecording}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 animate-pulse min-h-[52px]"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>{t.stopRecording} ({recordingSeconds}s)</span>
            </button>
          ) : media.voiceNoteUrl ? (
            <div className="w-full space-y-2">
              <div className="bg-[#21262D] border border-purple-500/40 p-2.5 rounded-xl flex items-center justify-between">
                <audio controls src={media.voiceNoteUrl} className="h-8 max-w-[150px]" />
                <button
                  onClick={() => onMediaChange({ ...media, voiceNoteUrl: undefined, voiceNoteDuration: undefined })}
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-blue-400 font-bold flex items-center justify-center gap-1">
                <Check className="w-3.5 h-3.5" /> {t.voiceNoteReady}
              </span>
            </div>
          ) : (
            <button
              onClick={startVoiceNoteRecording}
              className="w-full py-3 px-4 bg-[#21262D] hover:bg-[#30363D] text-purple-300 font-bold text-sm rounded-2xl border border-purple-500/40 min-h-[52px] transition-all"
            >
              🎙️ {t.recordAudioButton}
            </button>
          )}
        </div>
      </div>

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
          className="px-10 py-5 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xl transition-all shadow-xl shadow-blue-900/30 flex items-center gap-3 uppercase tracking-tight transform active:scale-95 min-h-[64px]"
        >
          <span>{t.next}</span>
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};
