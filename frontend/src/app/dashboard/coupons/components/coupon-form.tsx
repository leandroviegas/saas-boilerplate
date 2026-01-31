"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/hooks/useTranslation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GetAdminCouponsId200AllOfTwoData } from "@/api/generated/newChatbotAPI.schemas";
import { useCustomForm } from "@/hooks/useCustomForm";
import { useRouter } from "next/navigation";
import { useCreateCoupon, useUpdateCoupon } from "@/hooks/queries/useCoupons";

const couponFormSchema = z.object({
  code: z.string()
    .min(1, "Code is required")
    .regex(/^[a-zA-Z0-9_-]+$/, "Code can only contain letters, numbers, underscores, and hyphens (no spaces)"),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().min(0, "Value must be positive"),
  usageLimit: z.number().min(1, "Usage limit must be at least 1").optional(),
  active: z.boolean(),
  expiresAt: z.date().optional(),
});

type CouponFormValues = z.infer<typeof couponFormSchema>;

interface CouponFormProps {
  coupon?: GetAdminCouponsId200AllOfTwoData;
}

export function CouponForm({ coupon }: CouponFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();

  const { onFormSubmit, isLoading } = useCustomForm();

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: coupon?.code || "",
      discountType: coupon?.discountType || "PERCENTAGE",
      value: coupon?.value || 0,
      usageLimit: coupon?.usageLimit || undefined,
      active: coupon?.active ?? true,
      expiresAt: coupon?.expiresAt ? new Date(coupon.expiresAt) : undefined,
    },
  });

  const onSubmit = async (data: CouponFormValues) => {
    await onFormSubmit(data, async (formData) => {
      if (coupon?.id) {
        await updateCoupon.mutateAsync({
          id: coupon.id,
          updateData: {
            ...formData,
            expiresAt: formData.expiresAt?.toISOString(),
            usageCount: coupon.usageCount,
            stripeCouponId: coupon.stripeCouponId,
          },
        });
      } else {
        await createCoupon.mutateAsync({
          ...formData,
          expiresAt: formData.expiresAt?.toISOString(),
          usageCount: 0,
        });
      }

      router.push("/dashboard/coupons");
    }, form.setError);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('code')}</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., SUMMER2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="usageLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('usage_limit')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t('usage_limit_placeholder')}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="discountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('discount_type')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_discount_type')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">{t('percentage')}</SelectItem>
                    <SelectItem value="FIXED">{t('fixed')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('value')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t('value_placeholder')}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="expiresAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('expires_at')}</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    value={field.value ? field.value.toISOString().slice(0, 16) : ''}
                    onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('active')}</FormLabel>
              <Select onValueChange={(value) => field.onChange(value === 'true')} defaultValue={field.value.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">{t('yes')}</SelectItem>
                  <SelectItem value="false">{t('no')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || createCoupon.isPending || updateCoupon.isPending} className="w-full">
          {isLoading || createCoupon.isPending || updateCoupon.isPending ? t('saving') : coupon ? t('save_changes') : t('create_coupon')}
        </Button>
      </form>
    </Form>
  );
}