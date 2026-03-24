"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { useUpdateSystemVariable, useDeleteSystemVariable } from '@/hooks/queries/useSystemVariables';
import { FaSave, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';

interface SystemVariable {
  id: string;
  value: string;
  updatedAt: Date | string;
  createdAt: Date | string;
}

interface SystemVariableCardProps {
  variable: SystemVariable;
}

export function SystemVariableCard({ variable }: SystemVariableCardProps) {
  const { t } = useTranslation();
  const updateSystemVariable = useUpdateSystemVariable();
  const deleteSystemVariable = useDeleteSystemVariable();
  const [value, setValue] = useState(variable.value);

  useEffect(() => {
    setValue(variable.value);
  }, [variable.value]);

  const isDirty = value !== variable.value;

  const handleSave = async () => {
    if (!value.trim()) {
      toast.error(t('value is required'));
      return;
    }

    try {
      await updateSystemVariable.mutateAsync({ id: variable.id, value });
      toast.success(t('system variable updated'));
    } catch (err) {
      toast.error(t('failed to update system variable'));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSystemVariable.mutateAsync(variable.id);
      toast.success(t('system variable deleted'));
    } catch (err) {
      toast.error(t('failed to delete system variable'));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-mono">{variable.id}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="font-mono"
          placeholder={t('enter value')}
        />
        <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              onClick={handleDelete}
              disabled={deleteSystemVariable.isPending}
              variant="destructive"
            >
              <FaTrash className="h-4 w-4 mr-2" />
              {t('delete')}
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={!isDirty || updateSystemVariable.isPending}
            >
              <FaSave className="h-4 w-4 mr-2" />
              {t('save')}
            </Button>
          </div>  
      </CardContent>
    </Card>
  );
}
