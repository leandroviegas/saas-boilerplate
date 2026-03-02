"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRolePermission, useUpdateRolePermission } from '@/hooks/queries/useOrganizationRolePermissions';

interface RolePermissionFormProps {
  roleSlug: string;
}

export default function RolePermissionForm({ roleSlug }: RolePermissionFormProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const [permissionsJson, setPermissionsJson] = useState<string>('');
    const [jsonError, setJsonError] = useState<string>('');
    
    const { data, isLoading, error } = useRolePermission(roleSlug);
    const updateRolePermission = useUpdateRolePermission();

    useEffect(() => {
        if (data?.permissions) {
            try {
                setPermissionsJson(JSON.stringify(data.permissions, null, 2));
            } catch {
                setPermissionsJson(String(data.permissions));
            }
        }
    }, [data]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setJsonError('');

        let parsedPermissions;
        try {
            parsedPermissions = permissionsJson ? JSON.parse(permissionsJson) : {};
        } catch (err) {
            setJsonError(t('invalid json format'));
            return;
        }

        try {
            await updateRolePermission.mutateAsync({
                roleSlug,
                updateData: {
                    permissions: parsedPermissions,
                },
            });
            router.push('/dashboard/role-permissions');
        } catch (err) {
            console.error('Failed to update role permission:', err);
        }
    };

    const handleJsonChange = (value: string) => {
        setPermissionsJson(value);
        setJsonError('');
        
        // Validate JSON as user types
        if (value.trim()) {
            try {
                JSON.parse(value);
            } catch {
                // Ignore validation errors while typing
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">{t('loading')}...</div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-destructive">{t('error loading role permission')}</div>
            </div>
        );
    }

    const rolePermission = data;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="space-y-2">
                <Label htmlFor="roleSlug">{t('role')}</Label>
                <Input
                    id="roleSlug"
                    value={rolePermission.roleSlug}
                    disabled
                    className="bg-muted"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="permissions">{t('permissions')}</Label>
                <Textarea
                    id="permissions"
                    value={permissionsJson}
                    onChange={(e) => handleJsonChange(e.target.value)}
                    placeholder='{"read": true, "write": false}'
                    className={`min-h-[300px] font-mono ${jsonError ? 'border-destructive' : ''}`}
                    rows={15}
                />
                {jsonError && (
                    <p className="text-sm text-destructive">{jsonError}</p>
                )}
                <p className="text-sm text-muted-foreground">
                    {t('permissions json description')}
                </p>
            </div>

            <div className="flex gap-4">
                <Button
                    type="submit"
                    disabled={updateRolePermission.isPending || !!jsonError}
                >
                    {updateRolePermission.isPending ? t('saving') : t('save changes')}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard/role-permissions')}
                >
                    {t('cancel')}
                </Button>
            </div>

            {updateRolePermission.isError && (
                <p className="text-sm text-destructive">
                    {t('failed to update role permission')}
                </p>
            )}
        </form>
    );
}
