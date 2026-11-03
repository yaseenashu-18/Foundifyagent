import React, { useState } from 'react';
import { 
  Hash, 
  Plus, 
  PhoneCall, 
  Server, 
  ExternalLink, 
  Check, 
  Copy, 
  Radio, 
  SlidersHorizontal 
} from 'lucide-react';
import { PhoneNumberRecord, FoundifyVertical } from '../types/telephony';
import { PHONE_NUMBERS } from '../data/mockTelephonyData';
import { ServiceChip } from './ServiceChip';

interface PhoneManagerProps {
  onTestNumber: (number: PhoneNumberRecord) => void;
}

export const PhoneManager: React.FC<PhoneManagerProps> = ({ onTestNumber }) => {
  const [numbers, setNumbers] = useState<PhoneNumberRecord[]>(PHONE_NUMBERS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddingNumber, setIsAddingNumber] = useState<boolean>(false);
  const [newVertical, setNewVertical] = useState<FoundifyVertical>('Lost & Found');
  const [newAreaCode, setNewAreaCode] = useState<string>('415');

  const handleCopy = (num: string, id: string) => {
    navigator.clipboard.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddNumber = (e: React.FormEvent) => {
    e.preventDefault();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newRecord: PhoneNumberRecord = {
      id: `pn-${Date.now()}`,
      number: `+1 (${newAreaCode}) 555-${randomSuffix}`,
      country: 'US',
      vertical: newVertical,
      assignedAgent: `${newVertical} Autonomous Intake v1.0`,
      sipUri: `sip:${newVertical.toLowerCase().replace(/[^a-z]/g, '')}@trunk.foundify.ai`,
      status: 'Active',
      monthlyMinutes: 0,
      lastActive: 'Just provisioned',
    };
    setNumbers((prev) => [newRecord, ...prev]);
    setIsAddingNumber(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">
            DID Phone Numbers & Carrier SIP Trunks
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Dedicated inbound telephony endpoints routed directly to specialized Foundify vertical agents.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNumber(!isAddingNumber)}
          className="h-9 px-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Provision DID Number</span>
        </button>
      </div>

      {/* Provisioning Drawer / Modal if active */}
      {isAddingNumber && (
        <form
          onSubmit={handleAddNumber}
          className="p-4 bg-white border border-[#BFDBFE] rounded-xl shadow-sm space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
            <h3 className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
              Provision New Carrier DID Endpoint
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingNumber(false)}
              className="text-xs text-[#64748B] hover:text-[#0F172A]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-[#475569] block mb-1">Target Vertical</label>
              <select
                value={newVertical}
                onChange={(e) => setNewVertical(e.target.value as FoundifyVertical)}
                className="w-full h-9 px-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#0F172A]"
              >
                <option value="Lost & Found">Lost & Found</option>
                <option value="Marketplace">Marketplace</option>
                <option value="Rentals">Rentals</option>
                <option value="Services">Services</option>
                <option value="Giveaways">Giveaways</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#475569] block mb-1">Area Code</label>
              <select
                value={newAreaCode}
                onChange={(e) => setNewAreaCode(e.target.value)}
                className="w-full h-9 px-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#0F172A]"
              >
                <option value="415">415 (San Francisco, CA)</option>
                <option value="212">212 (New York, NY)</option>
                <option value="312">312 (Chicago, IL)</option>
                <option value="512">512 (Austin, TX)</option>
                <option value="206">206 (Seattle, WA)</option>
                <option value="305">305 (Miami, FL)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full h-9 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Allocate Number
              </button>
            </div>
          </div>
        </form>
      )}

      {/* DID Numbers Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="h-9 bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
              <th className="px-4 py-2">Phone Number</th>
              <th className="px-4 py-2">Assigned Vertical</th>
              <th className="px-4 py-2">Agent Target</th>
              <th className="px-4 py-2">SIP URI Route</th>
              <th className="px-4 py-2">Monthly Usage</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {numbers.map((item) => (
              <tr
                key={item.id}
                className="h-12 border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors text-xs text-[#1E293B]"
              >
                {/* Phone number */}
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-[#0F172A] text-sm tabular-nums">
                      {item.number}
                    </span>
                    <button
                      onClick={() => handleCopy(item.number, item.id)}
                      className="text-[#94A3B8] hover:text-[#2563EB] transition-colors"
                      title="Copy number"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </td>

                {/* Vertical Chip */}
                <td className="px-4 py-2">
                  <ServiceChip vertical={item.vertical} size="sm" />
                </td>

                {/* Assigned Agent */}
                <td className="px-4 py-2 font-medium text-[#475569]">
                  {item.assignedAgent}
                </td>

                {/* SIP URI */}
                <td className="px-4 py-2 font-mono text-[11px] text-[#64748B]">
                  {item.sipUri}
                </td>

                {/* Monthly minutes */}
                <td className="px-4 py-2 font-mono text-xs tabular-nums text-[#0F172A]">
                  {item.monthlyMinutes.toLocaleString()} mins
                </td>

                {/* Status */}
                <td className="px-4 py-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    <span>{item.status}</span>
                  </span>
                </td>

                {/* Action: Test Call */}
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => onTestNumber(item)}
                    className="h-7 px-2.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D4ED8] text-xs font-semibold rounded-md inline-flex items-center gap-1 transition-colors"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Test Line</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
