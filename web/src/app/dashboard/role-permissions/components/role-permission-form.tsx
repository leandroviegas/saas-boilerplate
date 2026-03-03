"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/hooks/useTranslation";
import { useForm } from "react-hook-form";
import { typeboxResolver } from "@/lib/typebox-resolver";
import { Type, Static } from "@sinclair/typebox";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUpdateRolePermission, useCreateRolePermission, useRolePermission } from "@/hooks/queries/useOrganizationRolePermissions";
import { useRoles } from "@/hooks/queries/useRoles";
import { useCustomForm } from "@/hooks/useCustomForm";
import PermissionManagement, { PermissionsMap } from "@/app/dashboard/components/permission-mangement";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const availableRolePermissions: PermissionsMap = {
  member: ["create", "update", "delete", "view"],
};

const rolePermissionFormSchema = Type.Object({
  roleSlug: Type.String({ minLength: 1 }),
  permissions: Type.Record(Type.String(), Type.Array(Type.String())),
});

type RolePermissionFormValues = Static<typeof rolePermissionFormSchema>;

interface RolePermissionFormProps {
  roleSlug?: string;
  onUpsertSuccess?: () => void;
}

export function RolePermissionForm({ roleSlug, onUpsertSuccess }: RolePermissionFormProps) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const { data: existingData, isLoading: isLoadingExisting } = useRolePermission(roleSlug || "");
  const { data: rolesData } = useRoles();
  const updateRolePermission = useUpdateRolePermission();
  const createRolePermission = useCreateRolePermission();
  const { onFormSubmit, isLoading } = useCustomForm();

  const form = useForm<RolePermissionFormValues>({
    resolver: typeboxResolver(rolePermissionFormSchema, { locale }),
    defaultValues: {
      roleSlug: roleSlug || "",
      permissions: (existingData?.permissions as PermissionsMap) ?? {},
    },
  });

  // Update form when existing data loads
  if (roleSlug && existingData?.permissions && form.getValues("permissions") === undefined) {
    form.reset({
      roleSlug: roleSlug,
      permissions: (existingData.permissions as PermissionsMap) ?? {},
    });
  }

  const onSubmit = async (data: RolePermissionFormValues) => {
    await onFormSubmit(data, async (formData) => {
      if (roleSlug) {
        await updateRolePermission.mutateAsync({
          roleSlug: roleSlug,
          updateData: {
            permissions: formData.permissions,
          },
        });
      } else {
        await createRolePermission.mutateAsync({
          roleSlug: formData.roleSlug,
          permissions: formData.permissions,
        });
      }

      if (onUpsertSuccess) {
        return onUpsertSuccess();
      }

      router.push("/dashboard/role-permissions");
    }, form.setError);
  };

  const isSubmitting = isLoading || createRolePermission.isPending || updateRolePermission.isPending;
  const isLoadingData = roleSlug && isLoadingExisting;

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">{t('loading')}...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="roleSlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">{t('role')}</FormLabel>
                      <FormControl>
                        {roleSlug ? (
                          <Input
                            {...field}
                            disabled
                            className="h-11 bg-muted"
                          />
                        ) : (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="h-11">
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
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <FormField
                control={form.control}
                name="permissions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">{t('permissions')}</FormLabel>
                    <FormControl>
                      <PermissionManagement
                        availablePermissions={availableRolePermissions}
                        permissions={field.value as PermissionsMap}
                        onPermissionChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <Button
                type="submit"
                disabled={isSubmitting || (!roleSlug && !form.watch().roleSlug)}
                className="w-full h-11 text-base font-semibold"
                size="lg"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting
                  ? t('saving')
                  : roleSlug
                    ? t('save changes')
                    : t('create role permission')
                }
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default RolePermissionForm;
