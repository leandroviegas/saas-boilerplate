import { AuthUser } from "@/auth";
import { organizationRolePermissionService, productService } from "@/services";
import { Member } from "@prisma/client";
import lodash from "lodash";

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

export async function hasPermission(
    user: AuthUser,
    member: Member,
    access: AccessI
): Promise<void> {
    if (!permissionChecker(allFeatures, access)) throw new Error("UNAUTHORIZED");

    if (user?.roleSlug === "admin") return;

    if (!permissionChecker(customerFeatures, access)) throw new Error("UNAUTHORIZED");

    const organizationPermissions = await organizationRolePermissionService.findPermissionsById(member.organizationId, member.role);

    if (!permissionChecker(organizationPermissions, access)) throw new Error("UNAUTHORIZED");

    const products = await productService.findActiveProductsByOrganizationId(member.organizationId);

    const hasProductAccess = products.some(product => permissionChecker(product.permissions as PermissionsMap, access));

    if (!hasProductAccess) throw new Error("UNAUTHORIZED");
}