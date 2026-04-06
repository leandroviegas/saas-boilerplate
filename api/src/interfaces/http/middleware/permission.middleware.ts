import { AuthUser } from "@/infrastructure/auth/better-auth";
import { organizationRolePermissionService, productService } from "@/application";
import lodash from "lodash";
import { AppError } from "@/core/errors/error.handler";
import { Prisma } from "@prisma/client";

export type PermissionsMap = { [key: string]: string[] };

export const customerFeatures: PermissionsMap = {
    member: ["create", "update", "delete", "view"]
};

export const platformFeatures: PermissionsMap = {
    billing: ["create", "update", "delete", "view"]
};

export const allFeatures: PermissionsMap = lodash.merge({}, customerFeatures, platformFeatures);

interface AccessI {
    feature: string;
    action: string;
}

function permissionChecker(availableAccess: PermissionsMap | null | undefined, access: AccessI): boolean {
    if (!availableAccess) return false;
    return availableAccess[access.feature]?.includes(access.action) ?? false;
}

interface MemberInfo {
    organizationId: string;
    role: string;
}

export function parsePermissions(
    permissions: string | Prisma.JsonValue | null | undefined
): PermissionsMap {
    if (!permissions) return {};

    let data: unknown;

    if (typeof permissions === "string") {
        try {
            data = JSON.parse(permissions);
        } catch {
            return {};
        }
    } else {
        data = permissions;
    }

    if (typeof data !== "object" || data === null) return {};

    const result: PermissionsMap = {};

    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
        if (Array.isArray(value)) {
            result[key] = value.filter((v): v is string => typeof v === "string");
        }
    }

    return result;
}

export async function hasPermission(
    user: AuthUser,
    member: MemberInfo,
    access: AccessI
): Promise<void> {
    if (!permissionChecker(allFeatures, access)) throw new Error("UNAUTHORIZED");

    if (user?.roleSlug === "admin") return;

    if (!permissionChecker(customerFeatures, access)) throw new Error("UNAUTHORIZED");

    const organizationPermissions = await organizationRolePermissionService.findPermissionsById(member.organizationId, member.role);

    if (!permissionChecker(organizationPermissions, access)) throw new Error("UNAUTHORIZED");

    const products = await productService.findActiveProductsByOrganizationId(member.organizationId);

    const hasProductAccess = products.some(product => permissionChecker(product.permissions as PermissionsMap, access));

    if (!hasProductAccess) throw new AppError("UNAUTHORIZED");
}
