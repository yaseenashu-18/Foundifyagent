import React from 'react';
import { 
  Sparkles, 
  Plus, 
  PhoneCall,
  ShieldCheck,
  Package,
  BarChart2,
  Terminal,
  ArrowUpRight,
  Radio,
  Sliders
} from 'lucide-react';

export type WebAppTab = 'console' | 'matches' | 'insights' | 'prompt';

interface WebAppHeaderProps {
  activeTab: WebAppTab;
  onSelectTab: (tab: WebAppTab) => void;
  matchesCount: number;
  onOpenNewReport?: () => void;
  isCallActive?: boolean;
}

export const WebAppHeader: React.FC<WebAppHeaderProps> = ({
  activeTab,
  onSelectTab,
  matchesCount,
  onOpenNewReport,
  isCallActive = false,
}) => {
  const tabs = [
    { id: 'console' as WebAppTab, label: 'Live Console', icon: Radio },
    { 
      id: 'matches' as WebAppTab, 
      label: 'AI Matches', 
      icon: Sparkles,
      badge: matchesCount > 0 ? String(matchesCount) : undefined
    },
    { id: 'insights' as WebAppTab, label: 'AI Agent Insights', icon: BarChart2 },
    { id: 'prompt' as WebAppTab, label: 'Prompt Studio', icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Brand & Telephony Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              F
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight text-[#0b1c30]">
                  Foundify Voice AI
                </span>
                <span className="hidden sm:inline-block text-[11px] text-[#737686]">/</span>
                <span className="hidden sm:inline-block text-xs font-medium text-[#434655]">
                  Parul Campus
                </span>
              </div>
            </div>
          </div>

          {/* Live Stream Telemetry Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ecfdf5] text-[#065f46] text-[11px] font-mono font-medium border border-[#a7f3d0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-voice-live" />
            <span>24kHz Duplex · 198ms</span>
          </div>
        </div>

        {/* Desktop Tab Selector */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#f8f9ff] p-1 rounded-lg border border-[#e2e8f0]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#2563eb] shadow-xs font-semibold'
                    : 'text-[#434655] hover:text-[#0b1c30] hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2563eb]' : 'text-[#737686]'}`} strokeWidth={1.75} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-[#2563eb] text-white' : 'bg-[#e2e8f0] text-[#0b1c30]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Official Foundify Redirect */}
          <a
            href="https://foundify-9osq.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Open official Foundify Campus Custody portal"
            className="flex items-center gap-1.5 text-xs font-medium text-[#434655] hover:text-[#0b1c30] px-2.5 py-1.5 rounded-md hover:bg-[#f8f9ff] transition-colors cursor-pointer border border-[#e2e8f0]"
          >
            <span className="hidden sm:inline">Official Foundify Portal</span>
            <span className="sm:hidden text-xs">Official Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#737686]" />
          </a>

          {/* New Report Trigger */}
          <button
            onClick={onOpenNewReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Report Item</span>
            <span className="sm:hidden">Report</span>
          </button>
        </div>

      </div>
    </header>
  );
};
