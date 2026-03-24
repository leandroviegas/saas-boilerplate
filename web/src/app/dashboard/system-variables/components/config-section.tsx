"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import { useSetSystemVariable, useUpdateSystemVariable } from '@/hooks/queries/useSystemVariables';
import { SystemVariableDTO } from '@/models/system-variable.model';
import { FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'sonner';

export interface ConfigField {
  key: string;
  label: string;
  description?: string;
  sensitive?: boolean;
  placeholder?: string;
}

interface ConfigSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  fields: ConfigField[];
  existingVariables: SystemVariableDTO[];
}

function ConfigFieldRow({
  field,
  existingVariable,
}: {
  field: ConfigField;
  existingVariable: SystemVariableDTO | undefined;
}) {
  const { t } = useTranslation();
  const setSystemVariable = useSetSystemVariable();
  const updateSystemVariable = useUpdateSystemVariable();

  const [value, setValue] = useState(existingVariable?.value ?? '');
  const [showValue, setShowValue] = useState(false);

  useEffect(() => {
    setValue(existingVariable?.value ?? '');
  }, [existingVariable?.value]);

  const isExisting = !!existingVariable;
  const isDirty = value !== (existingVariable?.value ?? '');

  const handleSave = async () => {
    if (!value.trim()) {
      toast.error(t('value is required'));
      return;
    }

    try {
      if (isExisting) {
        await updateSystemVariable.mutateAsync({ id: field.key, value });
      } else {
        await setSystemVariable.mutateAsync({ id: field.key, value });
      }
      toast.success(t('system variable saved'));
    } catch {
      toast.error(t('failed to save system variable'));
    }
  };

  const isPending = setSystemVariable.isPending || updateSystemVariable.isPending;
  const inputType = field.sensitive && !showValue ? 'password' : 'text';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label htmlFor={`field-${field.key}`} className="font-mono text-sm font-semibold">
          {field.label}
        </Label>
        {!isExisting && (
          <Badge variant="outline" className="text-xs text-muted-foreground">
            {t('not set')}
          </Badge>
        )}
      </div>
      {field.description && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id={`field-${field.key}`}
            type={inputType}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={field.placeholder ?? field.key}
            className="font-mono pr-10"
          />
          {field.sensitive && (
            <button
              type="button"
              onClick={() => setShowValue((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showValue ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
            </button>
          )}
        </div>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!isDirty || isPending || !value.trim()}
        >
          <FaSave className="h-3.5 w-3.5 mr-1.5" />
          {t('save')}
        </Button>
      </div>
    </div>
  );
}

export function ConfigSection({
  title,
  description,
  icon,
  fields,
  existingVariables,
}: ConfigSectionProps) {
  const variableMap = new Map(existingVariables.map((v) => [v.id, v]));

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {fields.map((field) => (
          <ConfigFieldRow
            key={field.key}
            field={field}
            existingVariable={variableMap.get(field.key)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
