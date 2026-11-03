import React from 'react';
import { Phone, Zap, Activity, Hash } from 'lucide-react';
import { FoundifyVertical } from '../types/telephony';

interface HeaderProps {
  onOpenDialer: () => void;
  onQuickSimulate: () => void;
  selectedVertical: FoundifyVertical | 'All';
  isCallLive: boolean;
  activeCallsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDialer,
  onQuickSimulate,
  selectedVertical,
  isCallLive,
  activeCallsCount,
}) => {
  return (
    <header className="h-14 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between select-none z-10 sticky top-0">
      {/* Left Operational Signals */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Context:</span>
          <span className="text-xs font-medium text-[#0F172A] bg-[#F8FAFC] px-2.5 py-1 rounded-md border border-[#E2E8F0]">
            {selectedVertical === 'All' ? 'All Verticals (Unified Router)' : `Vertical: ${selectedVertical}`}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[#E2E8F0]">
          <div className="flex items-center gap-1.5 text-xs text-[#475569]">
            <Zap className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>P95 Audio Latency:</span>
            <span className="font-mono font-semibold text-[#0F172A] tabular-nums">182ms</span>
          </div>
          <span className="text-[#CBD5E1]">|</span>
          <div className="flex items-center gap-1.5 text-xs text-[#475569]">
            <Activity className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Concurrent Sessions:</span>
            <span className="font-mono font-semibold text-[#0F172A] tabular-nums">
              {activeCallsCount} {isCallLive ? '(+1 Live Test)' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenDialer}
          className="h-9 px-3 text-xs font-medium bg-white border border-[#E2E8F0] text-[#1E293B] rounded-lg hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all flex items-center gap-1.5 active:scale-98"
        >
          <Hash className="w-3.5 h-3.5 text-[#64748B]" />
          <span>Keypad Dialer</span>
        </button>

        <button
          onClick={onQuickSimulate}
          className="h-9 px-3.5 text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg transition-all flex items-center gap-2 shadow-sm active:scale-98 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
        >
          <Phone className="w-3.5 h-3.5 fill-current" />
          <span>Simulate Voice Call</span>
        </button>
      </div>
    </header>
  );
};
