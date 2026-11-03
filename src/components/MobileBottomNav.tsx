import React from 'react';
import { 
  Radio, 
  Sparkles, 
  Package, 
  ShieldCheck, 
  BarChart2, 
  Terminal 
} from 'lucide-react';
import { WebAppTab } from './WebAppHeader';

interface MobileBottomNavProps {
  activeTab: WebAppTab;
  onSelectTab: (tab: WebAppTab) => void;
  matchesCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  matchesCount,
}) => {
  const tabs = [
    { id: 'console' as WebAppTab, label: 'Console', icon: Radio },
    { 
      id: 'matches' as WebAppTab, 
      label: 'Matches', 
      icon: Sparkles,
      badge: matchesCount > 0 ? String(matchesCount) : undefined
    },
    { id: 'insights' as WebAppTab, label: 'AI Insights', icon: BarChart2 },
    { id: 'prompt' as WebAppTab, label: 'Prompt', icon: Terminal },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#e2e8f0] pb-safe">
      <div className="flex items-center justify-around h-14 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer relative ${
                isActive ? 'text-[#2563eb] font-semibold' : 'text-[#737686] hover:text-[#0b1c30]'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 min-w-3.5 h-3.5 px-1 bg-[#2563eb] text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
