"use client";

import { useForm, type ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from '@/hooks/useAuth';
import { useCustomForm } from "@/hooks/useCustomForm";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  username: z.string().optional(),
  password: z.string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
  confirmPassword: z.string().min(1),
}).refine((data) => data.password === data.confirmPassword, {
  message: "passwords don't match",
  path: ["confirmPassword"],
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
export default function SignUpForm() {
    const { t } = useTranslation();
    const { signUp } = useAuth()
    const { onFormSubmit, isLoading } = useCustomForm()

    const signUpForm = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
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