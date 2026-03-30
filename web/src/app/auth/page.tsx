"use client";

import { useTranslation } from "@/hooks/useTranslation";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import SignInForm from "./signin-form";
import SignUpForm from "./signup-form";

export default function AuthTabs() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("signIn");

    const handleTabChange = (value: string) => {
        setActiveTab(value);
    };

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
                                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                                </svg>
                            </div>
                            <CardTitle className="text-2xl font-bold text-center text-foreground">{t('welcome')}</CardTitle>
                        </div>
                        <CardDescription className="text-center text-muted-foreground">
                            {t('sign in to your account or create a new one')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Button
                                variant="outline"
                                className="w-full"
                                type="button"
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                Google
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator className="w-full" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card text-muted-foreground px-2">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <Tabs
                                value={activeTab}
                                onValueChange={handleTabChange}
                                className="w-full"
                            >
                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                    <TabsTrigger
                                        value="signIn"
                                        className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                    >
                                        {t('sign in')}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="signUp"
                                        className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                    >
                                        {t('sign up')}
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="signIn" className="animate-in fade-in slide-in-from-left-4 duration-300">
                                    <SignInForm />
                                </TabsContent>

                                <TabsContent value="signUp" className="animate-in fade-in slide-in-from-right-4 duration-300">
                                    <SignUpForm />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}