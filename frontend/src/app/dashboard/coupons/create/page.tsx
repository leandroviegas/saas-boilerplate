"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { CouponForm } from "../components/coupon-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CouponCreatePage() {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold">{t('create_coupon')}</h1>
                <Link href="/dashboard/coupons">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t('back_to_coupons')}
                    </Button>
                </Link>
            </div>

            <CouponForm />
        </div>
    );
}