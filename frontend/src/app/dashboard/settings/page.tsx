"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/useTranslation";
import { UserDetailsCard } from "./cards/UserDetailsCard";
import { PasswordCard } from "./cards/PasswordCard";
import { PreferencesCard } from "./cards/PreferencesCard";
import { TwoFactorCard } from "./cards/TwoFactorCard";
import { SessionsCard } from "./cards/SessionsCard";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("settings")}</h1>
        <p className="text-muted-foreground">
          {t("manage your account settings and preferences")}
        </p>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="details">{t("details")}</TabsTrigger>
          <TabsTrigger value="security">{t("security")}</TabsTrigger>
          <TabsTrigger value="preferences">{t("preferences")}</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <UserDetailsCard />
        </TabsContent>
        <TabsContent value="security">
          <div className="space-y-6">
            <TwoFactorCard />
            <SessionsCard />
            <PasswordCard />
          </div>
        </TabsContent>
        <TabsContent value="preferences">
          <PreferencesCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
