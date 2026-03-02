"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { RoleForm } from "../components/role-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function RoleDetailPage() {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex gap-2 items-center">
                    <Shield />
                    <h1 className="text-2xl font-bold">{t('edit role')}</h1>
                </div>
                <Link href="/dashboard/roles">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t('back to roles')}
                    </Button>
                </Link>
            </div>

            <RoleForm />
        </div>
    );
}
