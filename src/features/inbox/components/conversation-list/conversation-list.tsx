import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Conversation } from "../../data/mock-data";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

interface ConversationListProps {
    conversations: Conversation[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
}

type FilterType = 'all' | 'unread' | 'whatsapp' | 'telegram' | 'instagram';

export const ConversationList = ({ conversations, selectedId, onSelect }: ConversationListProps) => {
    const [search, setSearch] = useState("");

    const filteredConversations = conversations.filter(c => {
        const matchesSearch = c.user.name.toLowerCase().includes(search.toLowerCase()) ||
            c.lastMessage.content.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="flex flex-col h-full bg-background/50 border-r backdrop-blur-xl w-full overflow-hidden">
            {/* Header combined with Search */}
            <div className="flex items-center gap-2 px-3 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shrink-0 h-[65px]">
                <div className="relative flex-1 group">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                        placeholder="Search messages..."
                        className="pl-9 h-9 bg-muted/40 border-muted-foreground/10 focus-visible:bg-background transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            <ScrollArea className="flex-1 w-full">
                <div className="flex flex-col p-2 gap-1 w-full max-w-full">
                    {filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground space-y-2">
                            <div className="p-3 rounded-full bg-muted">
                                <Search className="h-5 w-5 text-muted-foreground/50" />
                            </div>
                            <p className="text-sm font-medium">No conversations found</p>
                        </div>
                    ) : (
                        filteredConversations.map((conv, index) => {
                            let timeString = '';
                            try {
                                timeString = formatDistanceToNow(new Date(conv.lastMessage.timestamp), { addSuffix: true });
                                timeString = timeString
                                    .replace('about ', '')
                                    .replace('less than a minute ago', 'just now')
                                    .replace(' minutes ago', 'm')
                                    .replace(' minute ago', 'm')
                                    .replace(' hours ago', 'h')
                                    .replace(' hour ago', 'h')
                                    .replace(' days ago', 'd')
                                    .replace(' day ago', 'd');
                            } catch (e) {
                                timeString = 'now';
                            }

                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => onSelect(conv.id)}
                                    className={cn(
                                        "relative grid grid-cols-[auto_1fr] gap-3 p-3 text-left rounded-xl transition-all duration-200 group border border-transparent w-full max-w-full",
                                        selectedId === conv.id
                                            ? "bg-primary/5 border-primary/10 shadow-sm"
                                            : "hover:bg-muted/50 hover:border-border/40",
                                        "animate-in fade-in slide-in-from-left-2 fill-mode-backwards"
                                    )}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Selection Indicator */}
                                    {selectedId === conv.id && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-full" />
                                    )}

                                    <div className="relative shrink-0">
                                        <Avatar className={cn(
                                            "size-12 border-2 transition-all",
                                            selectedId === conv.id ? "border-background ring-2 ring-primary/20" : "border-background shadow-sm"
                                        )}>
                                            <AvatarImage src={conv.user.avatar} />
                                            <AvatarFallback>{conv.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        {/* Abstract online status for now */}
                                        <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 border-background ring-1 ring-background" />
                                    </div>

                                    <div className="flex flex-col gap-0.5 min-w-0 w-full">
                                        <div className="flex items-center justify-between gap-2 w-full">
                                            <span className={cn(
                                                "font-semibold truncate text-[15px] min-w-0 flex-1",
                                                conv.unreadCount > 0 ? "text-foreground" : "text-foreground/80"
                                            )}>
                                                {conv.user.name}
                                            </span>
                                            <span className={cn(
                                                "text-[11px] whitespace-nowrap tabular-nums shrink-0",
                                                conv.unreadCount > 0 ? "text-primary font-medium" : "text-muted-foreground/70"
                                            )}>
                                                {timeString}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-2 w-full">
                                            <span className={cn(
                                                "text-[13px] truncate leading-snug min-w-0 flex-1 block",
                                                conv.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                                            )}>
                                                {conv.lastMessage.type === 'image' ? (
                                                    <span className="flex items-center gap-1 text-primary">
                                                        <span className="i-lucide-image size-3" /> Image
                                                    </span>
                                                ) : (
                                                    <>
                                                        {conv.lastMessage.senderId === 'me' && (
                                                            <span className="text-muted-foreground/60 mr-1">You:</span>
                                                        )}
                                                        {conv.lastMessage.content}
                                                    </>
                                                )}
                                            </span>

                                            {conv.unreadCount > 0 && (
                                                <span className="flex h-5 min-w-5 px-1.5 rounded-full bg-primary text-[10px] text-primary-foreground items-center justify-center font-bold shadow-sm shadow-primary/20 shrink-0">
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};
