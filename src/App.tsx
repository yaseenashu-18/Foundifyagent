/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WebAppHeader, WebAppTab } from './components/WebAppHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LiveConsoleView } from './components/LiveConsoleView';
import { OutboundAiMatchesSection, INITIAL_AI_MATCHES } from './components/OutboundAiMatchesSection';
import { AiAgentInsightsDashboard } from './components/AiAgentInsightsDashboard';
import { PromptSandbox } from './components/PromptSandbox';
import { OutboundCallModal, OutboundCallTarget } from './components/OutboundCallModal';
import { ReportDetailModal } from './components/ReportDetailModal';
import { NewReportModal } from './components/NewReportModal';
import { LostFoundReport } from './types/campus';
import { HumanVoiceName, FoundifyVertical } from './types/telephony';

export default function App() {
  const [activeTab, setActiveTab] = useState<WebAppTab>('console');
  const [selectedReportForModal, setSelectedReportForModal] = useState<LostFoundReport | null>(null);
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState<boolean>(false);
  
  // Active Outbound Call Target & Modal State
  const [isCallModalOpen, setIsCallModalOpen] = useState<boolean>(false);
  const [activeCallTarget, setActiveCallTarget] = useState<OutboundCallTarget | null>(null);

  // Trigger Outbound AI Call to student with exact match details
  const handleInitiateOutboundCall = (target: {
    phone: string;
    studentName: string;
    scenario: 'match_alert' | 'security_vault' | 'custom';
    voice?: HumanVoiceName;
    itemTitle?: string;
    matchScore?: number;
    matchId?: string;
    lostLocation?: string;
    foundLocation?: string;
    identifyingFeature?: string;
    vaultToken?: string;
    category?: string;
  }) => {
    setActiveCallTarget({
      phone: target.phone,
      studentName: target.studentName,
      itemTitle: target.itemTitle || 'Belongings',
      lostLocation: target.lostLocation || 'Campus',
      foundLocation: target.foundLocation || 'Central Security Cabin',
      identifyingFeature: target.identifyingFeature,
      vaultToken: target.vaultToken || 'PU-SEC-8821',
      category: target.category || 'Lost & Found',
      matchScore: target.matchScore,
      assignedVoice: target.voice || 'Aoede',
      language: 'en',
    });
    setIsCallModalOpen(true);
  };

  // Trigger call from a report in the database or vault
  const handleTriggerCallFromReport = (report: LostFoundReport) => {
    const isVault = report.status === 'Handover to Security';
    handleInitiateOutboundCall({
      phone: '+91 98765 43210',
      studentName: report.reportedBy.name,
      scenario: isVault ? 'security_vault' : 'match_alert',
      itemTitle: report.itemName,
      lostLocation: `${report.location.buildingName} (${report.location.buildingCode})`,
      foundLocation: report.securityHandover?.deskLocation || 'Building C5 Room 102 Security Desk',
      vaultToken: report.securityHandover?.tokenNumber || 'PU-SEC-8821',
      category: report.category,
      voice: 'Aoede',
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased flex flex-col selection:bg-[#eff4ff] selection:text-[#004ac6]">
      {/* Header with technical minimalism and precision telemetry */}
      <WebAppHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        matchesCount={INITIAL_AI_MATCHES.filter((m) => m.telephonyStatus === 'Pending Outbound Call').length}
        onOpenNewReport={() => setIsNewReportModalOpen(true)}
        isCallActive={isCallModalOpen}
      />

      {/* Main Responsive Canvas */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12">
        {/* Screen 1: Live Voice Calling Console */}
        {activeTab === 'console' && (
          <LiveConsoleView
            onOpenReportModal={(report) => setSelectedReportForModal(report)}
          />
        )}

        {/* Screen 2: Outbound AI Matches & Phone Dispatch */}
        {activeTab === 'matches' && (
          <OutboundAiMatchesSection
            onInitiateCall={handleInitiateOutboundCall}
            isCallLive={isCallModalOpen}
          />
        )}

        {/* Screen 3: AI Agent Insights Dashboard */}
        {activeTab === 'insights' && (
          <AiAgentInsightsDashboard />
        )}

        {/* Screen 4: System Prompt Studio & Parameter Sandbox */}
        {activeTab === 'prompt' && (
          <PromptSandbox
            onTestPrompt={(vertical: FoundifyVertical) => {
              setActiveTab('console');
            }}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Phone Support) */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        matchesCount={INITIAL_AI_MATCHES.filter((m) => m.telephonyStatus === 'Pending Outbound Call').length}
      />

      {/* Outbound AI Calling Agent Modal */}
      <OutboundCallModal
        isOpen={isCallModalOpen}
        target={activeCallTarget}
        onClose={() => setIsCallModalOpen(false)}
        onCallCompleted={(audit) => {
          console.log('Call audit logged to Parul database:', audit);
        }}
      />

      {/* Item Detail & Custody Pass Modal */}
      <ReportDetailModal
        report={selectedReportForModal}
        onClose={() => setSelectedReportForModal(null)}
        onStatusUpdate={(id, status) => {
          if (selectedReportForModal && selectedReportForModal.id === id) {
            setSelectedReportForModal({
              ...selectedReportForModal,
              status: status as any,
            });
          }
        }}
      />

      {/* New Campus Report Intake Modal */}
      <NewReportModal
        isOpen={isNewReportModalOpen}
        onClose={() => setIsNewReportModalOpen(false)}
        onReportCreated={(newReport) => setSelectedReportForModal(newReport)}
      />
    </div>
  );
}
