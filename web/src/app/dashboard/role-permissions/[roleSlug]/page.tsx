"use server";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import RolePermissionForm from "./components/role-permission-form";
import { getTranslation } from "@/utils/server/translation";

interface PageProps {
  params: Promise<{
    roleSlug: string;
  }>;
}

export default async function RolePermissionDetailPage({ params }: PageProps) {
  const { t } = await getTranslation();
  const resolvedParams = await params;
  const { roleSlug } = resolvedParams;

  if (!roleSlug) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/role-permissions">
          <Button variant="outline" size="sm">
            <FaArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          {t('edit role permission')} - {roleSlug}
        </h1>
      </div>
      <RolePermissionForm roleSlug={roleSlug} />
    </div>
  );
}
