import { User as UserIcon, StickyNote, Mail, Phone, Tag as TagIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Platform } from "../../data/mock-data";

interface ProfileSidebarProps {
    user: User;
    platform: Platform;
    isOpen: boolean;
    onClose: () => void;
}

export const ProfileSidebar = ({ user, platform, isOpen, onClose }: ProfileSidebarProps) => {
    if (!isOpen) return null;

    return (
        <div className="border-l bg-background flex flex-col h-full animate-in slide-in-from-right duration-300 w-full md:w-[320px] absolute inset-y-0 right-0 z-20 md:relative md:inset-auto md:z-0 shadow-2xl md:shadow-none overflow-hidden">

            <div className="flex items-center justify-between px-6 border-b shrink-0 h-[65px]">
                <span className="font-semibold text-sm">Contact Info</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-transparent -mr-2" onClick={onClose}>
                    <span className="sr-only">Close</span>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.1929 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.1929 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </Button>
            </div>

            <ScrollArea className="flex-1 h-full">
                <div className="flex flex-col items-center p-8 pb-6 text-center border-b bg-muted/10">
                    <div className="relative mb-4 group cursor-pointer">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-lg transition-transform group-hover:scale-105 duration-300">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="text-2xl bg-primary/10 text-primary">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10 dark:ring-white/10" />
                    </div>

                    <h3 className="font-bold text-lg text-foreground tracking-tight">{user.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium mt-1">+1 (555) 000-0000</p>
                </div>

                <div className="p-6 space-y-8">
                    {/* About Section */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">About</h4>
                        <p className="text-sm leading-relaxed text-foreground/80">
                            {user.about || "No bio available."}
                        </p>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Info</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 text-sm group">
                                <div className="p-2 rounded-md bg-muted/40 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <Mail className="size-4" />
                                </div>
                                <div className="space-y-0.5 min-w-0 flex-1">
                                    <p className="font-medium text-foreground truncate">{user.email}</p>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                </div>
                            </div>
                            {user.phone && (
                                <div className="flex items-start gap-3 text-sm group">
                                    <div className="p-2 rounded-md bg-muted/40 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <Phone className="size-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="font-medium text-foreground">{user.phone}</p>
                                        <p className="text-xs text-muted-foreground">Mobile</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="px-2.5 py-1 bg-secondary/50 hover:bg-secondary text-secondary-foreground font-medium rounded-md transition-colors cursor-pointer">
                                Lead
                            </Badge>
                            <Badge variant="secondary" className="px-2.5 py-1 bg-secondary/50 hover:bg-secondary text-secondary-foreground font-medium rounded-md transition-colors cursor-pointer">
                                New Customer
                            </Badge>
                            <button className="flex items-center gap-1 px-2.5 py-1 text-xs border border-dashed rounded-md text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors">
                                <Plus className="size-3" />
                                Add Tag
                            </button>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};
