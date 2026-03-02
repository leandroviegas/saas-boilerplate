import { AuthUser } from "@/auth";
import { organizationRolePermissionService, productService } from "@/services";
import { Member } from "@prisma/client";
import lodash from "lodash";
import { AppError } from "@/handlers/error.handler";

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

export async function hasPermission(
    user: AuthUser,
    member: MemberInfo,
    access: AccessI
): Promise<void> {
    if (!permissionChecker(allFeatures, access)) throw new AppError("UNAUTHORIZED", 403);

    if (user?.roleSlug === "admin") return;

    if (!permissionChecker(customerFeatures, access)) throw new AppError("UNAUTHORIZED", 403);

    const organizationPermissions = await organizationRolePermissionService.findPermissionsById(member.organizationId, member.role);

    if (!permissionChecker(organizationPermissions, access)) throw new AppError("UNAUTHORIZED", 403);

    const products = await productService.findActiveProductsByOrganizationId(member.organizationId);

    const hasProductAccess = products.some(product => permissionChecker(product.permissions as PermissionsMap, access));

    if (!hasProductAccess) throw new AppError("UNAUTHORIZED", 403);
}