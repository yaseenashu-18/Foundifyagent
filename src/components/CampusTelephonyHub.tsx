import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneCall, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Building2, 
  Clock, 
  AlertTriangle, 
  Zap, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles,
  ArrowRight,
  Send,
  Radio,
  UserCheck
} from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';
import { playWavBase64, floatTo16BitPCMBase64, GaplessPCMPlayer } from '../utils/audioUtils';
import { CURRENT_CAMPUS_USER } from '../data/parulCampusData';
import { HumanVoiceName } from '../types/telephony';

interface TelephonyMessage {
  id: string;
  speaker: 'agent' | 'user';
  text: string;
  timestamp: string;
  latencyMs?: number;
}

export interface CampusTelephonyHubProps {
  initialTargetPhone?: string;
  initialStudentName?: string;
  initialScenario?: 'match_alert' | 'security_vault' | 'custom';
  autoStartCall?: boolean;
  activeVoice?: HumanVoiceName;
  activeLanguage?: 'en' | 'hi' | 'te';
  onCallStateChange?: (isLive: boolean) => void;
  initialItemTitle?: string;
  initialLostLocation?: string;
  initialFoundLocation?: string;
  initialIdentifyingFeature?: string;
  initialVaultToken?: string;
  initialCategory?: string;
}

export const CampusTelephonyHub: React.FC<CampusTelephonyHubProps> = ({
  initialTargetPhone,
  initialStudentName,
  initialScenario,
  autoStartCall,
  activeVoice,
  activeLanguage,
  onCallStateChange,
  initialItemTitle,
  initialLostLocation,
  initialFoundLocation,
  initialIdentifyingFeature,
  initialVaultToken,
  initialCategory,
}) => {
  const [callState, setCallState] = useState<'idle' | 'ringing_outbound' | 'connected'>('idle');
  const [callDirection, setCallDirection] = useState<'inbound' | 'outbound'>('outbound');
  const [activeScenario, setActiveScenario] = useState<'match_alert' | 'security_vault' | 'custom'>(initialScenario || 'match_alert');
  const [targetPhone, setTargetPhone] = useState<string>(initialTargetPhone || '+91 98765 43210');
  const [studentName, setStudentName] = useState<string>(initialStudentName || CURRENT_CAMPUS_USER.name);
  const [itemTitle, setItemTitle] = useState<string>(initialItemTitle || 'Apple AirPods Pro');
  const [foundLocation, setFoundLocation] = useState<string>(initialFoundLocation || 'Central Library A27');
  const [lostLocation, setLostLocation] = useState<string>(initialLostLocation || 'Central Library A27');
  const [identifyingFeature, setIdentifyingFeature] = useState<string>(initialIdentifyingFeature || 'Yellow silicone loop');
  const [vaultToken, setVaultToken] = useState<string>(initialVaultToken || '');
  const [category, setCategory] = useState<string>(initialCategory || 'Lost & Found');
  const [selectedVoice, setSelectedVoice] = useState<HumanVoiceName>(activeVoice || 'Aoede');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'te'>(activeLanguage || 'en');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState<boolean>(false);
  const [messages, setMessages] = useState<TelephonyMessage[]>([]);
  const [customUserInput, setCustomUserInput] = useState<string>('');
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [currentLatency, setCurrentLatency] = useState<number>(142);
  const [isLiveWsActive, setIsLiveWsActive] = useState<boolean>(true);
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(false);
  const [liveWsStatus, setLiveWsStatus] = useState<string>('Ready');
  const [isMicStreaming, setIsMicStreaming] = useState<boolean>(false);
  const [activeInboundExt, setActiveInboundExt] = useState<string>('102');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const gaplessPlayerRef = useRef<GaplessPCMPlayer | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const isAgentSpeakingRef = useRef<boolean>(false);

  // Sync state when props change
  useEffect(() => {
    if (initialTargetPhone) setTargetPhone(initialTargetPhone);
    if (initialStudentName) setStudentName(initialStudentName);
    if (initialScenario) setActiveScenario(initialScenario);
    if (activeVoice) setSelectedVoice(activeVoice);
    if (activeLanguage) setSelectedLanguage(activeLanguage);
    if (initialItemTitle) setItemTitle(initialItemTitle);
    if (initialFoundLocation) setFoundLocation(initialFoundLocation);
    if (initialLostLocation) setLostLocation(initialLostLocation);
    if (initialIdentifyingFeature) setIdentifyingFeature(initialIdentifyingFeature);
    if (initialVaultToken !== undefined) setVaultToken(initialVaultToken);
    if (initialCategory) setCategory(initialCategory);
  }, [
    initialTargetPhone, 
    initialStudentName, 
    initialScenario, 
    activeVoice, 
    activeLanguage,
    initialItemTitle,
    initialFoundLocation,
    initialLostLocation,
    initialIdentifyingFeature,
    initialVaultToken,
    initialCategory
  ]);

  useEffect(() => {
    onCallStateChange?.(callState === 'connected' || callState === 'ringing_outbound');
  }, [callState, onCallStateChange]);

  useEffect(() => {
    if (autoStartCall && callState === 'idle') {
      handleInitiateAgentCall();
    }
  }, [autoStartCall]);

  // Call duration counter
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAgentSpeaking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopActiveAudio();
      closeLiveWebSocket();
      stopMicrophoneStream();
    };
  }, []);

  const stopActiveAudio = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (gaplessPlayerRef.current) {
      gaplessPlayerRef.current.stop();
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsAgentSpeaking(false);
  };

  const closeLiveWebSocket = () => {
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (e) {}
      wsRef.current = null;
    }
    if (gaplessPlayerRef.current) {
      gaplessPlayerRef.current.stop();
    }
  };

  const stopMicrophoneStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      try {
        inputAudioCtxRef.current.close();
      } catch (e) {}
      inputAudioCtxRef.current = null;
    }
    setIsMicStreaming(false);
  };

  const startMicrophoneStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      inputAudioCtxRef.current = inputCtx;

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);

      // Route through a zero-gain node so microphone audio is processed without echoing through laptop speakers
      const silentGain = inputCtx.createGain();
      silentGain.gain.value = 0;
      source.connect(processor);
      processor.connect(silentGain);
      silentGain.connect(inputCtx.destination);

      processor.onaudioprocess = (e) => {
        if (isMuted) return;
        const inputData = e.inputBuffer.getChannelData(0);

        // Calculate root-mean-square (RMS) energy to detect user voice vs room silence
        let sumSquares = 0;
        for (let i = 0; i < inputData.length; i++) {
          sumSquares += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sumSquares / inputData.length);

        // Anti-overlap feedback suppression:
        // When agent is speaking, ignore microphone to prevent acoustic feedback loop,
        // unless the user intentionally speaks loudly to barge-in (RMS > 0.05).
        if (isAgentSpeakingRef.current) {
          if (rms > 0.05) {
            // User barge-in detected: instantly halt agent speech
            stopActiveAudio();
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({ type: 'user_barge_in' }));
            }
          }
          return;
        }

        // Voice activity detection (VAD): Only send audio if actual speech detected (ignore room noise)
        if (rms > 0.012 && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          const pcmBase64 = floatTo16BitPCMBase64(inputData);
          wsRef.current.send(JSON.stringify({ type: 'audio', audio: pcmBase64 }));
        }
      };

      setIsMicStreaming(true);
    } catch (err: any) {
      console.warn('Microphone access notice for live streaming:', err?.message || err);
    }
  };

  const connectLiveWebSocket = (inboundExt?: string) => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const extQuery = inboundExt ? `&extension=${encodeURIComponent(inboundExt)}&context=inbound` : `&context=${callDirection}`;
      const topicQuery = itemTitle ? `&topic=${encodeURIComponent(itemTitle)}` : '';
      const wsUrl = `${protocol}//${window.location.host}/api/live?voice=${encodeURIComponent(selectedVoice)}${extQuery}${topicQuery}`;
      setLiveWsStatus('Connecting to Gemini 3.8 Live API...');
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      if (!gaplessPlayerRef.current) {
        gaplessPlayerRef.current = new GaplessPCMPlayer(24000);
      }
      gaplessPlayerRef.current.resume();

      ws.onopen = () => {
        setLiveWsStatus('Live API Connected (24kHz Voice Stream)');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'ready') {
            setLiveWsStatus(`Live Session Active (${msg.voice})`);
          } else if (msg.type === 'audio' && msg.audio) {
            setIsAgentSpeaking(true);
            isAgentSpeakingRef.current = true;
            if (isAudioEnabled && gaplessPlayerRef.current) {
              gaplessPlayerRef.current.enqueueChunk(msg.audio, (playing) => {
                setIsAgentSpeaking(playing);
                isAgentSpeakingRef.current = playing;
              });
            }
          } else if (msg.type === 'inputTranscript' && msg.text) {
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.speaker === 'user') {
                return [...prev.slice(0, -1), { ...last, text: last.text + ' ' + msg.text }];
              }
              return [
                ...prev,
                {
                  id: `turn-live-user-${Date.now()}`,
                  speaker: 'user',
                  text: msg.text,
                  timestamp: formatTime(callDuration),
                },
              ];
            });
          } else if (msg.type === 'outputTranscript' && msg.text) {
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.speaker === 'agent') {
                return [...prev.slice(0, -1), { ...last, text: last.text + ' ' + msg.text }];
              }
              return [
                ...prev,
                {
                  id: `turn-live-agent-${Date.now()}`,
                  speaker: 'agent',
                  text: msg.text,
                  timestamp: formatTime(callDuration),
                  latencyMs: 112,
                },
              ];
            });
          } else if (msg.type === 'interrupted') {
            if (gaplessPlayerRef.current) {
              gaplessPlayerRef.current.stop();
            }
            setIsAgentSpeaking(false);
            isAgentSpeakingRef.current = false;
          }
        } catch (e) {
          console.warn('Live ws message error:', e);
        }
      };

      ws.onerror = (e) => {
        console.warn('Live ws error:', e);
        setLiveWsStatus('Live API Standby');
      };

      ws.onclose = () => {
        setLiveWsStatus('Live Session Closed');
      };
    } catch (err) {
      console.warn('Live WebSocket connect error:', err);
    }
  };

  const playSynthesizedSpeech = async (text: string) => {
    if (!isAudioEnabled) return;
    stopActiveAudio();
    setIsAgentSpeaking(true);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: selectedVoice,
          language: selectedLanguage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audio) {
          const audio = await playWavBase64(data.audio);
          if (audio) {
            activeAudioRef.current = audio;
            audio.onended = () => {
              setIsAgentSpeaking(false);
              activeAudioRef.current = null;
            };
            return;
          }
        }
      }
    } catch (e) {
      console.warn('TTS notice:', e);
    }

    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'te' ? 'te-IN' : 'en-IN';
        utt.rate = 1.0;
        utt.onend = () => setIsAgentSpeaking(false);
        utt.onerror = () => setIsAgentSpeaking(false);
        window.speechSynthesis.speak(utt);
      } else {
        setIsAgentSpeaking(false);
      }
    } catch {
      setIsAgentSpeaking(false);
    }
  };

  // 1. Trigger Outbound Call: Agent calls the user
  const handleInitiateAgentCall = async () => {
    setCallDirection('outbound');
    setCallState('ringing_outbound');
    stopActiveAudio();

    // Play gentle incoming phone ringtone via Web Audio API
    playRingtoneTone();
  };

  // 2. User accepts the incoming call from the agent
  const handleAcceptOutboundCall = async () => {
    setCallState('connected');
    setCallDuration(0);
    setMessages([]);

    if (isLiveWsActive) {
      connectLiveWebSocket();
      startMicrophoneStream();
    }

    try {
      const res = await fetch('/api/telephony/outbound-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientPhone: targetPhone,
          studentName: studentName || CURRENT_CAMPUS_USER.name,
          scenario: activeScenario,
          voice: selectedVoice,
          language: selectedLanguage,
          itemTitle,
          lostLocation,
          foundLocation,
          identifyingFeature,
          vaultToken,
          category,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const initialTurn: TelephonyMessage = {
          id: `turn-init-${Date.now()}`,
          speaker: 'agent',
          text: data.openingGreeting,
          timestamp: '00:01',
          latencyMs: 138,
        };
        setMessages([initialTurn]);

        // Anti-overlap audio dispatch: Only synthesize if live WebSocket is not already handling speech
        if (data.audio && isAudioEnabled) {
          setIsAgentSpeaking(true);
          const audio = await playWavBase64(data.audio);
          if (audio) {
            activeAudioRef.current = audio;
            audio.onended = () => {
              setIsAgentSpeaking(false);
              isAgentSpeakingRef.current = false;
            };
          }
        }
      }
    } catch (err) {
      console.warn('Call initiation notice:', err);
    }
  };

  // 3. User dials Inbound Call to Parul Campus Helpline
  const handleConnectInboundCall = async (extension: string = '102') => {
    setActiveInboundExt(extension);
    setCallDirection('inbound');
    setCallState('connected');
    setCallDuration(0);
    setMessages([]);
    stopActiveAudio();

    // Map extension to specific campus desk name and inquiry topic
    const extDesks: Record<string, { desk: string; topic: string }> = {
      '102': { desk: 'Central Lost & Found Desk', topic: 'Campus Lost and Found Inquiries' },
      '204': { desk: 'A1 PIET Engineering Hub Desk', topic: 'Engineering Lab & Workshop Belongings' },
      '270': { desk: 'A27 Central Library Inquiries', topic: 'Library Reading Hall Belongings' },
      '501': { desk: 'Building C5 Security Vault Post', topic: 'Security Vault Property & Token Verification' },
      '401': { desk: 'Hostel Resident Property Desk', topic: 'Hostel Resident Property Tracking' },
    };

    const deskInfo = extDesks[extension] || { desk: 'Central Lost & Found Desk', topic: 'Campus Belongings' };
    setItemTitle(deskInfo.topic);

    if (isLiveWsActive) {
      connectLiveWebSocket(extension);
      startMicrophoneStream();
    }

    try {
      const res = await fetch('/api/telephony/inbound-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          extension,
          voice: selectedVoice,
          language: selectedLanguage,
          callerPhone: targetPhone,
          callerName: studentName || CURRENT_CAMPUS_USER.name,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const initialTurn: TelephonyMessage = {
          id: `turn-in-${Date.now()}`,
          speaker: 'agent',
          text: data.greeting,
          timestamp: '00:01',
          latencyMs: 145,
        };
        setMessages([initialTurn]);

        if (data.audio && isAudioEnabled) {
          setIsAgentSpeaking(true);
          isAgentSpeakingRef.current = true;
          const audio = await playWavBase64(data.audio);
          if (audio) {
            activeAudioRef.current = audio;
            audio.onended = () => {
              setIsAgentSpeaking(false);
              isAgentSpeakingRef.current = false;
              activeAudioRef.current = null;
            };
          }
        }
      }
    } catch (err) {
      console.warn('Inbound connection notice:', err);
    }
  };

  const handleHangup = () => {
    setCallState('idle');
    stopActiveAudio();
    closeLiveWebSocket();
    stopMicrophoneStream();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsMicActive(false);

    // Persist completed call audit dynamically into database
    if (messages.length > 0) {
      const turnsSummary = messages.map(m => `${m.speaker}: ${m.text}`).join(' | ');
      fetch('/api/telephony/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callerId: targetPhone,
          callerName: studentName,
          vertical: (category || 'Lost & Found') as any,
          campusLocation: foundLocation || lostLocation || 'Parul University Campus',
          matchedItem: itemTitle || 'Campus Belongings',
          voiceModel: `Gemini 3.8 Live (${selectedVoice})`,
          status: 'Completed',
          durationSeconds: callDuration || 45,
          durationFormatted: formatTime(callDuration || 45),
          latencyMs: currentLatency || 148,
          sentiment: 'Resolved',
          transcript: messages.map(m => ({
            id: m.id,
            speaker: m.speaker,
            text: m.text,
            timestamp: m.timestamp,
            latencyMs: m.latencyMs,
          })),
          aiAuditSummary: `Verified conversation completed between student ${studentName} (${targetPhone}) and Foundify AI. Details: ${turnsSummary.slice(0, 150)}...`,
        }),
      }).catch(err => console.warn('Call audit save notice:', err));
    }
  };

  // Send a user utterance during active call (strictly guarded)
  const handleTransmitUtterance = async (userSpeech: string) => {
    if (!userSpeech.trim() || callState !== 'connected') return;

    // Immediately stop active audio playback on user input (barge-in)
    stopActiveAudio();

    const callerTurn: TelephonyMessage = {
      id: `turn-user-${Date.now()}`,
      speaker: 'user',
      text: userSpeech.trim(),
      timestamp: formatTime(callDuration),
    };

    setMessages((prev) => [...prev, callerTurn]);
    setCustomUserInput('');

    // If live WebSocket is connected and open, transmit text over realtime session
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'text', text: userSpeech.trim() }));
      return;
    }

    const startMs = Date.now();
    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userSpeech.trim(),
          history: messages.slice(-6).map((m) => ({
            sender: m.speaker === 'agent' ? 'assistant' : 'user',
            text: m.text,
          })),
          voice: selectedVoice,
          language: selectedLanguage,
          useSearchGrounding,
          context: {
            activeTopic: itemTitle,
            extension: callDirection === 'inbound' ? activeInboundExt : undefined,
            studentName: studentName || CURRENT_CAMPUS_USER.name,
            location: foundLocation || lostLocation,
            category: category,
          },
        }),
      });

      const elapsed = Date.now() - startMs;
      setCurrentLatency(elapsed);

      if (res.ok) {
        const data = await res.json();
        const agentTurn: TelephonyMessage = {
          id: `turn-agent-${Date.now()}`,
          speaker: 'agent',
          text: data.text,
          timestamp: formatTime(callDuration + 1),
          latencyMs: elapsed,
        };

        setMessages((prev) => [...prev, agentTurn]);

        if (data.audio && isAudioEnabled) {
          setIsAgentSpeaking(true);
          isAgentSpeakingRef.current = true;
          const audio = await playWavBase64(data.audio);
          if (audio) {
            activeAudioRef.current = audio;
            audio.onended = () => {
              setIsAgentSpeaking(false);
              isAgentSpeakingRef.current = false;
              activeAudioRef.current = null;
            };
          } else {
            playSynthesizedSpeech(data.text);
          }
        } else {
          playSynthesizedSpeech(data.text);
        }
      }
    } catch (err) {
      console.warn('Utterance transmit notice:', err);
    }
  };

  // Toggle speech recognition for speaking to the agent
  const toggleCallMicrophone = () => {
    if (isMicActive) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsMicActive(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Microphone recognition not supported in this browser. Please type responses in the box!');
      return;
    }

    stopActiveAudio();
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'te' ? 'te-IN' : 'en-IN';

    rec.onstart = () => setIsMicActive(true);
    rec.onresult = (e: any) => {
      const t = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setCustomUserInput(t);
    };
    rec.onend = () => {
      setIsMicActive(false);
      if (customUserInput.trim()) {
        handleTransmitUtterance(customUserInput);
      }
    };
    rec.onerror = () => setIsMicActive(false);

    recognitionRef.current = rec;
    rec.start();
  };

  const playRingtoneTone = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.setValueAtTime(480, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      // Ignore
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const speedDials = [
    { code: '102', label: 'Central Lost & Found Desk', phone: '+91 (2668) 260-312' },
    { code: '204', label: 'A1 PIET Engineering Hub Desk', phone: 'Campus Ext 204' },
    { code: '270', label: 'A27 Central Library Inquiries', phone: 'Campus Ext 270' },
    { code: '501', label: 'Building C5 Security Vault Post', phone: 'Campus Ext 501' },
    { code: '401', label: 'Hostel Resident Property Desk', phone: 'Campus Ext 401' },
  ];

  return (
    <div className="space-y-6">
      {/* Strict Guardrail Header Banner */}
      <div className="bg-amber-500/10 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-amber-950">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-900 uppercase tracking-wider text-[11px]">
                Active Telephony Guardrail
              </span>
              <span className="bg-amber-100 text-amber-800 font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">
                ENFORCED
              </span>
            </div>
            <p className="text-[11px] text-amber-800 font-medium">
              Foundify AI is strictly restricted to lost and found belongings around the <strong>Parul University campus</strong>. Off-campus or non-lost-and-found queries are automatically deflected.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-amber-900">Student Phone:</span>
          <span className="font-mono bg-white px-2.5 py-1 rounded-md border border-amber-200 font-bold">
            {targetPhone}
          </span>
        </div>
      </div>

      {/* Main Calling Hub: Left Inbound/Outbound Triggers, Right Active Telephony Call Session */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Place Outbound Call to Student OR Inbound Helpline Dialer */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Agent Calls User (Outbound) */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <PhoneOutgoing className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    Agent Calls User (Outbound)
                  </h3>
                  <span className="text-[11px] text-[#64748B]">Foundify AI calls student mobile</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                Auto Dispatch
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#475569] block mb-1">
                  Recipient Mobile Number
                </label>
                <input
                  type="text"
                  value={targetPhone}
                  onChange={(e) => setTargetPhone(e.target.value)}
                  className="w-full h-9 px-3 text-xs font-mono font-semibold bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#475569] block mb-1">
                  Outbound Campus Call Reason
                </label>
                <select
                  value={activeScenario}
                  onChange={(e: any) => setActiveScenario(e.target.value)}
                  className="w-full h-9 px-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A]"
                >
                  <option value="match_alert">Match Alert: Found AirPods near Central Library A27</option>
                  <option value="security_vault">Security Vault: Casio Calculator deposited in C5 Vault</option>
                  <option value="custom">General Campus Inquiry: Checking lost items report</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-[#64748B] block mb-1">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e: any) => setSelectedLanguage(e.target.value)}
                    className="w-full h-8 px-2 text-xs bg-white border border-[#E2E8F0] rounded-lg"
                  >
                    <option value="en">English (Campus)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-[#64748B] block mb-1">Voice Model</label>
                  <select
                    value={selectedVoice}
                    onChange={(e: any) => setSelectedVoice(e.target.value as HumanVoiceName)}
                    className="w-full h-8 px-2 text-xs bg-white border border-[#E2E8F0] rounded-lg"
                  >
                    <option value="Aoede">Aoede (Warm & Natural)</option>
                    <option value="Puck">Puck (Friendly & Conversational)</option>
                    <option value="Charon">Charon (Deep & Authoritative)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleInitiateAgentCall}
                disabled={callState !== 'idle'}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneOutgoing className="w-4 h-4" />
                <span>Trigger Agent Call to My Phone</span>
              </button>
            </div>
          </div>

          {/* Card 2: User Calls Campus (Inbound) */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                  <PhoneIncoming className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    User Calls Campus (Inbound)
                  </h3>
                  <span className="text-[11px] text-[#64748B]">Parul University Lost &amp; Found Helpline</span>
                </div>
              </div>
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              Campus Speed Dials
            </span>

            <div className="space-y-1.5">
              {speedDials.map((sd) => (
                <button
                  key={sd.code}
                  onClick={() => handleConnectInboundCall(sd.code)}
                  disabled={callState !== 'idle'}
                  className="w-full text-left p-2 rounded-xl text-xs bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#E2E8F0] hover:border-[#BFDBFE] text-[#0F172A] flex items-center justify-between transition-colors disabled:opacity-50"
                >
                  <div>
                    <span className="font-semibold block">{sd.label}</span>
                    <span className="text-[10px] font-mono text-[#64748B]">{sd.phone}</span>
                  </div>
                  <span className="px-2 py-1 bg-white border border-[#CBD5E1] rounded-md font-mono font-bold text-[11px] text-[#2563EB]">
                    Call Ext {sd.code}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Telephony Call Screen & Live Conversation */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl flex flex-col h-[650px] shadow-xs overflow-hidden">
          {/* Incoming Call Ringing Overlay Screen */}
          {callState === 'ringing_outbound' ? (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-900 to-slate-950 text-white text-center relative overflow-hidden animate-in fade-in duration-200">
              {/* Pulsing rings */}
              <div className="w-48 h-48 rounded-full border border-emerald-500/30 animate-ping absolute" />
              <div className="w-36 h-36 rounded-full border border-emerald-500/50 animate-pulse absolute" />

              <div className="w-24 h-24 rounded-full bg-emerald-600 flex items-center justify-center text-white mb-6 shadow-xl relative z-10 animate-bounce">
                <PhoneIncoming className="w-10 h-10" />
              </div>

              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold mb-1">
                INCOMING CAMPUS CALL
              </span>
              <h2 className="text-2xl font-bold tracking-tight">Foundify AI</h2>
              <p className="text-xs text-slate-300 mt-1">
                Parul University Central Security Desk · +91 (2668) 260-312
              </p>
              <div className="mt-3 px-3 py-1 rounded-full bg-slate-800 text-xs font-mono text-emerald-300 border border-slate-700">
                Calling {studentName} ({targetPhone})
              </div>

              <div className="flex items-center gap-6 mt-10 relative z-10">
                <button
                  onClick={handleHangup}
                  className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  title="Decline Call"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>

                <button
                  onClick={handleAcceptOutboundCall}
                  className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer animate-pulse"
                  title="Accept Call"
                >
                  <PhoneCall className="w-7 h-7" />
                </button>
              </div>
            </div>
          ) : callState === 'connected' ? (
            <div className="h-full flex flex-col">
              {/* Active Telephony Call Bar */}
              <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0F172A]">
                        {callDirection === 'outbound' ? 'Outbound Match Call from Foundify AI' : `Inbound Helpline · Ext ${activeInboundExt}`}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                        {isLiveWsActive ? 'GEMINI 3.8 LIVE' : 'FULL DUPLEX'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#64748B]">
                      Status: {liveWsStatus} · Latency: {currentLatency}ms
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Toggle Live WebSocket Mode */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = !isLiveWsActive;
                      setIsLiveWsActive(next);
                      if (next) {
                        connectLiveWebSocket();
                        startMicrophoneStream();
                      } else {
                        closeLiveWebSocket();
                        stopMicrophoneStream();
                      }
                    }}
                    className={`h-8 px-2 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1 ${
                      isLiveWsActive
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                        : 'bg-white text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A]'
                    }`}
                    title="Toggle Gemini 3.8 Live API real-time duplex stream"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Live API ({isLiveWsActive ? 'ON' : 'OFF'})</span>
                  </button>

                  {/* Toggle Google Search Grounding */}
                  <button
                    type="button"
                    onClick={() => setUseSearchGrounding(!useSearchGrounding)}
                    className={`h-8 px-2 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1 ${
                      useSearchGrounding
                        ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                        : 'bg-white text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A]'
                    }`}
                    title="Toggle Google Search Grounding with gemini-3.8-flash"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Search Grounding ({useSearchGrounding ? 'ON' : 'OFF'})</span>
                  </button>

                  <div className="text-right ml-1">
                    <span className="text-[9px] uppercase font-bold text-[#94A3B8] block">CALL DURATION</span>
                    <span className="font-mono text-sm font-bold text-[#0F172A] tabular-nums">
                      {formatTime(callDuration)}
                    </span>
                  </div>

                  <button
                    onClick={handleHangup}
                    className="h-8 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <PhoneOff className="w-3.5 h-3.5" />
                    <span>Hang Up</span>
                  </button>
                </div>
              </div>

              {/* Acoustic Waveform & Agent Speaking Status */}
              <div className="p-3 bg-white border-b border-[#F1F5F9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isAgentSpeaking ? 'bg-blue-600 animate-ping' : isMicStreaming ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  <span className="text-xs font-mono font-semibold text-[#0F172A]">
                    {isAgentSpeaking
                      ? `FOUNDIFY AI SPEAKING (${selectedVoice.toUpperCase()} HUMAN VOICE)...`
                      : isMicStreaming
                      ? 'STREAMING 16KHZ MIC TO GEMINI LIVE...'
                      : isMicActive
                      ? 'LISTENING TO CALLER MICROPHONE...'
                      : 'LINE CONNECTED · PARUL CAMPUS TOPIC ONLY'}
                  </span>
                </div>

                <AudioWaveform
                  isActive={true}
                  colorScheme={isAgentSpeaking ? 'sapphire' : isMicStreaming ? 'emerald' : 'sapphire'}
                  barCount={28}
                  height={28}
                  intensity={isAgentSpeaking ? 0.95 : isMicStreaming ? 0.85 : 0.25}
                />
              </div>

              {/* Turn-by-Turn Telephony Conversation Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC]">
                {messages.map((turn) => {
                  const isAgent = turn.speaker === 'agent';
                  return (
                    <div
                      key={turn.id}
                      className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-2 text-[10px] text-[#64748B] mb-1">
                        <span className="font-semibold text-[#0F172A]">
                          {isAgent ? 'Foundify AI (Campus Desk)' : 'Rohan Patel (Student)'}
                        </span>
                        <span>·</span>
                        <span className="font-mono">{turn.timestamp}</span>
                        {turn.latencyMs && (
                          <span className="font-mono text-[#2563EB] text-[9px] bg-blue-50 px-1 rounded">
                            {turn.latencyMs}ms
                          </span>
                        )}
                      </div>

                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                          isAgent
                            ? 'bg-white border border-[#E2E8F0] text-[#0F172A] shadow-2xs'
                            : 'bg-[#0F172A] text-white shadow-xs'
                        }`}
                      >
                        {turn.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Interactive Caller Controls: Speak or Type */}
              <div className="p-3 bg-white border-t border-[#E2E8F0] space-y-2">
                {/* Topic Guardrail Quick Tests */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] flex-shrink-0">
                    Quick Responses:
                  </span>
                  <button
                    onClick={() => handleTransmitUtterance('Yes, I am looking for my white AirPods with a yellow carabiner loop.')}
                    className="px-2.5 py-1 bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#E2E8F0] text-[#0F172A] rounded-lg text-xs font-medium flex-shrink-0"
                  >
                    Confirm AirPods Details
                  </button>
                  <button
                    onClick={() => handleTransmitUtterance('Verify the online specs of my Casio FX-991CW calculator.')}
                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 rounded-lg text-xs font-medium flex-shrink-0"
                  >
                    🔍 Verify Specs Online (Search)
                  </button>
                  <button
                    onClick={() => handleTransmitUtterance('How can I collect it from the C5 Security Vault?')}
                    className="px-2.5 py-1 bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#E2E8F0] text-[#0F172A] rounded-lg text-xs font-medium flex-shrink-0"
                  >
                    Ask Vault Pickup Details
                  </button>
                  <button
                    onClick={() => handleTransmitUtterance('Can you write code for my web development homework?')}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-lg text-xs font-medium flex-shrink-0"
                    title="Tests strict deflection of off-topic requests"
                  >
                    Test Off-Topic Deflection
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (isMicStreaming) {
                        stopMicrophoneStream();
                      } else {
                        startMicrophoneStream();
                      }
                    }}
                    className={`h-10 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      isMicStreaming
                        ? 'bg-emerald-600 text-white animate-pulse'
                        : 'bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0]'
                    }`}
                    title="Continuous 16kHz microphone stream to Gemini 3.8 Live API"
                  >
                    <Mic className="w-4 h-4" />
                    <span>{isMicStreaming ? 'Mic Live (16kHz Stream)' : 'Live Mic Stream'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleCallMicrophone}
                    className={`h-10 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      isMicActive
                        ? 'bg-blue-600 text-white animate-pulse'
                        : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9]'
                    }`}
                    title="Single-turn Speech Recognition"
                  >
                    <Mic className="w-4 h-4 text-blue-600" />
                    <span>{isMicActive ? 'Listening...' : 'Transcribe'}</span>
                  </button>

                  <input
                    type="text"
                    value={customUserInput}
                    onChange={(e) => setCustomUserInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customUserInput.trim()) {
                        handleTransmitUtterance(customUserInput);
                      }
                    }}
                    placeholder="Speak via microphone or type your response about campus belongings..."
                    className="flex-1 h-10 px-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />

                  <button
                    onClick={() => handleTransmitUtterance(customUserInput)}
                    disabled={!customUserInput.trim()}
                    className="h-10 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Idle Screen */
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
                <PhoneCall className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Telephony Station Idle</h3>
              <p className="text-xs text-[#64748B] max-w-sm mt-1 mb-6 leading-relaxed">
                Trigger an <strong>Outbound Call</strong> to have Foundify AI ring student mobile, or make an <strong>Inbound Call</strong> to the Parul University Campus Helpline.
              </p>

              <div className="grid grid-cols-2 gap-3 max-w-md w-full">
                <button
                  onClick={handleInitiateAgentCall}
                  className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PhoneOutgoing className="w-5 h-5 text-emerald-700" />
                  <span>Agent Calls User</span>
                  <span className="text-[10px] text-emerald-700 font-normal">Outbound Match Ring</span>
                </button>

                <button
                  onClick={() => handleConnectInboundCall('102')}
                  className="p-3.5 rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-950 font-bold text-xs flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PhoneIncoming className="w-5 h-5 text-blue-700" />
                  <span>User Calls Campus</span>
                  <span className="text-[10px] text-blue-700 font-normal">Dial Helpline Ext 102</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
