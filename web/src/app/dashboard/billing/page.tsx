'use client';

import React, { useEffect, useState } from 'react';
import { getPayment } from '@/api/generated/payment/payment';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { GetMemberPaymentsProducts200AllOfTwoDataItem } from '@/api/generated/newChatbotAPI.schemas';

const paymentApi = getPayment();

export default function MemberProductsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<GetMemberPaymentsProducts200AllOfTwoDataItem[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await paymentApi.getMemberPaymentsProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('choose your product')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">{t('available prices')}:</p>
                  <div className="space-y-2">
                    {product.prices?.map(price => (
                      <div key={price.id} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                        <div className="text-sm">
                          <span className="font-bold">{price.amount} {price.currencyCode}</span>
                          <span className="text-muted-foreground ml-1">/ {price.intervalValue} {t(price.intervalType.toLowerCase())}</span>
                        </div>
                        <Button asChild size="sm">
                          <Link href={`/checkout/${price.id}`}>
                            {t('select')}
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
