"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useSessions, useRevokeSession } from "@/hooks/queries/useSessions";

export function SessionsCard() {
  const { t } = useTranslation();
  const { data: sessions = [] } = useSessions();
  const { mutate: revokeSession } = useRevokeSession();
  const { session } = useAuth();

  function handleRevokeSession(sessionId: string) {
    revokeSession(sessionId, {
      onSuccess: () => {
        toast.success(t("session revoked"));
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("active sessions")}</CardTitle>
        <CardDescription>
          {t("manage your active sessions across different devices")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">
                  {s.userAgent || t("unknown device")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {s.ipAddress} • {new Date(s.createdAt).toLocaleString()}
                </p>

              </div>
              <div>
                <p className="text-sm text-green-400">
                  {s.id === session?.id ? t("current session") : ""}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                disabled={s.id === session?.id}
                onClick={() => handleRevokeSession(s.id)}
              >
                {t("revoke")}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
