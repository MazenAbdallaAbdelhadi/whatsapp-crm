"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AVAILABLE_VARIABLES } from "../lib/template-utils";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateEditorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export const TemplateEditor = ({ value, onChange, className }: TemplateEditorProps) => {

    const insertVariable = (variableId: string) => {
        // Simple append for now. 
        // Ideal: Insert at cursor position (requires ref logic, keeping it simple for v1 reliability)
        const toInsert = `{{${variableId}}}`;
        onChange(value + (value.endsWith(' ') || value === '' ? '' : ' ') + toInsert);
    };

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <Label className="text-sm font-medium text-muted-foreground">Message Content</Label>
            <div className="relative">
                <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Hi {{first_name}}, welcome to..."
                    className="min-h-[160px] p-4 resize-none font-sans text-base leading-relaxed bg-background"
                />
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-0.5 rounded">
                    {value.length} chars
                </div>
            </div>

            <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Insert Variable</Label>
                <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_VARIABLES.map(variable => (
                        <Button
                            key={variable.id}
                            variant="secondary"
                            size="sm"
                            type="button"
                            className="h-7 text-xs bg-primary/5 hover:bg-primary/10 text-primary border border-primary/10 transition-colors"
                            onClick={() => insertVariable(variable.id)}
                        >
                            <Plus className="w-3 h-3 mr-1 opacity-50" />
                            {variable.label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};
