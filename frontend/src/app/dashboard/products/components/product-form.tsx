"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/hooks/useTranslation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X, DollarSign, Loader2 } from "lucide-react";
import { useState } from "react";
import { GetAdminProducts200AllOfTwoDataItem, GetAdminProducts200AllOfTwoDataItemAllOfTwoPricesItem } from "@/api/generated/newChatbotAPI.schemas";
import { useCustomForm } from "@/hooks/useCustomForm";
import { ProductPriceForm } from "./product-price-form";
import { useRouter } from "next/navigation";
import { useCreateProduct, useUpdateProduct } from "@/hooks/queries/useProducts";

const productFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  features: z.array(z.string()),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: GetAdminProducts200AllOfTwoDataItem;
  onUpsertSuccess?: () => void;
}

export function ProductForm({ product, onUpsertSuccess }: ProductFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [prices, setPrices] = useState<GetAdminProducts200AllOfTwoDataItemAllOfTwoPricesItem[] | undefined>(product?.prices);
  const { onFormSubmit, isLoading } = useCustomForm();
  const [newFeature, setNewFeature] = useState("");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      features: product?.features || [],
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    await onFormSubmit(data, async (formData) => {
      if (product?.id) {
        await updateProduct.mutateAsync({
          id: product.id,
          updateData: {
            id: product.id,
            ...formData,
            active: product.active,
            archived: product.archived,
          },
        });
      } else {
        await createProduct.mutateAsync({
          ...formData,
          active: true,
          archived: false,
        });
      }

      if (onUpsertSuccess) {
        return onUpsertSuccess();
      }

      router.push("/dashboard/products");
    }, form.setError);
  };

  const isSubmitting = isLoading || createProduct.isPending || updateProduct.isPending;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">{t('name')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('product_name_placeholder')}
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">{t('description')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('product_description_placeholder')}
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">{t('features')}</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {field.value && field.value.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-4 rounded-lg border bg-muted/50">
                            {field.value.map((feature, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="h-8 px-3 text-sm font-normal hover:bg-secondary/80 transition-colors"
                              >
                                <span className="mr-1">{feature}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const currentFeatures = field.value || [];
                                    field.onChange(currentFeatures.filter((_, i) => i !== index));
                                  }}
                                  className="h-5 w-5 p-0 ml-1 hover:bg-destructive/20 rounded-full"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Input
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            placeholder={t('feature_placeholder')}
                            className="h-11"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (newFeature.trim()) {
                                  const currentFeatures = field.value || [];
                                  field.onChange([...currentFeatures, newFeature.trim()]);
                                  setNewFeature("");
                                }
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              if (newFeature.trim()) {
                                const currentFeatures = field.value || [];
                                field.onChange([...currentFeatures, newFeature.trim()]);
                                setNewFeature("");
                              }
                            }}
                            variant="outline"
                            size="icon"
                            className="h-11 w-11 shrink-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 text-base font-semibold"
                size="lg"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting
                  ? t('saving')
                  : product
                    ? t('save_changes')
                    : t('create_product')
                }
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {product?.id && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle>{t('prices')}</CardTitle>
                </div>
              </div>
              <Button
                onClick={() => {
                  const newPrice = {} as GetAdminProducts200AllOfTwoDataItemAllOfTwoPricesItem;
                  setPrices(prevPrices => ([...(prevPrices || []), newPrice]));
                }}
                size="sm"
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("add_price")}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {prices && prices.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {prices.map((price, index) => (
                  <Card key={index} className="shadow-sm">
                    <CardContent className="p-4">
                      <ProductPriceForm
                        price={price}
                        productId={product.id}
                        onUpsertSuccess={() => { if (onUpsertSuccess) onUpsertSuccess() }}
                        onDeleteSucess={() => setPrices(prevPrices => prevPrices?.filter((_, i) => i !== index))}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <DollarSign className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('no_prices')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('no_prices_description')}
                </p>
                <Button
                  onClick={() => {
                    const newPrice = {} as GetAdminProducts200AllOfTwoDataItemAllOfTwoPricesItem;
                    setPrices(prevPrices => ([...(prevPrices || []), newPrice]));
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("add_first_price")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}