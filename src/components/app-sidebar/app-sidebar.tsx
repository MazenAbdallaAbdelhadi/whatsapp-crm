"use client";
import { HomeIcon, InboxIcon, BlocksIcon, SettingsIcon, ShieldCheck } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { UserSidebarButton } from "@/features/auth";
import { authClient } from "@/lib/auth/auth-client";

import { NavMain } from "./nav-main";

const mainNavData = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    title: "Inbox",
    href: "/inbox",
    icon: InboxIcon,
    badge: 5,
  },
];

const featuresData = [
  {
    title: "Integrations",
    href: "/integrations",
    icon: BlocksIcon,
  },
  {
    title: "Settings",
    href: "/settings/profile",
    icon: SettingsIcon,
  },
];

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { data: session } = authClient.useSession();

  // Check if user has admin role
  const isAdmin = session?.user?.role?.toLowerCase().includes('admin') || false;

  // Add admin to features if user is admin
  const features = isAdmin
    ? [
      {
        title: "Admin",
        href: "/admin/users",
        icon: ShieldCheck,
      },
      ...featuresData,
    ]
    : featuresData;

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader></SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavData} label="Main Menu" />
        <NavMain items={features} label="Features" />
      </SidebarContent>

      <SidebarFooter>
        <UserSidebarButton />
      </SidebarFooter>
    </Sidebar>
  );
};

