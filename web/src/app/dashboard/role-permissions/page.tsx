"use server";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Plus, Users } from "lucide-react";
import RolePermissionList from "./components/role-permission-list";
import { getTranslation } from "@/utils/server/translation";


export default async function AdminRolePermissionsPage() {
  const { t } = await getTranslation();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('manage role permission')}</h1>
      </div>
      <RolePermissionList />
    </div>
  );
}
