"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import RolePermissionForm from "../components/role-permission-form";
import { useTranslation } from "@/hooks/useTranslation";
import { useRolePermission } from "@/hooks/queries/useOrganizationRolePermissions";
import { use } from "react";
import { Shield } from "lucide-react";

interface PageProps {
  params: Promise<{
    roleSlug: string;
  }>;
}

export default function RolePermissionDetailPage({ params }: PageProps) {
  const { t } = useTranslation();
  const { roleSlug } = use(params);
  const { data: rolePermission, isLoading, error } = useRolePermission(roleSlug);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (!rolePermission || error) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 items-center">
          <Shield />
          <h1 className="text-2xl font-bold">{t('edit role permission')}</h1>
        </div>
        <Link href="/dashboard/role-permissions">
          <Button variant="outline" size="sm">
            <FaArrowLeft className="h-4 w-4 mr-2" />
            {t('back to role permissions')}
          </Button>
        </Link>
      </div>
      <RolePermissionForm 
        roleSlug={roleSlug}
      />
    </div>
  );
}
