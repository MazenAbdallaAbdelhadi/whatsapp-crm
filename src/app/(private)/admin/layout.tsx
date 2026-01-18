"use client";

import { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function AdminLayout({ children }: PropsWithChildren) {
    const pathname = usePathname();

    const adminMenu = [
        {
            label: "Users",
            href: "/users",
            icon: Users,
        },
    ];

    return (
        <div className="flex flex-col h-full gap-6 px-2 md:px-4 py-4 md:py-6">
            <ScrollArea>
                <div className="flex gap-2 items-center">
                    {adminMenu.map((item) => (
                        <Button
                            key={item.href}
                            variant={pathname.endsWith(item.href) ? "secondary" : "ghost"}
                            asChild
                        >
                            <Link href={`/admin${item.href}`}>
                                <item.icon />
                                <span>{item.label}</span>
                            </Link>
                        </Button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <div className="flex-1">{children}</div>
        </div>
    );
}
