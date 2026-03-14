import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RoleService } from '@/services/role.service';

export const rolePermissionKeys = {
  all: ['role-permissions'] as const,
  lists: () => [...rolePermissionKeys.all, 'list'] as const,
  list: () => [...rolePermissionKeys.lists()] as const,
  details: () => [...rolePermissionKeys.all, 'detail'] as const,
  detail: (roleSlug: string) => [...rolePermissionKeys.details(), roleSlug] as const,
};

export function useRolePermissions() {
  return useQuery({
    queryKey: rolePermissionKeys.list(),
    queryFn: () => RoleService.listRolePermissions(),
  });
}

export function useRolePermission(roleSlug: string) {
  return useQuery({
    queryKey: rolePermissionKeys.detail(roleSlug),
    queryFn: () => RoleService.getRolePermission("", roleSlug), // orgId is handled by session in backend
    enabled: !!roleSlug,
  });
}

export function useCreateRolePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => RoleService.upsertRolePermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolePermissionKeys.lists() });
    },
  });
}

export function useUpdateRolePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => RoleService.upsertRolePermission(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: rolePermissionKeys.lists() });
      if (data?.roleSlug) {
        queryClient.invalidateQueries({ queryKey: rolePermissionKeys.detail(data.roleSlug) });
      }
    },
  });
}

export function useDeleteRolePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleSlug: string) => RoleService.deleteRolePermission("", roleSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolePermissionKeys.lists() });
    },
  });
}
