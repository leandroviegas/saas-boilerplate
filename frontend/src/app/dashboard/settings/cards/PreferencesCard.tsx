"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

export function PreferencesCard() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { currentLocale, changeLanguage } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("preferences")}</CardTitle>
        <CardDescription>
          {t("customize your experience with theme and language settings")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>{t("theme")}</Label>
          <div className="flex space-x-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => setTheme('light')}
            >
              <Sun className="mr-0.5 h-4 w-4" /> {t("light")}
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => setTheme('dark')}
            >
              <Moon className="mr-0.5 h-4 w-4" /> {t("dark")}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">{t("language")}</Label>
          <Select defaultValue={currentLocale} onValueChange={(e) => changeLanguage(e)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup >
                <SelectItem value="en">{t("english")}</SelectItem>
                <SelectItem value="pt">{t("portuguese (brazil)")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
