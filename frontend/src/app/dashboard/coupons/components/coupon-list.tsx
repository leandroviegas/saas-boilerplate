"use client"

import React from 'react';
import Link from 'next/link';
import { GetAdminCoupons200AllOfTwoDataItem } from '@/api/generated/newChatbotAPI.schemas';
import DataTable from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { FaPencilAlt, FaSearch } from 'react-icons/fa';
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { useCoupons, useIncrementCouponUsage } from '@/hooks/queries/useCoupons';

export default function CouponList() {
    const { t } = useTranslation();
    const incrementUsage = useIncrementCouponUsage();

    const [filters, setFilters] = useQueryStates({
        page: parseAsInteger.withDefault(1),
        perPage: parseAsInteger.withDefault(20),
        search: parseAsString.withDefault(""),
    }, { shallow: true, history: "replace" });

    const { data, isLoading, error } = useCoupons(filters);
    const coupons = data?.data || [];
    const meta = data?.meta || { total: 0, page: 1, perPage: 20 };

    const dataFormat = [
        { key: 'code', header: t('code'), type: 'string' as const },
        { key: 'discountType', header: t('discount_type'), type: 'string' as const },
        { key: 'value', header: t('value'), type: 'number' as const },
        { key: 'active', header: t('active'), type: 'boolean' as const },
        { key: 'usageCount', header: t('usage_count'), type: 'number' as const },
        { key: 'usageLimit', header: t('usage_limit'), type: 'number' as const },
        { key: 'expiresAt', header: t('expires_at'), type: 'date' as const },
        { key: 'createdAt', header: t('created_at'), type: 'date' as const },
    ]

    const List = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coupons.map((coupon) => (
                <div key={coupon.id} className="border border-border rounded-xl p-4">
                    <h3 className="font-bold">{coupon.code}</h3>
                    <p>{coupon.discountType} - {coupon.value}{coupon.discountType === 'PERCENTAGE' ? '%' : ' ' + t('currency')}</p>
                    <p>{t('active')}: {coupon.active ? t('yes') : t('no')}</p>
                    <p>{t('usage')}: {coupon.usageCount}/{coupon.usageLimit || t('unlimited')}</p>
                    {coupon.expiresAt && <p>{t('expires')}: {new Date(coupon.expiresAt).toLocaleDateString()}</p>}
                    <Button onClick={() => incrementUsage.mutate(coupon.id)} className='mt-2' disabled={incrementUsage.isPending}>
                        {t('increment_usage')}
                    </Button>
                </div>
            ))}
        </div>
    )

    return (
        <div>
            <div className="mb-4">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        placeholder={t('search')}
                        value={filters.search}
                        onChange={(e) => setFilters(prevFilters => ({ ...prevFilters, search: e.target.value }))}
                        className="pl-10"
                    />
                </div>
            </div>
            <DataTable
                data={coupons}
                list={<List />}
                tableId='coupon-list'
                dataFormat={dataFormat}
                status={isLoading ? 'loading' : error ? 'error' : 'success'}
                meta={meta}
                onPageChange={(page, perPage) => { setFilters(prevFilters => ({ ...prevFilters, page, perPage })) }}
                actions={(coupon: GetAdminCoupons200AllOfTwoDataItem) => (
                    <div className='flex gap-2'>
                        <Button onClick={() => incrementUsage.mutate(coupon.id)} className='bg-blue-500 px-3 py-2 rounded' disabled={incrementUsage.isPending}>
                            {t('increment_usage')}
                        </Button>
                        <Link href={`/dashboard/coupons/${coupon.id}`} className='bg-amber-500 px-3 py-2 rounded'>
                            <FaPencilAlt />
                        </Link>
                    </div>
                )} />
        </div>
    )
}