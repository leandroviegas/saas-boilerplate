"use client";

import { useForm } from "react-hook-form";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { Type, Static } from "@sinclair/typebox";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { useCustomForm } from "@/hooks/useCustomForm";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const passwordSchema = Type.Object({
  currentPassword: Type.String({ minLength: 1 }),
  newPassword: Type.String({ minLength: 8 }),
  confirmPassword: Type.String({ minLength: 1 }),
});

type PasswordValues = Static<typeof passwordSchema>;

export function PasswordCard() {
  const { t } = useTranslation();
  const { onFormSubmit, isLoading } = useCustomForm();

  const form = useForm<PasswordValues>({
    resolver: typeboxResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordValues) => {
    // Validate password match manually since TypeBox doesn't have refine equivalent
    if (data.newPassword !== data.confirmPassword) {
      form.setError("confirmPassword", { message: "passwords don't match" });
      return;
    }

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
