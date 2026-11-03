import React from 'react';
import { 
  PhoneCall, 
  FileText, 
  Terminal, 
  BarChart3, 
  Hash, 
  Radio, 
  ShieldCheck,
  Headphones
} from 'lucide-react';
import { FoundifyVertical } from '../types/telephony';

export type ActiveTab = 'studio' | 'records' | 'prompt' | 'telemetry' | 'dids';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  selectedVertical: FoundifyVertical | 'All';
  onSelectVertical: (vertical: FoundifyVertical | 'All') => void;
  activeCallsCount: number;
  isCallLive: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  selectedVertical,
  onSelectVertical,
  activeCallsCount,
  isCallLive,
}) => {
  const navItems = [
    {
      id: 'studio' as ActiveTab,
      label: 'Live Call Studio',
      icon: PhoneCall,
      badge: isCallLive ? 'LIVE' : undefined,
      badgeColor: 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]',
    },
    {
      id: 'records' as ActiveTab,
      label: 'Call Records',
      icon: FileText,
      badge: '1,428',
      badgeColor: 'bg-[#F1F5F9] text-[#475569]',
    },
    {
      id: 'prompt' as ActiveTab,
      label: 'System Prompts',
      icon: Terminal,
      badge: '5 Active',
      badgeColor: 'bg-[#EFF6FF] text-[#1D4ED8]',
    },
    {
      id: 'telemetry' as ActiveTab,
      label: 'Operational Telemetry',
      icon: BarChart3,
    },
    {
      id: 'dids' as ActiveTab,
      label: 'DID Numbers & SIP',
      icon: Hash,
    },
  ];

  const verticals: (FoundifyVertical | 'All')[] = [
    'All',
    'Lost & Found',
    'Marketplace',
    'Rentals',
    'Services',
    'Giveaways',
  ];

  return (
    <aside className="w-[240px] flex-shrink-0 bg-white border-r border-[#E2E8F0] flex flex-col h-screen select-none z-20">
      {/* Brand Header */}
      <div className="h-14 px-4 border-b border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-sm">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-[#0F172A]">Foundify</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] font-semibold">
                VOICE
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-none">Telephony Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] px-2 py-1">
          Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#EFF6FF] text-[#1D4ED8] font-semibold'
                  : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Service Vertical Filter Section */}
      <div className="p-3 border-t border-[#F1F5F9] flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-2 py-1 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
            Foundify Verticals
          </span>
          <span className="text-[10px] font-mono text-[#94A3B8]">5 Nodes</span>
        </div>

        <div className="space-y-0.5">
          {verticals.map((vert) => {
            const isSelected = selectedVertical === vert;
            return (
              <button
                key={vert}
                onClick={() => onSelectVertical(vert)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  isSelected
                    ? 'bg-[#0F172A] text-white font-medium'
                    : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      vert === 'All'
                        ? 'bg-[#94A3B8]'
                        : vert === 'Lost & Found'
                        ? 'bg-slate-400'
                        : vert === 'Marketplace'
                        ? 'bg-indigo-500'
                        : vert === 'Rentals'
                        ? 'bg-sky-500'
                        : vert === 'Services'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <span className="truncate">{vert}</span>
                </div>
                {vert === 'Lost & Found' && <span className="text-[10px] font-mono opacity-75">38%</span>}
                {vert === 'Services' && <span className="text-[10px] font-mono opacity-75">24%</span>}
                {vert === 'Rentals' && <span className="text-[10px] font-mono opacity-75">18%</span>}
              </button>
            );
          })}
        </div>

        <div className="mt-4 p-2.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE]">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1D4ED8] mb-1">
            <Headphones className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Gemini Live Engine</span>
          </div>
          <p className="text-[11px] text-[#2563EB] leading-tight">
            gemini-3.8-live & Human Voice pipeline active (24kHz Full-Duplex).
          </p>
        </div>
      </div>

      {/* SIP Telemetry Footer Status */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
            </span>
            <span className="text-[11px] font-semibold text-[#0F172A]">SIP TRUNK ONLINE</span>
          </div>
          <span className="text-[10px] font-mono text-[#10B981] bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">
            99.98%
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-[#64748B]">
          <div>
            <span className="text-[#94A3B8]">Jitter:</span> 1.2ms
          </div>
          <div>
            <span className="text-[#94A3B8]">Loss:</span> 0.02%
          </div>
        </div>
      </div>
    </aside>
  );
};
