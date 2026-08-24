import { SupportedLanguage, LanguageInfo } from '../types';

export const LANGUAGES: LanguageInfo[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', speechLang: 'hi-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', speechLang: 'te-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', speechLang: 'ta-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', speechLang: 'mr-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', speechLang: 'bn-IN' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🌐', speechLang: 'en-US' },
];

export interface TranslationSet {
  appName: string;
  tagline: string;
  listenPage: string;
  stopListening: string;
  emergencySos: string;
  prototypeNotice: string;
  prototypePrefix: string;
  ruralSafeBadge: string;
  dismiss: string;
  ruralSafetyNetwork: string;
  footerDesc: string;
  
  // Step headers
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  step5Title: string;
  step5Desc: string;

  // Progress bar
  progressBar: {
    speak: string;
    where: string;
    proof: string;
    check: string;
    send: string;
    stepAnnouncement: string;
  };

  // Step 1
  listen: string;
  securityTitle: string;
  securityDesc: string;
  pressToSpeak: string;
  listeningNow: string;
  tapToStop: string;
  micSubtitle: string;
  orTypeText: string;
  placeholderText: string;
  readBack: string;
  chooseCategoryTitle: string;
  selectCategoryHint: string;
  selected: string;
  categoryLabel: string;
  categories: {
    theft: string;
    violence: string;
    land_crop: string;
    women_safety: string;
    other: string;
  };
  audioPrompts: {
    pageGuide1: string;
    pageGuide2: string;
    pageGuide3: string;
    pageGuide4: string;
    pageGuide5: string;
  };

  // Step 2
  findMyLocation: string;
  locatingRadar: string;
  locationFound: string;
  pinpointedVillage: string;
  gpsNotSupported: string;
  locationPinpointed: string;
  selectManually: string;
  stateLabel: string;
  districtLabel: string;
  villageLabel: string;

  // Step 3
  takePhoto: string;
  photoDesc: string;
  addPhoto: string;
  photoAttached: string;
  recordVideo: string;
  videoDesc: string;
  addVideo: string;
  videoAttached: string;
  addVoiceNote: string;
  voiceNoteDesc: string;
  recordAudio: string;
  voiceNoteReady: string;
  recordingVoice: string;
  playVoiceNote: string;
  stopRecording: string;
  safetyPill: string;
  optionalTag: string;

  // Step 4
  aiAnalyzing: string;
  aiAnalyzingSub: string;
  userAudioReassurance: string;
  playAudio: string;
  pauseAudio: string;
  urgencyLabel: string;
  detectedIssueLabel: string;
  targetHelplineLabel: string;
  recommendedRoutingLabel: string;
  authorityJsonPayload: string;
  inspectAuthorityJson: string;
  closeJsonInspector: string;

  // Step 5
  sendReportSafely: string;
  reportSubmittedSuccess: string;
  yourCaseCode: string;
  listenToCaseCode: string;
  copyCaseCode: string;
  copied: string;
  trackReportStatus: string;
  fileAnotherReport: string;
  villageLocationLabel: string;
  reportedTextLabel: string;
  anonymityGuaranteedNote: string;
  successSubNote: string;
  saveCaseCodeHint: string;

  // Emergency SOS Modal
  emergencyHeaderSub: string;
  emergencyBannerText: string;
  callHelpline: string;
  helplines: Record<string, { name: string; desc: string }>;

  // Case Tracker Modal
  trackerTitle: string;
  trackerSub: string;
  trackerPlaceholder: string;
  search: string;
  statusLabel: string;
  reportedCategoryLabel: string;
  locationLabel: string;
  submittedLabel: string;
  helplineLabel: string;
  recommendedAuthLabel: string;
  noCaseFound: string;
  myLocalReports: string;

  // Buttons
  next: string;
  back: string;
  close: string;
  callNow: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationSet> = {
  hi: {
    appName: 'ACT.ai',
    tagline: 'सुरक्षित और गुप्त अपराध रिपोर्टिंग सहायता',
    listenPage: 'पेज की आवाज़ सुनें',
    stopListening: 'आवाज़ बंद करें',
    emergencySos: 'आपातकालीन सहायता (SOS)',
    prototypeNotice: 'आपकी पहचान 100% सुरक्षित और गुप्त है। नाम व फ़ोन नंबर कभी साझा नहीं किए जाते।',
    prototypePrefix: 'प्रारूप नोटिस:',
    ruralSafeBadge: 'ग्रामीण सुरक्षा',
    dismiss: 'हटाएं',
    ruralSafetyNetwork: 'ACT.ai ग्रामीण सुरक्षा नेटवर्क',
    footerDesc: 'ग्रामीण भारत के नागरिकों के लिए सरल, गुप्त और सुरक्षित अपराध रिपोर्टिंग प्रणाली। आपकी भाषा में आवाज़ द्वारा सहायता और 100% पहचान सुरक्षा।',

    step1Title: 'अपनी शिकायत बोलकर बताएं',
    step1Desc: 'माइक बटन दबाएं और जो हुआ उसे अपनी भाषा में खुलकर बोलें।',
    step2Title: 'घटना कहाँ हुई?',
    step2Desc: 'अपना गाँव, पंचायत या लोकेशन बटन दबाकर चुनें।',
    step3Title: 'सबूत या फोटो जोड़ें (ऐच्छिक)',
    step3Desc: 'यदि कोई फोटो, वीडियो या रिकॉर्डिंग है तो यहाँ जोड़ें।',
    step4Title: 'ACT.ai सहायक जांच',
    step4Desc: 'कृत्रिम बुद्धिमत्ता आपकी रिपोर्ट समझकर सही अधिकारी चुन रही है।',
    step5Title: 'सुरक्षित भेजें और कोड प्राप्त करें',
    step5Desc: 'आपकी रिपोर्ट दर्ज हो गई है। यह आपका गुप्त केस कोड है।',

    progressBar: {
      speak: 'बोलें',
      where: 'स्थान',
      proof: 'सबूत',
      check: 'जांच',
      send: 'भेजें',
      stepAnnouncement: 'चरण',
    },

    listen: 'सुनें',
    securityTitle: 'सुरक्षा और गोपनीयता की गारंटी',
    securityDesc: 'आपका नाम, फोन नंबर और पहचान पूरी तरह गुप्त और सुरक्षित रहेगी।',
    pressToSpeak: 'बोलने के लिए दबाएं',
    listeningNow: 'हम आपकी बात सुन रहे हैं...',
    tapToStop: 'रोकने के लिए दबाएं',
    micSubtitle: 'अपनी भाषा में खुलकर बोलें। हम आपकी बात सुनकर सहायता करेंगे।',
    orTypeText: 'या फिर यहाँ लिखकर बताएं...',
    placeholderText: 'यहाँ लिखें क्या घटना हुई थी...',
    readBack: 'सुनें',
    chooseCategoryTitle: 'घटना का प्रकार चुनें:',
    selectCategoryHint: 'कम से कम एक श्रेणी चुनें',
    selected: 'चयनित',
    categoryLabel: 'श्रेणी',
    categories: {
      theft: 'चोरी व लूटपात',
      violence: 'हिंसा या झगड़ा',
      land_crop: 'ज़मीन या फसल विवाद',
      women_safety: 'महिला सुरक्षा',
      other: 'अन्य शिकायत',
    },
    audioPrompts: {
      pageGuide1: 'नमस्ते! शिकायत दर्ज करने के लिए लाल माइक बटन दबाएं और अपनी समस्या बोलें। आप नीचे दिए गए चित्रों से भी चुन सकते हैं।',
      pageGuide2: 'यह लोकेशन चरण है। नीले बटन से अपनी लोकेशन खोजें या नीचे अपने राज्य और गाँव का नाम चुनें।',
      pageGuide3: 'यदि आपके पास घटना की कोई फोटो, वीडियो या आवाज़ की रिकॉर्डिंग है तो यहाँ जोड़ें। यह अनिवार्य नहीं है।',
      pageGuide4: 'एक्ट एआई आपकी रिपोर्ट की जांच कर रहा है। यहाँ आपको सहायता का प्रकार और हेल्पलाइन नंबर दिखाई देगा।',
      pageGuide5: 'आपकी रिपोर्ट सफलतापूर्वक भेज दी गई है। आपका केस कोड सुरक्षित रखें। इसे सुनने के लिए आवाज़ वाला बटन दबाएं।',
    },

    findMyLocation: 'मेरी लोकेशन खोजें',
    locatingRadar: 'लोकेशन खोजी जा रही है...',
    locationFound: 'लोकेशन मिल गई है',
    pinpointedVillage: 'वर्तमान चिन्हित गाँव:',
    gpsNotSupported: 'आपकी लोकेशन स्वतः नहीं मिल सकी। कृपया नीचे से अपना गाँव चुनें।',
    locationPinpointed: 'लोकेशन मिल गई है। आप नीचे बदलाव भी कर सकते हैं।',
    selectManually: 'या फिर सूची से अपना गाँव चुनें:',
    stateLabel: 'राज्य चुनें',
    districtLabel: 'जिला चुनें',
    villageLabel: 'गाँव / पंचायत चुनें',

    takePhoto: 'फोटो खींचे / अपलोड करें',
    photoDesc: 'घटना या नुकसान की फोटो लें',
    addPhoto: '+ फोटो जोड़ें',
    photoAttached: 'फोटो जुड़ गई है',
    recordVideo: 'वीडियो बनाएं / अपलोड करें',
    videoDesc: 'घटना का छोटा वीडियो',
    addVideo: '+ वीडियो जोड़ें',
    videoAttached: 'वीडियो जुड़ गया है',
    addVoiceNote: 'आवाज़ रिकॉर्ड करके भेजें',
    voiceNoteDesc: 'बोलकर समस्या दर्ज करें',
    recordAudio: '🎙️ आवाज़ रिकॉर्ड करें',
    voiceNoteReady: 'आवाज़ रिकॉर्ड हो गई',
    recordingVoice: 'आवाज़ रिकॉर्ड हो रही है...',
    playVoiceNote: 'अपनी रिकॉर्डिंग सुनें',
    stopRecording: 'रिकॉर्डिंग पूरी करें',
    safetyPill: '✓ आपकी पहचान पूरी तरह गुप्त और सुरक्षित है',
    optionalTag: 'ऐच्छिक (जरूरी नहीं)',

    aiAnalyzing: 'ACT.ai आपकी रिपोर्ट को समझ रहा है...',
    aiAnalyzingSub: 'हम आपकी बात को सही अधिकारी और हेल्पलाइन तक पहुंचा रहे हैं।',
    userAudioReassurance: 'अधिकारी आश्वासन:',
    playAudio: 'आवाज़ सुनें',
    pauseAudio: 'आवाज़ रोकें',
    urgencyLabel: 'गंभीरता स्तर:',
    detectedIssueLabel: 'पहचाना गया मामला:',
    targetHelplineLabel: 'सहायता हेल्पलाइन:',
    recommendedRoutingLabel: 'संबंधित अधिकारी / पंचायत:',
    authorityJsonPayload: 'अधिकारी डेटा (JSON)',
    inspectAuthorityJson: 'अधिकारी डेटा (JSON) देखें',
    closeJsonInspector: 'JSON बंद करें',

    sendReportSafely: 'रिपोर्ट सुरक्षित रूप से भेजें',
    reportSubmittedSuccess: 'आपकी शिकायत सफलतापूर्वक दर्ज हो गई है!',
    yourCaseCode: 'आपका गुप्त केस कोड:',
    listenToCaseCode: 'केस कोड सुनें',
    copyCaseCode: 'कोड कॉपी करें',
    copied: 'कॉपी हो गया!',
    trackReportStatus: 'केस स्थिति जांचें',
    fileAnotherReport: 'नयी शिकायत दर्ज करें',
    villageLocationLabel: 'गाँव व पंचायत स्थान:',
    reportedTextLabel: 'दर्ज विवरण / वॉइस नोट:',
    anonymityGuaranteedNote: '✓ आपका नाम, फोन नंबर और पहचान 100% सुरक्षित और गुप्त है।',
    successSubNote: 'आपकी शिकायत एन्क्रिप्ट करके ग्राम पंचायत और पुलिस डेस्क को भेज दी गई है।',
    saveCaseCodeHint: '💡 ऊपर दिया गया केस कोड संभालकर रखें। इस कोड से आप कभी भी अपनी शिकायत की स्थिति जांच सकते हैं।',

    emergencyHeaderSub: '24 घंटे चलने वाले निःशुल्क आपातकालीन हेल्पलाइन नंबर',
    emergencyBannerText: '⚠️ यदि आप या कोई अन्य तुरंत किसी खतरे में हैं, तो सीधे आपातकालीन सेवा पर कॉल करें।',
    callHelpline: 'कॉल करें',
    helplines: {
      '112': { name: 'राष्ट्रीय आपातकालीन सेवा (112)', desc: 'पुलिस, एम्बुलेंस और अग्निशमन आपातकालीन सहायता' },
      '100': { name: 'राज्य पुलिस कंट्रोल रूम (100)', desc: 'तत्काल पुलिस सहायता के लिए सीधा नंबर' },
      '1091': { name: 'महिला सुरक्षा हेल्पलाइन (1091)', desc: 'महिलाओं की सुरक्षा और सहायता के लिए 24 घंटे हेल्पलाइन' },
      '181': { name: 'महिला संकट निवारण केंद्र (181)', desc: 'घरेलू हिंसा व ग्रामीण महिलाओं की कानूनी सहायता' },
      '1098': { name: 'चाइल्डलाइन बाल सुरक्षा (1098)', desc: 'बच्चों की सुरक्षा व देखरेख के लिए निःशुल्क सेवा' },
      panchayat: { name: 'ग्राम पंचायत सुरक्षा डेस्क (1800-111-222)', desc: 'ज़मीन, फसल और स्थानीय विवादों के लिए ग्राम पंचायत डेस्क' },
    },

    trackerTitle: 'अपनी शिकायत की स्थिति जांचें',
    trackerSub: 'अपनी शिकायत का प्रगति स्तर देखने के लिए गुप्त केस कोड डालें।',
    trackerPlaceholder: 'केस कोड डालें जैसे #ACT-4029',
    search: 'खोजें',
    statusLabel: 'स्थिति:',
    reportedCategoryLabel: 'दर्ज श्रेणी:',
    locationLabel: 'स्थान:',
    submittedLabel: 'दर्ज तारीख:',
    helplineLabel: 'हेल्पलाइन:',
    recommendedAuthLabel: 'संबंधित अधिकारी:',
    noCaseFound: 'इस केस कोड से कोई शिकायत नहीं मिली। कृपया कोड जांचकर पुनः प्रयास करें।',
    myLocalReports: 'मेरी दर्ज की गई शिकायतें (इस ब्राउज़र में):',

    next: 'आगे बढ़ें',
    back: 'पीछे जाएं',
    close: 'बंद करें',
    callNow: 'तुरंत कॉल करें',
  },

  te: {
    appName: 'ACT.ai',
    tagline: 'రహస్య నేర ఫిర్యాదు & సహాయక వ్యవస్థ',
    listenPage: 'వాయిస్ ద్వారా వినండి',
    stopListening: 'వాయిస్ ఆపండి',
    emergencySos: 'అత్యవసర సహాయం (SOS)',
    prototypeNotice: 'మీ గుర్తింపు 100% రహస్యంగా మరియు సురక్షితంగా ఉంటుంది.',
    prototypePrefix: 'నమూనా సూచన:',
    ruralSafeBadge: 'గ్రామీణ రక్షణ',
    dismiss: 'మూసివేయి',
    ruralSafetyNetwork: 'ACT.ai గ్రామీణ రక్షణ నెట్‌వర్క్',
    footerDesc: 'గ్రామీణ పౌరుల కోసం సరళమైన, రహస్యమైన నేర ఫిర్యాదు వ్యవస్థ. మీ మాతృభాషలో వాయిస్ సాయం మరియు పూర్తి గుర్తింపు రక్షణ.',

    step1Title: 'మీ సమస్యను మాట్లాడండి',
    step1Desc: 'మైక్ బటన్ నొక్కి ఏమైందో మీ స్వంత భాషలో చెప్పండి.',
    step2Title: 'సంఘటన ఎక్కడ జరిగింది?',
    step2Desc: 'మీ గ్రామం లేదా పంచాయితీని ఎంచుకోండి.',
    step3Title: 'సాక్ష్యం లేదా ఫోటో జతచేయండి',
    step3Desc: 'ఫోటో, వీడియో లేదా ఆడియో రికార్డింగ్ ఉంటే ఇక్కడ ఉంచండి.',
    step4Title: 'ACT.ai సహాయక పరిశీలన',
    step4Desc: 'కృత్రిమ మేధ మీ ఫిర్యాదును సరైన అధికారులకు పంపుతోంది.',
    step5Title: 'సురక్షితంగా పంపండి & కోడ్ పొందండి',
    step5Desc: 'మీ ఫిర్యాదు నమోదయింది. ఇది మీ రహస్య కేస్ కోడ్.',

    progressBar: {
      speak: 'మాట్లాడండి',
      where: 'ప్రదేశం',
      proof: 'సాక్ష్యం',
      check: 'పరిశీలన',
      send: 'పంపండి',
      stepAnnouncement: 'దశ',
    },

    listen: 'వినండి',
    securityTitle: 'భద్రత మరియు రహస్యం హామీ',
    securityDesc: 'మీ పేరు, ఫోన్ నంబర్ మరియు గుర్తింపు పూర్తిగా రహస్యంగా ఉంచబడుతుంది.',
    pressToSpeak: 'మాట్లాడటానికి నొక్కండి',
    listeningNow: 'మేము వింటున్నాము...',
    tapToStop: 'ఆపడానికి నొక్కండి',
    micSubtitle: 'మీ స్వంత భాషలో స్పష్టంగా మాట్లాడండి. మేము మీకు సహాయం చేస్తాము.',
    orTypeText: 'లేదా ఇక్కడ టైప్ చేయండి...',
    placeholderText: 'ఏమి జరిగిందో ఇక్కడ రాయండి...',
    readBack: 'వినండి',
    chooseCategoryTitle: 'సంఘటన రకాన్ని ఎంచుకోండి:',
    selectCategoryHint: 'కనీసం ఒక రకాన్ని ఎంచుకోండి',
    selected: 'ఎంచుకోబడింది',
    categoryLabel: 'విభాగం',
    categories: {
      theft: 'దొంగతనం / దోపిడీ',
      violence: 'హింస / గొడవ',
      land_crop: 'భూమి / పంట వివాదం',
      women_safety: 'మహిళా రక్షణ',
      other: 'ఇతర ఫిర్యాదు',
    },
    audioPrompts: {
      pageGuide1: 'నమస్కారం! ఫిర్యాదు చేయడానికి ఎరుపు రంగు మైక్ బటన్ నొక్కి మీ సమస్య చెప్పండి.',
      pageGuide2: 'మీ స్థానాన్ని ఎంచుకోవడానికి నీలం బటన్ నొక్కండి లేదా జాబితా నుండి మీ గ్రామాన్ని ఎంచుకోండి.',
      pageGuide3: 'మీ వద్ద ఫోటో లేదా రికార్డింగ్ ఉంటే ఇక్కడ జతచేయండి. ఇది తప్పనిసరి కాదు.',
      pageGuide4: 'మీ ఫిర్యాదు విశ్లేషించబడుతోంది. ఇక్కడ మీకు సహాయక హెల్ప్‌లైన్ నంబర్ కనిపిస్తుంది.',
      pageGuide5: 'మీ ఫిర్యాదు విజయవంతంగా పంపబడింది. మీ కేస్ కోడ్‌ను భద్రంగా ఉంచుకోండి.',
    },

    findMyLocation: 'నా స్థానాన్ని కనుగొను',
    locatingRadar: 'స్థానం కనుగొనబడుతోంది...',
    locationFound: 'స్థానం కనుగొనబడింది',
    pinpointedVillage: 'గుర్తించిన గ్రామం:',
    gpsNotSupported: 'మీ స్థానం ఆటోమేటిక్‌గా లభించలేదు. దయచేసి క్రింది నుండి ఎంచుకోండి.',
    locationPinpointed: 'స్థానం గుర్తించబడింది. మీరు మార్పులు చేయవచ్చు.',
    selectManually: 'లేదా మీ గ్రామాన్ని ఎంచుకోండి:',
    stateLabel: 'రాష్ట్రం',
    districtLabel: 'జిల్లా',
    villageLabel: 'గ్రామం / పంచాయితీ',

    takePhoto: 'ఫోటో తీయండి',
    photoDesc: 'సంఘటన లేదా నష్టం ఫోటో తీయండి',
    addPhoto: '+ ఫోటో జతచేయండి',
    photoAttached: 'ఫోటో జతచేయబడింది',
    recordVideo: 'వీడియో రికార్డ్ చేయండి',
    videoDesc: 'సంఘటన చిన్న వీడియో',
    addVideo: '+ వీడియో జతచేయండి',
    videoAttached: 'వీడియో జతచేయబడింది',
    addVoiceNote: 'వాయిస్ రికార్డింగ్ జతచేయండి',
    voiceNoteDesc: 'ఆడియో రికార్డింగ్ చేయండి',
    recordAudio: '🎙️ ఆడియో రికార్డ్ చేయండి',
    voiceNoteReady: 'ఆడియో రికార్డింగ్ సిద్ధంగా ఉంది',
    recordingVoice: 'రికార్డ్ అవుతోంది...',
    playVoiceNote: 'రికార్డింగ్ వినండి',
    stopRecording: 'ఆపండి',
    safetyPill: '✓ మీ గుర్తింపు పూర్తి రహస్యంగా ఉంటుంది',
    optionalTag: 'ఐచ్ఛికం',

    aiAnalyzing: 'ACT.ai విశ్లేషిస్తోంది...',
    aiAnalyzingSub: 'మేము సరైన అధికారులకు సమాచారం పంపుతున్నాము.',
    userAudioReassurance: 'అధికారుల హామీ:',
    playAudio: 'వాయిస్ వినండి',
    pauseAudio: 'వాయిస్ ఆపండి',
    urgencyLabel: 'తీవ్రత:',
    detectedIssueLabel: 'గుర్తించిన అంశం:',
    targetHelplineLabel: 'హెల్ప్‌లైన్ నంబర్:',
    recommendedRoutingLabel: 'సంబంధిత అధికారి / పంచాయితీ:',
    authorityJsonPayload: 'అధికారుల డేటా (JSON)',
    inspectAuthorityJson: 'అధికారుల డేటా (JSON)',
    closeJsonInspector: 'JSON మూసివేయి',

    sendReportSafely: 'సురక్షితంగా పంపండి',
    reportSubmittedSuccess: 'మీ ఫిర్యాదు నమోదయింది!',
    yourCaseCode: 'మీ రహస్య కేస్ కోడ్:',
    listenToCaseCode: 'కేస్ కోడ్ వినండి',
    copyCaseCode: 'కోడ్ కాపీ చేయండి',
    copied: 'కాపీ అయింది!',
    trackReportStatus: 'స్టేటస్ తనిఖీ చేయండి',
    fileAnotherReport: 'కొత్త ఫిర్యాదు చేయండి',
    villageLocationLabel: 'గ్రామం మరియు పంచాయితీ స్థానం:',
    reportedTextLabel: 'నమోదైన వివరాలు / వాయిస్ నోట్:',
    anonymityGuaranteedNote: '✓ మీ పేరు, ఫోన్ నంబర్ మరియు గుర్తింపు 100% రహస్యంగా ఉంటాయి.',
    successSubNote: 'మీ ఫిర్యాదు గ్రామ పంచాయితీ మరియు పోలీస్ డెస్క్‌కు సురక్షితంగా పంపబడింది.',
    saveCaseCodeHint: '💡 మీ కేస్ కోడ్‌ను భద్రపరుచుకోండి. మీరు ఎప్పుడైనా దీనితో కేస్ స్టేటస్ తనిఖీ చేయవచ్చు.',

    emergencyHeaderSub: '24/7 ఉచిత అత్యవసర హెల్ప్‌లైన్ నంబర్లు',
    emergencyBannerText: '⚠️ మీకు లేదా ఇతరులకు తక్షణ ప్రమాదం ఉంటే, వెంటనే అత్యవసర నంబర్‌కు కాల్ చేయండి.',
    callHelpline: 'కాల్ చేయండి',
    helplines: {
      '112': { name: 'జాతీయ అత్యవసర సహాయం (112)', desc: 'పోలీస్, అంబులెన్స్ మరియు ఫైర్ సర్వీస్' },
      '100': { name: 'రాష్ట్ర పోలీస్ హెల్ప్‌లైన్ (100)', desc: 'తక్షణ పోలీస్ సహాయం కోసం' },
      '1091': { name: 'మహిళా రక్షణ హెల్ప్‌లైన్ (1091)', desc: 'మహిళల రక్షణ కోసం 24/7 అత్యవసర సేవ' },
      '181': { name: 'మహిళా ఆపత్సమయ సహాయం (181)', desc: 'గృహ హింస మరియు మహిళల చట్టపరమైన సహాయం' },
      '1098': { name: 'చైల్డ్‌లైన్ బాలల రక్షణ (1098)', desc: 'పిల్లల రక్షణ మరియు సంక్షేమ సేవలు' },
      panchayat: { name: 'గ్రామ పంచాయితీ రక్షణ డెస్క్ (1800-111-222)', desc: 'గ్రామీణ వివాదాలు మరియు పంచాయితీ సహాయం' },
    },

    trackerTitle: 'ఫిర్యాదు స్టేటస్ తనిఖీ చేయండి',
    trackerSub: 'మీ ఫిర్యాదు పురోగతి తెలుసుకోవడానికి రహస్య కేస్ కోడ్ నమోదు చేయండి.',
    trackerPlaceholder: 'కేస్ కోడ్ నమోదు చేయండి ఉదా: #ACT-4029',
    search: 'వెతకండి',
    statusLabel: 'స్థితి:',
    reportedCategoryLabel: 'నమోదైన విభాగం:',
    locationLabel: 'స్థానం:',
    submittedLabel: 'సమర్పించిన తేదీ:',
    helplineLabel: 'హెల్ప్‌లైన్:',
    recommendedAuthLabel: 'సంబంధిత అధికారి:',
    noCaseFound: 'ఈ కేస్ కోడ్‌తో ఎలాంటి ఫిర్యాదు లభించలేదు. దయచేసి సరైన కోడ్ నమోదు చేయండి.',
    myLocalReports: 'నా మునుపటి ఫిర్యాదులు (ఈ బ్రౌజర్‌లో):',

    next: 'తరువాత',
    back: 'వెనుకకు',
    close: 'మూసివేయి',
    callNow: 'ఇప్పుడే కాల్ చేయండి',
  },

  ta: {
    appName: 'ACT.ai',
    tagline: 'ரகசிய குற்றப் புகார் மற்றும் உதவி அமைப்பு',
    listenPage: 'குரல் வழிகாட்டல்',
    stopListening: 'குரலை நிறுத்து',
    emergencySos: 'அவசர உதவி (SOS)',
    prototypeNotice: 'உங்கள் அடையாளம் 100% பாதுகாப்பானது மற்றும் ரகசியமானது.',
    prototypePrefix: 'மாதிரி அறிவிப்பு:',
    ruralSafeBadge: 'கிராமப்புற பாதுகாப்பு',
    dismiss: 'தவிர்',
    ruralSafetyNetwork: 'ACT.ai கிராமப்புற பாதுகாப்பு வலையமைப்பு',
    footerDesc: 'கிராமப்புற குடிமக்களுக்கான எளிய, ரகசிய குற்றப் புகார் அமைப்பு. உங்கள் தாய்மொழியில் குரல் உதவி மற்றும் 100% ரகசியப் பாதுகாப்பு.',

    step1Title: 'உங்கள் புகாரைப் பேசுங்கள்',
    step1Desc: 'மைக் பொத்தானை அழுத்தி நடந்த சம்பவத்தைப் பேசுங்கள்.',
    step2Title: 'சம்பவம் எங்கு நடந்தது?',
    step2Desc: 'உங்கள் கிராமம் அல்லது பஞ்சாயத்தைத் தேர்ந்தெடுக்கவும்.',
    step3Title: 'ஆதாரம் சேர்க்கவும் (விருப்பம்)',
    step3Desc: 'புகைப்படம் அல்லது குரல் பதிவு இருந்தால் சேர்க்கவும்.',
    step4Title: 'ACT.ai உதவி ஆய்வு',
    step4Desc: 'உங்கள் புகார் சரிபார்க்கப்பட்டு அதிகாரிகளுக்கு அனுப்பப்படுகிறது.',
    step5Title: 'பாதுகாப்பாக அனுப்புங்கள்',
    step5Desc: 'உங்கள் புகார் பதிவானது. இது உங்கள் ரகசிய வழக்கின் குறியீடு.',

    progressBar: {
      speak: 'பேசுங்கள்',
      where: 'இடம்',
      proof: 'ஆதாரம்',
      check: 'ஆய்வு',
      send: 'அனுப்பு',
      stepAnnouncement: 'படி',
    },

    listen: 'கேளுங்கள்',
    securityTitle: 'பாதுகாப்பு மற்றும் ரகசியத்தன்மை உத்தரவாதம்',
    securityDesc: 'உங்கள் பெயர் மற்றும் தொலைபேசி எண் முழுமையாக ரகசியமாக வைக்கப்படும்.',
    pressToSpeak: 'பேச அழுத்தவும்',
    listeningNow: 'கேட்கிறோம்...',
    tapToStop: 'நிறுத்த அழுத்தவும்',
    micSubtitle: 'உங்கள் தாய்மொழியில் தெளிவாகப் பேசுங்கள். நாங்கள் உதவுவோம்.',
    orTypeText: 'அல்லது இங்கு தட்டச்சு செய்யவும்...',
    placeholderText: 'நடந்ததை இங்கு எழுதவும்...',
    readBack: 'கேளுங்கள்',
    chooseCategoryTitle: 'சம்பவ வகையைத் தேர்ந்தெடுக்கவும்:',
    selectCategoryHint: 'குறைந்தது ஒரு வகையைத் தேர்ந்தெடுக்கவும்',
    selected: 'தேர்ந்தெடுக்கப்பட்டது',
    categoryLabel: 'வகை',
    categories: {
      theft: 'திருட்டு / கொள்ளை',
      violence: 'வன்முறை / சண்டை',
      land_crop: 'நிலம் / பயிர் தகராறு',
      women_safety: 'பெண்கள் பாதுகாப்பு',
      other: 'இதர புகார்',
    },
    audioPrompts: {
      pageGuide1: 'வணக்கம்! புகார் செய்ய சிவப்பு மைக் பொத்தானை அழுத்திப் பேசுங்கள்.',
      pageGuide2: 'உங்கள் இருப்பிடத்தைக் கண்டறிய நீல பொத்தானை அழுத்தவும்.',
      pageGuide3: 'புகைப்படம் அல்லது வீடியோ இருந்தால் இங்கு சேர்க்கவும்.',
      pageGuide4: 'உங்கள் புகார் ஆய்வு செய்யப்படுகிறது.',
      pageGuide5: 'உங்கள் புகார் வெற்றிகரமாக அனுப்பப்பட்டது. வழக்கின் குறியீட்டைச் சேமிக்கவும்.',
    },

    findMyLocation: 'எனது இடத்தைக் கண்டறி',
    locatingRadar: 'கண்டறியப்படுகிறது...',
    locationFound: 'இடம் கண்டறியப்பட்டது',
    pinpointedVillage: 'கண்டறியப்பட்ட கிராமம்:',
    gpsNotSupported: 'இருப்பிடம் தானாகக் கிடைக்கவில்லை. கீழே தேர்ந்தெடுக்கவும்.',
    locationPinpointed: 'இடம் கண்டறியப்பட்டது. நீங்கள் மாற்றங்களைச் செய்யலாம்.',
    selectManually: 'அல்லது உங்கள் கிராமத்தைத் தேர்ந்தெடுக்கவும்:',
    stateLabel: 'மாநிலம்',
    districtLabel: 'மாவட்டம்',
    villageLabel: 'கிராமம் / பஞ்சாயத்து',

    takePhoto: 'படம் எடுக்கவும்',
    photoDesc: 'சம்பவம் அல்லது சேதத்தின் படம்',
    addPhoto: '+ படம் சேர்க்க',
    photoAttached: 'படம் சேர்க்கப்பட்டது',
    recordVideo: 'வீடியோ பதிவு செய்ய',
    videoDesc: 'சம்பவத்தின் குறுகிய வீடியோ',
    addVideo: '+ வீடியோ சேர்க்க',
    videoAttached: 'வீடியோ சேர்க்கப்பட்டது',
    addVoiceNote: 'குரல் பதிவு சேர்க்க',
    voiceNoteDesc: 'குரல் வழிப் பதிவு',
    recordAudio: '🎙️ குரல் பதிவு செய்ய',
    voiceNoteReady: 'குரல் பதிவு தயார்',
    recordingVoice: 'பதிவாகிறது...',
    playVoiceNote: 'பதிவைக் கேட்க',
    stopRecording: 'நிறுத்து',
    safetyPill: '✓ உங்கள் ரகசியம் 100% பாதுகாப்பானது',
    optionalTag: 'விருப்பம்',

    aiAnalyzing: 'ACT.ai ஆய்வு செய்கிறது...',
    aiAnalyzingSub: 'சரியான அதிகாரிகளுக்குத் தகவல் அனுப்பப்படுகிறது.',
    userAudioReassurance: 'அதிகாரிகளின் உறுதிமொழி:',
    playAudio: 'குரலைக் கேட்க',
    pauseAudio: 'குரலை நிறுத்த',
    urgencyLabel: 'அவசர நிலை:',
    detectedIssueLabel: 'கண்டறியப்பட்ட பிரச்சனை:',
    targetHelplineLabel: 'உதவி எண்:',
    recommendedRoutingLabel: 'பொறுப்பு அதிகாரி:',
    authorityJsonPayload: 'அதிகாரி தரவு (JSON)',
    inspectAuthorityJson: 'அதிகாரி தரவு (JSON)',
    closeJsonInspector: 'JSON மூடு',

    sendReportSafely: 'பாதுகாப்பாக அனுப்புங்கள்',
    reportSubmittedSuccess: 'உங்கள் புகார் பதிவானது!',
    yourCaseCode: 'உங்கள் ரகசிய வழக்கின் குறியீடு:',
    listenToCaseCode: 'குறியீட்டைக் கேட்க',
    copyCaseCode: 'நகலெடு',
    copied: 'நகலெடுக்கப்பட்டது!',
    trackReportStatus: 'நிலையைக் காண்க',
    fileAnotherReport: 'புதிய புகார் செய்க',
    villageLocationLabel: 'கிராமம் மற்றும் பஞ்சாயத்து இடம்:',
    reportedTextLabel: 'பதிவு செய்யப்பட்ட விவரங்கள்:',
    anonymityGuaranteedNote: '✓ உங்கள் பெயர் மற்றும் தொலைபேசி எண் 100% ரகசியமாக வைக்கப்படும்.',
    successSubNote: 'உங்கள் புகார் கிராம பஞ்சாயத்து மற்றும் காவல் மையத்திற்கு அனுப்பப்பட்டது.',
    saveCaseCodeHint: '💡 வழக்கின் குறியீட்டைச் சேமிக்கவும். நிலையை அறிய இக்குறியீட்டைப் பயன்படுத்தலாம்.',

    emergencyHeaderSub: '24/7 இலவச அவசர உதவி எண்கள்',
    emergencyBannerText: '⚠️ உங்களுக்கு அவசர ஆபத்து இருந்தால், உடனடியாக அவசர எண்ணை அழைக்கவும்.',
    callHelpline: 'அழைக்கவும்',
    helplines: {
      '112': { name: 'தேசிய அவசர உதவி (112)', desc: 'காவல்துறை, ஆம்புலன்ஸ் மற்றும் தீயணைப்பு சேவை' },
      '100': { name: 'மாநில காவல் உதவி எண் (100)', desc: 'உடனடி காவல் உதவிக்கு' },
      '1091': { name: 'பெண்கள் பாதுகாப்பு எண் (1091)', desc: 'பெண்களுக்கான 24/7 அவசர சேவை' },
      '181': { name: 'பெண்கள் அவசர மையம் (181)', desc: 'குடும்ப வன்முறை மற்றும் சட்ட உதவி' },
      '1098': { name: 'குழந்தைகள் உதவி எண் (1098)', desc: 'குழந்தைகள் பாதுகாப்பு சேவை' },
      panchayat: { name: 'கிராம பஞ்சாயத்து உதவி மையம் (1800-111-222)', desc: 'கிராமப்புற பிரச்சனைகள் மற்றும் உதவி மையம்' },
    },

    trackerTitle: 'புகார் நிலையைக் காண்க',
    trackerSub: 'உங்கள் புகாரின் நிலையைக் அறிய ரகசிய வழக்கின் குறியீட்டை உள்ளிடவும்.',
    trackerPlaceholder: 'வழக்கின் குறியீடு எ.கா. #ACT-4029',
    search: 'தேடு',
    statusLabel: 'நிலை:',
    reportedCategoryLabel: 'பதிவான வகை:',
    locationLabel: 'இடம்:',
    submittedLabel: 'தேதி:',
    helplineLabel: 'உதவி எண்:',
    recommendedAuthLabel: 'பொறுப்பு அதிகாரி:',
    noCaseFound: 'இந்த குறியீட்டில் எந்த புகாரும் இல்லை. குறியீட்டை சரிபார்க்கவும்.',
    myLocalReports: 'எனது புகார்கள் (இந்த உலாவியில்):',

    next: 'அடுத்து',
    back: 'பின்னால்',
    close: 'மூடு',
    callNow: 'இப்போதே அழைக்கவும்',
  },

  mr: {
    appName: 'ACT.ai',
    tagline: 'गुप्त गुन्हे नोंदणी व मदत प्रणाली',
    listenPage: 'आवाज ऐका',
    stopListening: 'आवाज बंद करा',
    emergencySos: 'आणीबाणी मदत (SOS)',
    prototypeNotice: 'तुमची ओळख १००% गुप्त आणि सुरक्षित आहे.',
    prototypePrefix: 'प्रारूप सूचना:',
    ruralSafeBadge: 'ग्रामीण सुरक्षा',
    dismiss: 'काढा',
    ruralSafetyNetwork: 'ACT.ai ग्रामीण सुरक्षा नेटवर्क',
    footerDesc: 'ग्रामीण नागरिकांसाठी सोपी, गुप्त गुन्हे नोंदणी प्रणाली. तुमच्या भाषेत आवाज मदत आणि १००% ओळख सुरक्षा.',

    step1Title: 'तुमची तक्रार बोलून सांगा',
    step1Desc: 'माईक बटण दाबा आणि काय घडले ते तुमच्या भाषेत सांगा.',
    step2Title: 'घटना कोठे घडली?',
    step2Desc: 'तुमचे गाव किंवा ग्रामपंचायत निवडा.',
    step3Title: 'पुरावा किंवा फोटो जोडा (पर्यायी)',
    step3Desc: 'फोटो, व्हिडिओ किंवा ऑडिओ रेकॉर्डिंग असल्यास जोडा.',
    step4Title: 'ACT.ai सहाय्यक तपासणी',
    step4Desc: 'आपली तक्रार योग्य अधिकाऱ्यांपर्यंत पोहोचवली जात आहे.',
    step5Title: 'सुरक्षित पाठवा आणि कोड मिळवा',
    step5Desc: 'तुमची तक्रार नोंदवली गेली आहे. हा तुमचा गुप्त केस कोड आहे.',

    progressBar: {
      speak: 'बोला',
      where: 'ठिकाण',
      proof: 'पुरावा',
      check: 'तपास',
      send: 'पाठवा',
      stepAnnouncement: 'टप्पा',
    },

    listen: 'ऐका',
    securityTitle: 'सुरक्षा आणि गोपनीयतेची हमी',
    securityDesc: 'तुमचे नाव, फोन नंबर आणि ओळख पूर्णपणे गुप्त राहील.',
    pressToSpeak: 'बोलण्यासाठी दाबा',
    listeningNow: 'आम्ही ऐकत आहोत...',
    tapToStop: 'थांबवण्यासाठी दाबा',
    micSubtitle: 'तुमच्या भाषेत स्पष्ट बोला. आम्ही मदत करू.',
    orTypeText: 'किंवा येथे लिहून सांगा...',
    placeholderText: 'काय घडले ते येथे लिहा...',
    readBack: 'ऐका',
    chooseCategoryTitle: 'घटना प्रकार निवडा:',
    selectCategoryHint: 'किमान एक प्रकार निवडा',
    selected: 'निवडले',
    categoryLabel: 'प्रकार',
    categories: {
      theft: 'चोरी व दरोडा',
      violence: 'हिंसाचार किंवा भांडण',
      land_crop: 'जमीन किंवा पीक वाद',
      women_safety: 'महिला सुरक्षा',
      other: 'इतर तक्रार',
    },
    audioPrompts: {
      pageGuide1: 'नमस्कार! तक्रार नोंदवण्यासाठी लाल माईक बटण दाबा आणि आपली समस्या सांगा.',
      pageGuide2: 'तुमचे ठिकाण शोधण्यासाठी निळे बटण दाबा किंवा यादीतून गाव निवडा.',
      pageGuide3: 'फोटो किंवा रेकॉर्डिंग असल्यास येथे जोडा.',
      pageGuide4: 'तुमच्या तक्रारीची तपासणी सुरू आहे.',
      pageGuide5: 'तक्रार यशस्वीरीत्या पाठवली गेली आहे. केस कोड सुरक्षित ठेवा.',
    },

    findMyLocation: 'माझे ठिकाण शोधा',
    locatingRadar: 'ठिकाण शोधत आहे...',
    locationFound: 'ठिकाण सापडले',
    pinpointedVillage: 'निश्चित केलेले गाव:',
    gpsNotSupported: 'तुमचे ठिकाण आपोआप सापडले नाही. कृपया खालील यादीतून निवडा.',
    locationPinpointed: 'ठिकाण सापडले आहे. तुम्ही बदल करू शकता.',
    selectManually: 'किंवा यादीतून गाव निवडा:',
    stateLabel: 'राज्य',
    districtLabel: 'जिल्हा',
    villageLabel: 'गाव / ग्रामपंचायत',

    takePhoto: 'फोटो काढा',
    photoDesc: 'घटना किंवा नुकसानीचा फोटो',
    addPhoto: '+ फोटो जोडा',
    photoAttached: 'फोटो जोडला गेला',
    recordVideo: 'व्हिडिओ रेकॉर्ड करा',
    videoDesc: 'घटनास्थळाचा लहान व्हिडिओ',
    addVideo: '+ व्हिडिओ जोडा',
    videoAttached: 'व्हिडिओ जोडला गेला',
    addVoiceNote: 'आवाज रेकॉर्डिंग जोडा',
    voiceNoteDesc: 'बोलून समस्या नोंदवा',
    recordAudio: '🎙️ आवाज रेकॉर्ड करा',
    voiceNoteReady: 'रेकॉर्डिंग तयार आहे',
    recordingVoice: 'रेकॉर्डिंग सुरू आहे...',
    playVoiceNote: 'रेकॉर्डिंग ऐका',
    stopRecording: 'थांबवा',
    safetyPill: '✓ तुमची ओळख पूर्णपणे गुप्त आहे',
    optionalTag: 'पर्यायी',

    aiAnalyzing: 'ACT.ai विश्लेषण करत आहे...',
    aiAnalyzingSub: 'योग्य अधिकाऱ्यांशी संपर्क साधला जात आहे.',
    userAudioReassurance: 'अधिकाऱ्यांचे आश्वासन:',
    playAudio: 'आवाज ऐका',
    pauseAudio: 'आवाज थांबवा',
    urgencyLabel: 'गंभीरता:',
    detectedIssueLabel: 'ओळखलेला विषय:',
    targetHelplineLabel: 'मदत हेल्पलाइन:',
    recommendedRoutingLabel: 'संबंधित अधिकारी / पंचायत:',
    authorityJsonPayload: 'अधिकारी डेटा (JSON)',
    inspectAuthorityJson: 'अधिकारी डेटा (JSON)',
    closeJsonInspector: 'JSON बंद करा',

    sendReportSafely: 'सुरक्षित पाठवा',
    reportSubmittedSuccess: 'तक्रार यशस्वीरीत्या नोंदवली!',
    yourCaseCode: 'तुमचा गुप्त केस कोड:',
    listenToCaseCode: 'केस कोड ऐका',
    copyCaseCode: 'कॉपी करा',
    copied: 'कॉपी झाले!',
    trackReportStatus: 'स्थिती तपासा',
    fileAnotherReport: 'नवीन तक्रार नोंदवा',
    villageLocationLabel: 'गाव व पंचायत स्थान:',
    reportedTextLabel: 'नोंदवलेली माहिती / व्हॉइस नोट:',
    anonymityGuaranteedNote: '✓ तुमचे नाव आणि फोन नंबर १००% गुप्त व सुरक्षित आहे.',
    successSubNote: 'तुमची तक्रार ग्रामपंचायत आणि पोलिस स्टेशनकडे पाठवली गेली आहे.',
    saveCaseCodeHint: '💡 हा केस कोड जतन करा. याने तुम्ही तक्रारीची स्थिती तपासू शकता.',

    emergencyHeaderSub: '२४/७ मोफत आणीबाणी हेल्पलाइन नंबर',
    emergencyBannerText: '⚠️ तुम्हाला तातडीचा धोका असल्यास, त्वरित आणीबाणी नंबरवर कॉल करा.',
    callHelpline: 'कॉल करा',
    helplines: {
      '112': { name: 'राष्ट्रीय आणीबाणी सेवा (112)', desc: 'पोलिस, रुग्णवाहिका व अग्निशामक दल' },
      '100': { name: 'राज्य पोलिस कंट्रोल रूम (100)', desc: 'तातडीच्या पोलिस मदतीसाठी' },
      '1091': { name: 'महिला सुरक्षा हेल्पलाइन (1091)', desc: 'महिलांसाठी २४/७ आणीबाणी सेवा' },
      '181': { name: 'महिला मदत केंद्र (181)', desc: 'कौटुंबिक हिंसाचार व कायदेशीर मदत' },
      '1098': { name: 'चाइल्डलाइन बाल सुरक्षा (1098)', desc: 'बाल संरक्षण व मदतीसाठी सेवा' },
      panchayat: { name: 'ग्रामपंचायत सुरक्षा डेस्क (1800-111-222)', desc: 'स्थानिक वाद व ग्रामपंचायत मदत' },
    },

    trackerTitle: 'तक्रारीची स्थिती तपासा',
    trackerSub: 'तक्रारीची प्रगती पाहण्यासाठी गुप्त केस कोड टाका.',
    trackerPlaceholder: 'केस कोड टाका जसे #ACT-4029',
    search: 'शोधा',
    statusLabel: 'स्थिती:',
    reportedCategoryLabel: 'नोंदवलेला प्रकार:',
    locationLabel: 'ठिकाण:',
    submittedLabel: 'तारीख:',
    helplineLabel: 'हेल्पलाइन:',
    recommendedAuthLabel: 'संबंधित अधिकारी:',
    noCaseFound: 'या कोडवर कोणतीही तक्रार सापडली नाही. कोड तपासून पुन्हा प्रयत्न करा.',
    myLocalReports: 'माझ्या नोंदवलेल्या तक्रारी:',

    next: 'पुढे जा',
    back: 'मागे जा',
    close: 'बंद करा',
    callNow: 'आत्ताच कॉल करा',
  },

  bn: {
    appName: 'ACT.ai',
    tagline: 'গোপন অপরাধ রিপোর্টিং ও সহায়তা ব্যবস্থা',
    listenPage: 'ভয়েস নির্দেশনা শুনুন',
    stopListening: 'ভয়েস বন্ধ করুন',
    emergencySos: 'জরুরি সহায়তা (SOS)',
    prototypeNotice: 'আপনার পরিচয় ১০০% নিরাপদ ও গোপন রাখা হয়।',
    prototypePrefix: 'প্রোটোটাইপ নোটিশ:',
    ruralSafeBadge: 'গ্রামীণ সুরক্ষা',
    dismiss: 'বাতিল',
    ruralSafetyNetwork: 'ACT.ai গ্রামীণ সুরক্ষা নেটওয়ার্ক',
    footerDesc: 'গ্রামীণ নাগরিকদের জন্য সহজ, গোপন অপরাধ রিপোর্টিং ব্যবস্থা। নিজস্ব ভাষায় ভয়েস সহায়তা এবং ১০০% পরিচয় সুরক্ষা।',

    step1Title: 'আপনার অভিযোগ মুখে বলুন',
    step1Desc: 'মাইক বোতাম টিপে কি ঘটেছে নিজের ভাষায় বলুন।',
    step2Title: 'ঘটনাটি কোথায় ঘটেছে?',
    step2Desc: 'আপনার গ্রাম বা পঞ্চায়েত নির্বাচন করুন।',
    step3Title: 'প্রমাণ বা ছবি যুক্ত করুন (ঐচ্ছিক)',
    step3Desc: 'ছবি, ভিডিও বা ভয়েস রেকর্ড থাকলে যোগ করুন।',
    step4Title: 'ACT.ai সহকারী বিশ্লেষণ',
    step4Desc: 'কৃত্রিম বুদ্ধিমত্তা আপনার রিপোর্ট যাচাই করে উপযুক্ত সংস্থাকে পাঠাচ্ছে।',
    step5Title: 'নিরাপদে পাঠান ও কোড পান',
    step5Desc: 'আপনার রিপোর্ট জমা হয়েছে। এটি আপনার গোপন কেস কোড।',

    progressBar: {
      speak: 'বলুন',
      where: 'স্থান',
      proof: 'প্রমাণ',
      check: 'যাচাই',
      send: 'পাঠান',
      stepAnnouncement: 'ধাপ',
    },

    listen: 'শুনুন',
    securityTitle: 'সুরক্ষা ও গোপনীয়তার গ্যারান্টি',
    securityDesc: 'আপনার নাম ও ফোন নম্বর সম্পূর্ণ গোপন ও সুরক্ষিত থাকবে।',
    pressToSpeak: 'বলতে প্রেস করুন',
    listeningNow: 'আমরা শুনছি...',
    tapToStop: 'থামতে প্রেস করুন',
    micSubtitle: 'আপনার ভাষায় স্পষ্ট বলুন। আমরা সাহায্য করব।',
    orTypeText: 'অথবা এখানে লিখে জানান...',
    placeholderText: 'কি ঘটেছে এখানে লিখুন...',
    readBack: 'শুনুন',
    chooseCategoryTitle: 'ঘটনার ধরন বেছে নিন:',
    selectCategoryHint: 'কমপক্ষে একটি ধরন নির্বাচন করুন',
    selected: 'নির্বাচিত',
    categoryLabel: 'ধরন',
    categories: {
      theft: 'চুরি ও ডাকাতি',
      violence: 'সহিংসতা বা ঝামেলা',
      land_crop: 'জমি বা ফসলের বিতর্ক',
      women_safety: 'নারী সুরক্ষা',
      other: 'অন্যান্য অভিযোগ',
    },
    audioPrompts: {
      pageGuide1: 'নমস্কার! অভিযোগ জানাতে লাল মাইক বোতামটি চাপুন এবং কথা বলুন।',
      pageGuide2: 'আপনার অবস্থান জানতে নীল বোতাম চাপুন বা তালিকা থেকে গ্রাম বেছে নিন।',
      pageGuide3: 'কোনো ছবি বা ভিডিও থাকলে এখানে যোগ করুন।',
      pageGuide4: 'আপনার রিপোর্ট বিশ্লেষণ করা হচ্ছে।',
      pageGuide5: 'আপনার রিপোর্ট সফলভাবে পাঠানো হয়েছে। কেস কোডটি লিখে রাখুন।',
    },

    findMyLocation: 'আমার অবস্থান খুঁজুন',
    locatingRadar: 'অবস্থান খোঁজা হচ্ছে...',
    locationFound: 'অবস্থান পাওয়া গেছে',
    pinpointedVillage: 'চিহ্নিত গ্রাম:',
    gpsNotSupported: 'স্বয়ংক্রিয় অবস্থান পাওয়া যায়নি। তালিকা থেকে গ্রাম নির্বাচন করুন।',
    locationPinpointed: 'অবস্থান পাওয়া গেছে। আপনি সংশোধন করতে পারেন।',
    selectManually: 'অথবা তালিকা থেকে আপনার গ্রাম বেছে নিন:',
    stateLabel: 'রাজ্য',
    districtLabel: 'জেলা',
    villageLabel: 'গ্রাম / পঞ্চায়েত',

    takePhoto: 'ছবি তুলুন',
    photoDesc: 'ঘটনা বা ক্ষতির ছবি',
    addPhoto: '+ ছবি যোগ করুন',
    photoAttached: 'ছবি যুক্ত হয়েছে',
    recordVideo: 'ভিডিও রেকর্ড করুন',
    videoDesc: 'ঘটনাস্থলের ছোট ভিডিও',
    addVideo: '+ ভিডিও যোগ করুন',
    videoAttached: 'ভিডিও যুক্ত হয়েছে',
    addVoiceNote: 'ভয়েস নোট যোগ করুন',
    voiceNoteDesc: 'মুখে বলে বর্ণনা দিন',
    recordAudio: '🎙️ ভয়েস রেকর্ড করুন',
    voiceNoteReady: 'ভয়েস প্রস্তুত',
    recordingVoice: 'রেকর্ড হচ্ছে...',
    playVoiceNote: 'রেকর্ডিং শুনুন',
    stopRecording: 'থামান',
    safetyPill: '✓ আপনার পরিচয় ১০০% গোপন থাকবে',
    optionalTag: 'ঐচ্ছিক',

    aiAnalyzing: 'ACT.ai বিশ্লেষণ করছে...',
    aiAnalyzingSub: 'উপযুক্ত কর্তৃপক্ষের কাছে তথ্য পাঠানো হচ্ছে।',
    userAudioReassurance: 'কর্তৃপক্ষের আশ্বাস:',
    playAudio: 'ভয়েস শুনুন',
    pauseAudio: 'ভয়েস থামান',
    urgencyLabel: 'জরুরি মাত্রা:',
    detectedIssueLabel: 'শনাক্তকৃত বিষয়:',
    targetHelplineLabel: 'সহায়তা হেল্পলাইন:',
    recommendedRoutingLabel: 'দায়িত্বপ্রাপ্ত কর্মকর্তা:',
    authorityJsonPayload: 'কর্তৃপক্ষের ডেটা (JSON)',
    inspectAuthorityJson: 'কর্তৃপক্ষের ডেটা (JSON)',
    closeJsonInspector: 'JSON বন্ধ করুন',

    sendReportSafely: 'নিরাপদে পাঠান',
    reportSubmittedSuccess: 'আপনার অভিযোগ জমা হয়েছে!',
    yourCaseCode: 'আপনার গোপন কেস কোড:',
    listenToCaseCode: 'কেস কোড শুনুন',
    copyCaseCode: 'কপি করুন',
    copied: 'কপি হয়েছে!',
    trackReportStatus: 'স্ট্যাটাস চেক করুন',
    fileAnotherReport: 'নতুন অভিযোগ জানান',
    villageLocationLabel: 'গ্রাম ও পঞ্চায়েত স্থান:',
    reportedTextLabel: 'নথিভুক্ত তথ্য / ভয়েস নোট:',
    anonymityGuaranteedNote: '✓ আপনার নাম ও ফোন নম্বর ১০০% গোপন ও নিরাপদ।',
    successSubNote: 'আপনার অভিযোগ গ্রাম পঞ্চায়েত ও পুলিশ ডেস্কে পাঠানো হয়েছে।',
    saveCaseCodeHint: '💡 কেস কোডটি লিখে রাখুন। পরবর্তীতে এটি দিয়ে অভিযোগের স্ট্যাটাস জানা যাবে।',

    emergencyHeaderSub: '২৪/৭ নিখরচায় জরুরি হেল্পলাইন নম্বর',
    emergencyBannerText: '⚠️ আপনি বা অন্য কেউ বিপদে থাকলে, অবিলম্বে জরুরি নম্বরে কল করুন।',
    callHelpline: 'কল করুন',
    helplines: {
      '112': { name: 'জাতীয় জরুরি সেবা (112)', desc: 'পুলিশ, অ্যাম্বুলেন্স ও ফায়ার সার্ভিস' },
      '100': { name: 'রাজ্য পুলিশ হেল্পলাইন (100)', desc: 'জরুরি পুলিশ সহায়তার জন্য' },
      '1091': { name: 'নারী সুরক্ষা হেল্পলাইন (1091)', desc: 'নারীদের জন্য ২৪/৭ জরুরি সেবা' },
      '181': { name: 'নারী সহায়তা কেন্দ্র (181)', desc: 'গার্হস্থ্য সহিংসতা ও আইনি সহায়তা' },
      '1098': { name: 'চাইল্ডলাইন শিশু সুরক্ষা (1098)', desc: 'শিশুদের সুরক্ষা ও সাহায্য সেবা' },
      panchayat: { name: 'গ্রাম পঞ্চায়েত নিরাপত্তা ডেস্ক (1800-111-222)', desc: 'স্থানীয় বিবাদ ও পঞ্চায়েত সহায়তা' },
    },

    trackerTitle: 'অভিযোগের স্ট্যাটাস চেক করুন',
    trackerSub: 'অভিযোগের অগ্রগতি জানতে আপনার গোপন কেস কোড দিন।',
    trackerPlaceholder: 'কেস কোড দিন যেমন #ACT-4029',
    search: 'খুঁজুন',
    statusLabel: 'স্ট্যাটাস:',
    reportedCategoryLabel: 'নথিভুক্ত ধরন:',
    locationLabel: 'স্থান:',
    submittedLabel: 'তারিখ:',
    helplineLabel: 'হেল্পলাইন:',
    recommendedAuthLabel: 'দায়িত্বপ্রাপ্ত কর্মকর্তা:',
    noCaseFound: 'এই কোডে কোনো অভিযোগ পাওয়া যায়নি। সঠিক কোড দিয়ে চেষ্টা করুন।',
    myLocalReports: 'আমার জমা দেওয়া অভিযোগসমূহ:',

    next: 'পরবর্তী',
    back: 'পেছনে',
    close: 'বন্ধ করুন',
    callNow: 'এখনই কল করুন',
  },

  en: {
    appName: 'ACT.ai',
    tagline: 'Anonymous Crime Reporting & Assistance Tool',
    listenPage: 'Listen to Page Guidance',
    stopListening: 'Stop Voice Guidance',
    emergencySos: 'Emergency SOS',
    prototypeNotice: 'Your identity is 100% anonymous & safe. Name and phone number are never stored or shared.',
    prototypePrefix: 'PROTOTYPE NOTICE:',
    ruralSafeBadge: 'Rural Safe',
    dismiss: 'Dismiss',
    ruralSafetyNetwork: 'ACT.ai Rural Safety Network',
    footerDesc: 'Designed for compassionate, hyper-simplified rural anonymous reporting. Voice-first assistance in regional languages. Zero technical clutter. 100% identity protection.',

    step1Title: 'Speak Your Report',
    step1Desc: 'Press the microphone button and speak in your local language about what happened.',
    step2Title: 'Where Did It Happen?',
    step2Desc: 'Tap to locate automatically or choose your Village & Gram Panchayat below.',
    step3Title: 'Add Proof (Optional)',
    step3Desc: 'Attach a photo, record a short video, or record a voice note if available.',
    step4Title: 'ACT.ai Assistant Analysis',
    step4Desc: 'AI is analyzing your report to determine urgency and route to local authorities.',
    step5Title: 'Send Safely & Get Case Code',
    step5Desc: 'Your report is safe and queued. Keep your confidential Case Code for tracking.',

    progressBar: {
      speak: 'Speak',
      where: 'Where',
      proof: 'Proof',
      check: 'Check',
      send: 'Send',
      stepAnnouncement: 'Step',
    },

    listen: 'Listen',
    securityTitle: 'Security & Anonymity Guaranteed',
    securityDesc: 'Your name, phone number, and identity are strictly confidential and never shared.',
    pressToSpeak: 'Press to Speak',
    listeningNow: 'Listening to your report...',
    tapToStop: 'Tap to Stop Recording',
    micSubtitle: 'Speak clearly in your local language. We will listen and keep you safe.',
    orTypeText: 'Or type what happened below...',
    placeholderText: 'Describe the incident in plain text here...',
    readBack: 'Read Back',
    chooseCategoryTitle: 'Choose Category:',
    selectCategoryHint: 'Select at least one category',
    selected: 'Selected',
    categoryLabel: 'Category',
    categories: {
      theft: 'Theft / Robbery',
      violence: 'Violence / Assault',
      land_crop: 'Land / Crop Dispute',
      women_safety: 'Women Safety',
      other: 'Other Incident',
    },
    audioPrompts: {
      pageGuide1: 'Welcome to ACT.ai. Press the big red microphone to speak your report in your language. You can also select a category icon below.',
      pageGuide2: 'Location step: Tap the blue button to automatically detect your location, or select your State, District, and Village from the dropdowns.',
      pageGuide3: 'Proof step: Optionally attach a photo, video, or voice recording. Your identity remains completely private.',
      pageGuide4: 'ACT.ai is analyzing your report details. Review the urgency and helpline details.',
      pageGuide5: 'Your report has been safely submitted. Listen to or copy your private case code.',
    },

    findMyLocation: 'Tap to Find My Location',
    locatingRadar: 'Locating via Radar...',
    locationFound: 'Location Pinpoint Found',
    pinpointedVillage: 'Current Pinpointed Village:',
    gpsNotSupported: 'Geolocation is not supported by your browser. Please select your village below.',
    locationPinpointed: 'Location pinpointed. You can also adjust below.',
    selectManually: 'Or select manually from list:',
    stateLabel: 'Select State',
    districtLabel: 'Select District',
    villageLabel: 'Select Village / Gram Panchayat',

    takePhoto: 'Take Photo / Upload',
    photoDesc: 'Capture incident or damage',
    addPhoto: '+ Add Photo',
    photoAttached: 'Photo Attached',
    recordVideo: 'Record Video / Upload',
    videoDesc: 'Short clip of scene',
    addVideo: '+ Add Video',
    videoAttached: 'Video Attached',
    addVoiceNote: 'Add Voice Note',
    voiceNoteDesc: 'Record audio description',
    recordAudio: '🎙️ Record Audio',
    voiceNoteReady: 'Voice Note Ready',
    recordingVoice: 'Recording Voice Note...',
    playVoiceNote: 'Play Voice Note',
    stopRecording: 'Stop Recording',
    safetyPill: '✓ Your identity is 100% hidden and safe',
    optionalTag: 'Optional',

    aiAnalyzing: 'ACT.ai is carefully analyzing your report...',
    aiAnalyzingSub: 'Extracting key details and routing to the right local helpline and Panchayat office.',
    userAudioReassurance: 'Reassurance Message:',
    playAudio: 'Play Audio',
    pauseAudio: 'Pause Audio',
    urgencyLabel: 'Urgency Level:',
    detectedIssueLabel: 'Detected Issue:',
    targetHelplineLabel: 'Target Helpline:',
    recommendedRoutingLabel: 'Routing Authority:',
    authorityJsonPayload: 'Backend Dual Output Payload (Authority JSON)',
    inspectAuthorityJson: 'View Authority Data (JSON)',
    closeJsonInspector: 'Close JSON Inspector',

    sendReportSafely: 'SEND REPORT SAFELY',
    reportSubmittedSuccess: 'Your Report Has Been Submitted Safely!',
    yourCaseCode: 'Your Confidential Case Code:',
    listenToCaseCode: 'Listen to Case Code',
    copyCaseCode: 'Copy Code',
    copied: 'Code Copied!',
    trackReportStatus: 'Track Report Status',
    fileAnotherReport: 'File Another Report',
    villageLocationLabel: 'Village & Panchayat Location:',
    reportedTextLabel: 'Reported Details / Voice Note:',
    anonymityGuaranteedNote: '✓ Your name, phone number, and identity are 100% hidden and protected.',
    successSubNote: 'Your report has been encrypted and routed directly to the regional Gram Panchayat & Police Desk.',
    saveCaseCodeHint: '💡 Save your case code above. You can enter this code anytime to check the status of your report.',

    emergencyHeaderSub: 'Direct 24x7 Toll-Free Emergency Helpline Dial',
    emergencyBannerText: '⚠️ If you or someone else is in immediate physical danger, tap any button below to place a direct phone call to emergency services right now.',
    callHelpline: 'Call',
    helplines: {
      '112': { name: 'National Emergency SOS (112)', desc: 'Police, Ambulance & Fire Services (Unified Single Toll-Free Emergency Number)' },
      '100': { name: 'State Police Direct (100)', desc: 'Direct local Police Station control room for violent crime or immediate danger.' },
      '1091': { name: 'Women Helpline (1091)', desc: 'Dedicated 24x7 emergency helpline for female citizens facing harassment or domestic threat.' },
      '181': { name: 'Women in Distress Helpline (181)', desc: 'Support, counseling, and swift legal assistance for women in rural areas.' },
      '1098': { name: 'Childline Protection (1098)', desc: 'Free emergency protection and rescue service for children in need of care.' },
      panchayat: { name: 'Gram Panchayat Safety Desk (1800-111-222)', desc: 'Local village council and Sarpanch emergency desk for land, crop, and communal disputes.' },
    },

    trackerTitle: 'Track Anonymous Case Status',
    trackerSub: 'Enter your confidential Case Code below to inspect real-time progress.',
    trackerPlaceholder: 'Enter Case Code e.g. #ACT-4029',
    search: 'Search',
    statusLabel: 'Status:',
    reportedCategoryLabel: 'Reported Category:',
    locationLabel: 'Location:',
    submittedLabel: 'Submitted:',
    helplineLabel: 'Helpline:',
    recommendedAuthLabel: 'Recommended Authority:',
    noCaseFound: 'No report found with this Case Code. Please verify your code and try again.',
    myLocalReports: 'My Local Filed Reports (This Browser):',

    next: 'Next Step',
    back: 'Back',
    close: 'Close',
    callNow: 'Call Immediately',
  },
};

