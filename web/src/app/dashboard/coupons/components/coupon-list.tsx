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
        { key: 'discountType', header: t('discount type'), type: 'string' as const },
        { key: 'value', header: t('value'), type: 'number' as const },
        { key: 'active', header: t('active'), type: 'boolean' as const },
        { key: 'usageCount', header: t('usage count'), type: 'number' as const },
        { key: 'usageLimit', header: t('usage limit'), type: 'number' as const },
        { key: 'expiresAt', header: t('expires at'), type: 'date' as const },
        { key: 'createdAt', header: t('created at'), type: 'date' as const },
    ]

    const List = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coupons.map((coupon) => (
                <div
                    key={coupon.id}
                    className="group relative border border-border rounded-lg bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/50 flex flex-col"
                >
                    {/* Content wrapper - takes available space */}
                    <div className="p-6 flex-1 flex flex-col">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-semibold text-lg tracking-tight mb-1">
                                        {coupon.code}
                                    </h3>
                                    <span
                                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${coupon.active
                                            ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20'
                                            : 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20'
                                            }`}
                                    >
                                        {coupon.active ? t('active') : t('inactive')}
                                    </span>
                                </div>
                                <div className="pt-2">
                                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                                        {coupon.discountType === 'PERCENTAGE'
                                            ? `${coupon.value}%`
                                            : `${coupon.value} ${t('currency')}`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Details - flex-1 pushes actions to bottom */}
                        <div className="space-y-2 flex-1">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{t('usage')}:</span>
                                <span className="font-medium">
                                    {coupon.usageCount}/{coupon.usageLimit || t('unlimited')}
                                </span>
                            </div>

                            {coupon.expiresAt && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{t('expires')}:</span>
                                    <span className="font-medium">
                                        {new Date(coupon.expiresAt).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions - pinned to bottom */}
                    <div className="flex gap-2 p-6 pt-0">
                        <Button
                            onClick={() => incrementUsage.mutate(coupon.id)}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            disabled={incrementUsage.isPending}
                        >
                            {t('increment usage')}
                        </Button>
                        <Link href={`/dashboard/coupons/${coupon.id}`}>
                            <Button size="sm" variant="secondary">
                                <FaPencilAlt className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
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
                    <div className='flex gap-2 mt-auto'>
                        <Button variant="outline" className='flex-1' onClick={() => incrementUsage.mutate(coupon.id)} disabled={incrementUsage.isPending}>
                            {t('increment usage')}
                        </Button>
                        <Link className='flex-1' href={`/dashboard/coupons/${coupon.id}`}>
                            <Button variant="secondary" size="sm" className="w-full">
                                <FaPencilAlt className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                )} />
        </div>
    )
}