"use client";

import { cn } from "@/lib/utils";
import { CheckCheck } from "lucide-react";

interface MessageBubbleProps {
    content: string;
    timestamp?: string;
    isOutgoing?: boolean;
}

export const MessageBubble = ({ content, timestamp = "12:00 PM", isOutgoing = true }: MessageBubbleProps) => {
    return (
        <div className={cn(
            "max-w-[85%] rounded-lg p-2 px-3 shadow-sm relative text-[13px] leading-relaxed",
            isOutgoing
                ? "bg-[#E7FFDB] ml-auto rounded-tr-none text-gray-900"
                : "bg-white mr-auto rounded-tl-none text-gray-900"
        )}>
            {isOutgoing && (
                <div className="absolute top-0 -right-2 w-3 h-3 bg-[#E7FFDB]"
                    style={{ clipPath: 'polygon(0 0, 0% 100%, 100% 0)' }}
                />
            )}
            {!isOutgoing && (
                <div className="absolute top-0 -left-2 w-3 h-3 bg-white"
                    style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}
                />
            )}

            <p className="whitespace-pre-wrap">{content}</p>

            <div className="flex items-center justify-end gap-1 mt-1 opacity-60 select-none">
                <span className="text-[10px]">{timestamp}</span>
                {isOutgoing && <CheckCheck className="h-3 w-3 text-blue-500" />}
            </div>
        </div>
    );
};
