"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { GetAdminProducts200AllOfTwoDataItem, GetAdminProducts200AllOfTwoDataItemAllOfTwoPricesItem } from "@/api/generated/newChatbotAPI.schemas";
import { useCustomForm } from "@/hooks/useCustomForm";
import { ProductPriceForm } from "./product-price-form";
import { useRouter } from "next/navigation";
import { useCreateProduct, useUpdateProduct } from "@/hooks/queries/useProducts";

const productFormSchema = z.object({
  name: z.string(),
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

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('product_name_placeholder')} {...field} />
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
                  <FormLabel>{t('description')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('product_description_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('features')}</FormLabel>
                  <FormControl>
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {field.value?.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {feature}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const currentFeatures = field.value || [];
                                field.onChange(currentFeatures.filter((_, i) => i !== index));
                              }}
                              className="h-4 w-4 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder={t('feature_placeholder')}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
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
          </div>

          <Button type="submit" disabled={isLoading || createProduct.isPending || updateProduct.isPending} className="w-full">
            {isLoading || createProduct.isPending || updateProduct.isPending ? t('saving') : product ? t('save_changes') : t('create_product')}
          </Button>
        </form>
      </Form>


      {product?.id &&
        <>
          <hr className="my-4 border-border" />
          <div className="flex gap-4">
            <span className="h2 text-xl font-semibold mb-4">{t('prices')}</span>
            <Button onClick={() => {
              const newPrice = {} as GetAdminProducts200AllOfTwoDataItemAllOfTwoPricesItem;
              setPrices(prevPrices => ([...(prevPrices || []), newPrice]))
            }}>{t("add price")}</Button>
          </div>
          <div className="space-y-4 flex flex-wrap gap-4 mb-4">
            {prices?.map((price, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <ProductPriceForm
                  price={price}
                  productId={product.id}
                  onDeleteSucess={() => setPrices(prevPrices => prevPrices?.filter((_, i) => i != index))}
                />
              </div>
            ))}
          </div>
        </>}
    </div>
  );
}