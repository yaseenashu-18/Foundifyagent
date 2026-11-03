import React from 'react';
import { 
  Phone, 
  PhoneIncoming, 
  PhoneOutgoing, 
  Zap, 
  Activity, 
  Hash, 
  ShieldCheck, 
  Building2,
  Radio
} from 'lucide-react';

interface PlatformHeaderProps {
  onOpenDialer: () => void;
  onQuickOutbound: () => void;
  onQuickInbound: () => void;
  isCallLive: boolean;
  activeCallsCount: number;
}

export const PlatformHeader: React.FC<PlatformHeaderProps> = ({
  onOpenDialer,
  onQuickOutbound,
  onQuickInbound,
  isCallLive,
  activeCallsCount,
}) => {
  return (
    <header className="h-14 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between select-none z-10 sticky top-0 shrink-0">
      {/* Zone 1: Breadcrumbs & Campus Context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-[#0F172A] tracking-tight">Foundify Voice AI</span>
          <span className="text-[#CBD5E1]">/</span>
          <span className="text-[#64748B] font-medium">Parul University Campus</span>
          <span className="text-[#CBD5E1]">/</span>
          <span className="text-[#2563EB] font-mono font-semibold">Autonomous Dispatcher</span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium">
          <Building2 className="w-3 h-3 text-amber-700" />
          <span>Restricted to Parul University</span>
        </div>
      </div>

      {/* Zone 2: Acoustic Telemetry & Session Health */}
      <div className="hidden md:flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCallLive ? 'bg-[#10B981]' : 'bg-[#2563EB]'}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isCallLive ? 'bg-[#10B981]' : 'bg-[#2563EB]'}`} />
          </span>
          <span className="font-mono text-[#475569] text-[11px]">
            {isCallLive ? (
              <strong className="text-[#10B981]">ACTIVE 24KHZ LIVE STREAM</strong>
            ) : (
              <span>GEMINI 3.8 LIVE READY</span>
            )}
          </span>
        </div>

        <span className="text-[#CBD5E1]">|</span>

        <div className="flex items-center gap-1.5 text-xs text-[#475569]">
          <Zap className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>P95 RTT:</span>
          <span className="font-mono font-bold text-[#0F172A] tabular-nums">148ms</span>
        </div>

        <span className="text-[#CBD5E1]">|</span>

        <div className="flex items-center gap-1.5 text-xs text-[#475569]">
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          <span>Active Calls:</span>
          <span className="font-mono font-bold text-[#0F172A] tabular-nums">
            {activeCallsCount + (isCallLive ? 1 : 0)}
          </span>
        </div>
      </div>

      {/* Zone 3: Primary Operational Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenDialer}
          className="h-8 px-2.5 text-xs font-semibold bg-white border border-[#E2E8F0] text-[#1E293B] rounded-lg hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all flex items-center gap-1.5 active:scale-98 cursor-pointer"
          title="Open manual phone dialer"
        >
          <Hash className="w-3.5 h-3.5 text-[#64748B]" />
          <span className="hidden sm:inline">Keypad Dialer</span>
        </button>

        <button
          onClick={onQuickInbound}
          disabled={isCallLive}
          className="h-8 px-2.5 text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-900 rounded-lg hover:bg-blue-100 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          title="Simulate inbound student call to Parul University Helpline Ext 102"
        >
          <PhoneIncoming className="w-3.5 h-3.5 text-blue-700" />
          <span className="hidden sm:inline">Helpline (Ext 102)</span>
        </button>

        <button
          onClick={onQuickOutbound}
          disabled={isCallLive}
          className="h-8 px-3 text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg transition-all flex items-center gap-1.5 shadow-xs active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          <PhoneOutgoing className="w-3.5 h-3.5 fill-current" />
          <span>Dispatch Outbound Call</span>
        </button>
      </div>
    </header>
  );
};
