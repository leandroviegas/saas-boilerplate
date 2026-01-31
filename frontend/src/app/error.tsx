"use client";

import { useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full shadow-lg border-0 bg-card text-card-foreground">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-destructive">
              {t('something_went_wrong')}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              {t('unexpected_error')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={reset} variant="outline">
              {t('try_again')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}