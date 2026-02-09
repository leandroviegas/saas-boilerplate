"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useForm, type ControllerRenderProps } from "react-hook-form";
import { typeboxResolver } from "@/lib/typebox-resolver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from "next/link";
import { useAuth } from '@/hooks/useAuth';
import { useCustomForm } from "@/hooks/useCustomForm";
import { Type, Static } from "@sinclair/typebox";

const signInSchema = Type.Object({
  email: Type.String(),
  password: Type.String(),
});

export type SignInFormValues = Static<typeof signInSchema>;

export default function SignInForm() {
    const { t, locale } = useTranslation();
    const { signIn } = useAuth();
    const { onFormSubmit, isLoading } = useCustomForm();

    const signInForm = useForm<SignInFormValues>({
        resolver: typeboxResolver(signInSchema, { locale }),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onLoginSubmit = async (data: SignInFormValues) => {
        onFormSubmit(data, signIn, signInForm.setError);
    };

    return (
        <Form {...signInForm}>
            <form onSubmit={signInForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }: { field: ControllerRenderProps<SignInFormValues, "email"> }) => (
                        <FormItem>
                            <FormLabel className="text-foreground">{t('email')}</FormLabel>
                            <FormControl>
                                <Input placeholder="name@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }: { field: ControllerRenderProps<SignInFormValues, "password"> }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel className="text-foreground">{t('password')}</FormLabel>
                                <Link href="/forgot-password">
                                    <Button variant="link" className="px-0 font-normal h-auto text-xs text-muted-foreground" type="button">
                                        {t('forgot password')}?
                                    </Button>
                                </Link>
                            </div>
                            <FormControl>
                                <PasswordInput placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={isLoading}>
                    {isLoading ? t("signing in") + "..." : t("sign in")}
                </Button>
            </form>
        </Form>
    );
}
