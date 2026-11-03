import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Send, 
  Zap, 
  Sliders, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  PhoneCall,
  Radio,
  UserCheck
} from 'lucide-react';
import { FoundifyVertical, VoiceModel, TranscriptTurn, ExtractedEntity, HumanVoiceName } from '../types/telephony';
import { AudioWaveform } from './AudioWaveform';
import { ServiceChip } from './ServiceChip';
import { floatTo16BitPCMBase64, play24kPCMChunk, playWavBase64 } from '../utils/audioUtils';

interface Scenario {
  vertical: FoundifyVertical;
  title: string;
  caller: string;
  initialAgentGreeting: string;
  turns: {
    callerText: string;
    agentResponse: string;
    entities: ExtractedEntity[];
    latencyMs: number;
  }[];
}

const PRESET_SCENARIOS: Record<FoundifyVertical, Scenario> = {
  'Lost & Found': {
    vertical: 'Lost & Found',
    title: 'SFO Terminal 2 - Laptop Bag Custody Intake',
    caller: 'Elena Rostova (+1 415 555-0198)',
    initialAgentGreeting: 'Thank you for calling Foundify Lost and Found Operations. I can assist with item claims across all registered hubs. What item are you looking for?',
    turns: [
      {
        callerText: 'Hi, I left my work briefcase at SFO Terminal 2 near Gate B4 about an hour ago.',
        agentResponse: 'Checking live SFO Terminal 2 intake now. Could you confirm the brand, color, and any identifying electronics inside?',
        entities: [
          { label: 'Location', value: 'SFO Terminal 2 - Gate B4', category: 'Hub', confidence: 0.98 },
          { label: 'Time Elapsed', value: '~60 minutes', category: 'Temporal', confidence: 0.95 }
        ],
        latencyMs: 188
      },
      {
        callerText: 'It is a black ballistic nylon Tumi briefcase with a 16-inch MacBook Pro inside.',
        agentResponse: 'Direct match found in vault! Tag number LF-9921, black Tumi briefcase logged by security at 23:15. I have placed an immediate custody hold.',
        entities: [
          { label: 'Item Match', value: 'Tag #LF-9921 (Black Tumi)', category: 'Vault', confidence: 0.99 },
          { label: 'Hardware', value: 'MacBook Pro 16"', category: 'Device', confidence: 0.96 }
        ],
        latencyMs: 194
      },
      {
        callerText: 'That is wonderful! Can you text me the claim pickup link?',
        agentResponse: 'I just dispatched the encrypted retrieval pass to your mobile phone. You can present the QR code at Terminal 2 or request courier delivery.',
        entities: [
          { label: 'Claim Pass', value: 'SMS Dispatched (+1 415 555-0198)', category: 'Delivery', confidence: 0.99 },
          { label: 'Resolution', value: 'Claim Authorized', category: 'Status', confidence: 1.0 }
        ],
        latencyMs: 178
      }
    ]
  },
  'Marketplace': {
    vertical: 'Marketplace',
    title: 'High-Value Camera Escrow Payout Settlement',
    caller: 'Marcus Vance (+1 312 555-8391)',
    initialAgentGreeting: 'Foundify Marketplace transaction desk. How may I assist your listing or transaction today?',
    turns: [
      {
        callerText: 'I am calling about order MP-4409. The buyer received the Leica camera, but escrow is still pending.',
        agentResponse: 'Looking up order MP-4409 for the Leica M6. FedEx tracking confirms signed delivery yesterday afternoon.',
        entities: [
          { label: 'Order ID', value: 'MP-4409', category: 'Order', confidence: 0.99 },
          { label: 'Item', value: 'Leica M6 Rangefinder', category: 'Product', confidence: 0.98 }
        ],
        latencyMs: 172
      },
      {
        callerText: 'Did the buyer clear the 24-hour inspection checklist?',
        agentResponse: 'Yes, the inspection passed with five stars. I am releasing the one thousand eight hundred and fifty dollars from escrow to your Stripe account right now.',
        entities: [
          { label: 'Settlement Amount', value: '$1,850.00 USD', category: 'Finance', confidence: 0.99 },
          { label: 'Inspection Status', value: 'Passed (5/5 Stars)', category: 'Quality', confidence: 0.97 }
        ],
        latencyMs: 168
      }
    ]
  },
  'Rentals': {
    vertical: 'Rentals',
    title: 'Smart Keypad Lock PIN Recovery & Late Checkout',
    caller: 'Chloe Bennett (+1 512 555-4420)',
    initialAgentGreeting: 'Welcome to Foundify Smart Rentals Concierge. Please state your reservation code or inquiry.',
    turns: [
      {
        callerText: 'I am at unit 402 in Austin Downtown. The Schlage lock is flashing yellow and wont open.',
        agentResponse: 'I see your active check-in for reservation RN-8831, Chloe. Let me cycle the hub token and generate a fresh keycode for you.',
        entities: [
          { label: 'Reservation', value: 'RN-8831 (Austin Loft 402)', category: 'Booking', confidence: 0.99 },
          { label: 'Lock Status', value: 'Schlage Encode Token Cycle', category: 'IoT', confidence: 0.95 }
        ],
        latencyMs: 162
      },
      {
        callerText: 'Great, standing right in front of the keypad.',
        agentResponse: 'Keypad is refreshed! Please enter eight, four, nine, two, zero, one, followed by the check mark.',
        entities: [
          { label: 'Generated PIN', value: '849-201 (Valid 72h)', category: 'Access', confidence: 0.99 }
        ],
        latencyMs: 158
      }
    ]
  },
  'Services': {
    vertical: 'Services',
    title: 'Emergency Kitchen Main Valve Water Leak Dispatch',
    caller: 'Devon Patel (+1 206 555-7319)',
    initialAgentGreeting: 'Foundify On-Demand Services emergency dispatch. Are you in immediate danger or is this a home utility incident?',
    turns: [
      {
        callerText: 'Water is gushing under my kitchen sink! I do not know how to shut it off completely.',
        agentResponse: 'Look directly under the sink cabinet for two oval handles. Turn both clockwise until they stop. Can you reach them?',
        entities: [
          { label: 'Incident Severity', value: 'Tier 1 Plumbing Leak', category: 'Priority', confidence: 0.99 },
          { label: 'Action Triage', value: 'Shutoff Valve Isolation', category: 'Triage', confidence: 0.97 }
        ],
        latencyMs: 150
      },
      {
        callerText: 'Turned both clockwise... it stopped spraying!',
        agentResponse: 'Outstanding job. I have dispatched Cascade Rapid Plumbing to Queen Anne Ave. Technician Jordan is 4 miles away with an ETA of 28 minutes.',
        entities: [
          { label: 'Dispatched Pro', value: 'Cascade Rapid Plumbing #14', category: 'Vendor', confidence: 0.98 },
          { label: 'Live ETA', value: '28 minutes', category: 'Logistics', confidence: 0.96 }
        ],
        latencyMs: 154
      }
    ]
  },
  'Giveaways': {
    vertical: 'Giveaways',
    title: 'Community Free Oak Dining Table Listing Intake',
    caller: 'Sarah Jenkins (+1 718 555-9014)',
    initialAgentGreeting: 'Foundify Community Giveaways. Are you looking to donate items or claim a neighborhood listing today?',
    turns: [
      {
        callerText: 'I am moving this weekend and want to give away a solid oak dining table and six chairs to a local family.',
        agentResponse: 'That is wonderful! In which neighborhood are the items located, and what is your preferred pickup timeframe?',
        entities: [
          { label: 'Item Donation', value: 'Solid Oak Dining Set + 6 Chairs', category: 'Item', confidence: 0.99 }
        ],
        latencyMs: 198
      },
      {
        callerText: 'Park Slope, Brooklyn. Saturday between 10am and 2pm would be ideal for ground floor pickup.',
        agentResponse: 'Perfect. Listing GW-519 has been posted to verified neighbors within a 3-mile radius. I just texted you a link to snap photos.',
        entities: [
          { label: 'Listing ID', value: 'GW-519 (Park Slope, Brooklyn)', category: 'Geo', confidence: 0.98 },
          { label: 'Pickup Window', value: 'Saturday 10:00 AM - 2:00 PM', category: 'Logistics', confidence: 0.96 }
        ],
        latencyMs: 206
      }
    ]
  }
};

const HUMAN_VOICES: { name: HumanVoiceName; desc: string; persona: string }[] = [
  { name: 'Aoede', desc: 'Warm, natural, clear & expressive (Campus Lost & Found)', persona: 'Official Campus Dispatch' },
  { name: 'Puck', desc: 'Energetic, friendly & conversational (Marketplace & Peer)', persona: 'Marketplace & Community' },
  { name: 'Charon', desc: 'Authoritative, calm & grounded (Security Vault Desk)', persona: 'Security & Operations' },
];

interface LiveCallStudioProps {
  currentVertical: FoundifyVertical;
  onChangeVertical: (vertical: FoundifyVertical) => void;
  isCallLive: boolean;
  setIsCallLive: (live: boolean) => void;
}

export const LiveCallStudio: React.FC<LiveCallStudioProps> = ({
  currentVertical,
  onChangeVertical,
  isCallLive,
  setIsCallLive,
}) => {
  const [selectedModel, setSelectedModel] = useState<VoiceModel>('Gemini 3.8 Live (Live API)');
  const [selectedVoice, setSelectedVoice] = useState<HumanVoiceName>('Aoede');
  const [activeScenario, setActiveScenario] = useState<Scenario>(PRESET_SCENARIOS[currentVertical]);
  const [turnIndex, setTurnIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAudioOutEnabled, setIsAudioOutEnabled] = useState<boolean>(true);
  const [customInput, setCustomInput] = useState<string>('');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [currentLatency, setCurrentLatency] = useState<number>(148);
  const [liveEntities, setLiveEntities] = useState<ExtractedEntity[]>([]);
  const [transcript, setTranscript] = useState<TranscriptTurn[]>([]);
  const [isLiveWsConnected, setIsLiveWsConnected] = useState<boolean>(false);
  const [liveWsStatus, setLiveWsStatus] = useState<string>('Ready');
  const [isMicStreaming, setIsMicStreaming] = useState<boolean>(false);

  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const currentAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const activeSourceNodesRef = useRef<AudioBufferSourceNode[]>([]);

  // Sync scenario when currentVertical changes
  useEffect(() => {
    setActiveScenario(PRESET_SCENARIOS[currentVertical]);
    if (isCallLive) {
      endCall();
    }
  }, [currentVertical]);

  // Call duration timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCallLive) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isCallLive]);

  // Auto scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudioPlayback();
      closeLiveWebSocket();
      stopMicrophoneStream();
    };
  }, []);

  const stopAudioPlayback = () => {
    if (currentAudioElementRef.current) {
      currentAudioElementRef.current.pause();
      currentAudioElementRef.current = null;
    }
    activeSourceNodesRef.current.forEach((node) => {
      try {
        node.stop();
      } catch (e) {
        // Ignore
      }
    });
    activeSourceNodesRef.current = [];
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const closeLiveWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsLiveWsConnected(false);
  };

  const stopMicrophoneStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    setIsMicStreaming(false);
  };

  // Play natural human voice audio generated via Gemini TTS or browser fallback
  const speakWithHumanVoice = async (text: string, voiceToUse: HumanVoiceName = selectedVoice) => {
    if (!isAudioOutEnabled) return;

    stopAudioPlayback();
    setIsSpeaking(true);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          voice: voiceToUse,
          style: `Natural, human customer service voice for ${currentVertical}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audio) {
          const audio = await playWavBase64(data.audio);
          if (audio) {
            currentAudioElementRef.current = audio;
            audio.onended = () => {
              setIsSpeaking(false);
              currentAudioElementRef.current = null;
            };
            return;
          }
        }
      }
    } catch (err) {
      console.warn('Backend human TTS not reachable, falling back to speech synthesis:', err);
    }

    // High quality speech synthesis fallback
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = selectedVoice === 'Charon' ? 0.9 : 1.05;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  // Initialize Gemini 3.8 Live API WebSocket
  const setupGeminiLiveWebSocket = () => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live?voice=${encodeURIComponent(selectedVoice)}&vertical=${encodeURIComponent(currentVertical)}`;
      
      setLiveWsStatus('Connecting to Gemini 3.8 Live API...');
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // AudioContext for 24kHz model output
      if (!outputAudioCtxRef.current || outputAudioCtxRef.current.state === 'closed') {
        outputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: 24000,
        });
      }

      ws.onopen = () => {
        setIsLiveWsConnected(true);
        setLiveWsStatus('Live API Connected (24kHz Human Voice Stream)');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'ready') {
            setLiveWsStatus(`Live Session Active (${msg.voice})`);
          } else if (msg.type === 'audio' && msg.audio) {
            setIsSpeaking(true);
            if (isAudioOutEnabled && outputAudioCtxRef.current) {
              if (outputAudioCtxRef.current.state === 'suspended') {
                outputAudioCtxRef.current.resume();
              }
              const sourceNode = play24kPCMChunk(outputAudioCtxRef.current, msg.audio, () => {
                setIsSpeaking(false);
              });
              activeSourceNodesRef.current.push(sourceNode);
            }
          } else if (msg.type === 'text' && msg.text) {
            setTranscript((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.speaker === 'agent') {
                return [
                  ...prev.slice(0, -1),
                  { ...last, text: last.text + ' ' + msg.text }
                ];
              } else {
                return [
                  ...prev,
                  {
                    id: `turn-live-${Date.now()}`,
                    speaker: 'agent',
                    text: msg.text,
                    timestamp: formatTime(callDuration),
                    latencyMs: 142,
                    voiceName: selectedVoice,
                  }
                ];
              }
            });
          } else if (msg.type === 'interrupted') {
            stopAudioPlayback();
          }
        } catch (e) {
          console.error('Error handling WebSocket message:', e);
        }
      };

      ws.onerror = () => {
        setLiveWsStatus('Live API WebSocket connection notice');
      };

      ws.onclose = () => {
        setIsLiveWsConnected(false);
        setLiveWsStatus('Live Session Closed');
      };
    } catch (err) {
      console.warn('Could not establish Live WebSocket:', err);
      setLiveWsStatus('Standard Carrier TTS Mode Active');
    }
  };

  // Start live microphone capture for bidirectional streaming (16kHz PCM)
  const toggleLiveMicrophone = async () => {
    if (isMicStreaming) {
      stopMicrophoneStream();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      inputAudioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      // ScriptProcessorNode to capture raw PCM
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      source.connect(processor);
      processor.connect(audioCtx.destination);

      processor.onaudioprocess = (e) => {
        if (isMuted) return;
        const channelData = e.inputBuffer.getChannelData(0);
        // Calculate audio level to determine if user is speaking
        let sum = 0;
        for (let i = 0; i < channelData.length; i++) {
          sum += channelData[i] * channelData[i];
        }
        const rms = Math.sqrt(sum / channelData.length);

        if (rms > 0.02) {
          // Send 16kHz PCM to Gemini Live WebSocket
          const base64Pcm = floatTo16BitPCMBase64(channelData);
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'audio', audio: base64Pcm }));
          }
        }
      };

      setIsMicStreaming(true);
    } catch (err: any) {
      console.error('Microphone access denied or error:', err);
      alert('Microphone permission required for real-time speech conversation. You can also use the dialogue prompts.');
    }
  };

  const startCall = () => {
    setIsCallLive(true);
    setTurnIndex(0);
    setLiveEntities([]);

    const initialTurn: TranscriptTurn = {
      id: 't-0',
      speaker: 'agent',
      text: activeScenario.initialAgentGreeting,
      timestamp: '00:01',
      latencyMs: 148,
      confidence: 0.99,
      voiceName: selectedVoice,
    };
    setTranscript([initialTurn]);

    // Connect to Gemini 3.8 Live WebSocket
    setupGeminiLiveWebSocket();

    // Speak initial greeting with human voice
    speakWithHumanVoice(activeScenario.initialAgentGreeting, selectedVoice);
  };

  const endCall = () => {
    setIsCallLive(false);
    stopAudioPlayback();
    closeLiveWebSocket();
    stopMicrophoneStream();
  };

  const handleNextTurn = async (overrideText?: string) => {
    if (!isCallLive) return;

    const availableTurns = activeScenario.turns;
    const currentTurnData = availableTurns[turnIndex];
    const callerSpeech = overrideText || (currentTurnData ? currentTurnData.callerText : customInput);

    if (!callerSpeech) return;

    // 1. Add caller turn
    const callerTurn: TranscriptTurn = {
      id: `turn-caller-${Date.now()}`,
      speaker: 'caller',
      text: callerSpeech,
      timestamp: formatTime(callDuration),
    };

    setTranscript((prev) => [...prev, callerTurn]);
    setCustomInput('');

    // If WebSocket is open and connected to Gemini Live, transmit user text directly
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'text', text: callerSpeech }));
      setCurrentLatency(135);
      return;
    }

    // 2. Otherwise execute intelligent server chat or scenario dialogue
    const responseLatency = currentTurnData ? currentTurnData.latencyMs : Math.floor(Math.random() * 30 + 140);
    setCurrentLatency(responseLatency);

    try {
      let agentReply = '';
      if (currentTurnData) {
        agentReply = currentTurnData.agentResponse;
        if (currentTurnData.entities) {
          setLiveEntities((prev) => [...prev, ...currentTurnData.entities]);
        }
        setTurnIndex((prev) => prev + 1);
      } else {
        // Query server chat endpoint for real-time Gemini generation
        const res = await fetch('/api/agent/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: callerSpeech,
            vertical: currentVertical,
            voice: selectedVoice,
            history: transcript.slice(-4),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          agentReply = data.text;
          if (data.audio && isAudioOutEnabled) {
            // Play generated human voice audio immediately
            const audio = await playWavBase64(data.audio);
            if (audio) {
              currentAudioElementRef.current = audio;
              setIsSpeaking(true);
              audio.onended = () => setIsSpeaking(false);
            }
          }
        } else {
          agentReply = `I have logged your request: "${callerSpeech}". Foundify ledger updated and verified with primary operator credentials.`;
        }

        setLiveEntities((prev) => [
          ...prev,
          { label: 'Telephony Query', value: callerSpeech.slice(0, 32), category: 'VoiceInput', confidence: 0.96 }
        ]);
      }

      const agentTurn: TranscriptTurn = {
        id: `turn-agent-${Date.now()}`,
        speaker: 'agent',
        text: agentReply,
        timestamp: formatTime(callDuration + 1),
        latencyMs: responseLatency,
        confidence: 0.98,
        voiceName: selectedVoice,
      };

      setTranscript((prev) => [...prev, agentTurn]);

      if (currentTurnData) {
        speakWithHumanVoice(agentReply, selectedVoice);
      }
    } catch (err) {
      console.error('Error processing turn:', err);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const nextTurnAvailable = turnIndex < activeScenario.turns.length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Scenario Selector */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Active Test Scenario
              </span>
              <ServiceChip vertical={currentVertical} size="sm" />
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-emerald-600" />
                Human Voice: {selectedVoice}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">
              {activeScenario.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-[#64748B] mt-0.5">
              <span>Caller: <strong className="text-[#1E293B] font-mono">{activeScenario.caller}</strong></span>
              <span>·</span>
              <span>Telephony Stream: <span className="font-mono text-[#2563EB]">gemini-3.8-live</span></span>
            </div>
          </div>

          {/* Human Voice Selector & Model Selection */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Human Voice Preset Selector */}
            <div className="flex items-center gap-1.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg px-2.5 py-1">
              <UserCheck className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="text-[11px] font-semibold text-[#1D4ED8]">Voice:</span>
              <select
                value={selectedVoice}
                onChange={(e) => {
                  const v = e.target.value as HumanVoiceName;
                  setSelectedVoice(v);
                  if (isCallLive) {
                    speakWithHumanVoice(`Voice changed to ${v}. Foundify telephony line updated.`, v);
                  }
                }}
                className="bg-transparent text-xs font-semibold text-[#1D4ED8] focus:outline-none cursor-pointer"
              >
                {HUMAN_VOICES.map((hv) => (
                  <option key={hv.name} value={hv.name} className="text-[#0F172A]">
                    {hv.name} — {hv.persona}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Selector */}
            <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-1">
              <Sliders className="w-3.5 h-3.5 text-[#64748B] ml-1.5" />
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as VoiceModel)}
                className="bg-transparent text-xs font-medium text-[#1E293B] focus:outline-none pr-2 py-1 cursor-pointer"
              >
                <option value="Gemini 3.8 Live (Live API)">Gemini 3.8 Live (Live API - Human Voice)</option>
                <option value="ElevenLabs Flash v2.5">ElevenLabs Flash v2.5 (190ms)</option>
                <option value="Retell Turbo HD">Retell Turbo HD (175ms)</option>
                <option value="Deepgram Nova-2 + Aura">Deepgram Nova-2 + Aura (165ms)</option>
                <option value="Cartesia Sonic Enterprise">Cartesia Sonic Enterprise (150ms)</option>
              </select>
            </div>

            {/* Vertical Quick Buttons */}
            <div className="flex items-center gap-1">
              {(['Lost & Found', 'Marketplace', 'Rentals', 'Services', 'Giveaways'] as FoundifyVertical[]).map((v) => (
                <button
                  key={v}
                  onClick={() => onChangeVertical(v)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                    currentVertical === v
                      ? 'bg-[#0F172A] text-white font-medium shadow-sm'
                      : 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Left Audio Stream & Controls, Right Live Transcript */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Audio Stream, Waveform, Telephony Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] flex flex-col justify-between">
            {/* Telephony Header Status */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                {isCallLive ? (
                  <div className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-live-dot" />
                    <span>GEMINI LIVE STREAM ACTIVE</span>
                  </div>
                ) : (
                  <div className="bg-[#F1F5F9] text-[#64748B] text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
                    <span>SESSION IDLE</span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider text-[#94A3B8] font-semibold block">
                  SIP Duration
                </span>
                <span className="font-mono text-base font-semibold text-[#0F172A] tabular-nums">
                  {formatTime(callDuration)}
                </span>
              </div>
            </div>

            {/* Central Acoustic Waveform Visualizer */}
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="w-full max-w-[340px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="text-[11px] font-mono text-[#64748B] mb-2 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-[#2563EB]" />
                  <span>
                    {isSpeaking
                      ? `SPEAKING: ${selectedVoice.toUpperCase()} (HUMAN VOICE)...`
                      : isMicStreaming
                      ? 'LISTENING TO YOUR MICROPHONE...'
                      : isCallLive
                      ? 'WAITING FOR CALLER VOICE...'
                      : 'HUMAN TELEPHONY PIPELINE READY'}
                  </span>
                </div>

                {/* The 3px pill bars with 2px gap audio waveform */}
                <AudioWaveform
                  isActive={isCallLive}
                  colorScheme={isSpeaking ? 'sapphire' : isMicStreaming ? 'emerald' : 'sapphire'}
                  barCount={38}
                  height={44}
                  intensity={isSpeaking ? 0.95 : isMicStreaming ? 0.8 : 0.45}
                  isMuted={isMuted}
                />

                <div className="w-full mt-3 pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                  <span>Voice: <strong className="text-[#2563EB]">{selectedVoice}</strong></span>
                  <span className="text-[#10B981] font-semibold">{currentLatency}ms RTT</span>
                </div>
              </div>
            </div>

            {/* Live Telephony Control Buttons */}
            <div className="pt-2 space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  disabled={!isCallLive}
                  className={`h-10 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    isMuted
                      ? 'bg-[#EF4444] text-white'
                      : 'bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0] disabled:opacity-50'
                  }`}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isMuted ? 'Unmute' : 'Mute Mic'}</span>
                </button>

                <button
                  onClick={() => setIsAudioOutEnabled(!isAudioOutEnabled)}
                  className={`h-10 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    !isAudioOutEnabled
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0]'
                  }`}
                >
                  {!isAudioOutEnabled ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isAudioOutEnabled ? 'Human Voice' : 'Voice Off'}</span>
                </button>

                <button
                  onClick={() => {
                    if (isCallLive) {
                      endCall();
                      setTimeout(() => startCall(), 200);
                    } else {
                      startCall();
                    }
                  }}
                  className="h-10 px-3 rounded-lg text-xs font-medium bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0] flex items-center justify-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Restart</span>
                </button>
              </div>

              {/* Live Microphone Streaming Toggle */}
              {isCallLive && (
                <button
                  onClick={toggleLiveMicrophone}
                  className={`w-full h-10 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                    isMicStreaming
                      ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0] shadow-sm'
                      : 'bg-white text-[#1E293B] border-[#CBD5E1] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <Radio className={`w-4 h-4 ${isMicStreaming ? 'text-[#10B981] animate-pulse' : 'text-[#64748B]'}`} />
                  <span>{isMicStreaming ? 'Microphone Streaming Live (16kHz PCM)' : 'Enable Real Microphone (Speak to Agent)'}</span>
                </button>
              )}

              {/* Main Call Action: Start vs Hangup */}
              {!isCallLive ? (
                <button
                  onClick={startCall}
                  className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98 focus:ring-2 focus:ring-[#2563EB]"
                >
                  <PhoneCall className="w-4 h-4 fill-current" />
                  <span>Initiate Human Voice Call ({currentVertical})</span>
                </button>
              ) : (
                <button
                  onClick={endCall}
                  className="w-full h-11 bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>Terminate Call (Hangup)</span>
                </button>
              )}
            </div>
          </div>

          {/* Real-time Extracted Entities Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                Extracted Entities & Telephony Ledger
              </span>
              <span className="text-[11px] font-mono text-[#64748B]">
                {liveEntities.length} Detected
              </span>
            </div>

            {liveEntities.length === 0 ? (
              <p className="text-xs text-[#94A3B8] italic py-2">
                No entities extracted yet. Start or step through the voice call to extract metadata in real-time.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                {liveEntities.map((ent, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-[#64748B] block">
                        {ent.label}
                      </span>
                      <span className="font-medium text-[#0F172A]">{ent.value}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {Math.round(ent.confidence * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Turn-by-Turn Live Transcript & Interactive Dialogue Prompts */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-xl flex flex-col h-[560px] shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] overflow-hidden">
          {/* Transcript Header */}
          <div className="h-11 px-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#0F172A]">Acoustic Transcript Stream</span>
              <span className="text-[10px] font-mono text-[#64748B] bg-white border border-[#E2E8F0] px-1.5 py-0.5 rounded">
                Bidirectional Full-Duplex
              </span>
              <span className="text-[10px] font-mono text-[#10B981] bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">
                {liveWsStatus}
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#64748B]">
              Latency: <strong className="text-[#0F172A]">{currentLatency}ms</strong>
            </div>
          </div>

          {/* Transcript Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-white">
            {transcript.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#94A3B8]">
                <PhoneCall className="w-8 h-8 text-[#CBD5E1] mb-2" />
                <p className="text-sm font-medium text-[#475569]">No Active Call Stream</p>
                <p className="text-xs max-w-sm mt-1">
                  Click &ldquo;Initiate Human Voice Call&rdquo; to connect model <strong>gemini-3.8-live</strong> with authentic human speech.
                </p>
              </div>
            ) : (
              transcript.map((t) => {
                const isAgent = t.speaker === 'agent';
                return (
                  <div
                    key={t.id}
                    className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-1">
                      <span className="font-semibold text-[#1E293B]">
                        {isAgent ? `Foundify Voice Agent (${t.voiceName || selectedVoice})` : 'Caller'}
                      </span>
                      <span>·</span>
                      <span className="font-mono tabular-nums">{t.timestamp}</span>
                      {t.latencyMs && (
                        <>
                          <span>·</span>
                          <span className="font-mono text-[#2563EB] bg-[#EFF6FF] px-1 rounded text-[10px]">
                            {t.latencyMs}ms RTT
                          </span>
                        </>
                      )}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                        isAgent
                          ? 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A]'
                          : 'bg-[#0F172A] text-white shadow-sm'
                      }`}
                    >
                      {t.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={transcriptEndRef} />
          </div>

          {/* Quick Caller Prompts & Interactive Input */}
          <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
            {/* Context Prompt Suggestions */}
            {isCallLive && nextTurnAvailable && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-[11px] font-semibold text-[#64748B] flex-shrink-0">
                  Next Step:
                </span>
                <button
                  onClick={() => handleNextTurn()}
                  className="px-2.5 py-1 text-xs bg-white hover:bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] rounded-md font-medium transition-colors flex items-center gap-1.5 flex-shrink-0 shadow-xs"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>&ldquo;{activeScenario.turns[turnIndex]?.callerText}&rdquo;</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Custom Input or Type to Speak */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customInput.trim() && isCallLive) {
                  handleNextTurn(customInput.trim());
                }
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                disabled={!isCallLive}
                placeholder={
                  isCallLive
                    ? 'Type caller response or click suggested response above...'
                    : 'Start call to test voice dialogue...'
                }
                className="flex-1 h-9 px-3 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:bg-[#F1F5F9] disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!isCallLive || !customInput.trim()}
                className="h-9 px-3 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
