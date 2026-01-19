"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, MoreVertical, Phone, Video } from "lucide-react";

export const ChatHeader = () => {
    return (
        <div className="bg-[#075E54] p-2 flex items-center gap-2 text-white shrink-0 z-10 relative shadow-sm">
            <div className="flex items-center gap-1 cursor-pointer">
                <ChevronLeft className="h-5 w-5" />
                <Avatar className="h-8 w-8 border border-white/20">
                    <AvatarImage src="https://i.pravatar.cc/150?u=target_user" />
                    <AvatarFallback className="text-xs bg-gray-200 text-gray-700">SC</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex-1 min-w-0 ml-1">
                <h3 className="text-sm font-semibold truncate leading-tight">Sarah Connor</h3>
                <p className="text-[10px] text-white/80 truncate">online</p>
            </div>
            <div className="flex items-center gap-3 pr-1">
                <Video className="h-4 w-4" />
                <Phone className="h-4 w-4" />
                <MoreVertical className="h-4 w-4" />
            </div>
        </div>
    );
};
