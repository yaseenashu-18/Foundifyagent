import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Download, 
  Zap, 
  CheckCircle2, 
  PhoneCall, 
  Server, 
  Clock, 
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { CallRecord } from '../types/telephony';
import { ServiceChip } from './ServiceChip';
import { AudioWaveform } from './AudioWaveform';

interface CallInspectorDrawerProps {
  call: CallRecord | null;
  onClose: () => void;
}

export const CallInspectorDrawer: React.FC<CallInspectorDrawerProps> = ({ call, onClose }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(35);

  if (!call) return null;

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  const handleDownloadTranscript = () => {
    const transcriptText = call.transcript
      .map((t) => `[${t.timestamp}] ${t.speaker.toUpperCase()}: ${t.text} (Latency: ${t.latencyMs || 'N/A'}ms)`)
      .join('\n\n');
    
    const blob = new Blob(
      [`FOUNDIFY VOICE AI - CALL TRANSCRIPT RECORD\nCall SID: ${call.callSid}\nCaller: ${call.callerName} (${call.callerId})\nVertical: ${call.vertical}\nDuration: ${call.durationFormatted}\nDate: ${call.dateFormatted}\n\nSUMMARY:\n${call.summary}\n\nRESOLUTION:\n${call.resolution}\n\nFULL TRANSCRIPT:\n${transcriptText}`],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `foundify-call-${call.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity">
      <div 
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-[#94A3B8] animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center border border-[#BFDBFE]">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-[#0F172A]">{call.callerName}</h3>
                <ServiceChip vertical={call.vertical} size="sm" />
              </div>
              <p className="text-xs font-mono text-[#64748B]">{call.callerId} · SID: {call.callSid.slice(0, 16)}...</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTranscript}
              title="Download Transcript"
              className="h-8 px-2.5 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Audio Player Card */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#0F172A]">Telephony Call Recording</span>
                <span className="text-[10px] font-mono text-[#64748B] bg-white border border-[#E2E8F0] px-1.5 py-0.5 rounded">
                  Opus 48kHz
                </span>
              </div>
              <span className="text-xs font-mono font-semibold text-[#0F172A] tabular-nums">
                {call.durationFormatted}
              </span>
            </div>

            {/* Audio Waveform Scrubber */}
            <div className="py-2">
              <AudioWaveform
                isActive={isPlayingAudio}
                colorScheme="sapphire"
                barCount={52}
                height={32}
                intensity={0.8}
              />
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] mt-2">
              <button
                onClick={toggleAudio}
                className="h-8 px-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {isPlayingAudio ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlayingAudio ? 'Pause Playback' : 'Play Audio Stream'}</span>
              </button>

              <div className="flex items-center gap-3 text-xs font-mono text-[#64748B]">
                <span>Speed: 1.0x</span>
                <span>·</span>
                <span className="text-[#10B981] font-semibold">{call.latencyMs}ms P95</span>
              </div>
            </div>
          </div>

          {/* Quick Telemetry Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-white border border-[#E2E8F0] rounded-lg">
              <span className="text-[10px] font-semibold uppercase text-[#94A3B8] block">Voice Model</span>
              <span className="text-xs font-medium text-[#0F172A] truncate block mt-0.5">
                {call.voiceModel}
              </span>
            </div>
            <div className="p-3 bg-white border border-[#E2E8F0] rounded-lg">
              <span className="text-[10px] font-semibold uppercase text-[#94A3B8] block">Latency RTT</span>
              <span className="text-xs font-mono font-semibold text-[#10B981] block mt-0.5">
                {call.latencyMs}ms
              </span>
            </div>
            <div className="p-3 bg-white border border-[#E2E8F0] rounded-lg">
              <span className="text-[10px] font-semibold uppercase text-[#94A3B8] block">Cost</span>
              <span className="text-xs font-mono font-semibold text-[#0F172A] block mt-0.5">
                ${call.costUsd.toFixed(3)}
              </span>
            </div>
          </div>

          {/* Executive Summary & Resolution */}
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Intent & Summary
              </h4>
              <p className="text-xs text-[#1E293B] leading-relaxed bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3">
                {call.summary}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Resolution Ledger
              </h4>
              <div className="flex items-start gap-2 p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-lg text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{call.resolution}</span>
              </div>
            </div>
          </div>

          {/* Extracted Entities */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2">
              Captured Entities ({call.entities.length})
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {call.entities.map((ent, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-[#E2E8F0] bg-white text-xs">
                  <span className="text-[10px] font-semibold uppercase text-[#94A3B8] block">
                    {ent.label}
                  </span>
                  <span className="font-medium text-[#0F172A] block mt-0.5 truncate">
                    {ent.value}
                  </span>
                  <span className="text-[10px] font-mono text-[#10B981] mt-1 block">
                    {Math.round(ent.confidence * 100)}% match
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Full Turn-by-turn Transcript */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2">
              Full Dialogue Log
            </h4>
            <div className="space-y-2.5">
              {call.transcript.map((turn) => {
                const isAgent = turn.speaker === 'agent';
                return (
                  <div key={turn.id} className="text-xs border border-[#F1F5F9] rounded-lg p-3 bg-white">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className={`font-semibold ${isAgent ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>
                        {isAgent ? 'Foundify Voice AI' : call.callerName}
                      </span>
                      <div className="flex items-center gap-2 text-[#94A3B8] font-mono">
                        <span>{turn.timestamp}</span>
                        {turn.latencyMs && <span>· {turn.latencyMs}ms</span>}
                      </div>
                    </div>
                    <p className="text-[#334155] leading-relaxed">{turn.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIP Carrier Diagnostics */}
          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block">
              SIP Trunking Telemetry
            </span>
            <div className="flex items-center justify-between font-mono text-[11px] text-[#64748B]">
              <span>SIP URI:</span>
              <span className="text-[#0F172A]">{call.sipTrunk}</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] text-[#64748B]">
              <span>Packet Jitter:</span>
              <span className="text-[#10B981]">{call.packetJitterMs} ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
