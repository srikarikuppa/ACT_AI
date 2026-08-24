import { SupportedLanguage } from '../types';

export const LANGUAGE_SPEECH_MAP: Record<SupportedLanguage, string> = {
  hi: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  en: 'en-US',
};

export const LANGUAGE_VOICE_KEYWORDS: Record<SupportedLanguage, string[]> = {
  hi: ['hindi', 'hi-in', 'hi_in', 'हिन्दी', 'हिंदी'],
  te: ['telugu', 'te-in', 'te_in', 'తెలుగు'],
  ta: ['tamil', 'ta-in', 'ta_in', 'தமிழ்'],
  mr: ['marathi', 'mr-in', 'mr_in', 'मराठी'],
  bn: ['bengali', 'bn-in', 'bn_in', 'bangla', 'বাংলা'],
  en: ['en-us', 'en-in', 'en-gb', 'english', 'india'],
};

let cachedVoices: SpeechSynthesisVoice[] = [];
let currentAudio: HTMLAudioElement | null = null;
let currentAudioCancel: (() => void) | null = null;
let speakSessionId = 0;

const refreshVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
  return cachedVoices;
};

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  refreshVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      refreshVoices();
    };
  }
}

export const isSpeechSynthesisSupported = (): boolean => {
  return typeof window !== 'undefined';
};

export const stopSpeech = (): void => {
  // Invalidate any ongoing speak session
  speakSessionId++;
  if (currentAudioCancel) {
    currentAudioCancel();
    currentAudioCancel = null;
  }
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
};

/**
 * Pre-processes text for clearer speech synthesis across non-English scripts and alphanumerics.
 */
const prepareTextForSpeech = (text: string, lang: SupportedLanguage): string => {
  if (!text) return '';

  let processed = text;

  // Format case code like #ACT-4029 into spaced characters so TTS doesn't blur them
  processed = processed.replace(/#?ACT-(\d+)/gi, (_, digits) => {
    const digitSpaced = digits.split('').join(' ');
    if (lang === 'hi') return `ए सी टी केस कोड ${digitSpaced}`;
    if (lang === 'te') return `ఏ సీ టీ కేస్ కోడ్ ${digitSpaced}`;
    if (lang === 'ta') return `ஏ சி டி வழக்கு குறியீடு ${digitSpaced}`;
    if (lang === 'mr') return `ए सी टी केस कोड ${digitSpaced}`;
    if (lang === 'bn') return `এ সি টি কেস কোড ${digitSpaced}`;
    return `ACT Case Code ${digitSpaced}`;
  });

  return processed;
};

/**
 * Splits text into small chunks suitable for TTS audio URL GET requests (<180 chars).
 */
const splitTextIntoChunks = (text: string, maxLength = 180): string[] => {
  if (!text) return [];
  if (text.length <= maxLength) return [text];

  const sentenceRegex = /([.।?!;\n]+)/;
  const parts = text.split(sentenceRegex);
  const chunks: string[] = [];
  let currentChunk = '';

  for (let i = 0; i < parts.length; i += 2) {
    const sentence = parts[i] + (parts[i + 1] || '');
    if (!sentence.trim()) continue;

    if ((currentChunk + ' ' + sentence).trim().length <= maxLength) {
      currentChunk = (currentChunk + ' ' + sentence).trim();
    } else {
      if (currentChunk) chunks.push(currentChunk);
      if (sentence.length > maxLength) {
        // Fallback split by spaces if single sentence is long
        const words = sentence.split(' ');
        let temp = '';
        for (const w of words) {
          if ((temp + ' ' + w).trim().length <= maxLength) {
            temp = (temp + ' ' + w).trim();
          } else {
            if (temp) chunks.push(temp);
            temp = w;
          }
        }
        if (temp) chunks.push(temp);
        currentChunk = '';
      } else {
        currentChunk = sentence;
      }
    }
  }
  if (currentChunk) chunks.push(currentChunk);

  return chunks.filter((c) => c.trim().length > 0);
};

const playWebSpeechFallback = (
  text: string,
  lang: SupportedLanguage,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onError) onError('Speech synthesis not supported');
    if (onEnd) onEnd();
    return;
  }

  try {
    // window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    setTimeout(() => {
      const formattedText = prepareTextForSpeech(text, lang);
      const utterance = new SpeechSynthesisUtterance(formattedText);
      const targetLangCode = LANGUAGE_SPEECH_MAP[lang] || 'en-US';
      utterance.lang = targetLangCode;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      let voices = refreshVoices();
      if (!voices || voices.length === 0) {
        voices = window.speechSynthesis.getVoices();
      }

      const keywords = LANGUAGE_VOICE_KEYWORDS[lang] || ['en-us', 'india', 'en-in'];

      // 1. Exact BCP-47 match
      let matchingVoice = voices.find((v) => v.lang.toLowerCase() === targetLangCode.toLowerCase());

      // 2. Language prefix match
      if (!matchingVoice) {
        const prefix = lang.toLowerCase();
        matchingVoice = voices.find((v) =>
          v.lang.toLowerCase().replace('_', '-').startsWith(prefix)
        );
      }

      // 3. Name keyword search
      if (!matchingVoice) {
        matchingVoice = voices.find((v) => {
          const vName = v.name.toLowerCase();
          const vLang = v.lang.toLowerCase();
          return keywords.some((kw) => vName.includes(kw) || vLang.includes(kw));
        });
      }

      // 4. Any Hindi or Indian voice fallback so synthesis doesn't crash on unsupported language code
      if (!matchingVoice) {
        matchingVoice = voices.find((v) =>
          v.lang.toLowerCase().includes('hi') ||
          v.lang.toLowerCase().includes('in') ||
          v.name.toLowerCase().includes('india')
        );
        if (matchingVoice) {
          utterance.lang = matchingVoice.lang;
        }
      }

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onend = () => {
        if (onEnd) onEnd();
      };

      utterance.onerror = (evt) => {
        console.warn('SpeechSynthesis utterance error:', evt);
        if (onEnd) onEnd();
        if (onError) onError(evt);
      };

      window.speechSynthesis.speak(utterance);
    }, 40);
  } catch (err) {
    console.error('Failed to initiate WebSpeech:', err);
    if (onEnd) onEnd();
  }
};

export const speakText = (
  text: string,
  lang: SupportedLanguage,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): void => {
  stopSpeech();

  if (!text || !text.trim()) {
    if (onEnd) onEnd();
    return;
  }

  const formattedText = prepareTextForSpeech(text, lang);
  const chunks = splitTextIntoChunks(formattedText, 180);

  if (chunks.length === 0) {
    if (onEnd) onEnd();
    return;
  }

  // Create a new speak session id so concurrent/previous calls are ignored
  const mySession = ++speakSessionId;

  let chunkIndex = 0;
  let isCancelled = false;

  currentAudioCancel = () => {
    isCancelled = true;
  };

  const playNextChunk = () => {
    // Abort if this session has been invalidated or finished
    if (mySession !== speakSessionId || isCancelled || chunkIndex >= chunks.length) {
      currentAudio = null;
      currentAudioCancel = null;
      if (!isCancelled && onEnd) onEnd();
      return;
    }

    const chunk = chunks[chunkIndex];
    chunkIndex++;

    const langCodeMap: Record<SupportedLanguage, string> = {
      hi: 'hi',
      te: 'te',
      ta: 'ta',
      mr: 'mr',
      bn: 'bn',
      en: 'en',
    };
    const langCode = langCodeMap[lang] || 'en';
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${langCode}&client=tw-ob`;

    const audio = new Audio(audioUrl);
    currentAudio = audio;

    if (chunkIndex === 1 && onStart) {
      onStart();
    }

    audio.onended = () => {
      if (mySession === speakSessionId && !isCancelled) {
        playNextChunk();
      }
    };

    audio.onerror = (e) => {
      console.warn('Google TTS audio load error, attempting WebSpeech fallback:', e);
      if (mySession === speakSessionId && !isCancelled) {
        currentAudio = null;
        currentAudioCancel = null;
        const remainingText = chunks.slice(chunkIndex - 1).join(' ');
        playWebSpeechFallback(remainingText, lang, onStart, onEnd, onError);
      }
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Google TTS audio play rejected, attempting WebSpeech fallback:', err);
        if (mySession === speakSessionId && !isCancelled) {
          currentAudio = null;
          currentAudioCancel = null;
          const remainingText = chunks.slice(chunkIndex - 1).join(' ');
          playWebSpeechFallback(remainingText, lang, onStart, onEnd, onError);
        }
      });
    }
  };

  playNextChunk();
};

export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

export const createSpeechRecognition = (
  lang: SupportedLanguage,
  onResult: (text: string, isFinal: boolean) => void,
  onError: (err: string) => void,
  onEnd: () => void
) => {
  if (!isSpeechRecognitionSupported()) {
    onError('Speech recognition is not supported by your browser.');
    return null;
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = LANGUAGE_SPEECH_MAP[lang] || 'hi-IN';

  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcriptPiece = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcriptPiece + ' ';
      } else {
        interimTranscript += transcriptPiece;
      }
    }

    const combined = (finalTranscript + interimTranscript).trim();
    onResult(combined, Boolean(finalTranscript));
  };

  recognition.onerror = (event: any) => {
    console.warn('Speech recognition error:', event.error);
    if (event.error !== 'no-speech') {
      onError(`Speech recognition note: ${event.error}`);
    }
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
};

