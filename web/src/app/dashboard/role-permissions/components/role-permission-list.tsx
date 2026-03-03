"use client"

import React from 'react';
import Link from 'next/link';
import DataTable from '@/components/ui/data-table';
import { useTranslation } from '@/hooks/useTranslation';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useRolePermissions, useDeleteRolePermission } from '@/hooks/queries/useOrganizationRolePermissions';
import { GetAdminRolePermissions200AllOfTwoDataItem } from '@/api/generated/newChatbotAPI.schemas';
import { PermissionsPreview } from '@/components/ui/permissions-preview';
import { PermissionsMap } from '@/app/dashboard/components/permission-mangement';

export default function RolePermissionList() {
    const { t } = useTranslation();

    const { data, isLoading, error } = useRolePermissions();
    const deleteRolePermission = useDeleteRolePermission();

    const rolePermissions = data || [];

    const dataFormat = [
        { key: 'roleSlug', header: t('role'), type: 'string' as const },
        { key: 'permissions', header: t('permissions'), type: 'string' as const },
        { key: 'createdAt', header: t('created at'), type: 'date' as const },
    ]

    const List = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rolePermissions.map((permission) => (
                <div
                    key={permission.roleSlug}
                    className="group relative border border-border rounded-lg bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-200 hover:border-primary/50 flex flex-col"
                >
                    <div className="p-6 flex-1 flex flex-col">
                        <div className="space-y-2 flex-1">
                            <h3 className="font-semibold text-lg tracking-tight">
                                {permission.roleSlug}
                            </h3>
                            <PermissionsPreview permissions={permission.permissions as PermissionsMap} />
                        </div>
                    </div>

                    <div className="flex gap-2 p-6 border-t border-border mt-auto">
                        <Link
                            className="flex-1"
                            href={`/dashboard/role-permissions/${permission.roleSlug}`}
                        >
                            <Button variant="secondary" size="sm" className="w-full">
                                <FaPencilAlt className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button
                            onClick={() => deleteRolePermission.mutate({
                                roleSlug: permission.roleSlug
                            })}
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            disabled={deleteRolePermission.isPending}
                        >
                            <FaTrash className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )

    return (
        <DataTable
            data={rolePermissions}
            list={<List />}
            tableId='role-permission-list'
            dataFormat={dataFormat}
            status={isLoading ? 'loading' : error ? 'error' : 'success'}
            meta={{ total: rolePermissions.length, page: 1, perPage: rolePermissions.length }}
            actions={(permission: GetAdminRolePermissions200AllOfTwoDataItem) => (
                <div className="flex gap-2 mt-auto">
                    <Link
                        className="flex-1"
                        href={`/dashboard/role-permissions/${permission.roleSlug}`}
                    >
                        <Button variant="secondary" size="sm" className="w-full">
                            <FaPencilAlt className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button
                        onClick={() => deleteRolePermission.mutate({
                            roleSlug: permission.roleSlug
                        })}
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        disabled={deleteRolePermission.isPending}
                    >
                        <FaTrash className="h-4 w-4" />
                    </Button>
                </div>
            )} />
    )
}
