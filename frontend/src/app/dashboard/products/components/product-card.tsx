"use client";

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { GetAdminProducts200AllOfTwoDataItem } from '@/api/generated/newChatbotAPI.schemas'
import { useTranslation } from '@/hooks/useTranslation'
import { Edit } from 'lucide-react'
import Link from 'next/link';

interface ProductCardProps {
    product: GetAdminProducts200AllOfTwoDataItem
    children: React.ReactNode
}

function ProductCard({ product, children }: ProductCardProps) {
    const { t } = useTranslation();

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="space-y-4">
                        <CardTitle className="cursor-pointer hover:underline flex gap-2 align-middle">
                            <span>
                                {product.name}
                            </span>
                            <Badge>{product.active ? t('active') : t('inactive')}</Badge>
                        </CardTitle>
                        <CardDescription>{product.description}</CardDescription>
                    </div>
                    <Link href={`/dashboard/products/${product.id}`}>
                        <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {product.features && product.features.length > 0 && (
                        <>
                            <p className='font-'>{t('features')}:</p>
                            <div className='flex gap-2 flex-wrap'>
                                {product.features.map((feature, index) => (
                                    <Badge key={index}>{t(feature)}</Badge>
                                ))}
                            </div>
                        </>
                    )}
                    {product.prices && product.prices.length > 0 && (
                        <>
                            <p className='font-bold'>{t('prices')}:</p>
                            <div className='flex gap-2 flex-wrap'>
                                {product.prices.map((price, index) => (
                                    <span key={index} className={`${price.active ? 'bg-green-600' : 'bg-amber-600'} px-3 py-1 rounded-2xl text-xs`}>
                                        {price.amount} {price.currency} ({price.intervalValue} {price.intervalType})
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                {children}
            </CardFooter>
        </Card>
    )
}

export default ProductCard