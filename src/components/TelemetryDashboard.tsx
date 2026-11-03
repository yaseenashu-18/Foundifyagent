import React from 'react';
import { 
  Zap, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  PhoneCall, 
  Activity, 
  Radio, 
  TrendingUp, 
  ShieldCheck,
  Server
} from 'lucide-react';
import { TELEMETRY_METRICS } from '../data/mockTelephonyData';
import { ServiceChip } from './ServiceChip';
import { FoundifyVertical } from '../types/telephony';

interface TelemetryDashboardProps {
  onSelectVertical: (vertical: FoundifyVertical) => void;
}

export const TelemetryDashboard: React.FC<TelemetryDashboardProps> = ({ onSelectVertical }) => {
  const metricCards = [
    {
      title: 'Total Inbound Sessions',
      value: '1,428',
      trend: '+12.4% today',
      trendUp: true,
      sublabel: 'Across 5 active DID trunks',
      icon: PhoneCall,
      color: 'text-[#2563EB]',
      bgColor: 'bg-[#EFF6FF]',
    },
    {
      title: 'P95 Audio Latency',
      value: '182ms',
      trend: '-18ms below SLA',
      trendUp: true,
      sublabel: 'First-byte speech return',
      icon: Zap,
      color: 'text-[#10B981]',
      bgColor: 'bg-[#ECFDF5]',
    },
    {
      title: 'Avg Handling Time (AHT)',
      value: '1m 48s',
      trend: '-14s vs standard',
      trendUp: true,
      sublabel: 'Turnaround speed',
      icon: Clock,
      color: 'text-[#0284C7]',
      bgColor: 'bg-[#F0F9FF]',
    },
    {
      title: 'Autonomous Containment',
      value: '88.4%',
      trend: '+3.1% this week',
      trendUp: true,
      sublabel: 'Zero human escalation',
      icon: CheckCircle2,
      color: 'text-[#10B981]',
      bgColor: 'bg-[#ECFDF5]',
    },
    {
      title: 'Cost Per Voice Minute',
      value: '$0.038',
      trend: '68% cost reduction',
      trendUp: true,
      sublabel: 'STT + LLM + TTS pipeline',
      icon: DollarSign,
      color: 'text-[#0F172A]',
      bgColor: 'bg-[#F1F5F9]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div>
        <h2 className="text-xl font-semibold text-[#0F172A] tracking-tight">
          Operational Telemetry & Performance
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Real-time carrier latency, acoustic clarity, and autonomous resolution metrics across Foundify infrastructure.
        </p>
      </div>

      {/* High-Density Metric Cards (Pure #FFFFFF background, 1px solid #E2E8F0 perimeter, 12px radius, data-metric figure) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metricCards.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    {m.title}
                  </span>
                  <div className={`w-7 h-7 rounded-lg ${m.bgColor} ${m.color} flex items-center justify-center`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* data-metric figure in JetBrains Mono font */}
                <div className="font-mono text-[28px] font-semibold text-[#0F172A] tracking-tight tabular-nums leading-tight">
                  {m.value}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-[11px]">
                <span className="text-[#64748B] truncate">{m.sublabel}</span>
                <span className="font-medium text-[#10B981] bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0] flex-shrink-0">
                  {m.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operational Grids: Vertical Breakdown & Carrier Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Service Vertical Distribution & Latency */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A]">Vertical Workload Allocation</h3>
              <p className="text-xs text-[#64748B]">Telephony volume distribution across Foundify business verticals</p>
            </div>
            <span className="text-xs font-mono text-[#2563EB] bg-[#EFF6FF] px-2 py-1 rounded border border-[#BFDBFE]">
              5 Active Modules
            </span>
          </div>

          <div className="space-y-4">
            {TELEMETRY_METRICS.verticalBreakdown.map((item) => (
              <div
                key={item.vertical}
                onClick={() => onSelectVertical(item.vertical as FoundifyVertical)}
                className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ServiceChip vertical={item.vertical as FoundifyVertical} size="sm" />
                    <span className="text-xs font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {item.count} Calls
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-[#64748B]">
                    <span>AHT: <strong className="text-[#0F172A]">{item.avgDuration}</strong></span>
                    <span>·</span>
                    <span className="text-[#10B981] font-semibold">{item.latency}</span>
                    <span>·</span>
                    <strong className="text-[#0F172A]">{item.share}%</strong>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.share}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: SIP Carrier Infrastructure & Latency Distribution */}
        <div className="lg:col-span-5 space-y-4">
          {/* SIP Network Health */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#10B981]" />
                <h3 className="text-sm font-semibold text-[#0F172A]">Carrier SIP Trunk Health</h3>
              </div>
              <span className="text-[11px] font-mono text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                All Nodes Optimal
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono mb-4">
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                <span className="text-[10px] uppercase font-semibold text-[#94A3B8] block">Mean Opinion Score</span>
                <span className="text-lg font-bold text-[#0F172A] block mt-0.5">4.42 / 5.0</span>
                <span className="text-[11px] text-[#10B981]">HD Acoustic Quality</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                <span className="text-[10px] uppercase font-semibold text-[#94A3B8] block">Packet Jitter</span>
                <span className="text-lg font-bold text-[#0F172A] block mt-0.5">1.2ms</span>
                <span className="text-[11px] text-[#10B981]">&lt; 5ms target</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-white border border-[#E2E8F0]">
                <span className="text-[#64748B]">Primary Carrier Gateway</span>
                <span className="font-mono text-[#0F172A]">sfo-carrier-01.sip.foundify.ai</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-white border border-[#E2E8F0]">
                <span className="text-[#64748B]">Audio Transcoder Codec</span>
                <span className="font-mono text-[#0F172A]">Opus Fullband (48 kHz)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-white border border-[#E2E8F0]">
                <span className="text-[#64748B]">Failover Redundancy</span>
                <span className="font-mono text-[#10B981]">Active (3 Geo-Regions)</span>
              </div>
            </div>
          </div>

          {/* Hourly Latency Timeline Chart Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
            <h3 className="text-sm font-semibold text-[#0F172A] mb-1">P95 Latency Trend (24h)</h3>
            <p className="text-xs text-[#64748B] mb-3">RTT from speech end to first acoustic token</p>

            <div className="h-28 flex items-end justify-between gap-2 pt-2">
              {TELEMETRY_METRICS.hourlyLatency.map((slot) => {
                const heightPercent = Math.min(100, Math.max(30, ((slot.latency - 140) / 100) * 100));
                return (
                  <div key={slot.hour} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-mono text-[#64748B]">{slot.latency}ms</span>
                    <div
                      className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] rounded-t-sm transition-all"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] font-mono text-[#94A3B8]">{slot.hour}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
