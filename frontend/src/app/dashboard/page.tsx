'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();


  return (
    <div className="space-y-6">
     
    </div>
  );
}