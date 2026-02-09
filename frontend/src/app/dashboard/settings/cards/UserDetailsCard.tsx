"use client";

import { useForm } from "react-hook-form";
import { typeboxResolver } from "@/lib/typebox-resolver";
import { Type, Static } from "@sinclair/typebox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from '@/hooks/useAuth';
import { useCustomForm } from "@/hooks/useCustomForm";
import { authClient } from "@/lib/auth-client";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { getUsers } from "@/api/generated/users/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LuTrash2, LuUpload } from "react-icons/lu";

const userDetailsSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  username: Type.String({ minLength: 3 }),
  email: Type.String({ format: "email" }),
  image: Type.Optional(Type.String()),
});

type UserDetailsValues = Static<typeof userDetailsSchema>;

export function UserDetailsCard() {
  const { t, locale } = useTranslation();
  const { user, updateSession } = useAuth();
  const { onFormSubmit, isLoading } = useCustomForm();
  const usersApi = getUsers();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const base64 = await convertToBase64(file);
      setImagePreview(base64);
      form.setValue('image', base64);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    fileInputRef.current!.value = '';
    form.setValue('image', '');
  };

  const form = useForm<UserDetailsValues>({
    resolver: typeboxResolver(userDetailsSchema, { locale }),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      image: user?.image || "",
    },
  });

  async function updateAction(values: UserDetailsValues) {
    const { error } = await authClient.updateUser({
      name: values.name,
    });
    if (error) throw new Error(error.message);

    if (!user?.id) return;

    const { message } = await usersApi.putAdminUsersId(user.id, { name: values.name, username: values.username, email: values.email, image: values.image });

    await updateSession();
    toast.success(t(message!));
  };

  const onSubmit = async (data: UserDetailsValues) => {
    onFormSubmit(data, updateAction, form.setError);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("user details")}</CardTitle>
        <CardDescription>
          {t("update your personal information")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium mb-2 text-foreground">{t("profile picture")}</h4>
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32 border-2 border-border">
                      <AvatarImage src={imagePreview || user?.image || undefined} alt={t("profile")} />
                      <AvatarFallback className="text-2xl uppercase">
                        {user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                      <label htmlFor="picture-upload" className="cursor-pointer">
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          asChild={true}
                        >
                          <span>
                            <LuUpload className="h-4 w-4 mr-1" />
                            {t("upload")}
                          </span>
                        </Button>
                        <input
                          id="picture-upload"
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>

                      {imagePreview && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeImage}
                        >
                          <LuTrash2 className="h-4 w-4 mr-1" />
                          {t("remove")}
                        </Button>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground text-center max-w-xs">
                      {t("upload a profile picture. jpg, png or gif, maximum 2mb")}
                    </p>
                  </div>
                </div>
              </div>

              <hr className="hidden md:block h-auto w-px mx-4 bg-border border-0" />

              <div className="space-y-4 w-full md:w-2/3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("name")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("username")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("email")}</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t("saving...") : t("save changes")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
