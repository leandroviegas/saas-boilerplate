"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { typeboxResolver } from "@/lib/typebox-resolver";
import { Type, Static } from "@sinclair/typebox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/useTranslation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useAuth } from '@/hooks/useAuth';
import { useCustomForm } from "@/hooks/useCustomForm";
import QRCode from "react-qr-code";

const passwordSchema = Type.Object({
  password: Type.String({ minLength: 1 }),
});

const verifySchema = Type.Object({
  otpCode: Type.String({ minLength: 6, maxLength: 6 }),
});

type PasswordFormValues = Static<typeof passwordSchema>;
type VerifyFormValues = Static<typeof verifySchema>;

interface Enable2FAModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TwoFactorCard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isEnableOpen, setIsEnableOpen] = useState(false);
  const [isDisableOpen, setIsDisableOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("two factor authentication")}</CardTitle>
          <CardDescription>
            {t("add an extra layer of security to your account")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user?.twoFactorEnabled ? (
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-green-600">{t("2fa is currently enabled")}</p>
              <Button variant="destructive" onClick={() => setIsDisableOpen(true)}>
                {t("disable 2fa")}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{t("2fa is not enabled")}</p>
              <Button onClick={() => setIsEnableOpen(true)}>
                {t("enable 2fa")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Enable2FAModal isOpen={isEnableOpen} onOpenChange={setIsEnableOpen} />
      <Disable2FAModal isOpen={isDisableOpen} onOpenChange={setIsDisableOpen} />
    </>
  );
}

export function Enable2FAModal({ isOpen, onOpenChange }: Enable2FAModalProps) {
  const { t, locale } = useTranslation();
  const { updateSession } = useAuth();
  const [qrCode, setQrCode] = useState("");
  const [step, setStep] = useState<"password" | "verify">("password");

  const { onFormSubmit: onEnableSubmit, isLoading: enableLoading } = useCustomForm();
  const { onFormSubmit: onVerifySubmit, isLoading: verifyLoading } = useCustomForm();

  const passwordForm = useForm<PasswordFormValues>({
    resolver: typeboxResolver(passwordSchema, { locale }),
    defaultValues: { password: "" },
  });

  const verifyForm = useForm<VerifyFormValues>({
    resolver: typeboxResolver(verifySchema, { locale }),
    defaultValues: { otpCode: "" },
  });

  const handleEnable = (data: PasswordFormValues) => {
    onEnableSubmit(data, async (values) => {
      const { data: resData, error } = await authClient.twoFactor.enable({
        password: values.password,
      });
      if (error) throw new Error(error.message);
      if (resData?.totpURI) {
        setQrCode(resData.totpURI);
        setStep("verify");
      }
    }, passwordForm.setError);
  };

  const handleVerify = (data: VerifyFormValues) => {
    onVerifySubmit(data, async (values) => {
      const { error } = await authClient.twoFactor.verifyTotp({
        code: values.otpCode,
      });
      if (error) throw new Error(error.message);
      toast.success(t("2fa enabled successfully"));
      handleClose();
      await updateSession();
    }, verifyForm.setError);
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep("password");
    setQrCode("");
    passwordForm.reset();
    verifyForm.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("enable 2fa")}</DialogTitle>
          <DialogDescription>
            {step === "password"
              ? t("enter your password to set up two factor authentication")
              : t("scan the qr code with your authenticator app and enter the 6 digit code")}
          </DialogDescription>
        </DialogHeader>

        {step === "password" ? (
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handleEnable)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("password")}</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder={t("enter password to enable 2fa")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={enableLoading}>
                {enableLoading ? t("loading") : t("continue")}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center p-2 bg-white rounded-lg w-max mx-auto">
              <QRCode value={qrCode} size={192} />
            </div>
            <Form {...verifyForm}>
              <form onSubmit={verifyForm.handleSubmit(handleVerify)} className="space-y-4 text-center">
                <FormField
                  control={verifyForm.control}
                  name="otpCode"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-center">
                      <FormLabel>{t("6 digit code")}</FormLabel>
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
                <Button type="submit" className="w-full" disabled={verifyLoading}>
                  {verifyLoading ? t("loading") : t("verify & enable")}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// --- Component 2: Disable 2FA Modal ---
interface Disable2FAModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Disable2FAModal({ isOpen, onOpenChange }: Disable2FAModalProps) {
  const { t } = useTranslation();
  const { updateSession } = useAuth();
  const { onFormSubmit: onDisableSubmit, isLoading: disableLoading } = useCustomForm();

  const form = useForm<PasswordFormValues>({
    resolver: typeboxResolver(passwordSchema),
    defaultValues: { password: "" },
  });

  const handleDisable = (data: PasswordFormValues) => {
    onDisableSubmit(data, async (values) => {
      const { error } = await authClient.twoFactor.disable({
        password: values.password,
      });
      if (error) throw new Error(error.message);
      toast.success(t("2fa disabled successfully"));
      onOpenChange(false);
      form.reset();
      await updateSession();
    }, form.setError);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) form.reset();
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("disable 2fa")}</DialogTitle>
          <DialogDescription>
            {t("enter your password to disable two factor authentication")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleDisable)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("password")}</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder={t("enter password to disable 2fa")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="destructive" className="w-full" disabled={disableLoading}>
              {disableLoading ? t("loading") : t("disable 2fa")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
