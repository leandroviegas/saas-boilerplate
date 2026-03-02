"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import DataTable from '@/components/ui/data-table';
import { useTranslation } from '@/hooks/useTranslation';
import { FaPencilAlt, FaTrash, FaPlus } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useRolePermissions, useDeleteRolePermission, useCreateRolePermission, useUpdateRolePermission } from '@/hooks/queries/useOrganizationRolePermissions';
import { useRoles } from '@/hooks/queries/useRoles';
import { GetAdminRolePermissions200AllOfTwoDataItem } from '@/api/generated/newChatbotAPI.schemas';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function RolePermissionList() {
    const { t } = useTranslation();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newRoleSlug, setNewRoleSlug] = useState('');
    
    const { data, isLoading, error } = useRolePermissions();
    const { data: rolesData } = useRoles();
    const deleteRolePermission = useDeleteRolePermission();
    const createRolePermission = useCreateRolePermission();
    
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
                            <p className="text-sm text-muted-foreground">
                                {t('permissions')}: {JSON.stringify(permission.permissions)}
                            </p>
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

    const handleCreate = () => {
        if (newRoleSlug) {
            createRolePermission.mutate(
                {
                    roleSlug: newRoleSlug,
                    permissions: {}
                },
                {
                    onSuccess: () => {
                        setIsCreateDialogOpen(false);
                        setNewRoleSlug('');
                    }
                }
            );
        }
    };

    return (
        <div>
            <div className="flex gap-4 mb-6">
                <div className="flex-1"></div>
                
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <FaPlus className="h-4 w-4 mr-2" />
                            {t('add role permission')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('create role permission')}</DialogTitle>
                            <DialogDescription>
                                {t('create role permission description')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">{t('role')}</Label>
                                <Select value={newRoleSlug} onValueChange={setNewRoleSlug}>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder={t('select role')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rolesData?.data?.map((role) => (
                                            <SelectItem key={role.slug} value={role.slug}>
                                                {role.slug}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                {t('cancel')}
                            </Button>
                            <Button 
                                onClick={handleCreate} 
                                disabled={!newRoleSlug || createRolePermission.isPending}
                            >
                                {t('create')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

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
        </div>
    )
}
