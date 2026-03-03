'use client';

import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { typeboxResolver } from "@/lib/typebox-resolver";
import { Type, Static } from "@sinclair/typebox";
import { Loader2, Building2 } from "lucide-react";
import { useCustomForm } from "@/hooks/useCustomForm";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const organizationFormSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  slug: Type.String({ minLength: 1 }),
});

type OrganizationFormValues = Static<typeof organizationFormSchema>;

export default function CreateOrganizationPage() {
  const { t, locale } = useTranslation();
  const { updateSession } = useAuth();
  const router = useRouter();
  const { onFormSubmit, isLoading } = useCustomForm();

  const form = useForm<OrganizationFormValues>({
    resolver: typeboxResolver(organizationFormSchema, { locale }),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const onSubmit = async (data: OrganizationFormValues) => {
    await onFormSubmit(data, async (formData) => {
      const { data: responseData, error } = await authClient.organization.create({
        name: formData.name,
        slug: formData.slug,
      });

      if (error) {
        throw new Error(error.message);
      }

      await updateSession();
      toast.success(t("organization created successfully"));
      router.push("/dashboard");
    }, form.setError);
  };

  const isSubmitting = isLoading;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 pt-8 bg-background text-foreground">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full shadow-lg border-0 bg-card text-card-foreground">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <div className="p-3 rounded-full bg-primary/10">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-foreground">
              {t("create your organization")}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              {t("set up your organization to get started")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">{t("organization name")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("your organization name")}
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">{t("organization slug")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("your-organization")}
                            className="h-11"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
                              field.onChange(value);
                            }}
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
                  {isSubmitting ? t("creating...") : t("create organization")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
