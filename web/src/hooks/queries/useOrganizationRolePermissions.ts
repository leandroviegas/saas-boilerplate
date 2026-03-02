import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrganizationRolePermissions } from '@/api/generated/organization-role-permissions/organization-role-permissions';
import type {
  PostAdminRolePermissionsBody,
  PutAdminRolePermissionsRoleSlugBody,
} from '@/api/generated/newChatbotAPI.schemas';

const rolePermissionsApi = getOrganizationRolePermissions();

// Query keys
export const rolePermissionKeys = {
  all: ['role-permissions'] as const,
  lists: () => [...rolePermissionKeys.all, 'list'] as const,
  list: () => [...rolePermissionKeys.lists()] as const,
  details: () => [...rolePermissionKeys.all, 'detail'] as const,
  detail: (roleSlug: string) => [...rolePermissionKeys.details(), roleSlug] as const,
};

// Fetch all role permissions (for active organization from session)
export function useRolePermissions() {
  return useQuery({
    queryKey: rolePermissionKeys.list(),
    queryFn: async () => {
      const response = await rolePermissionsApi.getAdminRolePermissions();
      return response.data;
    },
  });
}

// Fetch single role permission by role slug (organization from session)
export function useRolePermission(roleSlug: string) {
  return useQuery({
    queryKey: rolePermissionKeys.detail(roleSlug),
    queryFn: async () => {
      const response = await rolePermissionsApi.getAdminRolePermissionsRoleSlug(roleSlug);
      return response.data;
    },
    enabled: !!roleSlug,
  });
}

// Create role permission
export function useCreateRolePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rolePermissionData: PostAdminRolePermissionsBody) => {
      const response = await rolePermissionsApi.postAdminRolePermissions(rolePermissionData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolePermissionKeys.lists() });
    },
  });
}

// Update role permission
export function useUpdateRolePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roleSlug,
      updateData,
    }: {
      roleSlug: string;
      updateData: PutAdminRolePermissionsRoleSlugBody;
    }) => {
      const response = await rolePermissionsApi.putAdminRolePermissionsRoleSlug(
        roleSlug,
        updateData
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: rolePermissionKeys.lists() });
      if (data) {
        queryClient.invalidateQueries({
          queryKey: rolePermissionKeys.detail(data.roleSlug),
        });
      }
    },
  });
}

// Delete role permission
export function useDeleteRolePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roleSlug }: { roleSlug: string }) => {
      await rolePermissionsApi.deleteAdminRolePermissionsRoleSlug(roleSlug);
      return { roleSlug };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolePermissionKeys.lists() });
    },
  });
}
