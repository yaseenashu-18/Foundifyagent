import React from 'react';
import { FoundifyVertical } from '../types/telephony';

interface ServiceChipProps {
  vertical: FoundifyVertical;
  className?: string;
  size?: 'sm' | 'md';
}

export const ServiceChip: React.FC<ServiceChipProps> = ({ vertical, className = '', size = 'md' }) => {
  const getStyles = () => {
    switch (vertical) {
      case 'Lost & Found':
        return 'bg-[#F1F5F9] text-[#334155] border-[#E2E8F0]';
      case 'Marketplace':
        return 'bg-[#EEF2FF] text-[#4338CA] border-[#C7D2FE]';
      case 'Rentals':
        return 'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]';
      case 'Services':
        return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
      case 'Giveaways':
        return 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]';
      default:
        return 'bg-[#F1F5F9] text-[#334155] border-[#E2E8F0]';
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-[6px] border ${getStyles()} ${sizeClasses} ${className} transition-colors`}
    >
      {vertical}
    </span>
  );
};
