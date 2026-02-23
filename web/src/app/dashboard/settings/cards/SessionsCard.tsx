"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { getSessions } from "@/api/generated/sessions/sessions";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { GetMemberSessions200AllOfTwoDataItem } from "@/api/generated/newChatbotAPI.schemas";

const sessionApi = getSessions();

export function SessionsCard() {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<GetMemberSessions200AllOfTwoDataItem[]>([]);
  const { session } = useAuth();

  async function fetchSessions() {
    const { data } = await sessionApi.getMemberSessions();
    if (!data) return;
    setSessions(data);
  };

  async function handleRevokeSession(sessionId: string) {
    await sessionApi.deleteMemberSessionsId(sessionId);
    toast.success(t("session revoked"));
    fetchSessions();
  };

  useEffect(() => {
    fetchSessions();
  }, []);

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