import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Sliders, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Volume2, 
  UserCheck, 
  Building2,
  AlertTriangle,
  Save
} from 'lucide-react';
import { HumanVoiceName, AgentPromptConfig } from '../types/telephony';
import { SYSTEM_PROMPTS } from '../data/mockTelephonyData';
import { playWavBase64 } from '../utils/audioUtils';

interface AgentPersonaStudioProps {
  currentVoice: HumanVoiceName;
  onVoiceChange: (voice: HumanVoiceName) => void;
  currentLanguage: 'en' | 'hi' | 'te';
  onLanguageChange: (lang: 'en' | 'hi' | 'te') => void;
}

const HUMAN_VOICE_PRESETS: { name: HumanVoiceName; tone: string; description: string; bestFor: string; tag: string }[] = [
  { 
    name: 'Aoede', 
    tone: 'Warm, natural conversational cadence (Female)', 
    description: 'Empathetic and ultra-natural human tone; ideal for polite student calls, reassuring outbound notifications, and registry updates.',
    bestFor: 'Outbound Match Calls & Campus Verification (Recommended)',
    tag: 'Ultra-Real Human'
  },
  { 
    name: 'Puck', 
    tone: 'Friendly, relatable & energetic collegiate (Male)', 
    description: 'Natural conversational pace; excellent for fast inquiries across Marketplace, Rentals, Food Court, and Giveaways.',
    bestFor: 'Marketplace Deals & Rentals Concierge',
    tag: 'Natural Collegiate'
  },
  { 
    name: 'Charon', 
    tone: 'Authoritative, deep & professional (Male)', 
    description: 'Grounded and official tone; calibrated for Campus Security, C5 Vault Room 102 dispatch, and verified handovers.',
    bestFor: 'C5 Security Vault & Campus Police Coordination',
    tag: 'Officer Authority'
  },
];

export const AgentPersonaStudio: React.FC<AgentPersonaStudioProps> = ({
  currentVoice,
  onVoiceChange,
  currentLanguage,
  onLanguageChange,
}) => {
  const [config, setConfig] = useState<AgentPromptConfig>(SYSTEM_PROMPTS['Lost & Found']);
  const [isPlayingSample, setIsPlayingSample] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const lines = config.systemPrompt.split('\n');

  const handleTestVoiceAudio = async (voiceToTest: HumanVoiceName = currentVoice) => {
    setIsPlayingSample(true);
    const sampleText =
      currentLanguage === 'hi'
        ? `नमस्ते! मैं फाउंडीफाई एआई हूँ, पारुल यूनिवर्सिटी का वॉइस असिस्टेंट। क्या आपका कोई सामान खो गया है?`
        : currentLanguage === 'te'
        ? `నమస్కారం! నేను ఫౌండిఫై ఏఐ, పారుల్ యూనివర్సిటీ అధికారిక వాయిస్ అసిస్టెంట్. నేను మీకు ఎలా సహాయపడగలను?`
        : `Hello! I am Foundify AI, the official voice calling assistant for Parul University campus. I can verify matches and coordinate security vault pickups.`;

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sampleText,
          voice: voiceToTest,
          language: currentLanguage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audio) {
          const audio = await playWavBase64(data.audio);
          if (audio) {
            audio.onended = () => setIsPlayingSample(false);
            return;
          }
        }
      }
    } catch (e) {
      console.warn('TTS sample test notice:', e);
    }

    // SpeechSynthesis fallback
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(sampleText);
      utt.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'te' ? 'te-IN' : 'en-IN';
      utt.onend = () => setIsPlayingSample(false);
      utt.onerror = () => setIsPlayingSample(false);
      window.speechSynthesis.speak(utt);
    } else {
      setIsPlayingSample(false);
    }
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Agent Persona &amp; Acoustic Configuration
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              Gemini 3.8 Live Pipeline
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">
            Foundify AI Calling Persona · Parul University
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Configured for human voice synthesis, strict campus containment, and sub-150ms latency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTestVoiceAudio(currentVoice)}
            disabled={isPlayingSample}
            className="h-9 px-3.5 bg-blue-50 hover:bg-blue-100 text-[#1D4ED8] border border-blue-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isPlayingSample ? 'animate-bounce' : ''}`} />
            <span>{isPlayingSample ? 'Synthesizing...' : 'Sample Voice Audio'}</span>
          </button>

          <button
            onClick={handleSave}
            className="h-9 px-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Deployed' : 'Save Config'}</span>
          </button>
        </div>
      </div>

      {/* Human Voice Selection Grid */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Human Voices for Agent Calling (3 Calibrated Realistic Voices)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#64748B]">Active Language:</span>
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as any)}
              className="h-8 px-2.5 text-xs font-semibold bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[#0F172A] cursor-pointer"
            >
              <option value="en">English (Campus)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {HUMAN_VOICE_PRESETS.map((vp) => {
            const isSelected = currentVoice === vp.name;
            return (
              <div
                key={vp.name}
                onClick={() => {
                  onVoiceChange(vp.name);
                  handleTestVoiceAudio(vp.name);
                }}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#EFF6FF] border-[#2563EB] shadow-xs ring-1 ring-[#2563EB]'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-[#0F172A]">{vp.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-800">
                        {vp.tag}
                      </span>
                    </div>
                    {isSelected ? (
                      <span className="px-2 py-0.5 rounded-md bg-[#2563EB] text-white font-mono text-[10px] font-bold">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#2563EB] font-semibold">Select</span>
                    )}
                  </div>
                  <span className="font-semibold text-xs text-[#2563EB] block mb-1">{vp.tone}</span>
                  <p className="text-[11px] text-[#475569] leading-relaxed mb-2">{vp.description}</p>
                </div>

                <div className="pt-2 border-t border-[#E2E8F0]/70 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                  <span>Best: {vp.bestFor}</span>
                  <Volume2 className="w-3.5 h-3.5 text-[#2563EB]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor & Parameter Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Strict Campus System Prompt Sandbox */}
        <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-xl shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] overflow-hidden flex flex-col h-[520px]">
          <div className="h-10 px-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
              <span>Campus Containment Prompt Instructions</span>
              <span className="font-mono text-[10px] text-[#2563EB] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                Parul University Guardrail
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#64748B]">
              {lines.length} Lines · Strict Containment
            </span>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className="w-12 bg-[#F8FAFC] border-r border-[#E2E8F0] py-3 select-none text-right pr-3 font-mono text-[11px] leading-6 text-[#94A3B8]">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            <textarea
              value={config.systemPrompt}
              onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
              spellCheck={false}
              className="flex-1 p-3 bg-white font-mono text-[11px] leading-6 text-[#0F172A] resize-none focus:outline-none focus:ring-0 overflow-y-auto"
            />
          </div>
        </div>

        {/* Right: Telephony Parameters */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F1F5F9]">
              <Sliders className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Acoustic Tuning Parameters
              </h3>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#475569]">Sampling Temperature</span>
                <span className="font-mono font-bold text-[#0F172A]">{config.temperature}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={config.temperature}
                onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                className="w-full accent-[#2563EB] cursor-pointer"
              />
              <p className="text-[11px] text-[#94A3B8]">
                Low temperature guarantees precise item and building identification.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#475569]">Speech Cadence (Rate)</span>
                <span className="font-mono font-bold text-[#0F172A]">{config.speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.85"
                max="1.25"
                step="0.05"
                value={config.speechRate}
                onChange={(e) => setConfig({ ...config, speechRate: parseFloat(e.target.value) })}
                className="w-full accent-[#2563EB] cursor-pointer"
              />
              <p className="text-[11px] text-[#94A3B8]">
                Natural human pacing optimized for telephone lines.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#475569]">Barge-In Sensitivity</span>
                <span className="font-mono font-bold text-emerald-700">{config.bargeInSensitivity}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="5"
                value={config.bargeInSensitivity}
                onChange={(e) => setConfig({ ...config, bargeInSensitivity: parseInt(e.target.value, 10) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <p className="text-[11px] text-[#94A3B8]">
                Promptly yields voice channel when student interrupts.
              </p>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-300 rounded-xl p-4 text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Campus Guardrail Enforcement</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              Foundify AI is strictly configured to answer questions regarding belongings around Parul University. Off-campus or generic homework queries are deflective.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
