"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { useForm } from "react-hook-form";
import { typeboxResolver } from "@/lib/typebox-resolver";
import { Type, Static } from "@sinclair/typebox";
import { Loader2 } from "lucide-react";
import { GetAdminRoles200AllOfTwoDataItem } from "@/api/generated/newChatbotAPI.schemas";
import { useCustomForm } from "@/hooks/useCustomForm";
import { useRouter } from "next/navigation";
import { useCreateRole, useUpdateRole } from "@/hooks/queries/useRoles";

const roleFormSchema = Type.Object({
  slug: Type.String({ minLength: 2, maxLength: 50 }),
  privilege: Type.Integer({ minimum: 0, maximum: 100 }),
});

type RoleFormValues = Static<typeof roleFormSchema>;

interface RoleFormProps {
  role?: GetAdminRoles200AllOfTwoDataItem;
  onUpsertSuccess?: () => void;
}

export function RoleForm({ role, onUpsertSuccess }: RoleFormProps) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();

  const { onFormSubmit, isLoading } = useCustomForm();

  const form = useForm<RoleFormValues>({
    resolver: typeboxResolver(roleFormSchema, { locale }),
    defaultValues: {
      slug: role?.slug || "",
      privilege: role?.privilege || 20,
    },
  });

  const onSubmit = async (data: RoleFormValues) => {
    await onFormSubmit(data, async (formData) => {
      if (role?.slug) {
        await updateRole.mutateAsync({
          slug: role.slug,
          updateData: formData,
        });
      } else {
        await createRole.mutateAsync(formData);
      }

      if (onUpsertSuccess) {
        return onUpsertSuccess();
      }

      router.push("/dashboard/roles");
    }, form.setError);
  };

  const isSubmitting = isLoading || createRole.isPending || updateRole.isPending;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">{t('slug')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('role slug placeholder')}
                          className="h-11"
                          disabled={!!role}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="privilege"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">{t('privilege')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t('privilege placeholder')}
                          className="h-11"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 text-base font-semibold"
                size="lg"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting
                  ? t('saving')
                  : role
                    ? t('save changes')
                    : t('create role')
                }
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
