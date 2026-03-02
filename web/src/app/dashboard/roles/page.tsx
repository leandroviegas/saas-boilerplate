"use server";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Plus } from "lucide-react";
import RoleList from "./components/role-list";
import { getTranslation } from "@/utils/server/translation";


export default async function AdminRolesPage() {
  const { t } = await getTranslation();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('manage role')}</h1>
        <Link href={`/dashboard/roles/create`}>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <RoleList />
    </div>
  );
}
