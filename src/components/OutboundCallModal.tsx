import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Send,
  User,
  Radio,
  FileCheck,
  ChevronDown
} from 'lucide-react';
import { HumanVoiceName } from '../types/telephony';
import { AudioWaveform } from './AudioWaveform';
import { playWavBase64 } from '../utils/audioUtils';

export interface OutboundCallTarget {
  phone: string;
  studentName: string;
  itemTitle?: string;
  lostLocation?: string;
  foundLocation?: string;
  identifyingFeature?: string;
  vaultToken?: string;
  category?: string;
  matchScore?: number;
  assignedVoice?: HumanVoiceName;
  language?: 'en' | 'hi' | 'te';
}

interface OutboundCallModalProps {
  isOpen: boolean;
  target: OutboundCallTarget | null;
  onClose: () => void;
  onCallCompleted?: (audit: any) => void;
}

interface DialogueTurn {
  id: string;
  speaker: 'agent' | 'student';
  text: string;
  timestamp: string;
}

export const OutboundCallModal: React.FC<OutboundCallModalProps> = ({
  isOpen,
  target,
  onClose,
  onCallCompleted,
}) => {
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState<boolean>(false);
  const [selectedVoice, setSelectedVoice] = useState<HumanVoiceName>('Aoede');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'te'>('en');
  const [dialogue, setDialogue] = useState<DialogueTurn[]>([]);
  const [studentInput, setStudentInput] = useState<string>('');
  const [isAgentSpeaking, setIsAgentSpeaking] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [callState, setCallState] = useState<'connecting' | 'connected' | 'completed'>('connecting');

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioBusyRef = useRef<boolean>(false);
  const dialogueEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && target) {
      setSelectedVoice(target.assignedVoice || 'Aoede');
      setSelectedLanguage(target.language || 'en');
      setCallDuration(0);
      setCallState('connecting');

      // Start initial call connection after short realistic ring (900ms)
      const connectTimer = setTimeout(() => {
        setCallState('connected');
        triggerInitialAgentGreeting(target);
      }, 900);

      // Start duration counter
      timerRef.current = setInterval(() => {
        setCallDuration((d) => d + 1);
      }, 1000);

      return () => {
        clearTimeout(connectTimer);
        clearInterval(timerRef.current);
        stopAudio();
      };
    } else {
      stopAudio();
      clearInterval(timerRef.current);
    }
  }, [isOpen, target]);

  // Scroll to bottom of dialogue
  useEffect(() => {
    dialogueEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogue, isAgentSpeaking]);

  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    audioBusyRef.current = false;
    setIsAgentSpeaking(false);
  };

  // 1. Natural greeting with exact location matching (ChatGPT / Gemini style)
  const triggerInitialAgentGreeting = async (tgt: OutboundCallTarget) => {
    const student = tgt.studentName || 'Student';
    const item = tgt.itemTitle || 'belongings';
    const lostLoc = tgt.lostLocation || 'campus';
    const foundLoc = tgt.foundLocation || 'security custody';
    const token = tgt.vaultToken || 'PU-SEC-8821';

    // Tailored human opener: exactly stating match context
    const greetingText = `Hello ${student}! This is Foundify AI calling regarding the ${item} you reported lost at ${lostLoc}. We just found an exact match recovered at ${foundLoc}, safely held in our campus security vault under token ${token}. Are you available to verify a few quick details?`;

    const initialTurn: DialogueTurn = {
      id: 'turn-1',
      speaker: 'agent',
      text: greetingText,
      timestamp: '00:01',
    };

    setDialogue([initialTurn]);

    // Synthesize audio
    speakAgentTurn(greetingText, tgt.assignedVoice || selectedVoice, tgt.language || selectedLanguage);
  };

  // 2. Play speech using Gemini native voice output
  const speakAgentTurn = async (text: string, voiceName: HumanVoiceName, lang: string) => {
    if (isSpeakerMuted || audioBusyRef.current) return;

    try {
      audioBusyRef.current = true;
      setIsAgentSpeaking(true);

      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          voice: voiceName,
          language: lang,
          context: {
            activeTopic: target?.itemTitle,
            location: target?.lostLocation,
          },
        }),
      });

      if (!res.ok) throw new Error('Speech synthesis failed');
      const data = await res.json();

      if (data.audio) {
        const audio = await playWavBase64(data.audio);
        if (audio) {
          currentAudioRef.current = audio;
          audio.onended = () => {
            audioBusyRef.current = false;
            setIsAgentSpeaking(false);
          };
          audio.onerror = () => {
            audioBusyRef.current = false;
            setIsAgentSpeaking(false);
          };
        } else {
          audioBusyRef.current = false;
          setIsAgentSpeaking(false);
        }
      } else {
        audioBusyRef.current = false;
        setIsAgentSpeaking(false);
      }
    } catch (e) {
      console.warn('Voice playback note:', e);
      audioBusyRef.current = false;
      setIsAgentSpeaking(false);
    }
  };

  // 3. User / Student sends a reply during the call
  const handleSendStudentReply = async (messageText?: string) => {
    const textToSend = messageText || studentInput;
    if (!textToSend.trim() || isProcessing) return;

    const currentSec = callDuration;
    const timeFormatted = `${String(Math.floor(currentSec / 60)).padStart(2, '0')}:${String(currentSec % 60).padStart(2, '0')}`;

    const studentTurn: DialogueTurn = {
      id: `turn-${Date.now()}-student`,
      speaker: 'student',
      text: textToSend.trim(),
      timestamp: timeFormatted,
    };

    const newDialogue = [...dialogue, studentTurn];
    setDialogue(newDialogue);
    setStudentInput('');
    setIsProcessing(true);

    try {
      const history = newDialogue.map((d) => ({
        sender: d.speaker === 'agent' ? 'assistant' : 'user',
        text: d.text,
      }));

      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history,
          voice: selectedVoice,
          language: selectedLanguage,
          context: {
            activeTopic: target?.itemTitle,
            location: target?.lostLocation,
            foundLocation: target?.foundLocation,
            token: target?.vaultToken,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.text || 'I have verified that for you.';

        const agentTurn: DialogueTurn = {
          id: `turn-${Date.now()}-agent`,
          speaker: 'agent',
          text: replyText,
          timestamp: timeFormatted,
        };

        setDialogue((prev) => [...prev, agentTurn]);

        // Synthesize agent audio response without voice overlap
        if (!isSpeakerMuted && data.audio) {
          stopAudio();
          audioBusyRef.current = true;
          setIsAgentSpeaking(true);
          const audio = await playWavBase64(data.audio);
          if (audio) {
            currentAudioRef.current = audio;
            audio.onended = () => {
              audioBusyRef.current = false;
              setIsAgentSpeaking(false);
            };
            audio.onerror = () => {
              audioBusyRef.current = false;
              setIsAgentSpeaking(false);
            };
          } else {
            audioBusyRef.current = false;
            setIsAgentSpeaking(false);
          }
        }
      }
    } catch (err) {
      console.error('Call conversation turn error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. Hang up & finalize call audit
  const handleEndCall = () => {
    stopAudio();
    clearInterval(timerRef.current);
    setCallState('completed');

    const durationFormatted = `${String(Math.floor(callDuration / 60)).padStart(2, '0')}:${String(callDuration % 60).padStart(2, '0')}`;

    const auditRecord = {
      id: `call-pu-${Math.floor(1000 + Math.random() * 9000)}`,
      callerId: target?.phone || '+91 98765 43210',
      callerName: target?.studentName || 'Student',
      vertical: target?.category || 'Lost & Found',
      campusLocation: target?.lostLocation || 'Parul University Campus',
      voiceModel: `Gemini 2.5 Flash (${selectedVoice})`,
      durationFormatted,
      durationSeconds: callDuration,
      status: 'Completed',
      sentiment: 'Resolved',
      summary: `Automated outbound AI match verification call to ${target?.studentName}. Item: ${target?.itemTitle}. Custody token verified: ${target?.vaultToken || 'PU-SEC-8821'}.`,
      resolution: 'Student identity verified. Retrieval instructions confirmed for Building C5 Room 102 Security Desk.',
      dialogue,
    };

    // Post audit record to server
    fetch('/api/call-audits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(auditRecord),
    }).catch((e) => console.warn('Audit record note:', e));

    if (onCallCompleted) {
      onCallCompleted(auditRecord);
    }

    setTimeout(() => {
      onClose();
    }, 600);
  };

  if (!isOpen || !target) return null;

  const durationFormatted = `${String(Math.floor(callDuration / 60)).padStart(2, '0')}:${String(callDuration % 60).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header Bar */}
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-medium text-sm">
              {target.studentName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-zinc-900">{target.studentName}</h3>
                <span className="text-[11px] font-mono text-zinc-500">{target.phone}</span>
              </div>
              <p className="text-xs text-zinc-500">
                Outbound AI Match Notification · Parul Campus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded-md">
              {durationFormatted}
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-medium border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-sf-pulse" />
              <span>Live Outbound</span>
            </div>
          </div>
        </div>

        {/* Match Grounding Context Banner */}
        <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-100 text-xs flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-zinc-900">{target.itemTitle}</span>
            {target.vaultToken && (
              <span className="font-mono text-[11px] font-medium text-zinc-700 bg-white border border-zinc-200 px-2 py-0.5 rounded">
                Vault Token: {target.vaultToken}
              </span>
            )}
          </div>
          <div className="text-[11px] text-zinc-500 flex flex-wrap items-center gap-x-2">
            <span>Lost at: {target.lostLocation || 'Campus'}</span>
            <span>·</span>
            <span>Found at: {target.foundLocation || 'Security Desk'}</span>
          </div>
        </div>

        {/* Live Audio Visualizer Canvas */}
        <div className="px-5 py-3 bg-white border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-medium">Voice Model:</span>
            <div className="flex items-center gap-1">
              {(['Aoede', 'Puck', 'Charon'] as HumanVoiceName[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVoice(v)}
                  className={`text-[11px] px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                    selectedVoice === v
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AudioWaveform isActive={isAgentSpeaking} height={20} barCount={18} />
            <span className="text-[11px] font-mono text-zinc-400">
              {isAgentSpeaking ? 'AI Speaking' : 'Listening'}
            </span>
          </div>
        </div>

        {/* Live Conversation Transcript */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-white text-xs">
          {dialogue.map((turn) => {
            const isAgent = turn.speaker === 'agent';
            return (
              <div
                key={turn.id}
                className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[10px] text-zinc-400 font-medium">
                  <span>{isAgent ? `Foundify AI (${selectedVoice})` : target.studentName}</span>
                  <span>·</span>
                  <span className="font-mono">{turn.timestamp}</span>
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    isAgent
                      ? 'bg-zinc-100 text-zinc-900'
                      : 'bg-zinc-900 text-white'
                  }`}
                >
                  {turn.text}
                </div>
              </div>
            );
          })}
          {isProcessing && (
            <div className="flex items-center gap-2 text-zinc-400 text-xs py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce delay-200" />
              <span className="text-[11px]">Foundify AI thinking...</span>
            </div>
          )}
          <div ref={dialogueEndRef} />
        </div>

        {/* Quick Follow-up Responses (Simulates Real Student Voice Responses) */}
        <div className="px-5 py-2 bg-zinc-50 border-t border-zinc-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-zinc-400 flex-shrink-0">Student replies:</span>
          {[
            'Yes, that is mine! Thank you!',
            'Where can I come to collect it?',
            'What is the token number for pickup?',
            'Can I pick it up tomorrow morning?',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendStudentReply(prompt)}
              disabled={isProcessing}
              className="flex-shrink-0 px-2.5 py-1 bg-white border border-zinc-200 rounded-lg text-zinc-700 hover:text-zinc-900 hover:border-zinc-300 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input & Call Controls */}
        <div className="p-4 bg-white border-t border-zinc-200/80 flex flex-col gap-3">
          {/* Custom text reply */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={studentInput}
              onChange={(e) => setStudentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendStudentReply();
              }}
              placeholder="Type student response to test AI agent..."
              className="flex-1 h-9 px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
            />
            <button
              onClick={() => handleSendStudentReply()}
              disabled={!studentInput.trim() || isProcessing}
              className="h-9 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
                className={`p-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  isSpeakerMuted
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                }`}
                title={isSpeakerMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
              >
                {isSpeakerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={handleEndCall}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-medium shadow-xs transition-colors cursor-pointer"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>End Call & File Audit</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
