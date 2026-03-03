"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { PermissionsMap } from "@/app/dashboard/components/permission-mangement";

interface PermissionsPreviewProps {
  permissions: PermissionsMap;
  maxFeatures?: number;
  maxActionsPerFeature?: number;
}

export function PermissionsPreview({
  permissions,
  maxFeatures = 3,
  maxActionsPerFeature = 3,
}: PermissionsPreviewProps) {
  const { t } = useTranslation();

  const features = Object.entries(permissions);
  const hasMore = features.length > maxFeatures;
  const visibleFeatures = features.slice(0, maxFeatures);

  if (features.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {t("no permissions")}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">
        {t("permissions")}:
      </p>
      <div className="space-y-2">
        {visibleFeatures.map(([feature, actions]) => (
          <div key={feature} className="flex items-start gap-2">
            <Badge variant="secondary" className="font-mono text-xs shrink-0">
              {feature}
            </Badge>
            <div className="flex flex-wrap gap-1">
              {actions.slice(0, maxActionsPerFeature).map((action) => (
                <span
                  key={action}
                  className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                >
                  {t(action)}
                </span>
              ))}
              {actions.length > maxActionsPerFeature && (
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  +{actions.length - maxActionsPerFeature}
                </span>
              )}
            </div>
          </div>
        ))}
        {hasMore && (
          <p className="text-xs text-muted-foreground">
            +{features.length - maxFeatures} more{" "}
            {features.length - maxFeatures === 1 ? "feature" : "features"}
          </p>
        )}
      </div>
    </div>
  );
}
