"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/useTranslation';
import { useSystemVariables, useSetSystemVariable } from '@/hooks/queries/useSystemVariables';
import { FaPlus, FaSave, FaAws, FaCreditCard } from 'react-icons/fa';
import { toast } from 'sonner';
import { SystemVariableCard } from './components/system-variable-card';
import { ConfigSection, ConfigField } from './components/config-section';
import Pagination from '@/components/ui/pagination';
import { useQueryStates, parseAsInteger } from 'nuqs';

const S3_FIELDS: ConfigField[] = [
  {
    key: 'S3_ACCESS_KEY_ID',
    label: 'S3_ACCESS_KEY_ID',
    description: 'AWS / S3-compatible access key ID used for authentication.',
    sensitive: true,
    placeholder: 'AKIAIOSFODNN7EXAMPLE',
  },
  {
    key: 'S3_SECRET_ACCESS_KEY',
    label: 'S3_SECRET_ACCESS_KEY',
    description: 'Secret access key paired with the access key ID.',
    sensitive: true,
    placeholder: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  },
  {
    key: 'S3_REGION',
    label: 'S3_REGION',
    description: 'AWS region where the bucket is hosted (e.g. us-east-1).',
    placeholder: 'us-east-1',
  },
  {
    key: 'S3_BUCKET_NAME',
    label: 'S3_BUCKET_NAME',
    description: 'Name of the S3 bucket used for file storage.',
    placeholder: 'my-app-bucket',
  },
  {
    key: 'S3_FORCE_PATH_STYLE',
    label: 'S3_FORCE_PATH_STYLE',
    description: 'Set to "true" when using S3-compatible providers like MinIO that require path-style URLs.',
    placeholder: 'false',
  },
  {
    key: 'S3_ENDPOINT',
    label: 'S3_ENDPOINT',
    description: 'Custom endpoint URL for S3-compatible storage providers. Leave blank for AWS S3.',
    placeholder: 'https://s3.example.com',
  },
];

const STRIPE_FIELDS: ConfigField[] = [
  {
    key: 'STRIPE_SECRET_KEY',
    label: 'STRIPE_SECRET_KEY',
    description: 'Stripe secret API key used for server-side requests.',
    sensitive: true,
    placeholder: 'sk_live_...',
  },
  {
    key: 'STRIPE_WEBHOOK_SECRET',
    label: 'STRIPE_WEBHOOK_SECRET',
    description: 'Webhook signing secret for verifying Stripe event payloads.',
    sensitive: true,
    placeholder: 'whsec_...',
  },
  {
    key: 'STRIPE_SUCCESS_URL',
    label: 'STRIPE_SUCCESS_URL',
    description: 'URL to redirect customers after a successful Stripe Checkout session.',
    placeholder: 'https://example.com/success',
  },
  {
    key: 'STRIPE_CANCEL_URL',
    label: 'STRIPE_CANCEL_URL',
    description: 'URL to redirect customers when they cancel a Stripe Checkout session.',
    placeholder: 'https://example.com/cancel',
  },
];

export default function SystemVariablesPage() {
  const { t } = useTranslation();
  const setSystemVariable = useSetSystemVariable();

  const [filters, setFilters] = useQueryStates(
    { page: parseAsInteger.withDefault(1), perPage: parseAsInteger.withDefault(10) },
    { shallow: true, history: 'replace' },
  );

  const [isCreating, setIsCreating] = useState(false);
  const [newVariable, setNewVariable] = useState({ id: '', value: '' });

  // Fetch enough items to cover all managed keys on the config tab
  const configQuery = useSystemVariables({ page: 1, limit: 100 });

  const { data, isLoading, error, refetch } = useSystemVariables({
    page: filters.page,
    limit: filters.perPage,
  });

  const variables = data?.items ?? [];
  const meta = { total: data?.total ?? 0, page: filters.page, perPage: filters.perPage };

  const managedVariables = configQuery.data?.items ?? [];

  const handleCreate = async () => {
    if (!newVariable.id.trim() || !newVariable.value.trim()) {
      toast.error(t('id and value are required'));
      return;
    }

    try {
      await setSystemVariable.mutateAsync({ id: newVariable.id, value: newVariable.value });
      toast.success(t('system variable created'));
      setNewVariable({ id: '', value: '' });
      setIsCreating(false);
      refetch();
    } catch {
      toast.error(t('failed to create system variable'));
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('manage system variables')}</h1>
      </div>

      <Tabs defaultValue="config">
        <TabsList>
          <TabsTrigger value="config">
            {t('configuration')}
          </TabsTrigger>
          <TabsTrigger value="all">
            {t('all variables')}
          </TabsTrigger>
        </TabsList>

        {/* ── Configuration tab ────────────────────────────────── */}
        <TabsContent value="config" className="space-y-6 mt-4">
          <ConfigSection
            title="Amazon S3 / Object Storage"
            description={t('credentials and settings for S3-compatible file storage')}
            icon={<FaAws className="h-5 w-5" />}
            fields={S3_FIELDS}
            existingVariables={managedVariables}
          />

          <ConfigSection
            title="Stripe"
            description={t('API keys and redirect URLs for Stripe payment processing')}
            icon={<FaCreditCard className="h-5 w-5" />}
            fields={STRIPE_FIELDS}
            existingVariables={managedVariables}
          />
        </TabsContent>

        {/* ── All variables tab ─────────────────────────────────── */}
        <TabsContent value="all" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreating(!isCreating)}
            >
              <FaPlus className="h-4 w-4 mr-2" />
              {t('add variable')}
            </Button>
          </div>

          {isCreating && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>{t('create new system variable')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-id">{t('id')}</Label>
                  <Input
                    id="new-id"
                    value={newVariable.id}
                    onChange={(e) => setNewVariable({ ...newVariable, id: e.target.value })}
                    placeholder={t('enter variable id')}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-value">{t('value')}</Label>
                  <Input
                    id="new-value"
                    value={newVariable.value}
                    onChange={(e) => setNewVariable({ ...newVariable, value: e.target.value })}
                    placeholder={t('enter variable value')}
                    className="font-mono"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreate} disabled={setSystemVariable.isPending}>
                    <FaSave className="h-4 w-4 mr-2" />
                    {t('save')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setNewVariable({ id: '', value: '' });
                    }}
                  >
                    {t('cancel')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-4 gap-2">
            {isLoading ? (
              <div className="text-center py-4">{t('loading...')}</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{t('error loading data')}</div>
            ) : (
              variables.map((variable) => (
                <SystemVariableCard key={variable.id} variable={variable} />
              ))
            )}
          </div>

          <div className="flex justify-center items-center gap-2 mt-8">
            <Pagination
              meta={meta}
              onPageChange={(page, perPage) => {
                setFilters((prev) => ({ ...prev, page, perPage }));
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
