import React, { useState } from 'react';
import { X, Phone, Delete, Hash, Asterisk, Sparkles, Building2, User } from 'lucide-react';
import { FoundifyVertical } from '../types/telephony';

interface DialerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDial: (phoneNumber: string, studentName?: string, scenario?: 'match_alert' | 'security_vault' | 'custom') => void;
}

export const DialerModal: React.FC<DialerModalProps> = ({ isOpen, onClose, onDial }) => {
  const [inputNumber, setInputNumber] = useState<string>('+91 98765 43210');
  const [studentName, setStudentName] = useState<string>('Rohan Patel');
  const [scenario, setScenario] = useState<'match_alert' | 'security_vault' | 'custom'>('match_alert');

  if (!isOpen) return null;

  const campusSpeedDials = [
    { label: 'Rohan Patel (AirPods Match)', number: '+91 98765 43210', name: 'Rohan Patel', scenario: 'match_alert' as const },
    { label: 'Sneha Sharma (ID Lanyard)', number: '+91 98251 12345', name: 'Sneha Sharma', scenario: 'security_vault' as const },
    { label: 'Aditya Dave (PIET Calculator)', number: '+91 97123 45678', name: 'Aditya Dave', scenario: 'match_alert' as const },
    { label: 'Central Lost & Found (Ext 102)', number: '+91 (2668) 260-312', name: 'Helpline Ext 102', scenario: 'custom' as const },
    { label: 'C5 Security Vault HQ (Ext 501)', number: '+91 (2668) 260-501', name: 'Security Vault C5', scenario: 'security_vault' as const },
  ];

  const handleDigit = (digit: string) => {
    setInputNumber((prev) => prev + digit);
  };

  const handleBackspace = () => {
    setInputNumber((prev) => prev.slice(0, -1));
  };

  const handleSelectHotline = (item: typeof campusSpeedDials[0]) => {
    setInputNumber(item.number);
    setStudentName(item.name);
    setScenario(item.scenario);
  };

  const handleCall = () => {
    onDial(inputNumber, studentName, scenario);
    onClose();
  };

  const keys = [
    { num: '1', sub: '' },
    { num: '2', sub: 'ABC' },
    { num: '3', sub: 'DEF' },
    { num: '4', sub: 'GHI' },
    { num: '5', sub: 'JKL' },
    { num: '6', sub: 'MNO' },
    { num: '7', sub: 'PQRS' },
    { num: '8', sub: 'TUV' },
    { num: '9', sub: 'WXYZ' },
    { num: '*', sub: '' },
    { num: '0', sub: '+' },
    { num: '#', sub: '' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-12 px-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#2563EB]" />
            <span className="text-xs font-bold text-[#0F172A]">Campus Telephony Dialer</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Display Screen */}
        <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1 text-xs text-[#2563EB] font-bold">
            <User className="w-3.5 h-3.5" />
            <span>Target: {studentName}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <input
              type="text"
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
              className="text-center font-mono text-xl font-bold text-[#0F172A] tracking-wider bg-transparent focus:outline-none w-full tabular-nums"
            />
            {inputNumber && (
              <button
                onClick={handleBackspace}
                className="text-[#94A3B8] hover:text-[#EF4444] transition-colors p-1 cursor-pointer"
              >
                <Delete className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-[10px] font-mono text-[#64748B] mt-1">Parul University Campus Voice Line</p>
        </div>

        {/* Quick Speed Dials */}
        <div className="p-3 border-b border-[#E2E8F0] bg-white">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1.5">
            Campus Speed Dials &amp; Match Targets
          </span>
          <div className="space-y-1">
            {campusSpeedDials.map((h) => (
              <button
                key={h.number}
                onClick={() => handleSelectHotline(h)}
                className={`w-full text-left p-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  inputNumber === h.number ? 'bg-blue-50 border border-blue-200' : 'hover:bg-[#F8FAFC]'
                }`}
              >
                <span className="font-semibold text-[#1E293B]">{h.label}</span>
                <span className="font-mono text-[10px] text-[#64748B]">{h.number}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 12-Key Pad */}
        <div className="p-4 bg-white grid grid-cols-3 gap-2">
          {keys.map((k) => (
            <button
              key={k.num}
              onClick={() => handleDigit(k.num)}
              className="h-11 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] text-[#0F172A] flex flex-col items-center justify-center transition-all select-none border border-[#E2E8F0] cursor-pointer"
            >
              <span className="font-mono text-base font-bold">{k.num}</span>
              {k.sub && <span className="text-[9px] font-mono text-[#94A3B8] leading-none">{k.sub}</span>}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <div className="p-4 pt-0 bg-white">
          <button
            onClick={handleCall}
            disabled={!inputNumber}
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>Dispatch AI Call Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
