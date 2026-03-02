"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/useTranslation";

export type PermissionsMap = { [key: string]: string[] };

interface PermissionManagementProps {
    availablePermissions: PermissionsMap;
    permissions: PermissionsMap;
    onPermissionChange: (permission: PermissionsMap) => void;
}

const Index = ({ availablePermissions, permissions, onPermissionChange }: PermissionManagementProps) => {
    const { t } = useTranslation();

    const handleToggleAction = (feature: string, action: string) => {
        const currentActions = permissions[feature] ?? [];
        const hasAction = currentActions.includes(action);
        const updatedActions = hasAction
            ? currentActions.filter((a) => a !== action)
            : [...currentActions, action];
        onPermissionChange({ ...permissions, [feature]: updatedActions });
    };

    const hasFeatures = Object.keys(availablePermissions).length > 0;

    if (!hasFeatures) return null;

    return (
        <div className="rounded-lg border border-border divide-y">
            {Object.entries(availablePermissions).map(([feature, availableActions]) => (
                <div key={feature} className="flex items-center gap-4 p-3">
                    <div className="min-w-30">
                        <Badge variant="secondary" className="font-mono text-xs">
                            {feature}
                        </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {availableActions.map((action) => {
                            const id = `${feature}-${action}`;
                            const isChecked = (permissions[feature] ?? []).includes(action);
                            return (
                                <div key={action} className="flex items-center gap-1.5">
                                    <Checkbox
                                        id={id}
                                        checked={isChecked}
                                        onCheckedChange={() => handleToggleAction(feature, action)}
                                    />
                                    <Label htmlFor={id} className="text-sm font-normal cursor-pointer">
                                        {t(action)}
                                    </Label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Index;
