import React, { useState } from 'react';
import { 
  Play, 
  Save, 
  RotateCcw, 
  Check, 
  Sliders, 
  Sparkles, 
  ShieldCheck, 
  Wrench,
  Radio,
  ArrowRight,
  Terminal,
  Cpu
} from 'lucide-react';
import { FoundifyVertical, AgentPromptConfig } from '../types/telephony';
import { SYSTEM_PROMPTS } from '../data/mockTelephonyData';
import { ServiceChip } from './ServiceChip';

interface PromptSandboxProps {
  onTestPrompt: (vertical: FoundifyVertical) => void;
}

export const PromptSandbox: React.FC<PromptSandboxProps> = ({ onTestPrompt }) => {
  const [selectedVertical, setSelectedVertical] = useState<FoundifyVertical>('Lost & Found');
  const [prompts, setPrompts] = useState<Record<string, AgentPromptConfig>>(SYSTEM_PROMPTS);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const currentConfig = prompts[selectedVertical] || SYSTEM_PROMPTS['Lost & Found'];

  const handlePromptTextChange = (text: string) => {
    setPrompts((prev) => ({
      ...prev,
      [selectedVertical]: {
        ...prev[selectedVertical],
        systemPrompt: text,
      },
    }));
    setIsSaved(false);
  };

  const handleUpdateConfig = <K extends keyof AgentPromptConfig>(
    key: K,
    value: AgentPromptConfig[K]
  ) => {
    setPrompts((prev) => ({
      ...prev,
      [selectedVertical]: {
        ...prev[selectedVertical],
        [key]: value,
      },
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2400);
  };

  const handleReset = () => {
    setPrompts((prev) => ({
      ...prev,
      [selectedVertical]: { ...SYSTEM_PROMPTS[selectedVertical] },
    }));
    setIsSaved(false);
  };

  // Generate line numbers for the code textarea
  const lines = currentConfig.systemPrompt.split('\n');

  const verticals: FoundifyVertical[] = [
    'Lost & Found',
    'Marketplace',
    'Rentals',
    'Services',
    'Giveaways',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Module Presets & Actions */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#737686]">
                Voice Prompt Architecture
              </span>
              <ServiceChip vertical={selectedVertical} size="sm" />
            </div>
            <h1 className="text-xl font-semibold text-[#0b1c30] tracking-tight">
              {currentConfig.title}
            </h1>
            <p className="text-xs text-[#737686] mt-0.5">
              Configured for sub-200ms TTFB carrier telephony execution at Parul University.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="h-9 px-3 bg-white border border-[#e2e8f0] hover:bg-[#f8f9ff] text-[#434655] text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleSave}
              className="h-9 px-3.5 bg-white border border-[#2563eb] text-[#2563eb] hover:bg-[#eff4ff] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isSaved ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Version Deployed' : 'Save Version'}</span>
            </button>

            <button
              onClick={() => onTestPrompt(selectedVertical)}
              className="h-9 px-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Test in Live Console</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>

        {/* 5 Foundify Module Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#f1f5f9] overflow-x-auto">
          {verticals.map((vert) => (
            <button
              key={vert}
              onClick={() => {
                setSelectedVertical(vert);
                setIsSaved(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0 cursor-pointer ${
                selectedVertical === vert
                  ? 'bg-[#0b1c30] text-white shadow-xs font-semibold'
                  : 'bg-[#f8f9ff] text-[#434655] hover:bg-[#eff4ff]'
              }`}
            >
              {vert}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Code Editor & Telephony Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column (8 Cols): Monospaced Textarea with Line Numbers */}
        <div className="lg:col-span-8 bg-white border border-[#e2e8f0] rounded-xl shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] overflow-hidden flex flex-col">
          <div className="h-10 px-4 bg-[#f8f9ff] border-b border-[#e2e8f0] flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs text-[#0b1c30] font-semibold">
              <Terminal className="w-3.5 h-3.5 text-[#2563eb]" />
              <span>system_instruction.prompt</span>
            </div>
            <span className="text-[11px] font-mono text-[#737686]">
              {lines.length} lines · UTF-8
            </span>
          </div>

          <div className="flex flex-1 min-h-[440px] font-mono text-xs">
            {/* Line Numbers Column */}
            <div className="w-12 bg-[#f8f9ff] border-r border-[#e2e8f0] py-3 select-none text-right pr-3 font-mono text-[11px] text-[#94a3b8] leading-[22px]">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code Content */}
            <textarea
              value={currentConfig.systemPrompt}
              onChange={(e) => handlePromptTextChange(e.target.value)}
              className="flex-1 p-3 bg-white font-mono text-xs text-[#0b1c30] leading-[22px] resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right Column (4 Cols): Precision Telephony Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#f1f5f9]">
              <Sliders className="w-4 h-4 text-[#2563eb]" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#0b1c30]">
                Acoustic Parameters
              </h2>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#434655] font-medium">Temperature</span>
                <span className="font-mono font-bold text-[#0b1c30]">{currentConfig.temperature}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={currentConfig.temperature}
                onChange={(e) => handleUpdateConfig('temperature', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
              />
              <span className="text-[10px] text-[#737686] block">
                Low temperature locks conversational fidelity to physical campus vault data.
              </span>
            </div>

            {/* Latency Target */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#434655] font-medium">Target Latency (TTFB)</span>
                <span className="font-mono font-bold text-[#10b981]">{currentConfig.latencyTargetMs}ms</span>
              </div>
              <input
                type="range"
                min="100"
                max="400"
                step="10"
                value={currentConfig.latencyTargetMs}
                onChange={(e) => handleUpdateConfig('latencyTargetMs', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
              />
            </div>

            {/* Domain Strictness Guardrail */}
            <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-lg text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#065f46] font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                <span>Strict 5-Domain Guardrail Active</span>
              </div>
              <p className="text-[11px] text-[#065f46] leading-relaxed">
                The agent is programmed to immediately deflect out-of-scope inquiries and maintain 100% adherence to Parul University belongings and peer services.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
