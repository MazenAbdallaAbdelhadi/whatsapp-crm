import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Message, User, CURRENT_USER_ID } from "../../data/mock-data";
import { format } from "date-fns";
import { Lock } from "lucide-react";

interface MessageListProps {
    messages: Message[];
    otherUser: User;
}

export const MessageList = ({ messages, otherUser }: MessageListProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <ScrollArea className="flex-1 min-h-0 bg-slate-50/50 dark:bg-background/50" ref={scrollRef}>
            <div className="flex flex-col justify-end min-h-full py-6 px-4 md:px-8 max-w-4xl mx-auto">
                <div className="flex flex-col gap-2">
                    {/* Date Separator */}
                    <div className="flex justify-center mb-4">
                        <span className="bg-muted/50 text-muted-foreground text-[11px] font-medium px-3 py-1 rounded-full border shadow-sm">
                            Today
                        </span>
                    </div>

                    {messages.map((msg, index) => {
                        const isMe = msg.senderId === CURRENT_USER_ID;
                        const isSequence = index > 0 && messages[index - 1].senderId === msg.senderId;
                        const isNote = msg.type === 'note';

                        if (isNote) {
                            return (
                                <div key={msg.id} className="flex justify-center my-4">
                                    <div className="bg-yellow-100/50 dark:bg-yellow-900/10 border border-yellow-200/50 dark:border-yellow-700/30 rounded-lg p-3 max-w-sm w-full flex flex-col gap-1.5 shadow-sm">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-widest">
                                            <Lock className="size-2.5" />
                                            Internal Note
                                        </div>
                                        <p className="text-sm text-yellow-800/90 dark:text-yellow-100/90 leading-normal">
                                            {msg.content}
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                            <Avatar className="h-4 w-4 border border-yellow-200">
                                                <AvatarFallback className="text-[8px] bg-yellow-100 text-yellow-700">YO</AvatarFallback>
                                            </Avatar>
                                            <span className="text-[10px] text-yellow-600/70">
                                                {format(new Date(msg.timestamp), "h:mm a")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex gap-2.5 group relative max-w-[85%] md:max-w-[70%]",
                                    isMe ? "ml-auto" : "mr-auto",
                                    isSequence ? "mt-0.5" : "mt-2"
                                )}
                            >
                                <div
                                    className={cn(
                                        "flex flex-col relative px-3 py-2 shadow-sm border",
                                        isMe
                                            ? "bg-primary/5 dark:bg-primary/20 border-primary/10 rounded-2xl rounded-tr-none text-foreground"
                                            : "bg-background border-border rounded-2xl rounded-tl-none text-foreground"
                                    )}
                                >
                                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                                    <div className={cn(
                                        "flex items-center gap-1 mt-1 select-none",
                                        isMe ? "justify-end" : "justify-start"
                                    )}>
                                        <span className="text-[10px] text-muted-foreground/70">
                                            {format(new Date(msg.timestamp), "h:mm a")}
                                        </span>
                                        {isMe && (
                                            <span className="text-primary/70">
                                                {/* Double tick icon */}
                                                <svg width="13" height="8" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5">
                                                    <path d="M1 6L4.5 9.5L12.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M4.5 6L8 9.5L16 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                                                </svg>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div ref={bottomRef} className="h-4" />
            </div>
        </ScrollArea>
    );
};
