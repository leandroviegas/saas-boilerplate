"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { useCustomForm } from "@/hooks/useCustomForm";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "current password is required"),
  newPassword: z.string()
    .min(8, "password must be at least 8 characters")
    .regex(/[A-Z]/, "password must contain at least one uppercase letter")
    .regex(/[a-z]/, "password must contain at least one lowercase letter")
    .regex(/[0-9]/, "password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "password must contain at least one special character"),
  confirmPassword: z.string().min(1, "please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "passwords don't match",
  path: ["confirmPassword"],
});

type PasswordValues = z.infer<typeof passwordSchema>;

export function PasswordCard() {
  const { t } = useTranslation();
  const { onFormSubmit, isLoading } = useCustomForm();

  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordValues) => {
    const changePasswordAction = async (values: PasswordValues) => {
      const { error } = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true,
      });

      if (error) throw new Error(error.message);
      toast.success(t("password changed successfully"));
      form.reset();
    };

    onFormSubmit(data, changePasswordAction, form.setError);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("change password")}</CardTitle>
        <CardDescription>
          {t("ensure your account is using a long, random password to stay secure")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("current password")}</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("new password")}</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("confirm new password")}</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t("updating...") : t("update password")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
