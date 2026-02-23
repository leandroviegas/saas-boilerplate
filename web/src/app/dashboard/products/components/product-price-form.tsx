"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useCustomForm } from "@/hooks/useCustomForm";
import { useTranslation } from "@/hooks/useTranslation";
import { typeboxResolver } from "@/lib/typebox-resolver";
import { Type, Static } from "@sinclair/typebox";
import { getProductPrices } from "@/api/generated/product-prices/product-prices";

const productPriceFormSchema = Type.Object({
  id: Type.Optional(Type.String()),
  amount: Type.Number({ minimum: 0 }),
  currency: Type.Union([Type.Literal("USD"), Type.Literal("EUR"), Type.Literal("BRL")]),
  active: Type.Boolean(),
  intervalType: Type.Union([Type.Literal("DAY"), Type.Literal("WEEK"), Type.Literal("MONTH"), Type.Literal("YEAR")]),
  intervalValue: Type.Number({ minimum: 1 }),
});

type ProductPriceFormValues = Static<typeof productPriceFormSchema>;

interface ProductPriceFormProps {
  price?: ProductPriceFormValues
  productId: string
  onUpsertSuccess?: () => void
  onDeleteSucess?: () => void
}

const productPricesApi = getProductPrices();

export function ProductPriceForm({ price, productId, onUpsertSuccess, onDeleteSucess }: ProductPriceFormProps) {
  const { t, locale } = useTranslation();
  const { onFormSubmit, isLoading } = useCustomForm();

  const form = useForm<ProductPriceFormValues>({
    resolver: typeboxResolver(productPriceFormSchema, { locale }),
    defaultValues: {
      id: price?.id,
      amount: price?.amount || 0,
      currency: price?.currency || "USD",
      active: price?.active || true,
      intervalType: price?.intervalType || "MONTH",
      intervalValue: price?.intervalValue || 1,
    },
  });

  const onSubmit = async (data: ProductPriceFormValues) => {
    await onFormSubmit(data, async (formData) => {
      let { id, ...formDataWithoutId } = formData;
      
      id = formData.id || price?.id;

      const formToSend = {
        ...formDataWithoutId,
        productId,
        archived: false,
      }

      if (id) {
        await productPricesApi.putAdminProductPricesId(id, { ...formToSend, id });
      } else {
        await productPricesApi.postAdminProductPrices(formToSend);
      }

      if (onUpsertSuccess)
        onUpsertSuccess();
    }, form.setError);
  };

  async function onDelete() {
    if (price?.id)
      await productPricesApi.deleteAdminProductPricesId(price.id);
    if (onDeleteSucess)
      onDeleteSucess()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="intervalType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('interval type')}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select interval type')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DAY">{t('day')}</SelectItem>
                    <SelectItem value="WEEK">{t('week')}</SelectItem>
                    <SelectItem value="MONTH">{t('month')}</SelectItem>
                    <SelectItem value="YEAR">{t('year')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="intervalValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('interval value')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t('interval value placeholder')}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('amount')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t('amount placeholder')}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('currency')}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select currency')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="BRL">BRL</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3">
              <div className="space-y-0.5">
                <FormLabel>{t('active')}</FormLabel>
                <p className="text-sm text-muted-foreground">{t('price active description')}</p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? t('saving') : price?.id ? t('save changes') : t('create price')}
          </Button>
          <Button type="button" variant="destructive" onClick={onDelete} disabled={isLoading}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
