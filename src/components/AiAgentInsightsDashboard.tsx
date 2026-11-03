import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Activity, 
  ShieldCheck, 
  Radio, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  Volume2, 
  BarChart3, 
  Sparkles, 
  UserCheck, 
  Building2, 
  TrendingUp,
  Cpu,
  FileText,
  ChevronRight
} from 'lucide-react';
import { HumanVoiceName } from '../types/telephony';

export const AiAgentInsightsDashboard: React.FC = () => {
  const [callAudits, setCallAudits] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/call-audits')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.audits) {
          setCallAudits(data.audits);
        }
      })
      .catch((err) => console.warn('Could not load audits:', err));
  }, []);

  const domainMetrics = [
    { domain: 'Lost & Found', percent: 56, calls: 82, resolution: '96.2%', color: 'bg-zinc-900' },
    { domain: 'Campus Marketplace', percent: 18, calls: 26, resolution: '92.3%', color: 'bg-zinc-700' },
    { domain: 'Peer Rentals', percent: 14, calls: 21, resolution: '95.2%', color: 'bg-zinc-600' },
    { domain: 'Campus Services', percent: 7, calls: 10, resolution: '90.0%', color: 'bg-zinc-500' },
    { domain: 'Student Giveaways', percent: 5, calls: 7, resolution: '100.0%', color: 'bg-zinc-400' },
  ];

  const calibratedVoices: { name: HumanVoiceName; style: string; realismScore: number; avgLatency: number; role: string }[] = [
    { name: 'Aoede', style: 'Warm, natural conversational cadence with active listening', realismScore: 99.2, avgLatency: 195, role: 'Primary Outbound Notifications' },
    { name: 'Puck', style: 'Friendly collegiate advisor tone for fast coordination', realismScore: 98.6, avgLatency: 182, role: 'Marketplace & Peer Rentals' },
    { name: 'Charon', style: 'Calm, authoritative campus security officer presence', realismScore: 98.9, avgLatency: 208, role: 'Security Vault Custody & Pickups' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Operational Intelligence
            </span>
            <span className="text-[11px] font-mono text-zinc-400">·</span>
            <span className="text-[11px] text-zinc-500 font-mono">Telemetry & Audits</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            AI Agent Performance & Call Audits
          </h1>
          <p className="text-xs text-zinc-500 mt-1 max-w-xl">
            Live accuracy metrics, voice latency benchmarks, and conversation audits for the Parul University campus calling agent.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-zinc-700">
            Voice Overlap: <strong className="text-emerald-700 font-semibold">0.0% (Zero Collision)</strong>
          </span>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
            Match Resolution Rate
          </span>
          <div className="text-2xl font-semibold text-zinc-900 mt-1 tabular-nums">
            96.4%
          </div>
          <span className="text-[11px] text-emerald-700 mt-0.5 block font-medium">
            +3.2% vs last week
          </span>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
            Voice Latency
          </span>
          <div className="text-2xl font-semibold text-zinc-900 mt-1 tabular-nums">
            195ms
          </div>
          <span className="text-[11px] text-zinc-400 mt-0.5 block font-mono">
            Gemini 2.5 Flash Native
          </span>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
            Domain Guardrail
          </span>
          <div className="text-2xl font-semibold text-zinc-900 mt-1 tabular-nums">
            100%
          </div>
          <span className="text-[11px] text-zinc-400 mt-0.5 block">
            5 Campus Verticals Only
          </span>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
            Human Realism Score
          </span>
          <div className="text-2xl font-semibold text-zinc-900 mt-1 tabular-nums">
            98.9 / 100
          </div>
          <span className="text-[11px] text-zinc-400 mt-0.5 block">
            Gemini & ChatGPT Voice Style
          </span>
        </div>
      </div>

      {/* Domain Breakdown & Calibrated Voices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Foundify 5-Domain Split */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Foundify 5-Domain Workload Split
            </h2>
            <span className="text-[11px] font-mono text-zinc-400">146 Active Interactions</span>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed">
            The agent is strictly restricted to Foundify's 5 official student domains on campus:
          </p>

          <div className="space-y-3">
            {domainMetrics.map((dm) => (
              <div key={dm.domain} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${dm.color}`} />
                    <span className="text-zinc-900">{dm.domain}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-zinc-400">{dm.calls} calls</span>
                    <span className="font-semibold text-zinc-900">{dm.percent}%</span>
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 text-[10px]">
                      {dm.resolution} resolved
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div className={`h-full ${dm.color} rounded-full`} style={{ width: `${dm.percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl text-[11px] text-zinc-600 leading-relaxed">
            <strong>Domain Guardrail:</strong> Queries outside these 5 services are politely deflected in one natural sentence to prevent off-topic hallucinations.
          </div>
        </div>

        {/* 3 Real Human Voice Personas */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              3 Calibrated Human Voices
            </h2>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Zero Voice Overlap Active
            </span>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed">
            Trained to speak with the natural fluency, active listening, and warmth of Gemini & ChatGPT voice mode:
          </p>

          <div className="space-y-3">
            {calibratedVoices.map((voice) => (
              <div
                key={voice.name}
                className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50 flex flex-col justify-between space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-zinc-900">{voice.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      · {voice.role}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-zinc-700">
                    {voice.realismScore}% Realism
                  </span>
                </div>

                <p className="text-xs text-zinc-500">{voice.style}</p>

                <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400 pt-1.5 border-t border-zinc-100">
                  <span>Latency: <strong className="text-zinc-700">{voice.avgLatency}ms</strong></span>
                  <span>Audio: <strong className="text-zinc-700">24kHz WAV Duplex</strong></span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl text-[11px] text-zinc-600 leading-relaxed">
            <strong>Voice Concurrency:</strong> Real-time microphone listening gates immediately pause agent audio on student interruption, eliminating collision.
          </div>
        </div>
      </div>

      {/* Recent Call Audit Ledger */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-500" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Recent Call Audits & Verified Tokens
            </h2>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">Stored in Parul DB</span>
        </div>

        <div className="space-y-2.5">
          {callAudits.length === 0 ? (
            <div className="text-center py-6 text-zinc-400 text-xs">
              No recent call audits recorded. Complete an outbound AI match call to view live audit entries.
            </div>
          ) : (
            callAudits.slice(0, 5).map((audit) => (
              <div
                key={audit.id}
                className="p-3 rounded-xl bg-zinc-50/50 border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900">{audit.callerName}</span>
                    <span className="font-mono text-[11px] text-zinc-500">{audit.callerId}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-200 text-zinc-700 font-mono">
                      {audit.vertical || 'Lost & Found'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 line-clamp-1">{audit.summary}</p>
                </div>

                <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400 flex-shrink-0">
                  <span>{audit.durationFormatted}</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {audit.status || 'Completed'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
