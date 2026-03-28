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
import { SignUpSchema } from "@/models/schemas";
import type { Static } from "@sinclair/typebox";

export type SignUpFormValues = Static<typeof SignUpSchema>;

export default function SignUpForm() {
    const { t, locale } = useTranslation();
    const { signUp } = useAuth()
    const { onFormSubmit, isLoading } = useCustomForm()

    const signUpForm = useForm<SignUpFormValues>({
        resolver: typeboxResolver(SignUpSchema, { locale }),
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
                <div className="grid grid-cols-2 gap-3">
                    <FormField
                        control={signUpForm.control}
                        name="name"
                        render={({ field }: { field: ControllerRenderProps<SignUpFormValues, "name"> }) => (
                            <FormItem>
                                <FormLabel className="text-foreground">{t('first name')}</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder={t('john')} 
                                        autoComplete="given-name" 
                                        className="h-10"
                                        {...field} 
                                    />
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
                                    <Input 
                                        placeholder={t('doe')} 
                                        autoComplete="family-name" 
                                        className="h-10"
                                        {...field} 
                                    />
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
                                <Input 
                                    placeholder={t('name@example.com')} 
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

                <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }: { field: ControllerRenderProps<SignUpFormValues, "password"> }) => (
                        <FormItem>
                            <FormLabel className="text-foreground">{t('password')}</FormLabel>
                            <FormControl>
                                <PasswordInput 
                                    placeholder={t('••••••••')} 
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
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }: { field: ControllerRenderProps<SignUpFormValues, "confirmPassword"> }) => (
                        <FormItem>
                            <FormLabel className="text-foreground">{t('confirm password')}</FormLabel>
                            <FormControl>
                                <PasswordInput 
                                    placeholder={t('••••••••')} 
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
                    {isLoading ? t('creating account') + " …" : t('create account')}
                </Button>
            </form>
        </Form>
    );
}
