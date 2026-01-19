"use client";

import { Template, TEMPLATE_CATEGORIES } from "../data/mock-templates";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { interpolateTemplate } from "../lib/template-utils";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
    template: Template;
    onView: (e: React.MouseEvent) => void;
}

export const TemplateCard = ({ template, onView }: TemplateCardProps) => {
    const categoryConfig = TEMPLATE_CATEGORIES.find(c => c.value === template.category);

    return (
        <Card className="flex flex-col border-muted hover:border-border transition-all hover:shadow-xl hover:shadow-primary/5 h-[260px] group cursor-pointer overflow-hidden relative bg-linear-to-br from-card to-muted/20" onClick={onView}>
            <div className={cn("absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10")}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>

            <CardHeader className="p-6 pb-3 space-y-3">
                <div className="flex items-center justify-between">
                    <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider border-0", categoryConfig?.color)}>
                        {categoryConfig?.label}
                    </Badge>
                </div>
                <h3 className="font-bold text-xl leading-tight truncate pr-4 group-hover:text-primary transition-colors">{template.name}</h3>
            </CardHeader>
            <CardContent className="p-6 pt-2 flex-1 overflow-hidden relative">
                <div className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    "{template.content}"
                </div>
                <div className="absolute bottom-0 left-0 w-full h-12 bg-linear-to-t from-card to-transparent" />
            </CardContent>
            <CardFooter className="p-6 pt-0 text-xs font-medium text-muted-foreground flex justify-between items-center mt-auto">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                    <span>Updated {format(template.updatedAt, 'MMM d, yyyy')}</span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => onView(e)}
                    className="flex items-center gap-1.5 text-primary opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                >
                    Preview <Eye className="h-3.5 w-3.5" />
                </Button>
            </CardFooter>
        </Card>
    );
};
