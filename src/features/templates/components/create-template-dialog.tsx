"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { TemplateEditor } from "./template-editor";
import { PhoneFrame } from "./whatsapp-mockup/phone-frame";
import { interpolateTemplate } from "../lib/template-utils";
import { TEMPLATE_CATEGORIES, Template } from "../data/mock-templates";
import { Sparkles } from "lucide-react";

interface CreateTemplateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Template | null;
}

export const CreateTemplateDialog = ({ open, onOpenChange, initialData }: CreateTemplateDialogProps) => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("greeting");
    const [content, setContent] = useState("");
    const [previewContent, setPreviewContent] = useState("");

    // Reset or populate form when dialog opens/closes or initialData changes
    useEffect(() => {
        if (open) {
            if (initialData) {
                setName(initialData.name);
                setCategory(initialData.category);
                setContent(initialData.content);
            } else {
                setName("");
                setCategory("greeting");
                setContent("");
            }
        }
    }, [open, initialData]);

    // Update preview live
    useEffect(() => {
        setPreviewContent(interpolateTemplate(content));
    }, [content]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] sm:max-w-[95vw] w-full h-[90vh] p-0 gap-0 border-none shadow-2xl bg-background block overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 h-full">

                    {/* Left: Editor Form (7 columns) */}
                    <div className="lg:col-span-7 flex flex-col p-8 lg:p-10 h-full overflow-y-auto bg-background">
                        <DialogHeader className="mb-8 space-y-2 shrink-0">
                            <DialogTitle className="text-3xl font-bold tracking-tight">
                                {initialData ? "Edit Template" : "Create Template"}
                            </DialogTitle>
                            <DialogDescription className="text-base max-w-xl">
                                Design your WhatsApp message template. Use the editor below to insert variables and preview the result instantly.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-8 flex-1">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                    <Label className="text-sm font-semibold text-foreground/80">Template Name</Label>
                                    <Input
                                        placeholder="e.g. Welcome Series #1"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-11"
                                    />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-semibold text-foreground/80">Category</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger className="h-11">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TEMPLATE_CATEGORIES.map(cat => (
                                                <SelectItem key={cat.value} value={cat.value}>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${cat.color.split(' ')[0]}`} />
                                                        {cat.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <TemplateEditor
                                value={content}
                                onChange={setContent}
                                className="flex-1 min-h-[300px]"
                            />
                        </div>
                        <DialogFooter className="mt-8 pt-4 border-t shrink-0">
                            <Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button size="lg" disabled={!name || !content} className="min-w-[140px]">
                                {initialData ? "Save Changes" : "Create Template"}
                            </Button>
                        </DialogFooter>
                    </div>

                    {/* Right: Preview (5 columns) */}
                    <div className="hidden lg:flex lg:col-span-5 bg-muted/30 border-l relative items-center justify-center p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
                        <div className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground/60">
                            <Sparkles className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Live Preview</span>
                        </div>

                        <div className="scale-[0.85] 2xl:scale-100 transition-transform duration-500 ease-out shadow-2xl rounded-[2.5rem]">
                            <PhoneFrame message={previewContent || "Your message preview will appear here..."} />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
