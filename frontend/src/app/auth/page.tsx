"use client";

import { useTranslation } from "@/hooks/useTranslation";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from "./signin-form";
import SignUpForm from "./signup-form";
export default function AuthTabs() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("signIn");

    return (
        <main className="flex min-h-screen flex-col items-center p-4 pt-8 bg-background text-foreground">
            <div className="w-full max-w-md mx-auto">
                <Card className="w-full shadow-lg border-0 bg-card text-card-foreground">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center text-foreground">{t('welcome')}</CardTitle>
                        <CardDescription className="text-center text-muted-foreground">
                            {t('sign in to your account or create a new one')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger className="text-foreground" value="signIn">
                                    {t('signIn')}
                                </TabsTrigger>
                                <TabsTrigger className="text-foreground" value="signUp">
                                    {t('signUp')}
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="signIn">
                                <SignInForm />
                            </TabsContent>

                            <TabsContent value="signUp">
                                <SignUpForm />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}