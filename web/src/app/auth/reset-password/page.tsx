"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useForm, type ControllerRenderProps } from "react-hook-form";
import { typeboxResolver } from "@/lib/typebox-resolver";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { ResetPasswordSchema } from "@/models/schemas";
import type { Static } from "@sinclair/typebox";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type ResetPasswordFormValues = Static<typeof ResetPasswordSchema>;

export default function ResetPasswordPage() {
    const { t, locale } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const token = searchParams.get("token");

    const form = useForm<ResetPasswordFormValues>({
        resolver: typeboxResolver(ResetPasswordSchema, { locale }),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (!token) {
            router.push("/auth/forgot-password");
        }
    }, [token, router]);

    const onSubmit = async (data: ResetPasswordFormValues) => {
        if (data.password !== data.confirmPassword) {
            form.setError("confirmPassword", { message: t("passwords don't match") });
            return;
        }

        if (!token) return;

        setIsLoading(true);
        try {
            await authClient.resetPassword({
                newPassword: data.password,
                token: token,
            });
            setIsSuccess(true);
            setTimeout(() => {
                router.push("/auth");
            }, 3000);
        } catch (error) {
            console.error("Reset password error:", error);
            form.setError("password", { message: t("invalid or expired token") });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground">
                <Card className="w-full max-w-md shadow-lg border-0 bg-card text-card-foreground">
                    <CardHeader className="space-y-1 pb-2">
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-6 w-6 text-green-600 dark:text-green-500"
                                >
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            </div>
                            <CardTitle className="text-2xl font-bold text-center text-foreground">
                                {t("password reset successful")}
                            </CardTitle>
                        </div>
                        <CardDescription className="text-center text-muted-foreground">
                            {t("your password has been reset successfully")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/auth" passHref>
                            <Button variant="outline" className="w-full">
                                {t("back to sign in")}
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </main>
        );
    }

    if (!token) {
        return null;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground">
            <div className="w-full max-w-md mx-auto">
                <Card className="w-full shadow-lg border-0 bg-card text-card-foreground">
                    <CardHeader className="space-y-1 pb-2">
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-6 w-6 text-primary"
                                >
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </div>
                            <CardTitle className="text-2xl font-bold text-center text-foreground">
                                {t("reset password")}
                            </CardTitle>
                        </div>
                        <CardDescription className="text-center text-muted-foreground">
                            {t("enter your new password")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({
                                        field,
                                    }: {
                                        field: ControllerRenderProps<
                                            ResetPasswordFormValues,
                                            "password"
                                        >;
                                    }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground">
                                                {t("new password")}
                                            </FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    placeholder={t("••••••••")}
                                                    autoComplete="new-password"
                                                    className="h-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({
                                        field,
                                    }: {
                                        field: ControllerRenderProps<
                                            ResetPasswordFormValues,
                                            "confirmPassword"
                                        >;
                                    }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground">
                                                {t("confirm new password")}
                                            </FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    placeholder={t("••••••••")}
                                                    autoComplete="new-password"
                                                    className="h-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90"
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? t("resetting") + " …"
                                        : t("reset password")}
                                </Button>
                            </form>
                        </Form>
                        <div className="mt-4 text-center">
                            <Link
                                href="/auth"
                                className="text-sm text-muted-foreground hover:text-primary"
                            >
                                {t("back to sign in")}
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}