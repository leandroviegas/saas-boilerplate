"use client"

import React from 'react';
import Link from 'next/link';
import { GetAdminProducts200AllOfTwoDataItem } from '@/api/generated/newChatbotAPI.schemas';
import DataTable from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import { FaPencilAlt, FaTrash, FaSearch } from 'react-icons/fa';
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { Button } from '@/components/ui/button';
import { useProducts, useDeleteProduct } from '@/hooks/queries/useProducts';
import { Edit } from 'lucide-react';

export default function ProductList() {
    const { t } = useTranslation();
    const deleteProduct = useDeleteProduct();

    const [filters, setFilters] = useQueryStates({
        page: parseAsInteger.withDefault(1),
        perPage: parseAsInteger.withDefault(20),
        search: parseAsString.withDefault(""),
    }, { shallow: true, history: "replace" });

    const { data, isLoading, error } = useProducts(filters);
    const products = data?.data || [];
    const meta = data?.meta || { total: 0, page: 1, perPage: 20 };

    const dataFormat = [
        { key: 'name', header: t('Name'), type: 'string' as const },
        { key: 'description', header: t('Description'), type: 'string' as const },
        { key: 'active', header: t('Active'), type: 'boolean' as const },
        { key: 'createdAt', header: t('Created At'), type: 'date' as const },
    ]

    const List = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="group relative border border-border rounded-lg bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-200 hover:border-primary/50 flex flex-col"
                >
                    {/* Content wrapper - takes available space */}
                    <div className="p-6 flex-1 flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-start gap-4 mb-4">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-semibold text-lg tracking-tight">
                                        {product.name}
                                    </h3>
                                    <span
                                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${product.active
                                                ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20'
                                                : 'bg-muted text-muted-foreground ring-muted-foreground/20'
                                            }`}
                                    >
                                        {product.active ? t('active') : t('inactive')}
                                    </span>
                                </div>
                                {product.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {product.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Details - flex-1 pushes actions to bottom */}
                        <div className="space-y-4 flex-1">
                            {product.features && product.features.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-foreground">
                                        {t('features')}:
                                    </p>
                                    <div className="flex gap-2 flex-wrap">
                                        {product.features.map((feature, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                                            >
                                                {t(feature)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.prices && product.prices.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-foreground">
                                        {t('prices')}:
                                    </p>
                                    <div className="flex gap-2 flex-wrap">
                                        {product.prices.map((price, index) => (
                                            <span
                                                key={index}
                                                className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${price.active
                                                        ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20'
                                                        : 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20'
                                                    }`}
                                            >
                                                {price.amount} {price.currency} ({price.intervalValue} {price.intervalType})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions - pinned to bottom */}
                    <div className="flex gap-2 p-6 border-t border-border mt-auto">
                        <Link className="flex-1" href={`/dashboard/products/${product.id}`}>
                            <Button variant="secondary" size="sm" className="w-full">
                                <FaPencilAlt className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button
                            onClick={() => deleteProduct.mutate(product.id)}
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            disabled={deleteProduct.isPending}
                        >
                            <FaTrash className="h-4 w-4" />
                        </Button>
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
                data={products}
                list={<List />}
                tableId='product-list'
                dataFormat={dataFormat}
                status={isLoading ? 'loading' : error ? 'error' : 'success'}
                meta={meta}
                onPageChange={(page, perPage) => { setFilters(prevFilters => ({ ...prevFilters, page, perPage })) }}
                actions={(product: GetAdminProducts200AllOfTwoDataItem) => (
                    <div className="flex gap-2 mt-auto">
                        <Link className="flex-1" href={`/dashboard/products/${product.id}`}>
                            <Button variant="secondary" size="sm" className="w-full">
                                <FaPencilAlt className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button
                            onClick={() => deleteProduct.mutate(product.id)}
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            disabled={deleteProduct.isPending}
                        >
                            <FaTrash className="h-4 w-4" />
                        </Button>
                    </div>
                )} />
        </div>
    )
}