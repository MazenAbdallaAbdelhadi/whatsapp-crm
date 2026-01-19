import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, PanelRightOpen } from "lucide-react";
import { Conversation } from "../../data/mock-data";

interface ChatHeaderProps {
    conversation: Conversation;
    onBack: () => void;
    onToggleProfile: () => void;
}

export const ChatHeader = ({ conversation, onBack, onToggleProfile }: ChatHeaderProps) => {
    return (
        <div className="flex items-center justify-between px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-[65px] z-10 relative shadow-sm/5 shrink-0">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-8 w-8 -ml-2 text-muted-foreground hover:bg-transparent"
                    onClick={onBack}
                >
                    <ChevronLeft className="size-6" />
                </Button>

                <div className="flex items-center gap-3.5 cursor-pointer group" onClick={onToggleProfile}>
                    <Avatar className="h-10 w-10 border border-border shadow-sm group-hover:opacity-90 transition-opacity">
                        <AvatarImage src={conversation.user.avatar} />
                        <AvatarFallback>{conversation.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="grid gap-0.5">
                        <span className="font-semibold text-sm leading-none group-hover:text-primary transition-colors">
                            {conversation.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                            Online
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary">
                    <Search className="size-4.5" />
                </Button>
                <div className="w-px h-5 bg-border mx-1" />
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary" onClick={onToggleProfile}>
                    <PanelRightOpen className="size-4.5" />
                </Button>
            </div>
        </div>
    );
};
