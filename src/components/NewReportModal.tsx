import React, { useState } from 'react';
import { X, Building2, ShieldCheck, CheckCircle2, Upload, AlertCircle } from 'lucide-react';
import { PARUL_CAMPUS_LOCATIONS } from '../data/parulCampusData';

interface NewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportCreated: (report: any) => void;
}

export const NewReportModal: React.FC<NewReportModalProps> = ({
  isOpen,
  onClose,
  onReportCreated,
}) => {
  const [type, setType] = useState<'lost' | 'found'>('lost');
  const [itemName, setItemName] = useState<string>('');
  const [category, setCategory] = useState<string>('Electronics');
  const [buildingCode, setBuildingCode] = useState<string>('A1');
  const [floor, setFloor] = useState<string>('Ground Floor');
  const [roomOrArea, setRoomOrArea] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [identifyingMarks, setIdentifyingMarks] = useState<string>('');
  const [isHandedToSecurity, setIsHandedToSecurity] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    setIsSubmitting(true);
    try {
      const selectedLoc = PARUL_CAMPUS_LOCATIONS.find((l) => l.code === buildingCode);

      const payload = {
        type,
        itemName,
        category,
        campusLocation: selectedLoc?.name || 'Parul University Campus',
        buildingCode,
        floor,
        roomOrArea,
        landmark,
        description,
        color,
        brand,
        identifyingMarks,
        isHandedToSecurity,
        securityDeskLocation: isHandedToSecurity ? 'Central Security Cabin (Building C5 / Near Gate 1)' : undefined,
      };

      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        onReportCreated(data.report);
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Electronics',
    'Personal Belongings',
    'Academic & College ID',
    'Keys & Access',
    'Clothing & Footwear',
    'Sports & Equipment',
    'Books & Notes',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-14 px-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div>
            <h3 className="font-bold text-sm text-[#0F172A]">File Campus Lost & Found Report</h3>
            <span className="text-[11px] text-[#64748B]">Parul University, Vadodara · Official Registry</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Report Type Selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setType('lost')}
              className={`py-2 rounded-lg transition-colors ${
                type === 'lost' ? 'bg-amber-600 text-white shadow-xs' : 'text-[#64748B]'
              }`}
            >
              I Lost An Item
            </button>
            <button
              type="button"
              onClick={() => setType('found')}
              className={`py-2 rounded-lg transition-colors ${
                type === 'found' ? 'bg-emerald-600 text-white shadow-xs' : 'text-[#64748B]'
              }`}
            >
              I Found An Item
            </button>
          </div>

          {/* Item Name */}
          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">
              Item Name *
            </label>
            <input
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. Casio ClassWiz FX-991CW Calculator, Apple AirPods, Blue Lanyard ID"
              className="w-full h-10 px-3 text-xs bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* Category & Color */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-2.5 text-xs bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">Color</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Black, White, Navy Blue"
                className="w-full h-10 px-3 text-xs bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* Parul University Campus Location */}
          <div className="p-3.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl space-y-3">
            <span className="text-xs font-bold text-[#1D4ED8] uppercase tracking-wider block">
              Parul University Campus Location
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-[#475569] block mb-1">Building</label>
                <select
                  value={buildingCode}
                  onChange={(e) => setBuildingCode(e.target.value)}
                  className="w-full h-9 px-2 text-xs bg-white border border-[#BFDBFE] rounded-lg text-[#0F172A]"
                >
                  {PARUL_CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc.code} value={loc.code}>
                      [{loc.code}] {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#475569] block mb-1">Floor / Wing</label>
                <select
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="w-full h-9 px-2 text-xs bg-white border border-[#BFDBFE] rounded-lg text-[#0F172A]"
                >
                  <option value="Ground Floor">Ground Floor</option>
                  <option value="1st Floor">1st Floor</option>
                  <option value="2nd Floor">2nd Floor</option>
                  <option value="3rd Floor">3rd Floor</option>
                  <option value="Workshop Ground">Workshop Ground</option>
                  <option value="Outdoor Area">Outdoor Area</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#475569] block mb-1">Room or Specific Spot</label>
              <input
                type="text"
                value={roomOrArea}
                onChange={(e) => setRoomOrArea(e.target.value)}
                placeholder="e.g. Room 204, Table 12, Reading Hall Cubicle 18"
                className="w-full h-9 px-3 text-xs bg-white border border-[#BFDBFE] rounded-lg text-[#0F172A]"
              />
            </div>
          </div>

          {/* Description & Identifying Marks */}
          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">
              Description & Identifying Marks
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide distinctive marks, engravings, stickers, or details that only the true owner knows..."
              className="w-full p-3 text-xs bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* If Found: Security Handover Checkbox */}
          {type === 'found' && (
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-900 cursor-pointer">
              <input
                type="checkbox"
                checked={isHandedToSecurity}
                onChange={(e) => setIsHandedToSecurity(e.target.checked)}
                className="rounded accent-emerald-600 w-4 h-4"
              />
              <span className="font-semibold">
                I have handed over this item to Parul University Campus Security (Gate 1 or C5 Vault)
              </span>
            </label>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !itemName.trim()}
              className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Registering on Campus...' : 'Submit to Parul University Registry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
