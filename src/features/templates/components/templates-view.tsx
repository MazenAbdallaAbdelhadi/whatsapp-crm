"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { MOCK_TEMPLATES, Template } from "../data/mock-templates";
import { TemplateCard } from "./template-card";
import { CreateTemplateDialog } from "./create-template-dialog";
import { PhoneFrame } from "./whatsapp-mockup/phone-frame";
import { interpolateTemplate } from "../lib/template-utils";
import { motion } from "motion/react";

export const TemplatesView = () => {
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(MOCK_TEMPLATES[0]);

    const filteredTemplates = MOCK_TEMPLATES.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.content.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = () => {
        setEditingTemplate(null);
        setIsCreateOpen(true);
    };

    const handleEdit = (template: Template, e: React.MouseEvent) => {
        e.stopPropagation(); // crucial: prevent row click
        setEditingTemplate(template);
        setSelectedTemplate(template); // also select it
        setIsCreateOpen(true);
    };

    const handleSelect = (template: Template) => {
        setSelectedTemplate(template);
    };

    return (
        <div className="h-full flex flex-col md:flex-row overflow-hidden bg-muted/10">
            {/* Left Panel: Template List */}
            <div className="flex-1 flex flex-col h-full overflow-hidden border-r bg-background">

                {/* Header */}
                <div className="p-6 md:p-8 border-b space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Message Templates</h2>
                            <p className="text-muted-foreground mt-1">Manage standard replies and automated messages.</p>
                        </div>
                        <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700 shadow-xl shadow-green-600/20">
                            <Plus className="mr-2 h-4 w-4" />
                            New Template
                        </Button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search templates..."
                                className="pl-9 bg-muted/40 border-muted-foreground/20 focus-visible:bg-background transition-colors"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon" className="shrink-0">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                        {filteredTemplates.map((template, idx) => (
                            <motion.div
                                key={template.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => handleSelect(template)}
                                className={`cursor-pointer ring-2 transition-all rounded-xl ${selectedTemplate?.id === template.id ? 'ring-primary border-primary shadow-lg scale-[1.01]' : 'ring-transparent hover:ring-border hover:border-foreground/20'}`}
                            >
                                <TemplateCard
                                    template={template}
                                    onView={(e) => handleEdit(template, e)}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel: Live Preview (Desktop) */}
            <div className="hidden 2xl:flex w-[480px] bg-muted/20 flex-col border-l relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 pointer-events-none" />

                <div className="flex-1 flex flex-col items-center justify-center p-8 sticky top-0">
                    <div className="text-center mb-8 space-y-1 z-10">
                        <h3 className="text-lg font-semibold">Live Preview</h3>
                        <p className="text-sm text-muted-foreground">See how it looks on a device</p>
                    </div>

                    <motion.div
                        key={selectedTemplate?.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        className="drop-shadow-2xl"
                    >
                        <PhoneFrame
                            message={selectedTemplate ? interpolateTemplate(selectedTemplate.content) : ""}
                        />
                    </motion.div>
                </div>
            </div>

            <CreateTemplateDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                initialData={editingTemplate}
            />
        </div>
    );
};
