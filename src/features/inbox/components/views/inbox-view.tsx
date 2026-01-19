"use client";

import { useState, useEffect } from "react";
import { MessageComposer } from "../message-composer";
import { ConversationList } from "../conversation-list/conversation-list";
import { ChatHeader } from "../chat-area/chat-header";
import { MessageList } from "../chat-area/message-list";
import { ProfileSidebar } from "../chat-area/profile-sidebar";
import { MOCK_CONVERSATIONS } from "../../data/mock-data";
import { MessageSquareDashed } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

export const InboxView = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const { setOpenMobile, isMobile } = useSidebar();

  const selectedConversation = MOCK_CONVERSATIONS.find((c) => c.id === selectedId);

  // Auto-collapse mobile sidebar when entering a chat
  useEffect(() => {
    if (selectedId && isMobile) {
      setOpenMobile(false);
    }
  }, [selectedId, isMobile, setOpenMobile]);

  const handleSelectConversation = (id: string | null) => {
    setSelectedId(id);
  };

  return (
    <div className="flex h-[calc(100vh-var(--header-height))] w-full overflow-hidden bg-background relative">
      {/* 
        Conversation List Column 
        - Hidden on Mobile if conversation selected
        - Hidden on Tablet (MD) if Profile Panel is OPEN (to save space)
        - Visible on Desktop (LG) always (unless explicitly toggled, but here we keep it)
      */}
      <div className={cn(
        "w-full md:w-[320px] lg:w-[360px] shrink-0 border-r bg-background transition-all duration-300 ease-in-out absolute md:relative z-10 h-full overflow-hidden",
        selectedId ? "md:block -translate-x-full md:translate-x-0" : "translate-x-0",
        // Logic: On MD, if Panel Open -> Hide List. On LG -> Show List.
        showRightPanel ? "md:hidden lg:block" : "md:block"
      )}>
        {/* Mobile-only view logic handles visibility via translation/absolute positioning */}
        <ConversationList
          conversations={MOCK_CONVERSATIONS}
          selectedId={selectedId}
          onSelect={handleSelectConversation}
        />
      </div>

      {/* 
        Main Chat Column 
        - Visible on Desktop
        - Visible on Mobile if conversation selected (slides in)
      */}
      <div className={cn(
        "flex flex-1 flex-col min-w-0 bg-muted/5 w-full h-full transition-transform duration-300 relative",
        selectedId ? "translate-x-0" : "translate-x-full md:translate-x-0"
      )}>
        {selectedConversation ? (
          <div className="flex flex-1 overflow-hidden relative h-full">
            {/* Main Chat Column (Header + Messages + Composer) */}
            <div className="flex flex-1 flex-col min-w-0 min-h-0 h-full">
              <div className="shrink-0">
                <ChatHeader
                  conversation={selectedConversation}
                  onBack={() => setSelectedId(null)}
                  onToggleProfile={() => setShowRightPanel(!showRightPanel)}
                />
              </div>

              <MessageList
                messages={selectedConversation.messages}
                otherUser={selectedConversation.user}
              />

              <div className="p-4 bg-background border-t shrink-0">
                <MessageComposer />
              </div>
            </div>

            {/* Right Sidebar - Profile */}
            <ProfileSidebar
              user={selectedConversation.user}
              platform={selectedConversation.platform}
              isOpen={showRightPanel}
              onClose={() => setShowRightPanel(false)}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
            <div className="p-4 rounded-full bg-muted/30 mb-4">
              <MessageSquareDashed className="size-12 opacity-50" />
            </div>
            <h3 className="text-lg font-semibold">No conversation selected</h3>
            <p className="text-sm text-center max-w-xs mt-2 text-muted-foreground">
              Choose a conversation from the sidebar to start chatting or view history.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
