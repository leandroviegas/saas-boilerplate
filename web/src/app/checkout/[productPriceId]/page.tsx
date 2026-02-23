'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPayment } from '@/api/generated/payment/payment';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { GetMemberPaymentsProducts200AllOfTwoDataItem, GetMemberPaymentsProducts200AllOfTwoDataItemAllOfTwoPricesItem } from '@/api/generated/newChatbotAPI.schemas';

const paymentApi = getPayment();

export default function CheckoutPage() {
  const { productPriceId } = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [product, setProduct] = useState<GetMemberPaymentsProducts200AllOfTwoDataItem | null>(null);
  const [price, setPrice] = useState<GetMemberPaymentsProducts200AllOfTwoDataItemAllOfTwoPricesItem | null>(null);
  const [promotionCode, setPromotionCode] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await paymentApi.getMemberPaymentsProducts();
        const allProducts = response.data;
        
        let foundProduct = null;
        let foundPrice = null;

        for (const p of allProducts) {
          const prices = p.prices || [];
          const pr = prices.find(price => price.id === productPriceId);
          if (pr) {
            foundProduct = p;
            foundPrice = pr;
            break;
          }
        }

        if (foundProduct && foundPrice) {
          setProduct(foundProduct);
          setPrice(foundPrice);
        } else {
          toast.error(t('product not found'));
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        toast.error(t('error fetching product'));
      } finally {
        setLoading(false);
      }
    };

    if (productPriceId) {
      fetchProductDetails();
    }
  }, [productPriceId, router, t]);

  const handleCheckout = async () => {
    try {
      setProcessing(true);
      const response = await paymentApi.postMemberPaymentsCheckout({
        productPriceId: productPriceId as string,
        promotionCode: promotionCode || undefined,
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('no checkout url returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(t('checkout error'));
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product || !price) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">{t('checkout summary')}</CardTitle>
          <CardDescription>{t('review your product details')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted p-4 mt-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold">
                  {price.amount} {price.currency}
                </span>
                <p className="text-xs text-muted-foreground uppercase"> {price.intervalValue} {t(price.intervalType.toLowerCase())}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('included features')}:</p>
              <ul className="grid grid-cols-1 gap-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="promo">{t('promotion code')}</Label>
            <div className="flex gap-2">
              <Input
                id="promo"
                placeholder={t('enter promo code')}
                value={promotionCode}
                onChange={(e) => setPromotionCode(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 mt-6">
          <Button 
            className="w-full py-6 text-lg" 
            onClick={handleCheckout} 
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t('processing')}
              </>
            ) : (
              t('confirm and pay')
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            {t('checkout disclaimer')}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
