"use client";

import { ProductForm } from "../components/product-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { notFound } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { useProduct } from "@/hooks/queries/useProducts";
import { use } from "react";

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { t } = useTranslation();
  const { productId } = use(params);
  const { data: product, isLoading, error } = useProduct(productId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (!product || error) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 items-center">
          <Package />
          <h1 className="text-2xl font-bold">{t('edit_product')}</h1>
        </div>
        <Link href="/dashboard/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('back_to_products')}
          </Button>
        </Link>
      </div>

      <ProductForm product={product} />
    </div>
  );
}