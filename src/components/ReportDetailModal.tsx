import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Send, 
  Building2, 
  Share2, 
  AlertCircle,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { LostFoundReport } from '../types/campus';

interface ReportDetailModalProps {
  report: LostFoundReport | null;
  onClose: () => void;
  onStatusUpdate?: (reportId: string, newStatus: string) => void;
  onHandoverSecurity?: (reportId: string) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onStatusUpdate,
  onHandoverSecurity,
}) => {
  const [contactMessage, setContactMessage] = useState<string>('');
  const [isContactSent, setIsContactSent] = useState<boolean>(false);
  const [isHandoverSuccess, setIsHandoverSuccess] = useState<boolean>(false);

  if (!report) return null;

  const handleSendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;

    try {
      await fetch(`/api/reports/${report.id}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: contactMessage }),
      });
      setIsContactSent(true);
      setContactMessage('');
      setTimeout(() => setIsContactSent(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSecurityHandoverClick = async () => {
    try {
      await fetch(`/api/reports/${report.id}/security-handover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          securityDeskLocation: 'Central Security Cabin (Building C5 / Near Gate 1)',
          securityOfficerName: 'Duty Security Officer',
        }),
      });
      setIsHandoverSuccess(true);
      if (onStatusUpdate) {
        onStatusUpdate(report.id, 'Handover to Security');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-14 px-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                report.type === 'found'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {report.type === 'found' ? 'Found Item' : 'Lost Item'}
            </span>
            <span className="font-mono text-xs text-[#64748B]">#{report.id}</span>
            <span className="text-xs text-[#94A3B8]">·</span>
            <span className="text-xs font-medium text-[#1E293B]">Parul University, Vadodara</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Title & Photos */}
          <div className="flex flex-col sm:flex-row gap-5">
            {report.images && report.images.length > 0 && (
              <div className="w-full sm:w-44 h-36 rounded-xl overflow-hidden bg-slate-100 border border-[#E2E8F0] flex-shrink-0">
                <img
                  src={report.images[0]}
                  alt={report.itemName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#2563EB] uppercase tracking-wider">
                  {report.category}
                </span>
                <span className="text-xs font-mono text-[#64748B]">{report.dateFormatted}</span>
              </div>
              <h2 className="text-xl font-bold text-[#0F172A] mt-1">{report.itemName}</h2>
              <p className="text-xs text-[#475569] mt-2 leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                {report.description}
              </p>
            </div>
          </div>

          {/* Location on Parul University Campus */}
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#1D4ED8] uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Parul University Campus Location</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#64748B] block text-[11px]">Building / Landmark:</span>
                <span className="font-semibold text-[#0F172A]">
                  [{report.location.buildingCode}] {report.location.buildingName}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">Floor / Specific Room:</span>
                <span className="font-medium text-[#0F172A]">
                  {report.location.floor || 'Not specified'} · {report.location.roomOrArea || ''}
                </span>
              </div>
              {report.location.landmark && (
                <div className="sm:col-span-2">
                  <span className="text-[#64748B] block text-[11px]">Exact Spot Landmark:</span>
                  <span className="font-medium text-[#0F172A]">{report.location.landmark}</span>
                </div>
              )}
            </div>
          </div>

          {/* Security Vault & Custody Status if Handed Over */}
          {report.securityHandover?.isHandedOver || isHandoverSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Safely Secured in Campus Security Custody</span>
              </div>
              <p className="text-xs text-emerald-800 mb-3">
                This item has been deposited in the official Parul University Security Vault. The rightful owner can claim it by presenting student ID and verifying identifying marks.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-white p-2.5 rounded-lg border border-emerald-200">
                <div>
                  <span className="text-[#94A3B8] text-[10px] block">SECURITY TOKEN:</span>
                  <strong className="text-emerald-700">
                    {report.securityHandover?.tokenNumber || 'SEC-VAULT-2026-ACTIVE'}
                  </strong>
                </div>
                <div>
                  <span className="text-[#94A3B8] text-[10px] block">CUSTODY CABIN:</span>
                  <span className="text-[#0F172A]">
                    {report.securityHandover?.deskLocation || 'Building C5 Security Vault'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            report.type === 'found' && (
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-[#CBD5E1] rounded-xl text-xs">
                <div>
                  <span className="font-semibold text-[#0F172A] block">Hand over to Campus Security?</span>
                  <span className="text-[#64748B] text-[11px]">
                    Deposit at Gate 1 or Building C5 Central Security Vault for safe claim.
                  </span>
                </div>
                <button
                  onClick={handleSecurityHandoverClick}
                  className="px-3 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Record Security Handover</span>
                </button>
              </div>
            )
          )}

          {/* Reporter Profile & Verification Privacy */}
          <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm">
                {report.reportedBy.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#0F172A]">{report.reportedBy.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                    {report.reportedBy.role}
                  </span>
                </div>
                <span className="text-[#64748B] text-[11px] block">
                  {report.reportedBy.department} · Parul University
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-[#94A3B8] block">STUDENT PRIVACY SHIELD</span>
              <span className="font-mono text-xs text-[#0F172A]">{report.reportedBy.enrollmentMasked}</span>
            </div>
          </div>

          {/* Secure In-App Communication */}
          <div>
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
              Contact Reporter via Foundify Relay
            </h4>
            <form onSubmit={handleSendContact} className="space-y-2">
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Enter a message to verify ownership (e.g. 'Hi, I believe this Casio calculator belongs to me. I can specify the engraving...')"
                className="w-full h-20 p-3 text-xs bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#64748B]">
                  Personal contact info is protected. The recipient will receive a verified Foundify campus notification.
                </span>
                <button
                  type="submit"
                  disabled={!contactMessage.trim()}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Campus Message</span>
                </button>
              </div>
            </form>
            {isContactSent && (
              <p className="text-xs text-emerald-700 font-medium mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Message dispatched through Foundify Parul University secure relay!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
