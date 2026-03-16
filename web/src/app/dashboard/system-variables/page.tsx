"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { useSystemVariables, useSetSystemVariable } from '@/hooks/queries/useSystemVariables';
import { useQueryStates, parseAsInteger } from "nuqs";
import { FaPlus, FaSave } from 'react-icons/fa';
import { toast } from 'sonner';
import { SystemVariableCard } from './components/system-variable-card';
import Pagination from '@/components/ui/pagination';

export default function SystemVariablesPage() {
  const { t } = useTranslation();
  const setSystemVariable = useSetSystemVariable();

  const [filters, setFilters] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
  }, { shallow: true, history: "replace" });

  const [isCreating, setIsCreating] = useState(false);
  const [newVariable, setNewVariable] = useState({ id: '', value: '' });

  const { data, isLoading, error, refetch } = useSystemVariables({ 
    page: filters.page, 
    limit: filters.perPage 
  });
  
  const variables = data?.items || [];
  const meta = { total: data?.total || 0, page: filters.page, perPage: filters.perPage };

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
    } catch (err) {
      toast.error(t('failed to create system variable'));
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('manage system variables')}</h1>
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
              <Button 
                onClick={handleCreate}
                disabled={setSystemVariable.isPending}
              >
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
                setFilters(prevFilters => ({ ...prevFilters, page, perPage })) 
            }} 
        />
      </div>
    </div>
  );
}
