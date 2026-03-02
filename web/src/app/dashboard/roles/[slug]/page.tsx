"use client";

import { RoleForm } from "../components/role-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { notFound } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { useRole } from "@/hooks/queries/useRoles";
import { use } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function RoleDetailPage({ params }: PageProps) {
  const { t } = useTranslation();
  const { slug } = use(params);
  const { data: role, isLoading, error, refetch } = useRole(slug);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (!role || error) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 items-center">
          <Shield />
          <h1 className="text-2xl font-bold">{t('edit role')}</h1>
        </div>
        <Link href="/dashboard/roles">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('back to roles')}
          </Button>
        </Link>
      </div>

      <RoleForm role={role} onUpsertSuccess={() => refetch()} />
    </div>
  );
}
