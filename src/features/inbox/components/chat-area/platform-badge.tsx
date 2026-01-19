import { Badge } from "@/components/ui/badge";
import { Platform } from "../../data/mock-data";
import { Instagram, MessageCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformBadgeProps {
    platform: Platform;
    showLabel?: boolean;
    className?: string;
}

export const PlatformBadge = ({ platform, showLabel = false, className }: PlatformBadgeProps) => {
    const config = {
        whatsapp: {
            icon: MessageCircle,
            label: "WhatsApp",
            className: "bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20",
        },
        telegram: {
            icon: Send,
            label: "Telegram",
            className: "bg-sky-500/10 text-sky-600 border-sky-200 hover:bg-sky-500/20",
        },
        instagram: {
            icon: Instagram,
            label: "Instagram",
            className: "bg-pink-500/10 text-pink-600 border-pink-200 hover:bg-pink-500/20",
        },
    };

    const { icon: Icon, label, className: colorClass } = config[platform];

    if (!showLabel) {
        return (
            <div className={cn("p-1 rounded-full", colorClass, className)}>
                <Icon className="size-3" />
            </div>
        );
    }

    return (
        <Badge variant="outline" className={cn("gap-1.5 font-normal", colorClass, className)}>
            <Icon className="size-3.5" />
            {label}
        </Badge>
    );
};
