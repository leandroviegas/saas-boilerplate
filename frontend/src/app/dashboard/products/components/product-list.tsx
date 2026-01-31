"use client"

import React from 'react';
import Link from 'next/link';
import { GetAdminProducts200AllOfTwoDataItem } from '@/api/generated/newChatbotAPI.schemas';
import DataTable from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import ProductCard from './product-card';
import { useTranslation } from '@/hooks/useTranslation';
import { FaPencilAlt, FaTrash, FaSearch } from 'react-icons/fa';
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { Button } from '@/components/ui/button';
import { useProducts, useDeleteProduct } from '@/hooks/queries/useProducts';

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
                <ProductCard key={product.id} product={product}>
                    <div className='flex w-full text-center gap-2 pt-4'>
                        <Link  className='flex-1' href={`/dashboard/products/${product.id}`}>
                            <Button className='w-full bg-amber-500 px-3 py-2 rounded'>
                                <FaPencilAlt />
                            </Button>
                        </Link>
                        
                        <Button onClick={() => deleteProduct.mutate(product.id)} className='flex-1 bg-red-700 px-3 py-2 rounded' disabled={deleteProduct.isPending}>
                            <FaTrash />
                        </Button>
                    </div>
                </ProductCard>
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
                    <div className='flex gap-2'>
                        <Button onClick={() => deleteProduct.mutate(product.id)} className='bg-red-700 px-3 py-2 rounded' disabled={deleteProduct.isPending}>
                            <FaTrash />
                        </Button>
                        <Link href={`/dashboard/products/${product.id}`} className='bg-amber-500 px-3 py-2 rounded'>
                            <FaPencilAlt />
                        </Link>
                    </div>
                )} />
        </div>
    )
}