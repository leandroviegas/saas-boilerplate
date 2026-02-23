"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { ProductForm } from "../components/product-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

export default function ProductDetailPage() {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex gap-2 items-center">
                    <Package />
                    <h1 className="text-2xl font-bold">{t('edit product')}</h1>
                </div>
                <Link href="/dashboard/products">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t('back to products')}
                    </Button>
                </Link>
            </div>

            <ProductForm />
        </div>
    );
}