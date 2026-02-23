"use client";

import { CouponForm } from "../components/coupon-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { useCoupon } from "@/hooks/queries/useCoupons";
import { use } from "react";
import { RiCoupon2Fill } from "react-icons/ri";

interface PageProps {
  params: Promise<{ couponId: string }>;
}

export default function CouponDetailPage({ params }: PageProps) {
  const { t } = useTranslation();
  const { couponId } = use(params);
  const { data: coupon, isLoading, error } = useCoupon(couponId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (!coupon || error) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 items-center">
          <RiCoupon2Fill />
          <h1 className="text-2xl font-bold">{t('edit coupon')}</h1>
        </div>
        <Link href="/dashboard/coupons">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('back to coupons')}
          </Button>
        </Link>
      </div>

      <CouponForm coupon={coupon} />
    </div>
  );
}