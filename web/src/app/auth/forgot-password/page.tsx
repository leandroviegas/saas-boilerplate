"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useForm, type ControllerRenderProps } from "react-hook-form";
import { typeboxResolver } from "@/lib/typebox-resolver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { ForgotPasswordSchema } from "@/models/schemas";
import type { Static } from "@sinclair/typebox";
import { useState } from "react";
import Link from "next/link";

type ForgotPasswordFormValues = Static<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const { t, locale } = useTranslation();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ForgotPasswordFormValues>({
        resolver: typeboxResolver(ForgotPasswordSchema, { locale }),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        setIsLoading(true);
        try {
            await authClient.requestPasswordReset({
                email: data.email,
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });
            setIsSubmitted(true);
        } catch (error) {
            console.error("Forgot password error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
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
                                {t("check your email")}
                            </CardTitle>
                        </div>
                        <CardDescription className="text-center text-muted-foreground">
                            {t("we have sent password reset instructions to your email")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground text-center">
                                {t("didn't receive the email")}?{" "}
                                <button
                                    type="button"
                                    className="text-primary hover:underline"
                                    onClick={() => setIsSubmitted(false)}
                                >
                                    {t("resend")}
                                </button>
                            </p>
                            <Link href="/auth" passHref>
                                <Button variant="outline" className="w-full">
                                    {t("back to sign in")}
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>
        );
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
                                {t("forgot password")}
                            </CardTitle>
                        </div>
                        <CardDescription className="text-center text-muted-foreground">
                            {t("enter your email and we will send you reset instructions")}
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
                                    name="email"
                                    render={({
                                        field,
                                    }: {
                                        field: ControllerRenderProps<
                                            ForgotPasswordFormValues,
                                            "email"
                                        >;
                                    }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground">
                                                {t("email")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="name@example.com"
                                                    autoComplete="email"
                                                    spellCheck={false}
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
                                        ? t("sending") + " …"
                                        : t("send reset instructions")}
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