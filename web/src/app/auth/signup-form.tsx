"use client";

import { useForm, type ControllerRenderProps } from "react-hook-form";
import { typeboxResolver } from "@/lib/typebox-resolver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from '@/hooks/useAuth';
import { useCustomForm } from "@/hooks/useCustomForm";
import { Type, Static } from "@sinclair/typebox";

const signUpSchema = Type.Object({
    name: Type.String({ minLength: 1 }),
    lastName: Type.String({ minLength: 1 }),
    email: Type.String({ format: "email" }),
    username: Type.Optional(Type.String()),
    password: Type.String({ minLength: 8 }),
    confirmPassword: Type.String({ minLength: 1 }),
});

export type SignUpFormValues = Static<typeof signUpSchema>;

export default function SignUpForm() {
    const { t, locale } = useTranslation();
    const { signUp } = useAuth()
    const { onFormSubmit, isLoading } = useCustomForm()

    const signUpForm = useForm<SignUpFormValues>({
        resolver: typeboxResolver(signUpSchema, { locale }),
        defaultValues: {
            name: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onRegisterSubmit = async (data: SignUpFormValues) => {
        if (data.password !== data.confirmPassword) {
            signUpForm.setError("confirmPassword", { message: "passwords don't match" });
            return;
        }

        const submitData = {
            ...data,
            name: `${data.name} ${data.lastName}`.trim(),
            username: `${data.name} ${data.lastName} ${Math.floor(Math.random() * 10000)}`.trim().toLowerCase().replace(/\s+/g, '-')
        };
        onFormSubmit(submitData, signUp, signUpForm.setError);
    };

    return (
        <Form {...signUpForm}>
            <form onSubmit={signUpForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={signUpForm.control}
                        name="name"
                        render={({ field }: { field: ControllerRenderProps<SignUpFormValues, "name"> }) => (
                            <FormItem>
                                <FormLabel className="text-foreground">{t('first name')}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t('john')} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={signUpForm.control}
                        name="lastName"
                        render={({ field }: { field: ControllerRenderProps<SignUpFormValues, "lastName"> }) => (
                            <FormItem>
                                <FormLabel className="text-foreground">{t('last name')}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t('doe')} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }: { field: ControllerRenderProps<SignUpFormValues, "email"> }) => (
                        <FormItem>
                            <FormLabel className="text-foreground">{t('email')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('name@example.com')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }: { field: ControllerRenderProps<SignUpFormValues, "password"> }) => (
                        <FormItem>
                            <FormLabel className="text-foreground">{t('password')}</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder={t('••••••••')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }: { field: ControllerRenderProps<SignUpFormValues, "confirmPassword"> }) => (
                        <FormItem>
                            <FormLabel className="text-foreground">{t('confirm password')}</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder={t('••••••••')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={isLoading}>
                    {isLoading ? t('creating account...') : t('create account')}
                </Button>
            </form>
        </Form>
    );
}
