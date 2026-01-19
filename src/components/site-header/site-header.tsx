import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import { AppBreadcrumb } from "../app-breadcrumb";
import { Notifications } from "./notifications";
import { OrgMembers } from "./org-members";

export const SiteHeader = () => {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex flex-1 items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <AppBreadcrumb />
      </div>

      <div className="flex items-center gap-4 px-4 h-full">
        <OrgMembers />
        <Separator orientation="vertical" className="h-6" />
        <Notifications />
      </div>
    </header>
  );
};
