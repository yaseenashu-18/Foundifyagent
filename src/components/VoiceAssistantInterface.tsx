import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Send, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight,
  Globe,
  Radio,
  UserCheck,
  Eye,
  Search,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { AssistantMessage, AssistantVoiceState, LostFoundReport } from '../types/campus';
import { HumanVoiceName } from '../types/telephony';
import { AudioWaveform } from './AudioWaveform';
import { playWavBase64 } from '../utils/audioUtils';

interface VoiceAssistantInterfaceProps {
  onOpenReportModal: (report: LostFoundReport) => void;
  onNavigateToDatabase: () => void;
  onNavigateToMap: () => void;
}

export const VoiceAssistantInterface: React.FC<VoiceAssistantInterfaceProps> = ({
  onOpenReportModal,
  onNavigateToDatabase,
  onNavigateToMap,
}) => {
  const [voiceState, setVoiceState] = useState<AssistantVoiceState>('idle');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'te'>('en');
  const [selectedVoice, setSelectedVoice] = useState<HumanVoiceName>('Aoede');
  const [isAudioOutEnabled, setIsAudioOutEnabled] = useState<boolean>(true);
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(false);
  const [currentActionText, setCurrentActionText] = useState<string>('');
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'Hello Rohan! I am Foundify AI, your official campus lost-and-found voice assistant at Parul University, Vadodara. How can I help you today? You can tell me about an item you lost or found on campus.',
      timestamp: 'Just now',
      language: 'en',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Auto scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, voiceState]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      stopSpeechRecognition();
    };
  }, []);

  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore
      }
      recognitionRef.current = null;
    }
    setIsListeningMic(false);
  };

  // Play natural voice audio via Gemini TTS or browser synthesis
  const speakText = async (text: string, lang: 'en' | 'hi' | 'te') => {
    if (!isAudioOutEnabled || !text || !text.trim()) {
      setVoiceState('idle');
      return;
    }

    setVoiceState('speaking');
    stopAudio();

    let audioPlayed = false;
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: selectedVoice,
          language: lang,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audio) {
          const audio = await playWavBase64(data.audio);
          if (audio) {
            audioPlayed = true;
            currentAudioRef.current = audio;
            audio.onended = () => {
              setVoiceState('idle');
              currentAudioRef.current = null;
            };
            return;
          }
        }
      }
    } catch (err) {
      // Backend TTS optional; browser Web Speech API provides smooth fallback
    }

    // Web Speech API fallback
    if (!audioPlayed) {
      try {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'te' ? 'te-IN' : 'en-IN';
          utterance.rate = 1.0;
          utterance.onend = () => setVoiceState('idle');
          utterance.onerror = () => setVoiceState('idle');
          window.speechSynthesis.speak(utterance);
        } else {
          setVoiceState('idle');
        }
      } catch {
        setVoiceState('idle');
      }
    }
  };

  // Send message to Gemini 3.8 Function-Calling Engine
  const sendMessage = async (userPrompt: string) => {
    if (!userPrompt || !userPrompt.trim()) return;

    stopAudio();
    stopSpeechRecognition();

    const userMsg: AssistantMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: userPrompt.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: selectedLanguage,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setVoiceState('processing');
    setCurrentActionText('Foundify AI is querying Parul University database...');

    try {
      const historyPayload = messages.slice(-5).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      let data: any = null;
      try {
        const res = await fetch('/api/assistant/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userPrompt.trim(),
            history: historyPayload,
            voice: selectedVoice,
            language: selectedLanguage,
            useSearchGrounding,
          }),
        });

        if (res.ok) {
          data = await res.json();
        } else {
          try {
            data = await res.json();
          } catch {
            data = null;
          }
        }
      } catch (fetchErr) {
        // Fallback to local Parul campus assistance
      }

      if (!data || !data.text) {
        data = {
          text: selectedLanguage === 'hi'
            ? 'नमस्ते रोहन! मैं पारुल यूनिवर्सिटी लॉस्ट एंड फाउंड असिस्टेंट हूं। आप A1 PIET, सेंट्रल लाइब्रेरी A27 या हॉस्टल्स के बारे में जानकारी ले सकते हैं।'
            : selectedLanguage === 'te'
            ? 'నమస్కారం రోహన్! పారుల్ యూనివర్సిటీ ఫౌండిఫై క్యాంపస్ అసిస్టెంట్ కు స్వాగతం. మీరు A1 PIET లేదా సెంట్రల్ లైబ్రరీ A27 గురించి అడగవచ్చు.'
            : 'Hello Rohan! I am Foundify AI at Parul University. You can ask me to search, report, or match items lost near A1 PIET, Central Library A27, or Food Courts.',
          actionTaken: { type: 'campus_assistance', title: 'Parul Campus Database Active', status: 'info' },
          reportCards: [],
        };
      }

      if (data.actionTaken) {
        setVoiceState('performing_action');
        setCurrentActionText(data.actionTaken.title || 'Executing Parul Campus Database query...');
        await new Promise((r) => setTimeout(r, 400));
      }

      const assistantMsg: AssistantMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: selectedLanguage,
        actionTaken: data.actionTaken,
        reportCards: data.reportCards,
        isGroundedWithGoogleSearch: data.isGroundedWithGoogleSearch,
        groundingSources: data.groundingSources,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Speak response with human voice
      if (data.audio && isAudioOutEnabled) {
        setVoiceState('speaking');
        try {
          const audio = await playWavBase64(data.audio);
          if (audio) {
            currentAudioRef.current = audio;
            audio.onended = () => {
              setVoiceState('idle');
              currentAudioRef.current = null;
            };
          } else {
            speakText(data.text, selectedLanguage);
          }
        } catch {
          speakText(data.text, selectedLanguage);
        }
      } else {
        speakText(data.text, selectedLanguage);
      }
    } catch (err: any) {
      console.warn('Voice assistant notice:', err?.message || err);
      setVoiceState('idle');
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-info-${Date.now()}`,
          sender: 'assistant',
          text: 'I am here at the Parul University Lost & Found desk. You can tell me about any item lost or found near PIET A1, Central Library A27, or Food Courts.',
          timestamp: 'Just now',
          language: selectedLanguage,
        },
      ]);
    }
  };

  // Start Browser Speech Recognition (Web Speech API)
  const toggleSpeechRecognition = () => {
    if (isListeningMic) {
      stopSpeechRecognition();
      setVoiceState('idle');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. You can type your request in the box below!');
      return;
    }

    stopAudio();
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang =
      selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'te' ? 'te-IN' : 'en-IN';

    recognition.onstart = () => {
      setIsListeningMic(true);
      setVoiceState('listening');
      setCurrentActionText('Listening for Parul campus inquiry...');
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setInputText(transcript);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListeningMic(false);
      setVoiceState('idle');
    };

    recognition.onend = () => {
      setIsListeningMic(false);
      if (inputText.trim()) {
        sendMessage(inputText);
      } else {
        setVoiceState('idle');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const quickPrompts = [
    {
      label: 'Lost Casio Calculator in A1 PIET',
      query: 'I lost my black Casio ClassWiz calculator in A1 PIET Room 204 yesterday.',
    },
    {
      label: 'Find AirPods at Central Library A27',
      query: 'Did anyone report found AirPods near Central Library A27 2nd floor?',
    },
    {
      label: '🔍 Search: Casio FX-991CW Specs',
      query: 'Check online specifications of Casio ClassWiz FX-991CW scientific calculator to verify my lost item claim.',
      useSearch: true,
    },
    {
      label: '🚌 Search: Vadodara Bus Routes to Parul',
      query: 'What are the official bus transit routes from Vadodara to Parul University Waghodia campus for item pickup?',
      useSearch: true,
    },
    {
      label: 'Hindi: लाइब्रेरी में बटुआ खो गया',
      query: 'मेरा बटुआ सेंट्रल लाइब्रेरी के पास खो गया है, क्या कोई रिपोर्ट है?',
      lang: 'hi' as const,
    },
    {
      label: 'Telugu: కాలేజీ ఐడీ కార్డు పోయింది',
      query: 'నా కాలేజీ ఐడీ కార్డు ఫుడ్ కోర్టు వద్ద పోయింది, ఎవరైనా చూసారా?',
      lang: 'te' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Parul University Verified Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-base shadow-sm">
            PU
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-[#0F172A]">Foundify AI Campus Assistant</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                PARUL UNIVERSITY ONLY
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              Vadodara, Gujarat · Real-time lost & found discovery across 29+ campus blocks
            </p>
          </div>
        </div>

        {/* Language & Voice Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Google Search Grounding Toggle */}
          <button
            type="button"
            onClick={() => setUseSearchGrounding(!useSearchGrounding)}
            className={`h-8 px-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              useSearchGrounding
                ? 'bg-[#2563EB] border-[#1D4ED8] text-white shadow-xs'
                : 'bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
            title="Toggle Google Search Grounding (gemini-3.8-flash with googleSearch tool)"
          >
            <Sparkles className={`w-3.5 h-3.5 ${useSearchGrounding ? 'text-amber-300 animate-spin-slow' : 'text-blue-500'}`} />
            <span>Search Grounding</span>
            <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${useSearchGrounding ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {useSearchGrounding ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Multilingual Selector */}
          <div className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-[#64748B] ml-1.5" />
            <button
              onClick={() => setSelectedLanguage('en')}
              className={`px-2 py-1 rounded-md font-medium transition-colors ${
                selectedLanguage === 'en' ? 'bg-[#2563EB] text-white font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setSelectedLanguage('hi')}
              className={`px-2 py-1 rounded-md font-medium transition-colors ${
                selectedLanguage === 'hi' ? 'bg-[#2563EB] text-white font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setSelectedLanguage('te')}
              className={`px-2 py-1 rounded-md font-medium transition-colors ${
                selectedLanguage === 'te' ? 'bg-[#2563EB] text-white font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              తెలుగు
            </button>
          </div>

          {/* Human Voice Persona */}
          <div className="flex items-center gap-1.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg px-2.5 py-1 text-xs text-[#1D4ED8]">
            <UserCheck className="w-3.5 h-3.5" />
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value as HumanVoiceName)}
              className="bg-transparent font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Aoede">Aoede (Warm & Natural)</option>
              <option value="Puck">Puck (Energetic & Friendly)</option>
              <option value="Charon">Charon (Authoritative & Deep)</option>
            </select>
          </div>

          <button
            onClick={() => setIsAudioOutEnabled(!isAudioOutEnabled)}
            className={`h-8 px-2.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
              isAudioOutEnabled
                ? 'bg-white border-[#E2E8F0] text-[#1E293B] hover:bg-[#F8FAFC]'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
            title="Toggle Voice Speech Output"
          >
            {isAudioOutEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#2563EB]" /> : <VolumeX className="w-3.5 h-3.5 text-amber-600" />}
            <span className="hidden sm:inline">{isAudioOutEnabled ? 'Voice On' : 'Voice Muted'}</span>
          </button>
        </div>
      </div>

      {/* Central Interactive Voice Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Central Animated Orb & Voice Telemetry */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
            {/* Ambient Background Aura */}
            <div 
              className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                voiceState === 'listening'
                  ? 'bg-radial from-emerald-100/70 via-transparent to-transparent'
                  : voiceState === 'processing' || voiceState === 'performing_action'
                  ? 'bg-radial from-blue-100/70 via-transparent to-transparent'
                  : voiceState === 'speaking'
                  ? 'bg-radial from-indigo-100/70 via-transparent to-transparent'
                  : 'bg-radial from-slate-100/50 via-transparent to-transparent'
              }`}
            />

            {/* Central Animated Orb Visualizer */}
            <div className="relative my-4 flex items-center justify-center">
              {/* Pulse rings */}
              <div 
                className={`w-36 h-36 rounded-full absolute transition-all duration-500 ${
                  voiceState === 'listening'
                    ? 'border-2 border-emerald-400 animate-ping opacity-30'
                    : voiceState === 'speaking'
                    ? 'border-2 border-blue-400 animate-pulse opacity-40'
                    : 'border border-slate-200'
                }`}
              />

              <div 
                className={`w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-300 ${
                  voiceState === 'listening'
                    ? 'bg-emerald-600 text-white scale-105 shadow-emerald-200'
                    : voiceState === 'processing'
                    ? 'bg-blue-600 text-white animate-pulse shadow-blue-200'
                    : voiceState === 'performing_action'
                    ? 'bg-indigo-600 text-white shadow-indigo-200'
                    : voiceState === 'speaking'
                    ? 'bg-[#2563EB] text-white shadow-blue-200'
                    : 'bg-[#0F172A] text-white hover:bg-slate-800'
                }`}
              >
                <button
                  onClick={toggleSpeechRecognition}
                  className="w-full h-full flex flex-col items-center justify-center focus:outline-none cursor-pointer"
                  title="Click to talk or stop listening"
                >
                  {voiceState === 'listening' ? (
                    <Mic className="w-10 h-10 animate-bounce" />
                  ) : voiceState === 'processing' || voiceState === 'performing_action' ? (
                    <Sparkles className="w-10 h-10 animate-spin" />
                  ) : voiceState === 'speaking' ? (
                    <Volume2 className="w-10 h-10 animate-pulse" />
                  ) : (
                    <Mic className="w-10 h-10" />
                  )}
                  <span className="text-[10px] font-semibold mt-1 uppercase tracking-wider">
                    {voiceState === 'listening'
                      ? 'Listening'
                      : voiceState === 'processing'
                      ? 'Thinking'
                      : voiceState === 'performing_action'
                      ? 'Action'
                      : voiceState === 'speaking'
                      ? 'Speaking'
                      : 'Tap to Speak'}
                  </span>
                </button>
              </div>
            </div>

            {/* Dynamic Status Display */}
            <div className="mt-2 mb-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#BFDBFE]">
                {voiceState === 'idle'
                  ? 'Ready · Parul University Campus Registry'
                  : currentActionText}
              </span>
            </div>

            {/* Acoustic Waveform */}
            <div className="w-full py-2 flex items-center justify-center">
              <AudioWaveform
                isActive={voiceState === 'listening' || voiceState === 'speaking'}
                colorScheme={voiceState === 'listening' ? 'emerald' : 'sapphire'}
                barCount={36}
                height={36}
                intensity={voiceState === 'speaking' ? 0.95 : voiceState === 'listening' ? 0.8 : 0.2}
              />
            </div>

            <p className="text-xs text-[#64748B] mt-2 max-w-xs">
              Natural conversational campus voice assistant. Understands English, Hindi, and Telugu.
            </p>

            {/* Quick Actions Bar */}
            <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#F1F5F9]">
              <button
                onClick={onNavigateToDatabase}
                className="h-9 px-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F172A] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Browse Registry</span>
              </button>

              <button
                onClick={onNavigateToMap}
                className="h-9 px-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F172A] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Campus Map (A1-A29)</span>
              </button>
            </div>
          </div>

          {/* Quick Voice Dialogue Suggestions */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              Suggested Campus Queries
            </span>
            <div className="space-y-1.5">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (p.lang) setSelectedLanguage(p.lang);
                    if ((p as any).useSearch) setUseSearchGrounding(true);
                    sendMessage(p.query);
                  }}
                  className="w-full text-left p-2.5 rounded-xl text-xs bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#E2E8F0] hover:border-[#BFDBFE] text-[#1E293B] hover:text-[#1D4ED8] transition-colors flex items-center justify-between group"
                >
                  <span className="font-medium truncate">{p.label}</span>
                  <ArrowRight className="w-3 h-3 text-[#94A3B8] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Transcript, Interactive Result Cards & Dialogue */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl flex flex-col h-[620px] shadow-xs overflow-hidden">
          {/* Transcript Header */}
          <div className="h-12 px-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#2563EB]" />
              <span className="text-xs font-bold text-[#0F172A]">Campus Voice Dialogue</span>
              <span className="text-[10px] font-mono text-[#64748B] bg-white border border-[#E2E8F0] px-2 py-0.5 rounded-full">
                Gemini 3.8 Intelligence
              </span>
            </div>

            <button
              onClick={() => {
                stopAudio();
                setMessages([
                  {
                    id: `msg-reset-${Date.now()}`,
                    sender: 'assistant',
                    text: 'Conversation reset. How can I assist you with Parul University lost & found records?',
                    timestamp: 'Just now',
                  },
                ]);
              }}
              className="text-xs text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          {/* Transcript Feed with Messages and Rich Report Result Cards */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-white">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-1">
                    <span className="font-semibold text-[#1E293B]">
                      {isAssistant ? 'Foundify AI' : 'Rohan Patel (You)'}
                    </span>
                    <span>·</span>
                    <span className="font-mono">{msg.timestamp}</span>
                    {msg.actionTaken && (
                      <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {msg.actionTaken.title}
                      </span>
                    )}
                  </div>

                  {/* Speech Bubble */}
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      isAssistant
                        ? 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A]'
                        : 'bg-[#0F172A] text-white shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Google Search Grounding Sources */}
                  {msg.groundingSources && msg.groundingSources.length > 0 && (
                    <div className="w-full mt-2.5 max-w-[88%] p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs">
                      <div className="flex items-center gap-1.5 text-blue-900 font-bold mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Verified with Google Search Grounding ({msg.groundingSources.length} sources)</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.groundingSources.map((source, sIdx) => (
                          <a
                            key={sIdx}
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-700 hover:text-blue-900 hover:border-blue-400 font-medium transition-colors shadow-2xs text-[11px]"
                          >
                            <Globe className="w-3 h-3 text-blue-500" />
                            <span className="max-w-[200px] truncate">{source.title || source.uri}</span>
                            <ArrowRight className="w-2.5 h-2.5 -rotate-45 text-blue-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rich Report Cards rendered when AI performs database search or report actions */}
                  {msg.reportCards && msg.reportCards.length > 0 && (
                    <div className="w-full mt-3 space-y-2.5 max-w-[92%]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                        Matching Parul University Records ({msg.reportCards.length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {msg.reportCards.map((report) => (
                          <div
                            key={report.id}
                            onClick={() => onOpenReportModal(report)}
                            className="p-3 rounded-xl border border-[#E2E8F0] hover:border-[#2563EB] bg-white hover:bg-[#F8FAFC] transition-all cursor-pointer shadow-xs group flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span
                                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                    report.type === 'found'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {report.type === 'found' ? 'Found' : 'Lost'}
                                </span>
                                <span className="text-[10px] font-mono text-[#64748B]">
                                  #{report.id}
                                </span>
                              </div>

                              <h4 className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-1">
                                {report.itemName}
                              </h4>

                              <div className="flex items-center gap-1.5 text-[11px] text-[#475569] mt-1">
                                <Building2 className="w-3 h-3 text-[#2563EB] flex-shrink-0" />
                                <span className="truncate">
                                  [{report.location.buildingCode}] {report.location.buildingName}
                                </span>
                              </div>

                              <p className="text-[11px] text-[#64748B] line-clamp-2 mt-1.5">
                                {report.description}
                              </p>
                            </div>

                            <div className="mt-3 pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px]">
                              <span className="text-emerald-700 font-semibold text-[10px]">
                                {report.status}
                              </span>
                              <span className="text-[#2563EB] font-bold inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                                <span>Inspect</span>
                                <ArrowRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice & Text Input Box */}
          <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(inputText);
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isListeningMic
                    ? 'bg-emerald-600 text-white animate-pulse shadow-md'
                    : 'bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
                title="Click to speak using microphone"
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  selectedLanguage === 'hi'
                    ? 'पारुल यूनिवर्सिटी में खोया या मिला सामान बताएं...'
                    : selectedLanguage === 'te'
                    ? 'పారుల్ యూనివర్సిటీలో పోయిన వస్తువు గురించి అడగండి...'
                    : 'Ask Foundify AI or report an item at Parul University...'
                }
                className="flex-1 h-10 px-3.5 text-xs bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="h-10 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ask AI</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
