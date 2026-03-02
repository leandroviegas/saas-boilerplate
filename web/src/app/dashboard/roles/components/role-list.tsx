"use client"

import React from 'react';
import Link from 'next/link';
import DataTable from '@/components/ui/data-table';
import { useTranslation } from '@/hooks/useTranslation';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useRoles, useDeleteRole } from '@/hooks/queries/useRoles';
import { GetAdminRoles200AllOfTwoDataItem } from '@/api/generated/newChatbotAPI.schemas';

export default function RoleList() {
    const { t } = useTranslation();
    const deleteRole = useDeleteRole();

    const { data, isLoading, error } = useRoles();
    const roles = data?.data || [];

    const dataFormat = [
        { key: 'slug', header: t('slug'), type: 'string' as const },
        { key: 'privilege', header: t('privilege'), type: 'number' as const },
        { key: 'createdAt', header: t('created at'), type: 'date' as const },
    ]

    const List = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role) => (
                <div
                    key={role.slug}
                    className="group relative border border-border rounded-lg bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-200 hover:border-primary/50 flex flex-col"
                >
                    <div className="p-6 flex-1 flex flex-col">
                        <div className="space-y-2 flex-1">
                            <h3 className="font-semibold text-lg tracking-tight">
                                {role.slug}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t('privilege')}: {role.privilege}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2 p-6 border-t border-border mt-auto">
                        <Link className="flex-1" href={`/dashboard/roles/${role.slug}`}>
                            <Button variant="secondary" size="sm" className="w-full">
                                <FaPencilAlt className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button
                            onClick={() => deleteRole.mutate(role.slug)}
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            disabled={deleteRole.isPending}
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
            <DataTable
                data={roles}
                list={<List />}
                tableId='role-list'
                dataFormat={dataFormat}
                status={isLoading ? 'loading' : error ? 'error' : 'success'}
                meta={{ total: roles.length, page: 1, perPage: roles.length }}
                actions={(role: GetAdminRoles200AllOfTwoDataItem) => (
                    <div className="flex gap-2 mt-auto">
                        <Link className="flex-1" href={`/dashboard/roles/${role.slug}`}>
                            <Button variant="secondary" size="sm" className="w-full">
                                <FaPencilAlt className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button
                            onClick={() => deleteRole.mutate(role.slug)}
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            disabled={deleteRole.isPending}
                        >
                            <FaTrash className="h-4 w-4" />
                        </Button>
                    </div>
                )} />
        </div>
    )
}
