"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="flex flex-col items-center justify-center p-4 my-6 bg-background text-foreground">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full shadow-lg border-0 bg-card text-card-foreground">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-foreground">
              {t('page not found')}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              {t('page not found description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild variant="outline">
              <Link href="/">
                {t('go home')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}