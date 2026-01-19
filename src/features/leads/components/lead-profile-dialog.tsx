"use client";

import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Calendar,
    Mail,
    Phone,
    MapPin,
    Building,
    Globe,
    Linkedin,
    Clock,
    CreditCard,
    Tag,
    MessageCircle,
    X,
    MoreVertical,
    CheckCircle2
} from "lucide-react";
import { Lead } from "../data/mock-leads";
import { format } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LeadProfileDialogProps {
    lead: Lead | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LeadProfileDialog({ lead, open, onOpenChange }: LeadProfileDialogProps) {
    if (!lead) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-4xl p-0 overflow-hidden gap-0 border-none shadow-2xl bg-card/95 backdrop-blur-md"
                showCloseButton={false}
            >

                {/* Custom Close Button */}
                <DialogClose className="absolute right-4 top-4 z-50 rounded-full bg-background/20 p-2 hover:bg-background/40 transition-colors text-foreground/80 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>

                {/* Hero Header */}
                <div className="relative h-40 md:h-48 bg-linear-to-br from-green-600/20 via-primary/10 to-background flex flex-col justify-end p-4 md:p-6 pb-8 md:pb-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

                    <div className="flex items-end gap-4 md:gap-5 relative z-10 translate-y-8 md:translate-y-8">
                        <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-background shadow-xl ring-2 ring-border/50 shrink-0">
                            <AvatarImage src={lead.avatar} alt={lead.name} />
                            <AvatarFallback className="text-xl md:text-2xl bg-primary/10 text-primary">{lead.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 pb-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground truncate">{lead.name}</h2>
                                    <div className="flex flex-wrap items-center gap-2 text-muted-foreground mt-0.5 text-sm">
                                        <Building className="h-3.5 w-3.5" />
                                        <span className="font-medium truncate max-w-[120px]">{lead.company}</span>
                                        <span className="hidden md:inline">•</span>
                                        <span className="truncate max-w-[120px]">{lead.role}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 mb-1 md:mr-8">
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 rounded-full px-4 md:px-6 flex-1 md:flex-none">
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        Chat
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full bg-background/50 backdrop-blur-sm border-2 h-9 w-9">
                                        <Phone className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground h-9 w-9">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <ScrollArea className="max-h-[calc(85vh-10rem)] md:max-h-[600px]">
                    <div className="pt-12 px-4 md:px-6 pb-8 bg-background">
                        <div className="grid grid-cols-12 gap-6 md:gap-8">

                            {/* Left Column: Stats & Tags */}
                            <div className="col-span-12 md:col-span-4 space-y-6 md:border-r pr-0 md:pr-8 border-border/50">

                                <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                                    {/* Status */}
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 md:mb-3">Status</h4>
                                        <div className="flex items-center justify-between p-2 md:p-3 rounded-lg border bg-muted/30">
                                            <span className="font-medium text-sm">{lead.status}</span>
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                        </div>
                                    </div>

                                    {/* Value */}
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 md:mb-3">Deal Value</h4>
                                        <div className="p-3 md:p-4 rounded-xl border bg-card shadow-sm group hover:border-primary/50 transition-colors">
                                            <div className="flex items-center gap-2 text-primary mb-1">
                                                <CreditCard className="h-4 w-4" />
                                                <span className="text-xs font-medium">Potential</span>
                                            </div>
                                            <div className="text-xl md:text-2xl font-bold tracking-tight">
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(lead.value)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 md:mb-3">Labels</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {lead.tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="px-2.5 py-1 rounded-md bg-muted/50 hover:bg-muted transition-colors font-medium border-transparent">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Details & Activity */}
                            <div className="col-span-12 md:col-span-8 space-y-6 pl-0 md:pl-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            Contact Details
                                        </h4>
                                        <div className="space-y-3 pl-1">
                                            <div>
                                                <div className="text-xs text-muted-foreground mb-0.5">WhatsApp</div>
                                                <div className="text-sm font-medium font-mono">{lead.phone}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground mb-0.5">Source</div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs font-normal">
                                                        {lead.source}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            Activity
                                        </h4>
                                        <div className="space-y-3 pl-1">
                                            <div>
                                                <div className="text-xs text-muted-foreground mb-0.5">Last Message</div>
                                                <div className="text-sm italic text-muted-foreground/80 wrap-break-word">"{lead.lastMessage}"</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground mb-0.5">Last Active</div>
                                                <div className="text-sm font-medium">{format(lead.lastContacted, 'PPp')}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Notes / Preview */}
                                <div className="bg-muted/20 rounded-lg p-4 border border-dashed">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-medium">Quick Notes</h4>
                                        <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground hover:text-primary">Add Note</Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Customer has expressed interest in our bulk pricing tier. Follow up on Monday regarding the catalog inquiry. Preferred contact method is WhatsApp.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
