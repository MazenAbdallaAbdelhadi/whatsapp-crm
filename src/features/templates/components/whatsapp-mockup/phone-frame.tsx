"use client";

import { cn } from "@/lib/utils";
import { ChatHeader } from "./chat-header";
import { MessageBubble } from "./message-bubble";
import { Button } from "@/components/ui/button";
import { Mic, Plus, Camera, Image as ImageIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PhoneFrameProps {
    message: string;
    className?: string;
}

export const PhoneFrame = ({ message, className }: PhoneFrameProps) => {
    return (
        <div className={cn(
            "relative mx-auto border-gray-800 bg-gray-800 border-[8px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl flex flex-col overflow-hidden ring-4 ring-gray-900/40",
            className
        )}>
            {/* Notch Area (Decorative) */}
            <div className="w-full h-6 bg-gray-800 absolute top-0 left-0 z-20 flex justify-center">
                <div className="h-4 w-32 bg-black rounded-b-xl" />
            </div>

            {/* Screen Content */}
            <div className="flex-1 bg-[#ECE5DD] flex flex-col relative z-0 text-sm font-sans pt-6 overflow-hidden">
                <div className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundSize: '400px' }}
                />

                <ChatHeader />

                {/* Chat Area */}
                <ScrollArea className="flex-1 p-3">
                    <div className="flex flex-col gap-2 pt-2 pb-4">
                        <div className="flex justify-center mb-4">
                            <span className="bg-[#DDECF2] text-gray-600 text-[10px] px-2 py-1 rounded shadow-sm font-medium">
                                Today
                            </span>
                        </div>

                        <MessageBubble
                            content="Hello! I saw your ad on Facebook."
                            timestamp="11:58 AM"
                            isOutgoing={false}
                        />

                        {message && (
                            <MessageBubble
                                content={message}
                                timestamp="12:01 PM"
                                isOutgoing={true}
                            />
                        )}
                    </div>
                </ScrollArea>

                {/* Chat Input Bar (Decorative) */}
                <div className="bg-[#F0F0F0] p-2 flex items-center gap-2 relative z-10 shrink-0 mb-1">
                    <Plus className="h-5 w-5 text-blue-500" />
                    <div className="flex-1 bg-white rounded-full h-8 px-3 text-sm flex items-center text-gray-400 select-none cursor-default">
                        Type a message
                    </div>
                    <Camera className="h-5 w-5 text-blue-500" />
                    <Mic className="h-5 w-5 text-blue-500" />
                </div>

                {/* Home Indicator */}
                <div className="h-4 w-full bg-gray-800 flex items-center justify-center shrink-0">
                    <div className="w-1/3 h-1 bg-white/20 rounded-full" />
                </div>
            </div>
        </div>
    );
};
