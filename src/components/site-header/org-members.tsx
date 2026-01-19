"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function OrgMembers() {
    return (
        <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Avatar className="inline-block h-8 w-8 border-2 border-background ring-2 ring-background hover:z-10 cursor-pointer">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>Shadcn (Admin)</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Avatar className="inline-block h-8 w-8 border-2 border-background ring-2 ring-background hover:z-10 cursor-pointer">
                                <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
                                <AvatarFallback>LR</AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>Lee Robinson</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Avatar className="inline-block h-8 w-8 border-2 border-background ring-2 ring-background hover:z-10 cursor-pointer">
                                <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
                                <AvatarFallback>ER</AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>Evil Rabbit</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium ring-2 ring-background hover:z-10 cursor-default">
                    +2
                </div>
            </div>
        </div>
    );
}
