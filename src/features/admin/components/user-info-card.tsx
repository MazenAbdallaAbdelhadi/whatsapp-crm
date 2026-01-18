import { BanIcon, CalendarIcon, CheckCircleIcon, MailCheckIcon, ShieldIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { AdminUser } from "@/features/admin/types";
import { formatDate, formatRelativeTime, formatRoles, getRoleBadgeVariant } from "@/features/admin/utils";
import { Separator } from "@/components/ui/separator";

export const UserInfoCard = ({ user }: { user: AdminUser }) => {

  const roles = formatRoles(user.role);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
        <CardDescription>Basic details about this user</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <MailCheckIcon className="size-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.emailVerified && (
                <Badge variant="outline" className="mt-1 gap-1">
                  <CheckCircleIcon className="size-3" />
                  Verified
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldIcon className="size-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Roles</p>
              <div className="flex gap-1 flex-wrap mt-1">
                {roles.map((role, index) => (
                  <Badge
                    key={index}
                    variant={getRoleBadgeVariant(role)}
                    className="capitalize"
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Joined</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-sm text-muted-foreground">
                {formatRelativeTime(user.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {user.banned && user.banReason && (
          <>
            <Separator />
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
              <div className="flex items-start gap-2">
                <BanIcon className="size-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-destructive">
                    Ban Information
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {user.banReason}
                  </p>
                  {user.banExpires && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Expires: {formatDate(user.banExpires)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
