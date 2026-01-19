"use client";
import { HomeIcon, InboxIcon, BlocksIcon, SettingsIcon, ShieldCheck, GalleryVerticalIcon, AudioWaveformIcon, CommandIcon, Users2Icon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { UserSidebarButton } from "@/features/auth";
import { authClient } from "@/lib/auth/auth-client";

import { NavMain } from "./nav-main";
import { TeamSwitcher } from "./team-switcher";

const teams = [
  {
    name: "Acme Inc.",
    logo: GalleryVerticalIcon,
    plan: "Enterprise",
  },
  {
    name: "Monsters Inc.",
    logo: AudioWaveformIcon,
    plan: "Startup",
  },
  {
    name: "Stark Industries",
    logo: CommandIcon,
    plan: "Free",
  },
]

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
  {
    title: "Leads",
    href: "/leads",
    icon: Users2Icon,
  },
];

const settingsData = [
  {
    title: "Templates",
    href: "/templates",
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
  const settings = isAdmin
    ? [
      {
        title: "Admin",
        href: "/admin/users",
        icon: ShieldCheck,
      },
      ...settingsData,
    ]
    : settingsData;

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavData} label="Main Menu" />
        <NavMain items={settings} label="Settings" />
      </SidebarContent>

      <SidebarFooter>
        <UserSidebarButton />
      </SidebarFooter>
    </Sidebar>
  );
};

