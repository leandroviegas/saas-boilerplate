"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { useAuth } from '@/hooks/useAuth';
import { useCustomForm } from "@/hooks/useCustomForm";
import { useRouter } from "next/navigation";

const verifySchema = z.object({
  otpCode: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

export default function TwoFactorPage() {
  const { t } = useTranslation();
  const { updateSession } = useAuth();
  const router = useRouter();
  const { onFormSubmit, isLoading } = useCustomForm();

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      otpCode: "",
    },
  });

  const onSubmit = (data: VerifyFormValues) => {
    onFormSubmit(data, async (data) => {
      const { error } = await authClient.twoFactor.verifyTotp({
        code: data.otpCode,
      });

      if (error) {
        throw new Error(error.message);
      }

      await updateSession();
      router.push("/dashboard");
    }, form.setError);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 pt-8 bg-background text-foreground">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full shadow-lg border-0 bg-card text-card-foreground">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-foreground">
              {t("two-factor verification")}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              {t("enter the 6-digit code from your authenticator app")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col items-center">
                <FormField
                  control={form.control}
                  name="otpCode"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t("verifying...") : t("verify and sign in")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
